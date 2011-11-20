/*
 *  Variables Globales  
 *  
 */


_PConfig =  {
   urlMenu : 'protoExt/protoGetMenuData', 
   urlProtoDefinition : 'protoExt/protoGetConceptModel' , 
   
   clsBaseModel: 'ProtoUL.model.ProtoModel.', 
}; 





// ProtoUL.view.ProtoMasterDetail 
_ComboFilterOp = [
            ['iexact', '='],
            ['icontains', '*_*'],
            ['iendswith', '*_'],
            ['istartswith', '_*'],
            ['--', ''],

            ['gt', '>'],
            ['gte', '>='],
            ['lt', '<'],
            ['lte', '<='],
            // ['range', '(..)'],
            // ['in', '(_,_)'],
            ['--', ''],

            ['day', 'DD'],
            ['month', 'MM'],
            ['week_day', 'WD'],
            ['year', 'YY'],
            ['--', ''],

            ['isnull', 'null'],
            // ['iregex', 'regex'],
    ]; 
 
