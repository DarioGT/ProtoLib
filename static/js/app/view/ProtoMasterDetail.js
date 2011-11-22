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

        // Recupera la clase para obtener la meta   ------------------------------------------------------------ 
        var myMeta = _cllPCI[ this.protoConcept ] ;                         

        // Necesaria para poder agregar cosas dinamicamente   --------------------------------------------------
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : myMeta, 
            listeners: {
                'clickfilter': function( item ){
                    console.log ( 'onClickFilter' , item )
                },
                
                // 'clickloaddata': function (btn) { 
                    // console.log ( 'onClickLoadData' , btn )
                // }, 
                'menupromotedetail': function (item) {
                    console.log ( 'onMenuPromoteDetail' , item )
                },
                'menuselectdetail': function (item) {
                    console.log ( 'onMenuSelectDetail' , item )
                },                
            // scope: this, 
            }
        });
        tb.doLayout();


        tb.on('clickloaddata', function ( btn ) {
            console.log ( 'onClickLoadData' , btn )
        });

        
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


        //  @@ No esta haciendo nada   Carga del maestro detalle --------------------------------------------------------------------------- 
        masterGrid.on('rowclick', function (g, rowIndex, e) {
            var rec = g.store.getAt(rowIndex);
            idMasterGrid = rec.id
            linkDetail(ixActiveTab);
        });
    
        protoTabs.on('tabchange', function (tabPanel, tab) {
            ixActiveTab = tab.ixTab;
            linkDetail(ixActiveTab);
    
        });
    
        // Refresca las grillas de detalle 
        function linkDetail(ixTb) {
    
            // Verifica q halla un tab activo 
            if (ixTb < 0) { return; }
    
            // carga el store 
            var tmpStore = cllStoreDet[ixTb]
    
            // Verifica si la llave cambio
            if (tmpStore.protoMasterKey == idMasterGrid ) { return; };
    
            tmpStore.clearFilter();
            tmpStore.baseParams.protoFilterBase = '{"' + tmpStore.protoFilter + '" : ' + idMasterGrid + ',}';
            tmpStore.baseParams.modelLoad = '0'; 
            tmpStore.protoMasterKey = idMasterGrid;
            tmpStore.load();
            
        };

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

    loadDetail : function(rec) {
        // this.tab.setText(rec.get('text'));
        // this.child('#grid').loadForum(rec.getId());
    },

    refreshDetail : function(rec) {
        // this.tab.setText(rec.get('text'));
        // this.child('#grid').loadForum(rec.getId());
    },


});