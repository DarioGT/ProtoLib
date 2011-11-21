/*
 *  grid
 * -  store  ( proxy )   
 * -  -	model ( reader )  *** 
 * 
 * @Dario Gomez 11.11 
 * Requiere : 
 *              protoConcept
 */
Ext.define('ProtoUL.model.ProtoModel', {
    extend: 'Ext.data.Model',
    alias: 'model.protoModel',

    proxy: {
        type: 'ajax',
        api: {
            read : 'protoExt/protoList.action',
            create : 'protoExt/protoCreate.action/',
            update: 'protoExt/protoUpdate.action/',
            destroy: 'protoExt/protoDelete.action/'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            root: 'rows',
            //@@  id: _meta.idProperty ,
            id: 'id', 
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

    //DGT  NO  pasa por aqui  
    // initComponent: function() {},
    
});