function GridConfigFactory(protoAppCode, protoEntityName, protoStore) {

    var protoGrid = new ProtoAutoGrid({
        autoWidth: true,
        border: false,
        pagesize: 20,
        forceFit: false,
        stripRows: true,
        showBbar: true,
        loadMask: true,

        //En 3.x no es el valor por defecto
        sm: new Ext.grid.RowSelectionModel({}),

        store: protoStore,
        
        // listeners: {
            // itemclick: function () {
                // var data = grid_company.getSelectionModel().selected.items[0].data;
                // grid_product.setTitle(data.name + ' Products List');
                // store_product.clearFilter();
                // store_product.filter('company_id', data.id);
                // store_product.load();
            // }
        // }

    });

    return protoGrid;

}

