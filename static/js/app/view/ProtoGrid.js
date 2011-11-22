/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoGrid',

    requires: [
        // 'ProtoUL.store.ProtoStore',
    ],
    
    //requires: ['Ext.toolbar.Paging'],
    // iconCls: 'icon-grid',

	initComponent: function() {


        console.log ( this.protoConcept + '  grid init'  ); 

        
        
        var modelClassName = _PConfig.clsBaseModel + this.protoConcept ; 
        if  (! Ext.ClassManager.isCreated( modelClassName )){
            console.log ( this.protoConcept, ' ERROR Pci  not loaded ' ); 
        } ;

        // VErifica si el store viene como parametro ( Detail )
        if (typeof this.protoMasterStore == 'undefined') {
            
            console.log (  this.protoConcept, ' Loading store ...  '  ); 

            var myStore = Ext.create('Ext.data.Store', {
                model : modelClassName, 
                autoLoad: true,
                remoteSort: true,
                // autoLoad: {start: 0, limit: PAGESIZE},
                // pageSize: PAGESIZE,
                proxy : {
                    type: 'ajax',
                    url : 'protoExt/protoList/', //  + this.protoConcept,
                    Reader : {
                            type: 'json',
                            root : 'rows',
                            id : 'id',
                            totalProperty: 'totalCount',
                            },
                    extraParams : {
                        protoConcept : this.protoConcept,
                        // protoFilter : '{"pk" : 0,}',
                        // protoFilterBase: '{"' + item.protoFilter + '" : ' + idMasterGrid + ',}',
                        // protoApp: protoAppCode,
                        },
                    },
                    // sorters: [{
                        // property: 'leaf',
                        // direction: 'ASC'
                    // },],
                    
            });
            
            
            // store.getProxy().extraParams.feed = url;
            // store.loadPage(1);

            myStore.proxy.actionMethods.read = 'POST';
            myStore.load(); 
            // Ext.apply(Ext.data.AjaxProxy.prototype.actionMethods, { read: 'POST' });

        } else {

            console.log (  this.protoConcept, ' Promoting details store  ...  '  ); 

            var myStore = this.protoMasterStore
            myStore.load();
            
        }


        // REcupera la clase para obtener la meta 
        var myMeta = _cllPCI[ this.protoConcept ] ;                         
        var myColumns = [];

         // * adding RowNumberer  
        myColumns.push(Ext.create('Ext.grid.RowNumberer'));


        // DGT** Creacion de columnas  
        for (var ix in myMeta.fields ) {
            var vFld  =  myMeta.fields[ix]; 
            var col = {
                dataIndex: vFld.name,
                text: vFld.header,
                // sortable: vFld.sortable,
                // flex: vFld.flex,
                // hidden: vFld.hidden,
                // width: vFld.width ,
                // editor:  { xtype: _gridTypeEditor[vFld.type] }, 
                // renderer: this.formatDate,                
            };

            myColumns.push(col);
            
        }
        

        myColumns = [{"xtype":"rownumberer","width":30},{"text":"ID","sortable":true,"dataIndex":"id","hidden":true},{"text":"First Name","sortable":true,"dataIndex":"first","editor":{"xtype":"textfield"}},{"text":"Last Name","sortable":true,"dataIndex":"last","editor":{"xtype":null}},{"text":"Email","sortable":true,"dataIndex":"email","editor":{"xtype":"textfield"}}]; 
                
        this.columns = myColumns;  
        this.store = myStore; 
        
        // listeners: {
            // itemclick: function () {
                // var data = grid_company.getSelectionModel().selected.items[0].data;
                // grid_product.setTitle(data.name + ' Products List');
                // store_product.clearFilter();
                // store_product.filter('company_id', data.id);
                // store_product.load();
            // }
        // }

        
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

