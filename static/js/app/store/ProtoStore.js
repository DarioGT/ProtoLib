/*
 *  grid
 * - store ( reader )          **** 
 * - - model   ( proxy )   
 * 
 * @Dario Gomez 11.11 
 * Requiere : 
 *              protoConcept
 */

Ext.define('ProtoUL.store.ProtoStore', {
    extend: 'Ext.data.Store',
    alias: 'store.protoStore',

    // requires: [
        // 'ProtoUL.model.ProtoModel',
    // ],

    autoLoad: true,
    pageSize: 100,
    autoLoad: {start: 0, limit: 100},

    initComponent: function() {
        console.log ( 'store', this.protoConcept ); 

        // this.model =  Ext.create('Ext.model.ProtoModel', {
                // protoConcept : this.protoConcept,         
              // }); 
 
              
              
        this.callParent();
    },
    
    

    
});