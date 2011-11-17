Ext.define('ProtoUL.view.ProtoMasterDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.protoMasterDetail',

    initComponent: function() {
        
        // De aqui disparo los eventos de la grilla master 
        // var masterGrid = GridConfigFactory(protoAppCode, protoConcept, protoMasterStore);

        // coleccion con los store de los detalles  y su indice  
        var cllStoreDet = [];
        var ixCllStoreDet = 0;
        var ixActiveTab = -1;
    
        // Id Actual de la grilla master 
        var idMasterGrid = 0;
    
    
        // Controla la carga de la metadata 
        var bMasterMetaLoaded = false;
    
        // Necesaria para poder agregar cosas dinamicamente   ------------------------------------------------------
        var menu = new Ext.menu.Menu();
        var tb = new Ext.Toolbar();
        tb.add({
            text: 'Details',
            // iconCls: 'bmenu',  // <-- icon
            menu: menu // assign menu by instance
        }, '->');
    
        // items can easily be looked up
        var menuPromDetail = Ext.id();
        menu.add({
            text: '<b>Promote Detail<b>',
            id: menuPromDetail,
            disabled: true,
            // handler: onMenuPromoteDetail, 
        },{
            xtype: 'menuseparator'
        });
    
    
        // add a combobox to the toolbar
        var colStore = new Ext.data.ArrayStore({
            fields: ['colPhysique', 'colName'],
            data: [],
        });
    
        var comboCols = new Ext.form.ComboBox({
            store: colStore,
            width: 135,
            mode: 'local',
            triggerAction: 'all',
            displayField: 'colName',
            valueField: 'colPhysique',
            forceSelection: true,
            emptyText: 'Select a column ...',
            selectOnFocus: true,
            typeAhead: true,
        });
        tb.add(comboCols);
    
        // combo - operation 
        var comboOp = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({ fields: ['code', 'operation'], data: _ComboFilterOp }),
            width: 50,
            mode: 'local',
            triggerAction: 'all',  
            displayField: 'operation',
            valueField: 'code',
            forceSelection: true,
            editable: false,
        });
        tb.add(comboOp);
    
    
        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: 'search criteria ..',
            width: 135
        })
        tb.add(searchCr);
    
    
        // Load Data button 
        var searchBtn = new Ext.button.Split({
            text: 'Load data',
            // handler: onClickLoadData,
            // iconCls: 'blist',
            menu: {
                items: [{
                    text: '<b>Clear filter<b>',
                    // handler: onClickFilter
                // }, {
                    // text: 'add filter',
                    // handler: onClickFilter
                }]
            }
        })
    
        tb.add(searchBtn);
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
                // title: 'Master',
                tbar: tb,
                region: 'center',
                layout: 'fit',
                collapsible: false,
                // items: masterGrid
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