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


        // DGT**  REcuperar la clase para obtener la meta 
        var myMeta = _cllPCI[ this.protoConcept ] ;                         
        var myColumns = [];

         // * adding RowNumberer  
        myColumns.push(Ext.create('Ext.grid.RowNumberer'));


        // DGT** Creacion de columnas  
        for (var ix in myMeta.fields ) {
            var vFld  =  myMeta.fields[ix]; 
            var col = {
                text: vFld.header,
                sortable: vFld.sortable,
                dataIndex: vFld.dataIndex,
                flex: vFld.flex,
                hidden: vFld.hidden,
                width: vFld.width ,
                editor:  { xtype: _gridTypeEditor[vFld.type] }, 
                // renderer: this.formatDate,                
            };

            myColumns.push(col);
            
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

