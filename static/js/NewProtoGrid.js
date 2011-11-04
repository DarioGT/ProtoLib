

function newDjangoGrid(protoAppCode, protoConcept ) {

	// Reader y Proxy  ==============================================================================
    protoProxy = new Ext.data.HttpProxy({
        url: 'protoExtjsGridDefinition/?' + protoConcept,
        method: 'POST'
    });

    protoReader = new Ext.data.JsonReader({
        root: 'rows',
        id: 'id'
    });
	
	// Store MASTER   ================================================================================
    var protoMasterStore = new Ext.data.JsonStore({
	    autoLoad: true,
	    baseParams: {
	    	protoFilter : '{"pk" : 0,}',  
	    	protoApp : 	   protoAppCode, 
	    	protoConcept : protoConcept,  
	    	},
	    remoteSort: true,
	    proxy: protoProxy, 
	    reader: protoReader 
		});

	// De aqui disparo los eventos de la grilla master 
	var masterGrid = GridConfigFactory(protoAppCode, protoConcept, protoMasterStore);
	
	// coleccion con los store de los detalles  y su indice  
	var cllStoreDet = [];
	var ixCllStoreDet = 0; 
	var ixActiveTab = -1;
	
	// Id Actual de la grilla master 
	var idMasterGrid = 0;


	// Controla la carga de la metadata 
	var bMasterMetaLoaded = false;

	// Necesaria para poder agregar cosas dinamicamente   ------------------------------------------------------
    var menu = new Ext.menu.Menu();
    var tb = new Ext.Toolbar();
    tb.add({
            text:'Details',
            // iconCls: 'bmenu',  // <-- icon
            menu: menu  // assign menu by instance
       }, '->'
	);

    // items can easily be looked up
	var menuPromDetail = Ext.id();
    menu.add({
        text: '<b>Promote Detail<b>',
        id: menuPromDetail ,  
        disabled: true,    
    });
    menu.addSeparator();


    // add a combobox to the toolbar
    var colStore = new Ext.data.ArrayStore({
        fields: ['colPhysique', 'colName'],
        data : [],
    });

    var combo = new Ext.form.ComboBox({
        store: colStore,
        displayField: 'colName',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Select a column ...',
        selectOnFocus:true,
        width:135
    });
    tb.addField(combo);

	// combo - operation 
    var comboOp = new Ext.form.ComboBox({
        width:			50,
	    mode:           'local',
	    triggerAction:  'all',
	    forceSelection: true,
	    editable:       false,
	    fieldLabel:     'Op',
        name:           'operation',
        hiddenName:     'operation',
        displayField:   'operation',
        valueField:     'code',
	    value:          '=',
        store:          new Ext.data.ArrayStore({
        	fields : [ 'code', 'operation'],
            data   : [
				['iexact',		'='],
				['icontains',	'*_*'],
				['iendswith',	'*_'],
				['istartswith',	'_*'],
				['--',			''],

				['gt',			'>'],
				['gte',			'>='],
				['lt',			'<'],
				['lte',			'<='],
				['range',		'(..)'],
				['in',			'(_,_)'],
				['--',			''],

				['day',			'DD'],
				['month',		'MM'],
				['week_day',	'WD'],
				['year',		'YY'],
				['--',			''],

				['isnull',		'null'],
				['iregex',		'regex'],

            ]
        })
        
    });
    tb.addField(comboOp);


	// Criteria 
	var searchCr =  new Ext.form.TextField({
        emptyText:'search criteria ..',
        width:135
	})
    tb.addField(searchCr);



	// Seach button 
	var searchBtn = new Ext.Toolbar.SplitButton({
            text: 'Load data',
            handler: onClickLoadData,
            // tooltip: {text:'This is a an example QuickTip for a toolbar item', title:'Tip Title'},
            // iconCls: 'blist',
            // Menus can be built/referenced by using nested menu config objects
            menu : {
                items: [{
                    text: '<b>New filter<b>', handler: onClickFilter
                }, {
                    text: 'add filter', handler: onClickFilter
                }]
            }})

    tb.addField(searchBtn);

	//

    tb.doLayout();

	// Panel de detalles ==================================================================================

	var detailEI = Ext.id();
    var protoTabs = new Ext.TabPanel({
    	id: detailEI 
    });

	//  Crea una ventana     ===================================================================================  
    var newWin2 = new Ext.Window({
        title: protoConcept
        
        ,width:600
        ,height:400
        ,draggable :true
        ,layout:'border'
        ,defaults: {
            collapsible: true,
            split: true
        },
        items: [{
	            // title: 'Master',
				tbar: tb, 
				region:'center',
        		layout:'fit',
	            collapsible: false,

            	items: masterGrid
        	},{
            	title: 'Details',
                region: 'south',
                collapsed: true, 
        		layout:'fit',

                height: 180,
                minSize: 75,
             // maxSize: 250,
		      	defaults:{border:false, activeTab:0}, 
		      	items: protoTabs, 
	  }]
	});
   
	//  Logica de operacion  ===================================================================================  

 	function addTab( tabTitle, gridDetail, ixTabC  ){
        tab = protoTabs.add({
            title: tabTitle,
			layout: 'fit',
            items: gridDetail, 
            ixTab: ixTabC 
    	});
    	protoTabs.setActiveTab(tab);
	}

   // En este evento tengo la metadata 
   protoMasterStore.on ( 'metachange' , function(store, meta) {

	   // para evitar el seteo en cada carga  	   
 	   if ( bMasterMetaLoaded ) { return;  } 
 	   bMasterMetaLoaded = true;
 	   
 	   var pDetails = meta.protoDetails ; 
	   var bDetails = false;
	   
	   // Agrega un numero secuencia para marcar los tabs 
	   var ixTabC = 0 
	    
 	   for (var vDet in pDetails) {
 			// console.log( pDetails[vTab] + " ");
			bDetails = true; 			
		    var item = menu.add({
		        text: vDet, 
		        protoFilter : pDetails[vDet], 
		        ixTab : ixTabC, 
		    });
		    // Agrego el handler q activara el tab a partir del menu
		    item.on('click', onMenuSelectDetail);

			ixTabC += 1 ;
		};
 	 
 	 	// activa el boton de promover detalles 
		if (bDetails == true) {
    	   menu.items.get( menuPromDetail ).enable();
   		}; 

		// Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
		newColData = []; j = 0;
		for ( var i = 0, len = meta.fields.length; i < len; i++) {
			var c = meta.fields[i];

			if (c.allowFilter !== undefined) { c.allowFilter = 1 };
			if (c.allowFilter == 1) {
				newColData[j] = [c.name,c.header]; j += 1;
				
				// DGT: esta carga es directa al store, pienso q es mas costosa por q interactua cada vez con extjs
			 	// colStore.add(new colStore.recordType({ colPhysique: c.name, colName: c.header }));
			}
		};
		colStore.loadData(newColData);
		
		
   });


   // Carga del maestro detalle --------------------------------------------------------------------------- 
   masterGrid.on ( 'rowclick' , function( g, rowIndex, e) {
        var rec = g.store.getAt(rowIndex);
        idMasterGrid = rec.id 
 	   	linkDetail( ixActiveTab );
	}); 

   protoTabs.on ( 'tabchange', function( tabPanel, tab ){
 	   	ixActiveTab = tab.ixTab ; 
 	   	linkDetail( ixActiveTab );
 	   	
	});

	// Refresca las grillas de detalle 
    function linkDetail( ixTb ){

		// Verifica q halla un tab activo 
		if (ixTb < 0){ return; }
    	
    	// carga el store 
		var tmpStore = cllStoreDet[ixTb]
		
		// Verifica si la llave cambio
		if ( idMasterGrid = tmpStore.protoMasterKey ) {return; };  		         
		         
		tmpStore.clearFilter();
	    tmpStore.baseParams.protoFilterBase = '{"' + tmpStore.protoFilter  + '" : ' + idMasterGrid + ',}',  
		tmpStore.load();
    	
    };
    	


    // functions to load data  
    function onClickLoadData(btn){

		protoMasterStore.clearFilter();
	    protoMasterStore.baseParams.protoFilter = '';  
		protoMasterStore.load();

    }


	// TODO: Manejara los filtros compuestos ( QBE )
    function onClickFilter(item){};
    	

	// Carga los datos de la grilla con el criterio seleccionado 
	// TODO: Guardar criterios en el menu para q puedan ser (des)activados,  Querys complejos con combinacion de campos AND
    function onMenuSelectDetail(item){
        
   		// console.log( 'Menu', item ) ;
        
        var protoDetail = item.text; 
        
        var tab = protoTabs.items.find(function(i){return i.title === protoDetail;});
        if(!tab) {
        	
       		var protoDetailStore = new Ext.data.JsonStore({
			    autoLoad: true,
			    baseParams: {
			    	protoFilterBase : '{"' + item.protoFilter  + '" : ' + idMasterGrid + ',}',  
			    	protoApp : 	   protoAppCode, 
			    	protoConcept : protoDetail,  
			    	},
			    remoteSort: true,
			    proxy: protoProxy, 
			    reader: protoReader, 
			    protoFilter : item.protoFilter,
			    protoMasterKey : idMasterGrid
				});

			// guarda el store con el indice apropiado   
		    cllStoreDet[item.ixTab] = protoDetailStore 

			var detailGrid = GridConfigFactory(protoAppCode, protoDetail, protoDetailStore);
			tab = addTab( protoDetail, detailGrid, item.ixTab  ); 
        };
		
		// 	Marca el tab activo     
		ixActiveTab = item.ixTab ; 
	    protoTabs.setActiveTab(tab);

    }
   
   newWin2.show();
   
}


