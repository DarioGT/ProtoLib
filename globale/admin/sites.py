import re
from django import http, template
from globale.admin import ModelAdmin, actions
from globale.admin.forms import AdminAuthenticationForm
from globale.auth import REDIRECT_FIELD_NAME
from django.contrib.contenttypes import views as contenttype_views
from django.views.decorators.csrf import csrf_protect
from django.db.models.base import ModelBase
from django.core.exceptions import ImproperlyConfigured
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.utils.functional import update_wrapper
from django.utils.safestring import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext as _
from django.views.decorators.cache import never_cache
from django.conf import settings

LOGIN_FORM_KEY = 'this_is_the_login_form'

class AlreadyRegistered(Exception):
    pass

class NotRegistered(Exception):
    pass


class AdminSite(object):
    """
    An AdminSite object encapsulates an instance of the Django admin application, ready
    to be hooked in to your URLconf. Models are registered with the AdminSite using the
    register() method, and the get_urls() method can then be used to access Django view
    functions that present a full admin interface for the collection of registered
    models.
    """
    login_form = None
    index_template = None
    app_index_template = None
    login_template = None
    logout_template = None
    password_change_template = None
    password_change_done_template = None

    def __init__(self, name=None, app_name='admin'):
        self._registry = {} # model_class class -> admin_class instance
        
        #DGT: Inicia vars para manejo de menus
        self._menu = {}  
        self._models = {} 
        self._menuOrder = 0
        
        self.root_path = None
        if name is None:
            self.name = 'admin'
        else:
            self.name = name
        self.app_name = app_name
        self._actions = {'delete_selected': actions.delete_selected}
        self._global_actions = self._actions.copy()

    #------- def register(self, model_or_iterable, admin_class=None, **options):
    def register(self, model_or_iterable, admin_class=None, optKey =None, **options):
        """
        Registers the given model(s) with the given admin class.

        The model(s) should be Model classes, not instances.

        If an admin class isn't given, it will use ModelAdmin (the default
        admin options). If keyword arguments are given -- e.g., list_display --
        they'll be applied as options to the admin class.

        If a model is already registered, this will raise AlreadyRegistered.

        If a model is abstract, this will raise ImproperlyConfigured.
        
        PROTO: Se agrega el parametro optKey q servira como llave para poder repetir la 
        definicion de modelos,  se agregara otra collection adicional el modelo
        
        _menu 
        key = optKey,  value = AdminClass ( agregar el modelName y el optKey  as la clase admin )
        
        _models   
        key = modelName, value = Model
        
        Actualmente el requiere el modelo para poder manejar automaticamente las referencias 
        si manejo el admin class de forma separaa accesible con un nemonico 
        y puedo en cualquier momento referencia al modelo podria manejar varias instancias de los modelos.    
        
        """
        if not admin_class:
            admin_class = ModelAdmin


        # Don't import the humongous validation code unless required
        if admin_class and settings.DEBUG:
            from globale.admin.validation import validate
        else:
            validate = lambda model, adminclass: None
            
            
        #DGT: Verifica si esta en la instancia y luego los recorre, 
        #model_or_iterable es el modelo recibido, ModelBase es la clase Django
        if isinstance(model_or_iterable, ModelBase):
            
            #DGT: Varios nombres para escojer :  model.__name__,  model._meta.object_name
            #Si no existe el nemonico carga el nombre de la clase registrada
            if not optKey: 
                optKey = model_or_iterable._meta.module_name

            model_or_iterable = [model_or_iterable]
            

            
        #DGT: Una lista permite registrar varios modelos a la vez  
        for model in model_or_iterable:
            if model._meta.abstract:
                raise ImproperlyConfigured('The model %s is abstract, so it '
                      'cannot be registered with admin.' % model.__name__)
         
            #DGT: Si son varios toma el nombre del modelo 
            if len(model_or_iterable) > 1:
                optKey = model._meta.module_name
                
            #DGT: 0 registry es un dicc local donde va guardando toda la inf de las clases base 
            #if model in self._registry: raise AlreadyRegistered('The model %s is already registered' % model.__name__)
            if optKey in self._menu: 
                raise AlreadyRegistered('The option %s is already registered' % optKey)


            # If we got **options then dynamically construct a subclass of admin_class with those **options.
            if options:
                # For reasons I don't quite understand, without a __module__ the created class appears to "live" in the wrong place, which causes issues later on.
                #FIXME: optKey ?? Crea una metaclase?? Admin[ModelName], Parametro Admin Class  definida por Options 
                options['__module__'] = __name__
                admin_class = type("%sAdmin" % model.__name__, (admin_class,), options)

            # Validate (which might be a no-op)
            validate(admin_class, model)

            #DGT: 0 Instantiate the admin class     
            admModel = admin_class(model, self, optKey)
            
            #DGT: 1 Maneja el verbose_name_plural 
            if not (admin_class.verbose_name_plural):
                admModel.verbose_name_plural = model._meta.verbose_name_plural
            
            #DGT: menuOrder, registra en el orden de llegada 
            self._menuOrder +=1 
            admModel.menuOrder = self._menuOrder
            
            #DGT: 1Con el modelo guarda el admin de base  NO, por q las url son creadas con optkey 
            if not (model in self._registry):
                self._registry[model] = admModel
                
            self._menu[optKey] = admModel
            self._models[optKey] = model 
            

    def unregister(self, model_or_iterable):
        """
        Unregisters the given model(s).

        If a model isn't already registered, this will raise NotRegistered.
        """
        if isinstance(model_or_iterable, ModelBase):
            model_or_iterable = [model_or_iterable]
        for model in model_or_iterable:
            if model not in self._registry:
                raise NotRegistered('The model %s is not registered' % model.__name__)
            del self._registry[model]

    def add_action(self, action, name=None):
        """
        Register an action to be available globally.
        """
        name = name or action.__name__
        self._actions[name] = action
        self._global_actions[name] = action

    def disable_action(self, name):
        """
        Disable a globally-registered action. Raises KeyError for invalid names.
        """
        del self._actions[name]

    def get_action(self, name):
        """
        Explicitally get a registered global action wheather it's enabled or
        not. Raises KeyError for invalid names.
        """
        return self._global_actions[name]

    @property
    def actions(self):
        """
        Get all the enabled actions as an iterable of (name, func).
        """
        return self._actions.iteritems()

    def has_permission(self, request):
        """
        Returns True if the given HttpRequest has permission to view
        *at least one* page in the admin site.
        """
        return request.user.is_active and request.user.is_staff

    def check_dependencies(self):
        """
        Check that all things needed to run the admin have been correctly installed.

        The default implementation checks that LogEntry, ContentType and the
        auth context processor are installed.
        """
        from globale.admin.models import LogEntry
        from django.contrib.contenttypes.models import ContentType

        if not LogEntry._meta.installed:
            raise ImproperlyConfigured("Put 'globale.admin' in your "
                "INSTALLED_APPS setting in order to use the admin application.")
        if not ContentType._meta.installed:
            raise ImproperlyConfigured("Put 'django.contrib.contenttypes' in "
                "your INSTALLED_APPS setting in order to use the admin application.")
        if not ('globale.auth.context_processors.auth' in settings.TEMPLATE_CONTEXT_PROCESSORS or
            'django.core.context_processors.auth' in settings.TEMPLATE_CONTEXT_PROCESSORS):
            raise ImproperlyConfigured("Put 'globale.auth.context_processors.auth' "
                "in your TEMPLATE_CONTEXT_PROCESSORS setting in order to use the admin application.")

    def admin_view(self, view, cacheable=False):
        """
        Decorator to create an admin view attached to this ``AdminSite``. This
        wraps the view and provides permission checking by calling
        ``self.has_permission``.

        You'll want to use this from within ``AdminSite.get_urls()``:

            class MyAdminSite(AdminSite):

                def get_urls(self):
                    from django.conf.urls.defaults import patterns, url

                    urls = super(MyAdminSite, self).get_urls()
                    urls += patterns('',
                        url(r'^my_view/$', self.admin_view(some_view))
                    )
                    return urls

        By default, admin_views are marked non-cacheable using the
        ``never_cache`` decorator. If the view can be safely cached, set
        cacheable=True.
        """
        def inner(request, *args, **kwargs):
            if not self.has_permission(request):
                return self.login(request)
            return view(request, *args, **kwargs)
        if not cacheable:
            inner = never_cache(inner)
        # We add csrf_protect here so this function can be used as a utility
        # function for any view, without having to repeat 'csrf_protect'.
        if not getattr(view, 'csrf_exempt', False):
            inner = csrf_protect(inner)
        return update_wrapper(inner, view)

    def get_urls(self):
        from django.conf.urls.defaults import patterns, url, include

        if settings.DEBUG:
            self.check_dependencies()

        def wrap(view, cacheable=False):
            def wrapper(*args, **kwargs):
                return self.admin_view(view, cacheable)(*args, **kwargs)
            return update_wrapper(wrapper, view)

        # Admin-site-wide views.
        urlpatterns = patterns('',
            url(r'^$',
                wrap(self.index),
                name='index'),
            url(r'^logout/$',
                wrap(self.logout),
                name='logout'),
            url(r'^password_change/$',
                wrap(self.password_change, cacheable=True),
                name='password_change'),
            url(r'^password_change/done/$',
                wrap(self.password_change_done, cacheable=True),
                name='password_change_done'),
            url(r'^jsi18n/$',
                wrap(self.i18n_javascript, cacheable=True),
                name='jsi18n'),
            url(r'^r/(?P<content_type_id>\d+)/(?P<object_id>.+)/$',
                wrap(contenttype_views.shortcut)),
            url(r'^(?P<app_label>\w+)/$',
                wrap(self.app_index),
                name='app_list')
        )

        #DGT: 1Agrega las vistas de cada modelo  
        #or model, model_admin in self._registry.iteritems():
        for optKey, model_admin in self._menu.iteritems():
            model = self._models.get(optKey)
            
            urlpatterns += patterns('',
                # url(r'^%s/%s/' % (model._meta.app_label, model._meta.module_name),include(model_admin.urls))
                url(r'^%s/%s/' % (model._meta.app_label, optKey.lower() ),include(model_admin.urls))
            )
        return urlpatterns

    @property
    def urls(self):
        return self.get_urls(), self.app_name, self.name

    def password_change(self, request):
        """
        Handles the "change password" task -- both form display and validation.
        """
        from globale.auth.views import password_change
        if self.root_path is not None:
            url = '%spassword_change/done/' % self.root_path
        else:
            url = reverse('admin:password_change_done', current_app=self.name)
        defaults = {
            'current_app': self.name,
            'post_change_redirect': url
        }
        if self.password_change_template is not None:
            defaults['template_name'] = self.password_change_template
        return password_change(request, **defaults)

    def password_change_done(self, request, extra_context=None):
        """
        Displays the "success" page after a password change.
        """
        from globale.auth.views import password_change_done
        defaults = {
            'current_app': self.name,
            'extra_context': extra_context or {},
        }
        if self.password_change_done_template is not None:
            defaults['template_name'] = self.password_change_done_template
        return password_change_done(request, **defaults)

    def i18n_javascript(self, request):
        """
        Displays the i18n JavaScript that the Django admin requires.

        This takes into account the USE_I18N setting. If it's set to False, the
        generated JavaScript will be leaner and faster.
        """
        if settings.USE_I18N:
            from django.views.i18n import javascript_catalog
        else:
            from django.views.i18n import null_javascript_catalog as javascript_catalog
        return javascript_catalog(request, packages=['django.conf', 'globale.admin'])

    @never_cache
    def logout(self, request, extra_context=None):
        """
        Logs out the user for the given HttpRequest.

        This should *not* assume the user is already logged in.
        """
        from globale.auth.views import logout
        defaults = {
            'current_app': self.name,
            'extra_context': extra_context or {},
        }
        if self.logout_template is not None:
            defaults['template_name'] = self.logout_template
        return logout(request, **defaults)

    @never_cache
    def login(self, request, extra_context=None):
        """
        Displays the login form for the given HttpRequest.
        """
        from globale.auth.views import login
        context = {
            'title': _('Log in'),
            'root_path': self.root_path,
            'app_path': request.get_full_path(),
            REDIRECT_FIELD_NAME: request.get_full_path(),
        }
        context.update(extra_context or {})
        defaults = {
            'extra_context': context,
            'current_app': self.name,
            'authentication_form': self.login_form or AdminAuthenticationForm,
            'template_name': self.login_template or 'admin/login.html',
        }
        return login(request, **defaults)

    @never_cache
    def index(self, request, extra_context=None):
        """
        Displays the main admin index page, which lists all of the installed
        apps that have been registered in this site.
        """
        app_dict = {}
        user = request.user
        
        #DGT: Verifca permisos ( No tiene problema se recorre la coleccion y se llama el modelo y el admin )
        #or model, model_admin in self._registry.items():
        for optKey, model_admin in self._menu.items():
            model = self._models.get(optKey)
            
            app_label = model._meta.app_label
            app_name = model_admin.app_name
            if not app_name: 
                app_name = app_label 
                 
            has_module_perms = user.has_module_perms(app_label)

            if has_module_perms:
                perms = model_admin.get_model_perms(request)

                #DGT: 1 Crea la lista de urls en el menu y los permiso 
                # Check whether user has any perm for this module. If so, add the module to the model_list.
                if True in perms.values():
                    model_dict = {
                        #'name': capfirst(model._meta.verbose_name_plural),
                        #'admin_url': mark_safe('%s/%s/' % (app_label, model.__name__.lower())),
                        'name': capfirst(model_admin.verbose_name_plural),
                        'admin_url': mark_safe('%s/%s/' % (app_label, optKey.lower())),
                        'perms': perms,
                        'menuOrder': model_admin.menuOrder, 
                    }
                    if app_name in app_dict:
                        app_dict[app_name]['models'].append(model_dict)
                    else:
                        app_dict[app_name] = {
                            'name': app_name.title(),
                            'app_url': app_label + '/',
                            'has_module_perms': has_module_perms,
                            'models': [model_dict],
                        }

        #TODO: 0 Genera el indice de apps ( Sort the apps alphabetically  QUITAR ESTO ) 
        app_list = app_dict.values()
        #app_list.sort(key=lambda x: x['name'])

        #DGT:  Sort the models alphabetically within each app.
        for app in app_list:
            app['models'].sort(key=lambda x: x['menuOrder'])

        context = {
            'title': _('Site administration'),
            'app_list': app_list,
            'root_path': self.root_path,
        }
        context.update(extra_context or {})
        context_instance = template.RequestContext(request, current_app=self.name)
        return render_to_response(self.index_template or 'admin/index.html', context,
            context_instance=context_instance
        )


    #DGT: 1Maneja menu de una App especifica  
    def app_index(self, request, app_label, extra_context=None):
        user = request.user
        has_module_perms = user.has_module_perms(app_label)
        app_dict = {}
        
        #or model, model_admin in self._registry.items():
        for optKey, model_admin in self._menu.items():
            model = self._models.get(optKey)

            app_name = model_admin.app_name
            if not app_name: 
                app_name = app_label 
            
            if app_label == model._meta.app_label:
                if has_module_perms:
                    perms = model_admin.get_model_perms(request)

                    # Check whether user has any perm for this module.  If so, add the module to the model_list.
                    #DGT: Manejo de urls
                    #DGT: Nombre en plural definido en la clase admin  
                    if True in perms.values():
                        model_dict = {
                            #'name': capfirst(model._meta.verbose_name_plural),
                            #'admin_url': '%s/' % model.__name__.lower(),
                            'name': capfirst(model_admin.verbose_name_plural),
                            'admin_url': '%s/' % optKey.lower(),
                            'perms': perms,
                            'menuOrder': model_admin.menuOrder, 
                        }
                        #=======================================================================
                        # if app_dict:
                        #    app_dict['models'].append(model_dict),
                        # else:
                        #    app_dict = {
                        #        'name': app_label.title(),
                        #        'app_url': '',
                        #        'has_module_perms': has_module_perms,
                        #        'models': [model_dict],
                        #    }
                        #=======================================================================

                        if app_name in app_dict:
                            app_dict[app_name]['models'].append(model_dict)
                        else:
                            app_dict[app_name] = {
                                'name': app_name.title(),
                                'app_url': app_label + '/',
                                'has_module_perms': has_module_perms,
                                'models': [model_dict],
                            }
                        
                        #=======================================================================
        
        if not app_dict:
            raise http.Http404('The requested admin page does not exist.')
        
        #DGT: Sort the models alphabetically within each app.
        #app_dict['models'].sort(key=lambda x: x['menuOrder'])
        app_list = app_dict.values()
        #app_list.sort(key=lambda x: x['name'])

        #DGT:  Sort the models alphabetically within each app.
        for app in app_list:
            app['models'].sort(key=lambda x: x['menuOrder'])

        
        context = {
            'title': _('%s administration') % capfirst(app_label),
            #'app_list': [app_dict],
            'app_list': app_list,
            'root_path': self.root_path,
        }
        context.update(extra_context or {})
        context_instance = template.RequestContext(request, current_app=self.name)
        return render_to_response(self.app_index_template or ('admin/%s/app_index.html' % app_label,
            'admin/app_index.html'), context,
            context_instance=context_instance
        )

# This global object represents the default admin site, for the common case.
# You can instantiate AdminSite in your own code to create a custom admin site.
site = AdminSite()
