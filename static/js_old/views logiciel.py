# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.template import  Context
from django.template import  RequestContext
from django.template.loader import get_template 

from global_file import *
from donnees.models import *

from forms import *
from cout_annuel.forms import *
from discussion_logiciel.forms import *
from source.forms import * 
from django.utils import simplejson

def save_form_down(request):
    idLogiciel = 1
    DureeCycle = 0
    Editeur = ''
    description = ''
    Commentaire = ''
    output = 'Sauvegarde non effectuee'
    
    if request.method == 'POST':
        idLogiciel = request.POST.get('idLogiciel')
        DureeCycle = request.POST.get('DureeCycle')
        Editeur = request.POST.get('Editeur')
        description = request.POST.get('description')
        Commentaire = request.POST.get('Commentaire')
        
        logiciel = Logiciel.objects.get(pk=idLogiciel)
        logiciel.DureeCycle = DureeCycle
        logiciel.Editeur = Editeur
        logiciel.description = description
        logiciel.Commentaire = Commentaire
        logiciel.save()
        
        output = 'Sauvegarde effectuee'
        
    return HttpResponse(output,mimetype='text/javascript') 


def save_form_top(request):
   idLogiciel = 1
   idFamile = 1
   idLogicielType = 1
   output = "Sauvegarde non effectu&eacute;e"
   if request.method == 'POST':
       idLogiciel =  request.POST.get('idLogiciel')
       idFamille  = request.POST.get('idFamille')
       idLogicielType = request.POST.get('idLogicielType')
       
       logiciel = Logiciel.objects.get(pk=idLogiciel)
       famille = Famille.objects.get(pk=idFamille)
       typeLogiciel = TypeLogiciel.objects.get(pk=idLogicielType)
        
       logiciel.Famille = famille
       logiciel.TypeLogiciel = typeLogiciel
       
       logiciel.save()
       output = "Sauvegarde effectu&eacute;e"
    
   
   return HttpResponse(output,mimetype='text/javascript')   

def dataEquivalence(request):
    template = get_template('fiche_logiciel/data_equivalence.xml')
    
    if request.method == 'GET': 
        variables = RequestContext( request, 
         { 
         }                  
         )
        output = template.render(variables);
        return HttpResponse(output, content_type = 'application/xml')
    elif request.method == 'POST':
        logiciel_id =  request.POST.get('logiciel_id')
        logiciel_name  = request.POST.get('logiciel_name')
        variables = RequestContext( request, 
         { 
         }                  
         )
        """output = template.render(variables);"""
        output = '<?xml version="1.0" encoding="UTF-8"?>'
        output += '<dataEquivalence>'
        output += '<logiciel_id>'
        output += '10'
        output += '</logiciel_id>'
        output += '<logiciel_name>'
        output += 'logiciel10'
        output += '</logiciel_name>'
        output += '</dataEquivalence>' 
        return HttpResponse(output, content_type = 'application/xml')
   
    

def setDataEquivalence(request):
    dataEquivalenceXml = ''
    idLogiciel = 1
    if request.method == 'POST':
        idLogiciel =  request.POST.get('idLogiciel')
       
        logiciel = Logiciel.objects.get(pk=idLogiciel) 
        equivalences1 = list(Equivalence.objects.filter(Logiciel = logiciel))
        equivalences2 = list(Equivalence.objects.filter(LogicielRef = logiciel))  
        
        logiciels = []
        for o in equivalences1:
            logiciels.append(o.LogicielRef)
        for o in equivalences2:
            if o.Logiciel not in logiciels:
                logiciels.append(o.Logiciel)           
                             
        dataEquivalenceXml += '<?xml version="1.0" encoding="UTF-8"?>'
        dataEquivalenceXml += '<dataEquivalence>'
        
        for o in logiciels:
            dataEquivalenceXml += '<equivalence>'
            dataEquivalenceXml += '<logiciel_id>'
            dataEquivalenceXml += str(o.idLogiciel)
            dataEquivalenceXml += '</logiciel_id>'
            dataEquivalenceXml += '<logiciel_name>'
            dataEquivalenceXml += str(o.Nom)
            dataEquivalenceXml += '</logiciel_name>'
            dataEquivalenceXml += '</equivalence>'
        
            
        dataEquivalenceXml += '</dataEquivalence>'
            
        fileOut = open('public/datas/data_equivalence.xml', 'w')
        fileOut.write(dataEquivalenceXml)
        fileOut.close()
    output = "Okay"
    return HttpResponse(output, mimetype='text/javascript')


def loadLogicielData(request):
   response_dict = {}
   idLogiciel = 1
   if request.method == 'POST':
       idLogiciel =  request.POST.get('idLogiciel') 
   
   logiciel = Logiciel.objects.get(pk=idLogiciel) 
   
   
   response_dict.update( { 'Nom':logiciel.Nom, 'DureeCycle':logiciel.DureeCycle, 'description':logiciel.description, 'Fonction':logiciel.Fonction, 'Commentaire':logiciel.Commentaire, 'Editeur':logiciel.Editeur, 'Categorie':logiciel.Categorie, 'CoutDeIntroduction':str(logiciel.CoutDeIntroduction), 'TypeLogiciel':str(logiciel.TypeLogiciel.idTypeLogiciel), 'Famille':str(logiciel.Famille.idFamille)  })
   return HttpResponse(simplejson.dumps(response_dict), mimetype='text/javascript')  


def fiche_logiciel_main(request):
   template = get_template('fiche_logiciel/screen_select_logiciel.html');
   
   cfg = template_config(request)
   lst_logiciel = list(Logiciel.objects.all())
   
   lst_famille = list(Famille.objects.all())
   
   lst_type =  list(TypeLogiciel.objects.all())
   
   lst_niveau = list(Niveau.objects.all())
   
   lst_cout_adherance = list(CoutAdherance.objects.all())
   
   lst_cout_annuel = list(CoutAnnuel.objects.all())
   formCoutAnnuel = CoutAnnuelForm()
   
   lst_discussion_logiciel = list(DiscussionLogiciel.objects.all())
   formDiscussionLogiciel = DiscussionLogicielForm()
   
   lst_sources = list(Sources.objects.all())
   formSources = SourcesForm()
   
   lst_equivalences = list(Equivalence.objects.all())
   
   """lst_logiciel_meme_famille = list()"""
   
   successAddAdherance = -1
   if request.method == 'POST':
       if request.POST.get('action') == 'add_adherance':
            form = AdheranceForm(request.POST)
            if form.is_valid():
                successAdd = 1
                adherance = form.save()
                lst_cout_adherance = list(CoutAdherance.objects.all())
            else:
                successAdd = 0
       elif request.POST.get('action') == 'add_annuel':
           form = CoutAnnuelForm(request.POST);
           if form.is_valid():
               successAdd = 1
               annuel = form.save()
               lst_cout_annuel = list(CoutAnnuel.objects.all())
           else:
               successAdd = 0
       elif request.POST.get('action') == 'add_discussion_logiciel':
           form = DiscussionLogicielForm(request.POST);
           if form.is_valid():
               print "yesss"
               successAdd = 1
               discussionLogiciel = form.save()
               lst_discusssion_logiciel = list(DiscussionLogiciel.objects.all())
           else:
               successAdd = 0
       elif request.POST.get('action') == 'add_sources':
           form = SourcesForm(request.POST);
           if form.is_valid():
               successAdd = 1
               discussionLogiciel = form.save()
               lst_sources = list(Sources.objects.all())
           else:
               successAdd = 0
   
   variables = RequestContext( request, 
     { 
         'cfg' : cfg,
         'lst_logiciel' : lst_logiciel,
         'lst_niveau' : lst_niveau,
         'lst_famille' : lst_famille,
         'lst_type' : lst_type,
         'successAddAdherance' : successAddAdherance,
         'lst_cout_adherance' : lst_cout_adherance,
         'lst_cout_annuel' : lst_cout_annuel,
         'formCoutAnnuel' : formCoutAnnuel,
         'lst_discussion_logiciel':lst_discussion_logiciel,
         'formDiscussionLogiciel':formDiscussionLogiciel,
         'lst_sources':lst_sources,
         'formSources':formSources,
         'lst_equivalences':lst_equivalences,
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)    
    
    
    
