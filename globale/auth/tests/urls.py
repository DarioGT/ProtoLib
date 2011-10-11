from django.conf.urls.defaults import patterns
from globale.auth.urls import urlpatterns
from globale.auth.views import password_reset
from globale.auth.decorators import login_required
from django.http import HttpResponse
from django.template import Template, RequestContext
from django.views.decorators.cache import never_cache

@never_cache
def remote_user_auth_view(request):
    "Dummy view for remote user tests"
    t = Template("Username is {{ user }}.")
    c = RequestContext(request, {})
    return HttpResponse(t.render(c))

# special urls for auth test cases
urlpatterns = urlpatterns + patterns('',
    (r'^logout/custom_query/$', 'globale.auth.views.logout', dict(redirect_field_name='follow')),
    (r'^logout/next_page/$', 'globale.auth.views.logout', dict(next_page='/somewhere/')),
    (r'^remote_user/$', remote_user_auth_view),
    (r'^password_reset_from_email/$', 'globale.auth.views.password_reset', dict(from_email='staffmember@example.com')),
    (r'^login_required/$', login_required(password_reset)),
    (r'^login_required_login_url/$', login_required(password_reset, login_url='/somewhere/')),
)

