from dajaxice.decorators import dajaxice_register
from dajax.core import Dajax
from django.template.loader import render_to_string


@dajaxice_register
def zoomReturn(request, option, id):
    if id == 'Logiciel':
        dajax = Dajax()
  
        if option == 'sp':
            options = ['Madrid', 'Barcelona', 'Vitoria', 'Burgos']
        elif option == 'fr': 
            options = ['Paris', 'Evreux', 'Le Havre', 'Reims']
        else: 
            options = ['----']
        
        out = ""
        for o in options:
            out = '%s<option value="#">%s</option>' % (out, o)
 
        dajax.assign('#LogicielRef', 'innerHTML', out)
        dajax.assign('#famille', 'value', 'xxxxxxxx')
        
        return dajax.json()

    else:
        pass
    
