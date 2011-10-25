Tareas pendientes


	Crear el esquema de navegacion con el panel de navegacion y
	vinculos para crear los tabs

11/10/25  Enviar la configuracion de detalles y tabls

		En la construccion del json estoy enviando una configuracion basica de tabs y de los detalles  (protogrid.py)

            ,'protoTabs':[
                 {'T1': ['Col1','Col2']},
                 {'T2': ['Col3','Col2']},
                 ]
            ,'protoDetails': {
                 'Concpet1': 'Id = %Id',
                 'Concept2': 'Id = %Id'
                 }

		pero no encuentro la conf  q envio en el store
		La llamada Ajax hace desde ProtoGrid  ( POST )

		1. Verificar q este llegando,  ( manejar el store )

		Ext.data.HttpProxy( url, method )

        La lectura se hace asi

              ,proxy:new Ext.data.HttpProxy({
                    url:'protoExtjsGridDefinition/?' + protoEntityName
                    ,method:'POST'
                })

                ,reader: new Ext.data.JsonReader({
                    root:'rows'
                    ,id:'id'
                })


        La conf de columnas puede manejarse simplemente asignando la variable columns 
        
        // Column Model shortcut array
        var cols = [
          { id : 'name', header: "Record Name", width: 160, sortable: true, dataIndex: 'name'},
          {header: "column1", width: 50, sortable: true, dataIndex: 'column1'},
          {header: "column2", width: 50, sortable: true, dataIndex: 'column2'}
        ];

        Q es lo q viene en mi store.metaData.fields
        
        Estaba en el primer nivel con los campos de control,  lo inclui en la meta y ya puedo verlo desde js.

        Ahora es como pasarla para verla como una propiedad de la grilla?  asi podre desde el panel exterior configuar el entorno (navegacion)
        Hacer un getMeta en la grilla??

---------------


	Agregar vinculos de navegacion a la grilla

	Pasar la vista a ProtoLib
	 
	Q la vista genere los datos de manejo tomados de la definicion Db
	
	Manejar los modelos tambien dinamicamente Db
	 
	Agregar vinculos de navegacion a la grilla
	 
	Manejo de navegacion con dependencia padre hijo 
	
	Independizar las DB 	

	Convertir la grilla de lectura basica en una grilla extjs 	

	Cambiar el InLine por una tabla simple con 
	una columa de modificacion y otra de seleccion (hipervinculo sobre la llave), 

	
	la edicion no se hara inline, se hara todo el tiempo em la forma base del modelo,

	Panel de vinculos con manejo de la fila seleccionada. 

	
	Generacion de modelos a partir de la Db  


------------------------------------------------------------------------

9/26/2011 10:18:00 PM
	
Ok	Buscar librerias ExtJs para Django 
Ok	Buscar donde se procesa el InLine ( girlla de valores ) para ejecutarlo en extjs 
	

Ok  Manejo de Meta para unificar la importacion de Modelibra y OMS,. Se basa en Django para el manejo del ORM

Ok  Projecto Django para visualizar el diccionario.  

	

-----------------------------------------------------------------------
Soporte ExtJs

        PAra el manejo de extjs pienso q la manera mas optima es utilizando el  Django-ExtDirect 
        
        Hay varias versiones,  
            * github.revolunet-ext-js
              fue susituido por revulunet.django-extdirect
              baje un fork q trae ejemplos

            * github.ext-direct
              Es un proyecto generico q trae alguna forma de utilizarse en django
              lo descarte por q se dedica mas otros productos en python q a django.

            * github.revolunet-extdirect
              es bsado en sancho y es una version siguiente a revolunet-ext-js
              dice q requiere  Ext.ux.AwesomeCombo

            * Ext.ux.AwesomeCombo
              para instalarlo solo dice q se copie en las estaticas,
              podria ser en ext3.x o directamene en el proyecto,
              voy a copiarlas en el proyecto directamnte



## To install run
    python setup.py install


