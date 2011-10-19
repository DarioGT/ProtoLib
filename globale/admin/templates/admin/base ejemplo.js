
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
            split: true,
            bodyStyle: 'padding:15px'
        },
        items: [{
            title: 'Main Content',
            collapsible: false,
            region:'center',
            margins: '5 0 0 0'
        	},{
            title: 'Navigation',
            region:'west',
            margins: '5 0 0 0',
            cmargins: '5 5 0 0',
            width: 175,
            minSize: 100,
            maxSize: 250
        	},{
            	title: 'Footer',
                region: 'south',
                height: 150,
                minSize: 75,
                maxSize: 250,
                cmargins: '5 0 0 0'
	      
	      ,defaults:{border:false, activeTab:0}
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
	}).show();
	   

}

  
function newDjangoSimplePanel(title, djangoEntityName, htmlDiv) {
   var customgrid = GridConfigFactory(djangoEntityName);

   // Crea un panel
    var panel = new Ext.Panel({
         title: title 
        ,id:'simplestbl'
        ,layout:'border'
        ,width:1200
        ,height:400
        ,renderTo:htmlDiv
        ,items:[{
             region:'center'
            ,layout:'fit'
            ,frame:false
            ,border:false
        	,items: customgrid 
        },{
             region:'south'
            ,layout:'fit'
            ,frame:false
        	,height:200
            ,split:true
            ,collapsible:true
            ,defaults:{border:false, activeTab:0}
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
    }).show();

}


function newDjangoPanel(title, djangoEntityName, htmlDiv) {
   var customgrid = GridConfigFactory(djangoEntityName);

   var panel = new Ext.Panel({
        title: title
        ,iconCls:' icon-application_view_list'
        ,layout:'fit'
        ,height:400
        ,style: 'margin-top:20px'
        ,frame: true
        ,html: htmlDiv
        ,renderTo: htmlDiv
        ,items: customgrid
      }); 

   
   var viewport = new Ext.Viewport({
         id:'simplevp'
        ,layout:'border'
        ,border:true
        ,items:[{
             region:'north'
            ,height:200
            ,border:false
            ,bodyStyle:'background-color:#f8f8f8;'
            ,title:'North'
            ,collapsible:true
        	,items: panel
        },{
             region:'west'
            ,width:200
            ,border:false
            ,autoScroll:true
            ,title:'West'
            ,bodyStyle:'padding:5px;font-size:11px;background-color:#f4f4f4;'
            ,html:'Electram dissentiet no qui.  </p>'
            ,collapsible:true
            ,split:true
            ,collapseMode:'mini'
        },{
             region:'south'
            ,height:100
            ,html:'South'
            ,border:true
            ,title:'South'
            ,collapsible:true
        },{
             region:'east'
            ,width:200
            ,html:'East'
            ,border:true
            ,bodyStyle:'background-color:#f4f4f4;'
            ,title:'East'
            ,collapsible:true
        },{
             region:'center'
            ,html:'Center'
            ,border:true
            ,collapsible:true
            ,bodyStyle:'background-color:#f0f0f0;'
            ,title:'Center'
        }]
    }).show();

}


function createPanel(title){
            Ext.QuickTips.init();
        
           
			var newPanel = function(titlePanel, htmlDiv,  djangoEntityName ) {
				// Los botones son una coleccion 
            	var b = [ 
                        new Ext.Button({
                             text:'launch this example'
                            ,iconCls:'icon-application_form_magnify'
                            ,scope:this
                            ,handler: function() { newDjangoGrid(titlePanel, djangoEntityName); }
                            })
                    ];
                    
                var panel = new Ext.Panel({
                    title: titlePanel
                    ,iconCls:' icon-application_view_list'
                    ,width: 1200
                    ,style: 'margin-top:20px'
                    ,frame: true
                    ,html: htmlDiv
                    
                    ,buttons: b
                    ,buttonAlign:'left'
                    ,renderTo: 'examples'
                });
                return panel
            
            }

			newPanel(title, Ext.get('genericGrid').dom.innerHTML, 'user');
	}
               
</script>

   
   
    </body> 
    
</html>    