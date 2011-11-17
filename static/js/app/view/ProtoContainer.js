// Contiene  los tabs para crear las pcls 

Ext.define('ProtoUL.view.ProtoContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoContainer',
    requires: ['ProtoUL.view.ProtoMasterDetail', ],

    initComponent: function() {
        this.tabBar = {
            border: false
        };
        
        this.callParent();
    },
    
    addTabPanel: function( rec  ){
        
        var tab = this.add({
        title: rec.data.text ,
        closable: true, 
        layout: 'fit',
        xtype: 'protoMasterDetail',
        });

    },

});

