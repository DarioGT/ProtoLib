# These URLs are normally mapped to /admin/urls.py. This URLs file is
# provided as a convenience to those who want to deploy these URLs elsewhere.
# This file is also used to provide a reliable view deployment for test purposes.

from django.conf.urls.defaults import *

urlpatterns = patterns('',
    (r'^login/$', 'globale.auth.views.login'),
    (r'^logout/$', 'globale.auth.views.logout'),
    (r'^password_change/$', 'globale.auth.views.password_change'),
    (r'^password_change/done/$', 'globale.auth.views.password_change_done'),
    (r'^password_reset/$', 'globale.auth.views.password_reset'),
    (r'^password_reset/done/$', 'globale.auth.views.password_reset_done'),
    (r'^reset/(?P<uidb36>[0-9A-Za-z]{1,13})-(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', 'globale.auth.views.password_reset_confirm'),
    (r'^reset/done/$', 'globale.auth.views.password_reset_complete'),
)

