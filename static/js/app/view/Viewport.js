Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'ProtoUL.view.MenuTree',
        // 'ProtoUL.view.ProtoProperties',
        'ProtoUL.view.ProtoContainer',
    ],

    initComponent: function(){

        Ext.apply(this, {
            layout: 'border',
            autoRender: true, 
            padding: 5,
            defaults: { 
                split: true
            },
            items: [
                this.createMenuPanel(),
                this.createProtoContainer(),
                // this.createPropertyPanel(),
                // this.createHeaderPanel(),
                // this.createFooterPanel(),
                ],
        });

        this.callParent(arguments);
        
    },

    createMenuPanel: function(){
        // this.menuPanel = Ext.create('widget.menupanel', {
        this.menuPanel = {
            region: 'west',
            width: 300,
            title : 'Menu',
            collapsible: true,
            
            // Solo en el panel de menus
            xtype: 'menuTree'

            // ---------------------  manejo de favoritos 
            // layout: 'accordion',
            // items: [{
                // // title: 'Menu',
                // layout: 'fit',
                // xtype: 'menuTree'
                // // xtype: 'treepanel',
            // }, {
                // title: 'Favorits',
                // hidden: true, 
            // }]            
        }
        // );

        // listeners: {
            // scope: this,
            // feedselect: this.onFeedSelect
        // };

        return this.menuPanel;
    },

    DefineProtoModel: function( metaData , pConcept, modelClassName ){
            
        console.log ( pConcept, ' Loading ' + modelClassName + '...' ); 
        Ext.define(modelClassName, {
            extend: 'ProtoUL.model.ProtoModel',
            metaData : metaData,
            fields: metaData.fields, 
            proxy: {
                type: 'ajax',
                url: 'dynamic2.json'
            }, 
        });
  
    },


    loadPci: function(rec){
        
        
        // *** El truco es q no se crea el modelo, solo se define
        var protoConcept = rec.data.id ;  
        var thisRef = this ;
        
        console.log( protoConcept, ' Loading MasterPanel ...')

        var modelClassName = _PConfig.clsBaseModel + protoConcept ; 
        
        if  (! Ext.ClassManager.isCreated( modelClassName )){
            console.log ( protoConcept, ' Loading  Pci ...  ' ); 

            Ext.Ajax.request({
                url: _PConfig.urlProtoDefinition  ,
                params : { 
                    action : protoConcept 
                    },
                method: 'GET',
                success: function ( result, request ) { 
                    
                    console.log( protoConcept, ' Pci loaded ');
                    var myResult = Ext.decode( result.responseText )
                       
                    thisRef.DefineProtoModel( myResult.metaData , protoConcept, modelClassName  );
                    thisRef.protoContainer.addTabPanel(rec);

                },
                failure: function ( result, request) { 
                    // Se aborta la ejecucion 
                    console.log('Failed', result.responseText); 
                },
            });

        }  else {

            // El modelo ya ha sido cargado         
            this.protoContainer.addTabPanel(rec);
               
        };
        
    },   

    createProtoContainer: function(){
       this.protoContainer = Ext.create('widget.protoContainer', {
            // title: 'Master',
            // tbar: tb,
            region: 'center',
            minWidth: 300,
            // collapsible: false,
            // layout: 'border',
            // defaults: {
                // collapsible: true,
                // split: true
            // },
            // items: [{
                // region: 'center',
                // layout: 'fit',
                // collapsible: false,
                // // items: masterGrid
                // xtype: 'contactlist'
            // }, {
                // title: 'Details',
                // region: 'south',
                // collapsed: false,
                // layout: 'fit',
                // height: 180,
                // minSize: 75,
                // // items: protoTabs,
            // }]

        }); 
        return this.protoContainer;
    },


});