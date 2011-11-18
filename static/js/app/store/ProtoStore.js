/*
 *  grid
 * - model ( reader )
 * - - store  ( proxy )   
 * 
 * @Dario Gomez 11.11 
 * Requiere : 
 *              protoConcept
 */

Ext.define('ProtoUL.store.ProtoStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    pageSize: 100,
    autoLoad: {start: 0, limit: 100},
    
    proxy: {
        type: 'ajax',
        api: {
        	read : 'protoExt/view.action',
            create : 'protoExt/create.action/',
            update: 'protoExt/update.action/',
            destroy: 'protoExt/delete.action/'
        },
        writer: {
            type: 'json',
            // writeAllFields: true,
            encode: false,
            root: 'data',
        },
        listeners: {
            exception: function(proxy, response, operation){
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        }
    }, 

    // model: 'ProtoUL.model.Contact',
    initComponent: function() {

        console.log ( 'store', this.protoConcept ); 
      
        this.model =  Ext.create('Ext.model.ProtoModel', {
                protoConcept : this.protoConcept,         
              }); 
        this.callParent();
    },
    
});