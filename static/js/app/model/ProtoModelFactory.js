/*
 *  Se encarga de obtener el modelo q servira de base a la grilla  
 */
Ext.define('ProtoUL.model.ProtoModelFactory', {
    extend: 'Ext.data.Model',
    alias: 'model.menuModel',
    proxy: {
        type: 'ajax',
        url: 'protoExt/protoGetConceptModel'
    }, 

    initComponent: function() {

		
        
        this.callParent();
    },

    // fields: [
        // {name: 'id', type: 'string'},
        // {name: 'text', type: 'string'},
        // {name: 'leaf', type: 'boolean'},
    // ],

    initComponent: function() {
        this.tabBar = {
            border: false
        };
        
        this.callParent();
    },
    

    
});