/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoGrid',

    requires: [
        'ProtoUL.store.ProtoStore',
        'ProtoUL.model.ProtoModel',
    ],
    
    //requires: ['Ext.toolbar.Paging'],
    // iconCls: 'icon-grid',

	initComponent: function() {


        console.log ( this.protoConcept + '  grid init'  ); 
        var modelClassName = _PConfig.clsBaseModel + this.protoConcept ; 
        if  (! Ext.ClassManager.isCreated( modelClassName )){
            console.log ( this.protoConcept, ' ERROR Pci  not loaded ' ); 
        } ;
        
        console.log (  this.protoConcept, ' Loading store ...  '  ); 
    
        // this.store = Ext.create('ProtoUL.store.ProtoStore', {
            // model : this.model, 
            // protoConcept : this.protoConcept,   
            // }) ; 
    
        var myStore = Ext.create('Ext.data.Store', {
            model: modelClassName
        });


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
        
        this.columns = myColumns;  
        this.store = myStore; 
        
        this.callParent(arguments);


	},
	
});


        // this.dockedItems = [
        // {
            // xtype: 'toolbar',
            // items: [{
                // iconCls: 'icon-save',
                // itemId: 'add',
                // text: 'Add',
                // action: 'add'
            // },{
                // iconCls: 'icon-delete',
                // text: 'Delete',
                // action: 'delete'
            // }]
        // },
        // {
            // xtype: 'pagingtoolbar',
            // dock:'top',
            // store: 'Contacts',
            // displayInfo: true,
            // displayMsg: 'Displaying contacts {0} - {1} of {2}',
            // emptyMsg: "No contacts to display"
        // }];

