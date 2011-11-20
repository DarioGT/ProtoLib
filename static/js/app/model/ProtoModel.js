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


    initComponent: function() {


        // console.log ( 'model', this.protoConcept ); 


        // Si no hay q meterlo al callback o al success 

        // this.reader= {
            // type: 'json',
            // root: 'data',
            // successProperty: 'success',
            // // id: result.meta.id ,
            // id: 'id',
        // };
// 
// //      Definidos a nivel de STORE -------------------------------------
        // this.proxy =  {
            // type: 'ajax',
            // url: 'protoExt/protoGetConceptData',
            // method: 'POST'
        // }; 

        this.callParent(arguments);


    },
    
});