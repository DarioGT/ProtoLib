function GridConfigFactory(protoEntityName, protoAppCode) {

    protoStore = new Ext.data.JsonStore({
        autoLoad: true,
        baseParams: {
        	protoFilter : '1=2', 
        	protoApp : protoAppCode, 
        	protoEntity : protoEntityName,  
        },
        remoteSort: true,
        sortInfo: {
            field: 'id',
            direction: 'DESC'
        },
        
        proxy: new Ext.data.HttpProxy({
            url: 'protoExtjsGridDefinition/?' + protoEntityName,
            method: 'POST'
        })

        ,
        reader: new Ext.data.JsonReader({
            root: 'rows',
            id: 'id'
        })

    })

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

