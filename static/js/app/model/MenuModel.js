/*
 *  Carga los datos del menu
 *  Dgt 11.11  
 */

Ext.define('ProtoUL.model.MenuModel', {
    extend: 'Ext.data.Model',
    alias: 'model.menuModel',
    proxy: {
        type: 'ajax',
        url: 'protoExt/protoGetMenuData'
    }, 

    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'},
        {name: 'leaf', type: 'boolean'},
    ],
    
});
