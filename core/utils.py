# -*- encoding: utf-8 -*-


# some common routines
#

import os
import re
from django.http import Http404, HttpResponse, HttpResponseRedirect

def proxy_GetToPost(request):
    """ transfer the GET into a POST form then submit to $target url """
    data = request.GET.copy()
    uri = data.get('target')
    del data['target']
    html  = '<body><form name=form method=POST action="%s" >' % uri
    for item in data.keys():
        html += '<input type=hidden name="%s" value="%s">' % (item, data[item])
    html += '</form><script language="javascript">document.form.submit()</script></body>'
    return HttpResponse(html)
    
    
def set_cookie(response, key, value, days_expire = 7):
    if days_expire is None:
        max_age = 365*24*60*60  #one year
    else:
        max_age = days_expire*24*60*60 
        
    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(key, value, max_age=max_age, expires=expires, domain=settings.SESSION_COOKIE_DOMAIN, secure=settings.SESSION_COOKIE_SECURE or None)
    return response
    
    
def isinteger(astring):
    if not astring:
        return False
    import string   
    for char in str(astring):
        if not char in string.digits:
            return False
    return True
             
def parseEmailAddress(fullemail, delimitorLeft = '<', delimitorRight = '>'):
    """ 
        split a full name/email pair to name/email tuple 
        matches :
        # julien@bouquillon.com
        # Julien Bouquillon <julien@bouquillon.com>
    """
    
    import re
    if delimitorLeft == '(':
        delimitorLeft = '\\('
    if delimitorRight == ')':
        delimitorRight = '\\)'
        
    reg = re.compile('([^%s\n]+) ?%s?([^%s\r\n]+)?%s?' % (delimitorLeft, delimitorLeft, delimitorRight, delimitorRight) )
    
    matches = reg.findall(fullemail)

    if matches:
        (name, email) = matches[0]
        if email == '': 
            email = name
        return (name, email)
    
    return None
    
def guessNextPath(dst, slugify = True, idx = 0, checkExists = True):
    """ return a renamed path if provided one already exists 
        if slugify, file name is slugified first (fs encodings problems quick & dirty workaround)
    """
    from django.template.defaultfilters import slugify as slugifyer
    newpath = dst
    if idx == 0:
        (path, file) = os.path.split(newpath)
        (file, ext) =  os.path.splitext(file)
        slug = slugifyer(file)

        newpath = os.path.join(path, '%s%s' % (slug, ext))

    if checkExists and os.path.isfile(newpath):
        idx += 1
        name, ext = os.path.splitext(newpath)
        newpath = '%s-copy%s' % (name, ext)
        return guessNextPath(newpath, slugify, idx, checkExists)
        
    return newpath
    
    
def unique_id(more = ''):
    import time
    a = str(time.time())
    import random
    a += '-%s' % str(random.randint(2000, 10000))
    a += '-%s' % str(random.randint(0, 2000))
    a += more
    return a
    
    
    
def getUrl(url, data = None, method = 'GET', headers = {}):
    #print 'getUrl', url
    import urllib, urllib2
    if data:
        data = urllib.urlencode(data)
        if method == 'GET':
            url += '?%s' % data
            data = None
    #print 'getUrl', url , data
    req = urllib2.Request(url, data, headers)
    #try:
    response = urllib2.urlopen(req)
    #except urllib2.HTTPError, _code:
    #    return _code
    
    return response.read()

def count_files_in_dir(inDir, recursive=True):
    import os
    file_count = 0
    if recursive:
        for root, dirs, files in os.walk(inDir):
            file_count += len(files)
    else:
        file_count = len(os.walk(path)[2])
    return file_count
    
    
def reduceDict(inDict, keep_keys):
    """ keep only keep_keys in the dict (return a new one) """
    dict2 = inDict.copy()
    for k in dict2.keys():
        if k not in keep_keys:
            del dict2[k]
    return dict2

def dict_to_dbltuple(indict):
    atuple = tuple()
    for item in indict:
        atuple += ((item, indict[item]),)
    #print atuple
    return atuple
     
def CleanFilePath(inFileName):
    """ assure qu'un nom de fichier n'est bien qu'un nom de fichier (remove slashes) """
    inFileName = os.path.basename(inFileName)
    inFileName = inFileName.replace('/', '')
    inFileName = inFileName.replace('\\', '')
    return inFileName
    
        
def CheckPathSecurity(testPath, rootPath):
    if not os.path.realpath(testPath).startswith(rootPath):
        raise Exception("forbidden path %s !" % os.path.realpath(testPath))
    
def ReadFile(inFile, mode='r'):
    contents = ""
    try:
        f=open(inFile, mode)
        contents = f.read()
        f.close()
    except:
        pass
    return contents
    
def WriteFile(inFile, contents):
    f=open(inFile,'wb')
    f.write(contents)
    f.close()
    
def PathToList(inPath, template_type="", showExt = True):
    import os
    mylist = []
    for file in os.listdir(inPath):
        if file in ['.', '..', '']: continue
        if not os.path.isfile(os.path.join(inPath, file)): continue
        if not showExt: file = os.path.splitext(file)[0]
        mydict = {"name": file, "type": template_type}
        mylist.append(mydict)
    return mylist
      
        
def DownloadLocalFile(InFile):
    import mimetypes
    file_name = os.path.basename(InFile)
    hinfile = open(InFile,'rb')
    response = HttpResponse(hinfile.read())
    response['Content-Disposition'] = 'attachment; filename=%s' % file_name
    response['Content-Type'] = mimetypes.guess_type(file_name)[0]
    return response
   
def strip_html(inHtml):
    import re
    inHtml = re.sub(r'<br>', '\n', inHtml)
    inHtml = re.sub(r'</td><td>', ' - ', inHtml)
    inHtml = re.sub(r'</tr>', '\n\n', inHtml)
    inHtml = re.sub(r'</table>', '\n\n', inHtml)
    inHtml = re.sub(r'</p>', '\n\n', inHtml)
    inHtml = re.sub(r'<[^>]*?>', '', inHtml)
    inHtml = re.sub(r'<style>[^>]*</style>', '', inHtml)

    return inHtml
 
def strip_accents(inStr):
    inStr = u'%s' % inStr
    drep = {}
    drep["e"] = u'éêèë'
    drep["a"] = u'àâä'
    drep["i"] = u'îï'
    drep["c"] = u'ç'
    drep["u"] = u'ùû'
    drep["o"] = u'ôòö'
 
    for k in drep.keys():
        for ch in drep[k]:
            inStr = inStr.replace(ch, k)
    return inStr
    
def strip_euro(inStr):
    inStr = u'%s' % inStr
    inStr = inStr.replace(u'€', u'euro(s)')
    return inStr
    
def my_send_mail(subject, txt, sender, to=[], files=[], charset='UTF-8'):
    import os
    from django.core.mail import send_mail
    from email import Encoders
    from email.MIMEMultipart import MIMEMultipart
    from email.MIMEBase import MIMEBase
    from email.MIMEText import MIMEText
    from django.conf import settings
    from django.core.mail import EmailMultiAlternatives
    
    for dest in to:
        dest = dest.strip()
        msg = MIMEMultipart('related')
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] =  dest
        msg.preamble = 'This is a multi-part message in MIME format.'
        msgAlternative = MIMEMultipart('alternative')
        msg.attach(msgAlternative)
        msgAlternative.attach(MIMEText(txt, _charset=charset))
        msgAlternative.attach(MIMEText(txt, 'html', _charset=charset))
        #msg.attach_alternative(txt, "text/html")
        
        for f in files:
            part = MIMEBase('application', "octet-stream")
            part.set_payload( open(f,"rb").read() )
            Encoders.encode_base64(part)
            part.add_header('Content-Disposition', 'attachment; filename="%s"' % os.path.basename(f))
            msg.attach(part)
        
        from smtplib import SMTP
        smtp = SMTP()
        smtp.connect(host=settings.EMAIL_HOST)
        smtp.sendmail(sender,dest, msg.as_string())
        smtp.quit()
 
 
 
 #############################"" XML STUFF 
 
def xsl_transormation(xslfile, xmlfile = None, xmlstring = None, params={}):
    from lxml import etree
    import StringIO
    xslt_tree = etree.XML(open(xslfile, 'r').read())
    xml_contents = xmlstring
    if not xml_contents:
        if xmlfile:
            xml_contents = open(xmlfile, 'r').read()
        else:
            xml_contents = '<?xml version="1.0"?>\n<foo>A</foo>\n'
    f = StringIO.StringIO(xml_contents)
    #print xml_contents
    doc = etree.parse(f)
    f.close()
    transform = etree.XSLT(xslt_tree)
    #print params
    result = transform(doc, **params)
    return result
 