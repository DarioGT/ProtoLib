# appdispatcher.py
from django.http import Http404

    
def dispatch(request, app, view=None, path=None):
    
    # app views without app urls.py
    # used like this in the main urls.py :
    #(r'^apps/(?P<app>[^/]+)/(?P<view>[^/]+)$', 'core.appdispatcher.dispatch' ), --> apps/app/views.py/view
    #(r'^apps/(?P<app>[^/]+)/?$', 'core.appdispatcher.dispatch' ), --> apps/app/views.py/default
    # the core.decorators.publish decorator MUST be applied to ALL published function
    # @publish
    # def view(request):
    #   pass
    #
    
    fpath = 'apps.%s.views.%s' % (app, view or 'default')
    
    from django.core.urlresolvers import get_callable
    
    fctn = get_callable(fpath)
    
    published = getattr(fctn, '__publish__', False)
    
    if published:
        p = {'request':request}
        if path:
            p['path'] = path
        return fctn(**p)
        
    raise Http404