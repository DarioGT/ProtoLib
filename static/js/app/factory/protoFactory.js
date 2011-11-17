Ext.Loader.setConfig({
    enabled: true
});

// Ext.Loader.setPath('Ext.ux', 'http://dev.sencha.com/deploy/ext-4.0.1/examples/ux');

Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.grid.*',
    // 'Ext.ux.grid.FiltersFeature',
    // 'Ext.layout.container.Column'
    ]);



// This data can be pulled off a back-end database
// Used to generate a model and a data grid
var records = [{
    data:{
        "dataIndex":"first",
        "name":"First Name",
        "type":"string"
    }
},{
    data:{
        "dataIndex":"last",
        "name":"Last Name",
        "type":"String"
    }
},{
    data:{
        "dataIndex":"email",
        "name":"Email",
        "type":"string"
    }
}];



// Lookup table (type => xtype)
var type_lookup = new Object;
type_lookup['int'] = 'numberfield';
type_lookup['float'] = 'numberfield';
type_lookup['string'] = 'textfield';
type_lookup['date'] = 'datefield';
type_lookup['boolean'] = 'checkbox';


// Skeleton store
var store_template = {
    autoLoad: true,
    autoSync: true,
    remoteFilter: false,
    
    // DATA is inserted here for the example to work on local drive (use proxy below)
    // data:[{id:1,first:"Fred",last:"Flintstone",email:"fred@flintstone.com"},
          // {id:2,first:"Wilma",last:"Flintstone",email:"wilma@flintstone.com"},
          // {id:3,first:"Pebbles",last:"Flintstone",email:"pebbles@flintstone.com"},
          // {id:4,first:"Barney",last:"Rubble",email:"barney@rubble.com"},
          // {id:5,first:"Betty",last:"Rubble",email:"betty@rubble.com"},
          // {id:6,first:"BamBam",last:"Rubble",email:"bambam@rubble.com"}],

    proxy: {
        type: 'rest',
        url: 'users.json',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json'
        }
    }
};


// Skeleton grid (_PLUGINS_ & _STORE_, are placeholders)
var grid_template = {
    columnWidth: 1,
    height: 300,
    // plugins: '_PLUGINS_',
    // store: '_STORE_'
}


// Skeleton window (_ITEMS_ is a placeholder)
var window_template = {
    title: 'Dynamic Model / Window',
    height: 400,
    width: 750,
    layout: 'fit',
    items: '_ITEMS_'
}



// Generate a model dynamically, provide fields
function modelFactory(name,fields){
    // model =  { extend: 'Ext.data.Model', fields: fields  };
    // eval("Ext.define('"+name+"',"+Ext.encode(model)+");");

    Ext.define(name, {
        extend: 'Ext.data.Model',
        fields: fields
    });
}


// Generate a dynamic store
function storeFactory(name,template,model){
    template.model = model;

    // eval(name+" = Ext.create('Ext.data.Store',"+Ext.encode(template)+");");
    myStore = Ext.create('Ext.data.Store', template);
}



// Generate a dynamic grid, .. store name is appended as a string because otherwise, Ext.encode
// will cause 'too much recursion' error (same for plugins)
// function gridFactory(name,template,store,plugins){
function gridFactory(name,template){
    
    // var sTemplate =  name+" = Ext.create('Ext.grid.Panel', "+Ext.encode(template)+");";
    // sTemplate = sTemplate.replace("\"_STORE_\"", store);
    // sTemplate = sTemplate.replace("\"_PLUGINS_\"", plugins);
    // eval(sTemplate);

    // var sTemp = Ext.encode(template); 
    // sTemp = sTemp.replace("\"_STORE_\"", store);
    // sTemp = sTemp.replace("\"_PLUGINS_\"", plugins);
    // var cTemplate = Ext.decode(sTemp );
    return  Ext.create('Ext.grid.Panel', template) ; 

}

// Generate a dynamic window, .. items are appended as a string to avoid Ext.encode error
function windowFactory(winName,winTemp,items){
    var script = winName+" = Ext.create('Ext.window.Window',"+Ext.encode(winTemp)+").show();";
    script = script.replace("\"_ITEMS_\"", items);
    eval(script);
}

// Generate a model, a store a grid and a window dynamically from a record list!
function generateDynamicModel(records){
    
    fields = [{
        name: 'id',
        type: 'int',
        useNull:true
    }];

    columns = [
    {
        text: 'ID',
        sortable: true,
        dataIndex: 'id',
        hidden: true, 
    }];

    for (var i = 0; i < records.length; i++) {

        fields[i+1] =  {
            name: records[i].data.dataIndex,
            type: records[i].data.type
        };

        columns[i+1] = {
            text: records[i].data.name,
            sortable: true,
            dataIndex: records[i].data.dataIndex,
            editor:  {
                xtype: type_lookup[records[i].data.type]
            }
        };
    }

    // Add RowNumber
    colRn = [{xtype: 'rownumberer', width: 30,}];
    columns = colRn.concat ( columns )


    grid_template.columns = columns;

    modelFactory('myModel',fields);
    storeFactory('myStore',store_template,'myModel');
    
    // Adicion al template 
    grid_template.store = myStore; 
    grid_template.plugins = [rowEditing]; 
    // grid_template.selModel = Ext.create('Ext.selection.CheckboxModel');

    myGrid = gridFactory('myGrid',grid_template);

    // gridFactory('myGrid',grid_template,'myStore','[rowEditing]');
    windowFactory('myWindow',window_template,'[myGrid]');

    // Direct access to the store created above 
    myStore.load();



    myGrid.on('columnmove', function (ct, column, fromIdx, toIdx, eOpts) {
    // Ext.grid.header.Container ct, Ext.grid.column.Column column, Number fromIdx, Number toIdx, Object eOpts 
        console.log( ct, column , fromIdx, toIdx, eOpts) ;
    });


}




Ext.onReady(function(){
    rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
    generateDynamicModel(records);
});
