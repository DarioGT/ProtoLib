

function newDjangoGrid(protoEntityName) {
	
	var customgrid = GridConfigFactory(protoEntityName);


//	Definicion del tab no se necesita  
    protoTabs = new Ext.TabPanel({
        // resizeTabs:true, 
        // minTabWidth: 100,
        // tabWidth:120,
        // tabPosition: 'bottom',
        enableTabScroll: true,
        // autoScroll:true,
	    });
	 
 	function addTab( tabTitle  ){
        tab = protoTabs.add({
            title: tabTitle,
            // iconCls: 'tabs',
            // closable:true,
			layout: 'fit',
            // items: protoGridDetail
    	});
    	// potoTabs.setActiveTab(tab);
	}

   
   // Crea una ventana
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
	            title: 'Master',
            	region:'center',
        		layout:'fit',
	            collapsible: false,

            	items: customgrid
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
   

   // En este evento tengo la metadata 
   protoStore.on ( 'metachange' , function(store, meta) {
 	   console.log( 'metaProto', meta ) ;
 	   var pDetails = meta.protoDetails ; 
 	 
 	   for (var vTab in pDetails) {
 	   		console.log( 'vTab', vTab ) ;
 			// console.log( pDetails[vTab] + " ");
	 		addTab( vTab );
		}
 
   });

   
   newWin2.show();
   
   
}


