# -*- coding: utf-8 -*-

from functools import wraps
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.conf import settings

def publish(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        return function(request, *args, **kwargs)
    wrap.__publish__ = True
    return wrap
    
    

def swfupload_cookies_auth(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        if not request.user.is_authenticated():
            session = get_object_or_404(Session, session_key=request.POST.get(settings.SESSION_COOKIE_NAME))
            session_data = session.get_decoded()
            if not session_data.has_key('_auth_user_id'):
                # not auth but sent an invalid sessionid
                raise Http404()
            user = get_object_or_404(User, pk = session_data['_auth_user_id'])
            request.user = user
        return function(request, *args, **kwargs)
    return wrap
