

function newDjangoGrid(protoEntityName) {
	
	var masterGrid = GridConfigFactory(protoEntityName);
	// var detailGrid = GridConfigFactory("Domain");


	// Necesaria para poder agregar cosas dinamicamente   ------------------------------------------------------
    var menu = new Ext.menu.Menu({ id: 'mainMenu', });
    var tb = new Ext.Toolbar();
    tb.add({
            text:'Details',
            // iconCls: 'bmenu',  // <-- icon
            menu: menu  // assign menu by instance
       }, '->',

       new Ext.Toolbar.SplitButton({
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
            }
    	})
	);

    // items can easily be looked up
    menu.addSeparator();
    menu.add({
        text: 'Promote Detail',
        id: 'promoteDetail',  
        disabled: true   
    });

    var colStore = new Ext.data.ArrayStore({
        fields: ['colPhysique', 'colName'],
        data : []  
    });


    // add a combobox to the toolbar
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

	var searchCr =  new Ext.form.TextField({
        emptyText:'search criteria ..',
        width:135
	})
    tb.addField(searchCr);
    tb.doLayout();

	// Panel de detalles ==================================================================================

	var detailEI = Ext.id();
    protoTabs = new Ext.TabPanel({
    	id: detailEI 
    });

	//  Crea una ventana     ===================================================================================  
    var newWin2 = new Ext.Window({
        title: protoEntityName
        
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
   protoStore.on ( 'metachange' , function(store, meta) {
 	   console.log( 'metaProto', meta ) ;
 	   var pDetails = meta.protoDetails ; 
 	 
 	   for (var vTab in pDetails) {
 	   		// console.log( 'vTab', vTab ) ;
 			// console.log( pDetails[vTab] + " ");
 			
		    var item = menu.add({
		        text: vTab
		    });
		    // items support full Observable API
		    item.on('click', onItemClick);

		}

    // // Agregar
    // // adding and removing elements dynamically
    // menu.items.get('promoteDetail').disable();
// 
// 
	// // Columnas para el Query
	 // colStore.data =     [
        // ['id', 'Id Reg'],
        // ['code', 'Code Reg']
    // ];


   });

    // functions to display feedback
    function onButtonClick(btn){
        // Ext.example.msg('Button Click','You clicked the "{0}" button.', btn.text);
    }

    function onItemClick(item){
        // Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
 	   	// console.log( 'vTab', vTab ) ;
        
        protoEntityName = item.text; 
        protoEntityName = "Domain"; 
        
        // region = Ext.getCmp( 'regionDetail' ); 
		detailGrid =  GridConfigFactory(protoEntityName);

		addTab( protoEntityName, detailGrid ); 

		// detailGrid.render( detailEI )
		// detailPanel.doLayout();
		// detailPanel.show();
		
    	// region.title = 'Cambio..';
      	// region.items = detailGrid;

		// .items = detailGrid 
    }
   
   newWin2.show();
   
}


