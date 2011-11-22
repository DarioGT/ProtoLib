/*
 *  TabContainer 
 *  -   MasterDetail
 *  -   -   Grid 
 */
Ext.define('ProtoUL.view.ProtoMasterDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.protoMasterDetail',
    requires: [
        'ProtoUL.view.ProtoGrid',
        'ProtoUL.UI.TbMasterDetail',
    ],

    initComponent: function() {

        console.log ( this.protoConcept , ' masterPanel def'  ); 
        
        // Definicion grilla master   ---------------- 
        masterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            protoConcept : this.protoConcept,   
        }) ; 
        
        // Guarda el store para efectos de eventos y referencias 
        var protoMasterStore = masterGrid.store  

        // coleccion con los store de los detalles  y su indice  
        var cllStoreDet = [];
        var ixCllStoreDet = 0;
        var ixActiveTab = -1;
    
        // Id Actual de la grilla master 
        var idMasterGrid = 0;
    
    
        // Controla la carga de la metadata 
        var bMasterMetaLoaded = false;
    
        // Necesaria para poder agregar cosas dinamicamente   ------------------------------------------------------
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail');
        tb.doLayout();
        
        // Panel de detalles ==================================================================================
        var detailEI = Ext.id();
        var protoTabs = new Ext.TabPanel({
            id: detailEI
        });
        
        // Panel de detalles ==================================================================================
        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: true,
                split: true
            },
            items: [{
                tbar: tb,
                region: 'center',
                layout: 'fit',
                collapsible: false,
                items: masterGrid
            }, {
                title: 'Details',
                region: 'south',
                collapsed: true,
                layout: 'fit',
                height: 180,
                minSize: 75,
                defaults: {
                    border: false,
                    activeTab: 0
                },
                items: protoTabs,
            }]
        });

        this.callParent();
    },
    
    toggleDetail: function(show){
        var detail = this.child('#detail');
        if (show) {
            detail.show();
        } else {
            detail.hide();
        }
    },

    loadPCI: function(rec) {
        // this.tab.setText(rec.get('text'));
        // this.child('#grid').loadForum(rec.getId());
    },

});