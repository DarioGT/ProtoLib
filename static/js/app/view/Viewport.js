Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'ProtoUL.view.MenuTree',
        'ProtoUL.view.Properties',
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

    loadPci: function(rec){
        // console.log( 'MenuClick')
        this.protoContainer.addTabPanel(rec);
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

    // createHeaderPanel: function(){
        // this.headerPanel = Ext.create('widget.headerpanel', {
            // xtype: 'box',
            // region:'north',
            // html: '<span class="title">Proto Certae </span><span class="subtitle">Version 0.0</span>',
            // height: 40,
            // collapsible: false,
            // split: false,
        // });
        // return this.headerPanel;
    // },

    // createPropertyPanel: function(){
        // this.propertyPanel = Ext.create('widget.propertypanel', {
            // region: 'east',
            // width: 300,
            // title: 'Properties',
            // collapsed: true,
            // xtype : 'properties',
        // });
        // return this.propertyPanel;
    // },


    // createFooterPanel: function(){
        // this.footerPanel = Ext.create('widget.footerpanel', {
            // region: 'south',
            // collapsible: false,
            // split: false,
            // height: 20,
        // });
        // return this.footerPanel;
    // },

});