function newDjangoGrid(protoAppCode, protoConcept, protoMasterStore ) {

    // Reader y Proxy  ==============================================================================
    protoProxy = new Ext.data.HttpProxy({
        url: 'protoExtjsGridDefinition/?' + protoConcept,
        method: 'POST'
    });

    protoReader = new Ext.data.JsonReader({
        root: 'rows',
        id: 'id'
    });

    // Store MASTER   ================================================================================
    if (typeof protoMasterStore == 'undefined') {
        var protoMasterStore = new Ext.data.JsonStore({
            autoLoad: true,
            baseParams: {
                protoFilter: '{"pk" : 0,}',
                protoApp: protoAppCode,
                protoConcept: protoConcept,
                modelLoad: '1',
            },
            remoteSort: true,
            proxy: protoProxy,
            reader: protoReader
        });
    } else {
        
        protoMasterStore.load();
    }

    // De aqui disparo los eventos de la grilla master 
    var masterGrid = GridConfigFactory(protoAppCode, protoConcept, protoMasterStore);

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
        handler: onMenuPromoteDetail, 
    });
    menu.addSeparator();

    // TODO: data combo operation  ( sacar a un comboOp.json )
    dataOp = [
                ['iexact', '='],
                ['icontains', '*_*'],
                ['iendswith', '*_'],
                ['istartswith', '_*'],
                ['--', ''],

                ['gt', '>'],
                ['gte', '>='],
                ['lt', '<'],
                ['lte', '<='],
                // ['range', '(..)'],
                // ['in', '(_,_)'],
                ['--', ''],

                ['day', 'DD'],
                ['month', 'MM'],
                ['week_day', 'WD'],
                ['year', 'YY'],
                ['--', ''],

                ['isnull', 'null'],
                // ['iregex', 'regex'],
                ]
 

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
    tb.addField(comboCols);

    // combo - operation 
    var comboOp = new Ext.form.ComboBox({
        store: new Ext.data.ArrayStore({ fields: ['code', 'operation'], data: dataOp }),
        width: 50,
        mode: 'local',
        triggerAction: 'all',  
        displayField: 'operation',
        valueField: 'code',
        forceSelection: true,
        editable: false,
    });
    tb.addField(comboOp);


    // Criteria 
    var searchCr = new Ext.form.TextField({
        emptyText: 'search criteria ..',
        width: 135
    })
    tb.addField(searchCr);



    // Load Data button 
    var searchBtn = new Ext.Toolbar.SplitButton({
        text: 'Load data',
        handler: onClickLoadData,
        // iconCls: 'blist',
        menu: {
            items: [{
                text: '<b>Clear filter<b>',
                handler: onClickFilter
            // }, {
                // text: 'add filter',
                // handler: onClickFilter
            }]
        }
    })

    tb.addField(searchBtn);
    tb.doLayout();

    // Panel de detalles ==================================================================================
    var detailEI = Ext.id();
    var protoTabs = new Ext.TabPanel({
        id: detailEI
    });

    //  Crea una ventana     ===================================================================================  
    var newWin2 = new Ext.Window({
        title: protoConcept,
        width: 600,
        height: 400,
        draggable: true,
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

    // ===================================================================================
    //  Logica de operacion    
    // ===================================================================================


    // En este evento tengo la metadata, para conf el entorno  ---------------------------- 
    protoMasterStore.on('metachange', function (store, meta) {

        // para evitar el seteo en cada carga  	   
        if (bMasterMetaLoaded) {

	        // Refresh the detail 
	        idMasterGrid = 0
	        linkDetail(ixActiveTab);

            return;
        }
        bMasterMetaLoaded = true;

        var pDetails = meta.protoDetails;
        var bDetails = false;

        // Agrega un numero secuencia para marcar los tabs 
        var ixTabC = 0

        for (var vDet in pDetails) {
            // console.log( pDetails[vTab] + " ");
            bDetails = true;
            var item = menu.add({
                text: vDet,
                protoFilter: pDetails[vDet],
                ixTab: ixTabC,
            });
            // Agrego el handler q activara el tab a partir del menu
            item.on('click', onMenuSelectDetail);

            ixTabC += 1;
        };

        // activa el boton de promover detalles 
        if (bDetails == true) {
            menu.items.get(menuPromDetail).enable();
        };

        // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
        newColData = [];
        j = 0;
        for (var i = 0, len = meta.fields.length; i < len; i++) {
            var c = meta.fields[i];

            if (c.allowFilter == undefined) {
                c.allowFilter = 1
            };

            if (c.queryCode == undefined) { 
                c.queryCode =  c.name; 
            };
            
            if (c.allowFilter == 1) {
                newColData[j] = [c.queryCode, c.header];
                j += 1;

                // DGT: esta carga es directa al store, pienso q es mas costosa por q interactua cada vez con extjs
                // colStore.add(new colStore.recordType({ colPhysique: c.name, colName: c.header }));
            }
        };
        
        colStore.loadData(newColData);
        

    });


    // Carga del maestro detalle --------------------------------------------------------------------------- 
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


    // functions to load data  -------------------------------------------------------------------------------
    // TODO: Guardar criterios en el menu para q puedan ser (des)activados,  Querys complejos con combinacion de campos AND
    function onClickLoadData(btn) {

        var sFilter = '';

        if ((comboCols.getValue() == '') && (comboOp.getValue() == '') && (searchCr.getValue() == '' )) {
            sFilter = '';
        } else if ((comboCols.getValue() == '') || (comboOp.getValue() == '') || (searchCr.getValue() == '' )) {
            Ext.Msg.alert('Status', 'Invalid criteria');
            return; 
        } else {
            sFilter = '{"' + comboCols.getValue() + '__' + comboOp.getValue() + '" : "' + searchCr.getValue() + '",}';
        }

        protoMasterStore.clearFilter();
        protoMasterStore.baseParams.protoFilter = sFilter;
        protoMasterStore.baseParams.modelLoad = '0';
        protoMasterStore.load();

    }


    // TODO: Manejara los filtros compuestos ( QBE )
    function onClickFilter(item) {
        
        comboCols.setValue('');
        comboOp.setValue(''); 
        searchCr.setValue(''); 
        
        // Automatic refresh 
        onClickLoadData( {} );
    };


    //  Menu de control de detalles   ---------------------------------------------------------------------------------  
    function onMenuPromoteDetail(item) {

        // console.log( 'Menu', item ) ;
        // Verifica q halla un tab activo 
        if (ixActiveTab < 0) { return; }

        // carga el store 
        var tmpStore = cllStoreDet[ixActiveTab]

        newDjangoGrid( protoAppCode, tmpStore.baseParams.protoConcept , tmpStore )
        
    };

    // Creacion de tabs 
    function onMenuSelectDetail(item) {

        var protoDetail = item.text;

        var tab = protoTabs.items.find(function (i) {
            return i.title === protoDetail;
        });
        if (!tab) {

            var protoDetailStore = new Ext.data.JsonStore({
                autoLoad: true,
                baseParams: {
                    protoFilterBase: '{"' + item.protoFilter + '" : ' + idMasterGrid + ',}',
                    protoApp: protoAppCode,
                    protoConcept: protoDetail,
                    modelLoad: '1',
                },
                remoteSort: true,
                proxy: protoProxy,
                reader: protoReader,
                protoFilter: item.protoFilter,
                protoMasterKey: idMasterGrid
            });

            // guarda el store con el indice apropiado   
            cllStoreDet[item.ixTab] = protoDetailStore

            var detailGrid = GridConfigFactory(protoAppCode, protoDetail, protoDetailStore);
            var tab = protoTabs.add({
                title: protoDetail,
                layout: 'fit',
                items: detailGrid,
                ixTab: item.ixTab
            });

            ixActiveTab = item.ixTab;
            protoTabs.setActiveTab(tab);

        } else {

            //  Marca el tab activo     
            ixActiveTab = item.ixTab;
            protoTabs.setActiveTab(tab);
        }

    }

    newWin2.show();

}