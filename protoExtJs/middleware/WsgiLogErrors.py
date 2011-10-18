import traceback

class WsgiLogErrors(object):
    def process_exception(self, request, exception):
        tb_text = traceback.format_exc()
        url = request.build_absolute_uri()
        try:
            request.META['wsgi.errors'].write(u'%s\n%s\n' % (url, tb_text ))
        except:
            request.META['wsgi.errors'].write(u'error writing error for %s' % url)
