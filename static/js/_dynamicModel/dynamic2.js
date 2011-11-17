/** 
 * Ext.ux.grid.DynamicGridPanel
 */

Ext.Loader.setConfig({
    enabled: true
});

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.button.*',
    'Ext.form.*',
]);


Ext.define('Ext.ux.grid.DynamicGridPanel', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.dynamicgrid',
    
     // * initialising the components 
    initComponent: function () {

         // * set the config we want 
        var config = {
            columns: [],
            rowNumberer: false
        };

        // appy to this config  
        Ext.apply(this, this.initialConfig, config);
        // Ext.apply(this, config);
        // Ext.apply(this.initialConfig, config);
        this.callParent(arguments);
    },

     // * When the store is loading then reconfigure the column model of the grid 
    storeLoad: function () {

         // * JSON data returned from server has the column definitions 
        if (typeof (this.store.proxy.reader.jsonData.columns) === 'object') {
            var columns = [];

             // * adding RowNumberer as we need to add them before other columns to display first 
            if (this.rowNumberer) {
                columns.push(Ext.create('Ext.grid.RowNumberer'));
            }

             // * assign new columns from the json data columns 
            Ext.each(this.store.proxy.reader.jsonData.columns, function (column) {
                columns.push(column);
            });

             // *  reconfigure the column model of the grid 
            this.reconfigure(this.store, columns);
        }
    },

     // * assign the event to itself when the object is initialising 
    onRender: function (ct, position) {

         // old fashion way, but works well. 
        Ext.ux.grid.DynamicGridPanel.superclass.onRender.call(this, ct, position);

         // hook the store load event to our function 
        this.store.on('load', this.storeLoad, this);
    }
});



// ----  DATA
// "metaData":{"idProperty":"id","totalProperty":"total","successProperty":"success","root":"data","fields":[{"name":"ID","type":"int","allowBlank":false,"defaultValue":"0"},{"name":"USER","type":"string","allowBlank":false,"defaultValue":""},{"name":"HOST","type":"string","allowBlank":false,"defaultValue":""},{"name":"DB","type":"string","allowBlank":true,"defaultValue":null},{"name":"COMMAND","type":"string","allowBlank":false,"defaultValue":""},{"name":"TIME","type":"int","allowBlank":false,"defaultValue":"0"},{"name":"STATE","type":"string","allowBlank":true,"defaultValue":null},{"name":"INFO","type":"string","allowBlank":true,"defaultValue":null}]},"success":true,"total":1,"message":"Loaded data","data":[{"ID":"12177","USER":"BCD","HOST":"::1:10649","DB":"information_schema","COMMAND":"Query","TIME":"0","STATE":"executing","INFO":"SELECT * FROM `PROCESSLIST` LIMIT 0,50"}],"columns":[{"header":"ID","dataIndex":"ID","sortable":true},{"header":"USER","dataIndex":"USER","sortable":true},{"header":"HOST","dataIndex":"HOST","sortable":true},{"header":"DB","dataIndex":"DB","sortable":true},{"header":"COMMAND","dataIndex":"COMMAND","sortable":true},{"header":"TIME","dataIndex":"TIME","sortable":true},{"header":"STATE","dataIndex":"STATE","sortable":true},{"header":"INFO","dataIndex":"INFO","sortable":true}]}

//  ------ Test


Ext.onReady(function(){

    Ext.define('MyModel', {
        extend: 'Ext.data.Model',
        proxy: {
            type: 'ajax',
            url: 'dynamic2.json'
        }
    });

    var MyStore = Ext.create('Ext.data.Store', {
        model: 'MyModel'
    });
    
    Ext.create('Ext.ux.grid.DynamicGridPanel', {
        id: 'my-grid',
        title: 'Dynamic Grid',
        store: MyStore,

        rowNumberer: true,
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        plugins: Ext.create('Ext.grid.plugin.RowEditing'), 
        height: 200,
        width: 400,
        renderTo: Ext.getBody()
    });
    
    //uses the Proxy we set up on Model to load the Store data
    MyStore.load();
    
});

