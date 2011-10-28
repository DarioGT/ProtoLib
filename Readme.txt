Tareas pendientes

	** Seleccion de Columnas visibles ( vista )
	PAra el manejode las columnas no se usaran tabs, pues este objeto es automaticamente un contenedor y el objeto contenido 
	hace referencia a su contenedor, de tal forma q al intentar compartirlo en diferentes tabs, solo aparece en el ultimo q 
	se asigno,  habria q jugar con esto dinamicamente y tocaria escribir mas codigo.  
	
	
	** Busqueda  QBE
	Ext.ux.form.SearchField  Es un widget especializado en esto,  y con un campo de base adicional se podria manejar 
	busquedas sobre campos especificos o sobre todos los campos buscables
	 
	http://joekuan.wordpress.com/2011/04/04/selective-column-search-using-extjs-combo-and-searchfield-together/
	file:///D:/data/ExtJs/ext-3.4.0/examples/form/custom-access.html
	file:///D:/data/ExtJs/ext-3.4.0/examples/forum/forum.html

	** Filtros 
	Los filtros sobre las columnas tambien son una buena opcion 
	file:///D:/data/ExtJs/ext-3.4.0/examples/grid-filtering/grid-filter-local.html


** 	Nagegador 
	Agregar vinculos de navegacion a la grilla
	Manejo de navegacion con dependencia padre hijo 

	El manejo de tabs quedara para mas adelante, por ahora el manejo de master-detail se hace sobre un solo 
	detalle,  en el menu se agregan todas los "detalles"  y se configura el detalle seleccionado. 
	

**	Otras 
	Pasar la vista a ProtoLib
	Q la vista genere los datos de manejo tomados de la definicion Db
	Manejar los modelos tambien dinamicamente Db
	Independizar las DB 	
	Convertir la grilla de lectura basica en una grilla extjs
	 	
	 	
Ok 	Cambiar el InLine por una tabla simple con una columa de modificacion y otra de seleccion (hipervinculo sobre la llave), 
	la edicion no se hara inline, se hara todo el tiempo em la forma base del modelo,




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


