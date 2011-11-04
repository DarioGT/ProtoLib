
import utils
from django.db import models

# Si el campo no esta en la lista de campos a presentar se crea de manera virtual 
from utils import VirtualField

class ProtoGridFactory(object):


    def __init__(self, model):
            
        self.model = model          # the model to use as reference
        self.fields = []            # holds the extjs fields
        self.base_fields = []       # holds the base model fields
        
        model_fields = self.model._meta._fields()
        excludes = getattr(self.Meta, 'exclude', [])

        # Obtiene el nombre de la entidad 
        self.nomConcept = self.model._meta.object_name 
        
        # Clase conceptos  
        mConcept = models.get_model('metaDb', 'Concept').objects.filter( code = self.nomConcept ).get()

        
        # reorder cols if needed
        order = getattr(self.Meta, 'order', None)
        if order and len(order) > 0:
            for field in order:
                added = False
                for f in model_fields:
                    if f.name == field:
                        added = True
                        self.base_fields.append(f)
                if not added:
                    self.base_fields.append(VirtualField(field))
        else:
            self.base_fields = model_fields

        
        for field in self.base_fields:

            
            if field.name in excludes:
                continue

            if field.__class__.__name__ == VirtualField:
                self.fields.append(self.Meta.fields_conf[field.name])
                continue
            
            # Field Attrs   ------------------------------------------------------------------
            fdict = {'name':field.name, 'header': field.name}

            # Busca  la propiedad 
            try:
                mProperty  = mConcept.property_set.get( code = field.name )
                mUdps = mProperty.udp_set.all()
            except: 
                mUdps = []

            # Verifica la UDP 
            if len(mUdps) > 0 :
                self.getUdp( fdict, mUdps, 'allowFilter', 'Boolean', '1' )
                self.getUdp( fdict, mUdps, 'allowSort', 'Boolean', '1' )
                self.getUdp( fdict, mUdps, 'queryCode', 'String', '' )

            
            if getattr(field, 'verbose_name', None) and field.verbose_name != field.name:
                fdict['tooltip'] = u'%s' %  field.verbose_name
            
            if field.name == 'id':
                fdict['id']='id'
                
            if  field.__class__.__name__ == 'DateTimeField':
                fdict['type'] = 'datetime'
                fdict['xtype'] = 'datecolumn' 
                fdict['dateFormat'] = 'Y-m-d H:i:s'
                fdict['format'] = 'Y-m-d H:i:s'

                #fdict['editor'] = "new Ext.ux.form.DateTime({hiddenFormat:'Y-m-d H:i', dateFormat:'Y-m-D', timeFormat:'H:i'})"
            if  field.__class__.__name__ == 'DateField':
                fdict['type'] = 'date'
                fdict['xtype'] = 'datecolumn' 
                fdict['dateFormat'] = 'Y-m-d'
                fdict['format'] = 'Y-m-d'
                #fdict['renderer'] = 'Ext.util.' 
                #fdict['editor'] = "new Ext.form.DateField({format:'Y-m-d'})"
                
                
            elif field.__class__.__name__ == 'IntegerField':
                fdict['xtype'] = 'numbercolumn'
                #fdict['editor'] = 'new Ext.form.NumberField()'
                
            elif field.__class__.__name__ == 'BooleanField':
                fdict['xtype'] = 'booleancolumn'
                #fdict['editor'] = 'new Ext.form.Checkbox()'
                
            elif field.__class__.__name__ == 'DecimalField':
                fdict['xtype'] = 'numbercolumn '
                fdict['renderer'] = 'function(v) {return (v.toFixed && v.toFixed(2) || 0);}'
                #fdict['editor'] = 'new Ext.form.NumberField()'
                
            elif  field.__class__.__name__ == 'ForeignKey':
                pass
                # renderer : display FK str
                # choices
                
            elif field.choices:
                #print 'FIELD CHOICES', field.choices
                a = {}
                for c in field.choices:
                    a[c[0]] = c[1]
                fdict['renderer'] = 'function(v) {a = %s; return a[v] || "";}' % utils.JSONserialise(a)
                
            if getattr(self.Meta, 'fields_conf', {}).has_key(field.name):
                fdict.update(self.Meta.fields_conf[field.name])
                
               # print fdict
            self.fields.append(fdict)
        #for field in self.model:
        #    print field
    
    def get_field(self, name):  
        for f in self.fields:
            if f.get('name') == name:
                return f
        return None
    
    
    def get_base_field(self, name):  
        for f in self.base_fields:
            if f.name == name:
                return f
        return None
    
    
    def get_fields(self, colModel):  
        """ return this grid field list
            . can include hidden fields
            . A given colModel can order the fields and override width/hidden properties
        """
        # standard fields
        fields = self.fields
        # use the given colModel to order the fields
        if colModel and colModel.get('fields'):
            fields = []
            for f in colModel['fields']:    
                for cf in self.fields:
                    if cf['name'] == f['name']:
                        config_field = cf
                        if f.get('width'):
                            config_field['width'] = f.get('width')
                        # force hidden=False if field present in given colModel
                        if f.get('hidden') == True:                        
                            config_field['hidden'] = True
                        else:
                            config_field['hidden'] = False
                        fields.append(config_field)
        return fields
                        
    def get_rows(self, fields, queryset, start, limit):
        """ 
            return the row list from given queryset 
            order the data based on given field list
            paging from start,limit
        """
        rows = []
        if queryset:
            if limit > 0:
                queryset = queryset[int(start):int(start) + int(limit)]
            fields_items = []
            for item in queryset:
                field_items = []
                rowdict = {}
                for field in fields:
                    val = getattr(item, field['name'], '')
                    if val:
                        if field.get('type', '') == 'date':
                            val = val.strftime(utils.DateFormatConverter(to_python = field['format'] ) )
                        elif field.get('type', '') == 'datetime':
                            val = val.strftime(utils.DateFormatConverter(to_python = field['format'] ) )
                        else:
                            val = utils.JsonCleanstr(val)
                    else:
                        if field.get('type', '') == 'float':
                            val = 0.0
                        elif field.get('type', '') == 'int':
                            val = 0
                        else:
                            val = ''
                    #astr = utils.JSONserialise_dict_item(field['name'], val)
                    rowdict[field['name']] = val
                    #field_items.append(astr)
                #fields_items.append('{%s}' % ','.join(field_items))
                rows.append(rowdict)
            #json += ','.join(fields_items)
            #json += ']\n'

        return rows
         
        
    def to_grid(self, queryset, start = 0, limit = 0, totalcount = None, json_add = {}, colModel = None, sort_field = 'id', sort_direction = 'DESC'):
        """ return the given queryset as an ExtJs grid config
            includes full metadata (columns, renderers, totalcount...)
            includes the rows data
            to be used in combination with ProtoAutoGrid 
        """
        if not totalcount: 
            totalcount = queryset.count()

        base_fields = self.get_fields(colModel)
        
        protoDetails = self.get_details()
        
        # todo : stupid ?
        id_field = base_fields[0]['name']
            
        jsondict = {
             'succes':True
            ,'metaData':{
                 'root':'rows'
                ,'totalProperty':'totalCount'
                ,'successProperty':'success'
                ,'idProperty':id_field
                ,'sortInfo':{
                   "field": sort_field
                   ,"direction": sort_direction
                }
                ,'fields':base_fields

                ,'protoTabs':[
                     {'T1': ['Col1','Col2']}, 
                     {'T2': ['Col3','Col2']},
                     ]    
                ,'protoDetails': protoDetails
            }
            ,'rows':self.get_rows(base_fields, queryset, start, limit)
            ,'totalCount':totalcount
        }
        
        if json_add:
            jsondict.update(json_add)
        
        return utils.JSONserialise(jsondict) 
        
    class Meta:
        exclude = []
        order = []
        fields_conf = {}

    def get_details(self):  
 
        cllRelationship = models.get_model('metaDb', 'Relationship').objects.filter( baseConcept = self.nomConcept )
 
        # TODO: Deberia recorrer los vinculos y no las relacion,  ojo con la llave 
        # Recorre las relaciones : protoDetails = "{'Concpet1': 'Id = %Id',  'Concept2': 'Id = %Id'}"
        protoDetails = {}
        for mRelation in cllRelationship:
            protoDetails[ mRelation.concept.code ] = mRelation.baseConcept.lower() + '__id'
         
        return protoDetails


    def getUdp( self, fdict, mUdps, udpCode , udpType, udpDefault ):
        
        udpReturn = udpDefault
         
        try:
            mUdp =  mUdps.get( code = udpCode )
            udpReturn = mUdp.valueUdp
            
            if ( udpType == 'Boolean' ):
                if (udpReturn[0].lower() in ( 't','y','o', '1')): 
                    udpReturn = '1'
                else: udpReturn = '0' 

            if (udpReturn != udpDefault ): 
                fdict[udpCode] = udpReturn   
             
        except: 
            pass
        
        return 
