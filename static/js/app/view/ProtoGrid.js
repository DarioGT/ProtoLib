/*
 * 
 */
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoGrid',

    requires: [
        'ProtoUL.store.ProtoStore',
    ],
    
    //requires: ['Ext.toolbar.Paging'],
    iconCls: 'icon-grid',
    title : 'Contacts',

	initComponent: function() {

        console.log ( 'grid', this.protoConcept ); 

        this.store = Ext.create('ProtoUL.store.ProtoStore', {
            protoConcept : this.protoConcept,   
        }) ; 
        
        this.columns = [{
            "dataIndex": "id",
            "header": "id",
            "width": 160,
            }, {
                "header": "code",
                "dataIndex": "code"
            }, {
                "header": "description",
                "dataIndex": "description",
            }];   
        
		// this.dockedItems = [{
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

		this.callParent(arguments);
	}
});