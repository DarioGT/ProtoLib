

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

	
	var masterGrid = GridConfigFactory(protoAppCode, protoConcept, protoMasterStore);
	// var detailGrid = GridConfigFactory("Domain");


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
            handler: onButtonClick,
            // tooltip: {text:'This is a an example QuickTip for a toolbar item', title:'Tip Title'},
            // iconCls: 'blist',
            // Menus can be built/referenced by using nested menu config objects
            menu : {
                items: [{
                    text: '<b>New filter<b>', handler: onItemClick
                }, {
                    text: 'add filter', handler: onItemClick
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

                height: 150,
                minSize: 75,
                maxSize: 250,
		      	defaults:{border:false, activeTab:0}, 
		      	items: protoTabs, 
	  }]
	});
   
	//  Logica de operacion  ===================================================================================  

 	function addTab( tabTitle, gridDetail  ){
        tab = protoTabs.add({
            title: tabTitle,
			layout: 'fit',
            items: gridDetail
    	});
    	// potoTabs.doLayout();
    	protoTabs.setActiveTab(tab);
	}

   // En este evento tengo la metadata 
   protoMasterStore.on ( 'metachange' , function(store, meta) {
 	   // console.log( 'metaProto', meta ) ;
 	   var pDetails = meta.protoDetails ; 
	   var bDetails = false;
	    
 	   for (var vTab in pDetails) {
 			// console.log( pDetails[vTab] + " ");
			bDetails = true; 			
		    var item = menu.add({
		        text: vTab
		    });
		    // items support full Observable API
		    item.on('click', onItemClick);

		};
 	 
		if (bDetails == true) {
    	   menu.items.get( menuPromDetail ).enable();
   		}; 

		// Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
		newColData = []; j = 0;
		for ( var i = 0, len = meta.fields.length; i < len; i++) {
			c = meta.fields[i];
			if (c.allowFilter == undefined) { c.allowFilter = 1 };  
			if (c.allowFilter !== 0) {
				newColData[j] = [c.name,c.header]; j += 1;
			 // colStore.add(new colStore.recordType({ colPhysique: c.name, colName: c.header }));
			}
		};
		colStore.loadData(newColData);
   });


   // Carga del maestro detalle --------------------------------------------------------------------------- 
   masterGrid.on ( 'itemclick' , function() {
        var data = masterGrid.getSelectionModel().selected.items[0].data;
 	   	console.log( 'MasterId', data ) ;
		
        // store_product.clearFilter();
        // store_product.filter('company_id', data.id);
        // store_product.load();
	}); 


    // functions to display feedback
    function onButtonClick(btn){
        // Ext.example.msg('Button Click','You clicked the "{0}" button.', btn.text);

		protoMasterStore.clearFilter();
	    protoMasterStore.baseParams.protoFilter = '';  
		protoMasterStore.load();

    }

    function onItemClick(item){
        // Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
 	   	// console.log( 'vTab', vTab ) ;
        
        var protoDetail = item.text; 
        
        var tab = protoTabs.items.find(function(i){return i.title === protoDetail;});
        if(!tab) {
        	
       		var protoDetailStore = new Ext.data.JsonStore({
			    autoLoad: true,
			    baseParams: {
			    	protoFilter : '{"pk" : 0,}',  
			    	protoApp : 	   protoAppCode, 
			    	protoConcept : protoDetail,  
			    	},
			    remoteSort: true,
			    proxy: protoProxy, 
			    reader: protoReader 
				});

			var detailGrid = GridConfigFactory(protoAppCode, protoDetail, protoDetailStore);
			tab = addTab( protoDetail, detailGrid ); 
        };
	    protoTabs.setActiveTab(tab);

    }
   
   newWin2.show();
   
}


