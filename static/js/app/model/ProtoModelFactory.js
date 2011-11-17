/*
 *  Debe configuarse el template con los campos q se requieren 
 */
Ext.define('ProtoUL.model.ProtoModelFactory', {
    extend: 'Ext.data.Model',
    alias: 'model.menuModel',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'},
        {name: 'leaf', type: 'boolean'},
    ],
    
    proxy: {
        type: 'ajax',
        url: 'protoExt/menu'
    }
    
});