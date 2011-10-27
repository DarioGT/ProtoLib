

function newDjangoGrid(protoEntityName) {
	
   var customgrid = GridConfigFactory(protoEntityName);
   
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
	            title: 'Main Content',

	            collapsible: false,
            	region:'center',
        		layout:'fit',
            	items: customgrid
        	},{
	            title: 'Navigation',
	            region:'west',
	            width: 175,
	            collapsed: true, 
	            minSize: 100
        	},{
            	title: 'Footer',
                region: 'south',
                height: 150,
                minSize: 75,
                maxSize: 250,
                collapsed: true, 

		      	defaults:{border:false, activeTab:0}
		      	,items:[{
		           defaults:{layout:'fit'}
		          ,xtype:'tabpanel'
		          ,items:[{
		              title:'Tab 1'
		          },{
		              title:'Tab 2'
		          },{
		              title:'Tab 3'
		          }]

		      }]
	  }]
	});
   

   // En este evento tengo la metadata 
   protoStore.on ( 'metachange' , function(store, meta) {
	   console.log( 'metaProto', meta ) ;
   });

   
   newWin2.show();
   
   
}


