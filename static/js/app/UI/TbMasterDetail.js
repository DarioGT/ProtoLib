/*
 * 
 */
Ext.define('ProtoUL.UI.TbMasterDetail', {
    extend: 'Ext.Toolbar',
    alias: 'widget.tbMasterDetail',

    initComponent: function() {

        // Menu Detail 
        var menuDetail = new Ext.menu.Menu();
        var menuPromDetail = Ext.id();
        menuDetail.add({
            text: '<b>Promote Detail<b>',
            id: menuPromDetail,
            disabled: true,
            // handler: onMenuPromoteDetail, 
        },{
            xtype: 'menuseparator'
        });

        // Combo Columnas  
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

        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: 'search criteria ..',
            width: 135
        })

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
        
        tb = [{
            text: 'Details',
            // iconCls: 'bmenu',    // <-- icon
            menu: menuDetail        // assign menu by instance
            }, 
            '->',
            comboCols,
            comboOp,
            searchCr,
            searchBtn    
            ];

        this.items = tb;      
        this.callParent();
    }, 

}); 