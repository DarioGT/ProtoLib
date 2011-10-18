from django.conf.urls.defaults import *

urlpatterns = patterns('',)

 
# auto apps includes

urlpatterns += patterns('',    
    (r'^apps/(?P<app>[^/]+)/(?P<view>[^/]+)/?(?P<path>.+)?$', 'core.appdispatcher.dispatch' ),
    (r'^apps/(?P<app>[^/]+)/?$', 'core.appdispatcher.dispatch' ),
    
)

