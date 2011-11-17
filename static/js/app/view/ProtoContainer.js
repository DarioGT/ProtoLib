// Contiene  los tabs para crear las pcls 

Ext.define('ProtoUL.view.ProtoContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoContainer',

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
        // layout: 'fit',
            // items: detailGrid,
            // ixTab: item.ixTab
        });

        if (!this.ixTab){this.ixTab = 0}; 
        this.ixTab +=1; 
    },

});