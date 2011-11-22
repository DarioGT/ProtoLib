/*
 * 
 */
Ext.define('ProtoUL.UI.TbMasterDetail', {
    extend: 'Ext.Toolbar',
    alias: 'widget.tbMasterDetail',

    initComponent: function() {


        // Asigna una referencia al objeto 
        tbMasterDetail = this ; 

        var myMeta = this.protoMeta; 


        // Menu Detail 
        var menuDetail = new Ext.menu.Menu();
        var menuPromDetail = Ext.id();
        menuDetail.add({
            text: '<b>Promote Detail<b>',
            id: menuPromDetail,
            disabled: true,
            handler: tbMasterDetail.onMenuPromoteDetail, 
        },{
            xtype: 'menuseparator'
        });
        configureMenuDetail( ); 


        // Combo Columnas  
        var colStore = new Ext.data.ArrayStore({
            fields: ['colPhysique', 'colName'],
            data: configureComboColumns( ),
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
            handler: tbMasterDetail.onClickLoadData,
            // iconCls: 'blist',
            menu: {
                items: [{
                    text: '<b>Clear filter<b>',
                    handler: tbMasterDetail.onClickFilter
                }, {
                    text: 'add filter',
                    handler: tbMasterDetail.onClickFilter
                }]
            }
        })
        
        tbItems = [{
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


        
        this.items = tbItems;      
        this.callParent();

        function configureComboColumns ( tb ){
        
                // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
            var colData = [];
            j = 0;
            for (var i = 0, len = myMeta.fields.length; i < len; i++) {
                var c = myMeta.fields[i];
    
                if (c.allowFilter == undefined) {
                    c.allowFilter = 1
                };
    
                if (c.queryCode == undefined) { 
                    c.queryCode =  c.name; 
                };
                
                if (c.allowFilter == 1) {
                    colData[j] = [c.queryCode, c.header];
                    j += 1;
    
                    // DGT: esta carga es directa al store, pienso q es mas costosa por q interactua cada vez con extjs
                    // colStore.add(new colStore.recordType({ colPhysique: c.name, colName: c.header }));
                }
            };
            
            return colData ; 
        }; 

        function configureMenuDetail(  ){
            
           // Configuracion de detalles    ------------------------------------------------------------------------ 
            var pDetails = myMeta.protoDetails;
    
            // Agrega un numero secuencia para marcar los tabs 
            var ixTabC = 0
            
            // Indica si tiene o no detalles 
            var bDetails = false;

            // Recorre y agrega los detalles al menu 
            for (var vDet in pDetails) {
                // console.log( pDetails[vTab] + " ");
                bDetails = true;
                var item = menuDetail.add({
                    text: vDet,
                    protoFilter: pDetails[vDet],
                    ixTab: ixTabC,
                });
                // Agrego el handler q activara el tab a partir del menu
                item.on('click', tbMasterDetail.onMenuSelectDetail);
    
                ixTabC += 1;
            };
    
            // activa el boton de promover detalles 
            if (bDetails == true) {
                menuDetail.items.get( menuPromDetail ).enable();
            };
        };

        this.addEvents('clickfilter', 'clickloaddata', 'menupromotedetail', 'menuselectdetail');

    }, 
    
    onClickFilter: function( item ){
        // console.log ( 'onClickFilter' , item )
        this.fireEvent('clickfilter', this, item );
    }, 
    onClickLoadData: function (btn) { 
        // console.log ( 'onClickLoadData' , btn )
        this.fireEvent('clickloaddata', this, btn );

    }, 
    onMenuPromoteDetail: function (item) {
        // console.log ( 'onMenuPromoteDetail' , item )
        this.fireEvent('menupromotedetail', this, item );
        
    },
    onMenuSelectDetail: function (item) {
        // console.log ( 'onMenuSelectDetail' , item )
        this.fireEvent('menuselectdetail', this, item );

    },

}); 