
function newDjangoGrid(protoAppCode, protoConcept, protoMasterStore ) {


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

        

    });




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

}