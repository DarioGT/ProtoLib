# Create your views here.

from django.contrib.auth.models import User
from django.shortcuts import render_to_response, get_list_or_404
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from core.decorators import publish

import utils

from django.conf import settings

def renderWithContext(request, model, data={}):
    ctx = RequestContext(request)
    return render_to_response(model, data, context_instance=ctx)
    
 
@publish
def default(request):
    # auto includes files from apps/app/includes.py
    # todo : caching+minify
    
    adict = {}

#    if getattr(settings, 'FORCE_LOGIN', True) and not request.user.is_authenticated():
#        return HttpResponseRedirect(settings.LOGIN_URL)
        

    import os
    
    includes_list = {}
    apps_dir = os.path.join(settings.PPATH, 'apps')
    for app in os.listdir(apps_dir):
        appdir = os.path.join(apps_dir, app)
        if os.path.isfile(os.path.join(appdir, 'includes.py')):
            includes_list[app] = {'done':False}
            includes = __import__('apps.%s.includes' % app)
            
            exec "from apps.%s import includes" % app
           # print includes_list[app]
            includes_list[app]['JS'] = includes.JS
            includes_list[app]['CSS'] = includes.CSS
            if getattr(includes, 'JS_REQUIRE', '') != '':
                includes_list[app]['JS_REQUIRE'] = includes.JS_REQUIRE
           

    adict['APPS_CSS_INCLUDES'] = []
    adict['APPS_JS_INCLUDES'] = []  
    
    # gestion des require pour le JS
    complete = False
    while not complete:
        complete = True
        for app in includes_list.keys():
            #print 'app', app
            if not includes_list[app]['done']:
                complete = False
                wait = False
                if includes_list[app].get('JS_REQUIRE'):
                    for item in includes_list[app]['JS_REQUIRE']:
                        if not includes_list[item]['done']:
                            #print 'waiting for', item
                            wait = True
                            continue                   
                if not wait:
                    for item in includes_list[app]['JS']:
                        if item.startswith('http') or item.startswith('/'):
                            adict['APPS_JS_INCLUDES'].append( item )
                        else:
                            adict['APPS_JS_INCLUDES'].append( '/apps/%s/static/js/%s'  %(app, item) )
                    includes_list[app]['done'] = True
                 
    for app in includes_list.keys():
        for item in includes_list[app]['CSS']:
            if item.startswith('http') or item.startswith('/'):
                adict['APPS_CSS_INCLUDES'].append( item )
            else:
                adict['APPS_CSS_INCLUDES'].append( '/apps/%s/static/css/%s'  %(app, item) )
    
    
    adict = {}
    return renderWithContext(request, "default.html", adict )   