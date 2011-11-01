function GridConfigFactory(protoEntityName, protoAppCode) {

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
        

    });

    return protoGrid;

}

