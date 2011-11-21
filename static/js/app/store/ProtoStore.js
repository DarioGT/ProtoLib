/*
 *  grid
 * - store ( reader )          **** 
 * - - model   ( proxy )   
 * 
 * @Dario Gomez 11.11 
 * Requiere : 
 *              protoConcept
 */

var PAGESIZE = 100; 

Ext.define('ProtoUL.store.ProtoStore', {
    extend: 'Ext.data.Store',
    alias: 'store.protoStore',

    autoLoad: true,
    pageSize: PAGESIZE,
    autoLoad: {start: 0, limit: PAGESIZE},
    remoteSort: true,
    
    baseParams: {
        protoFilter: '{"pk" : 0,}',
        protoConcept : this.protoConcept,
    },
    
    //DGT No pasa por aqui 
    // initComponent: function() {},

});