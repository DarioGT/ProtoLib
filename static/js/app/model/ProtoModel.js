/*
 *  grid
 * - model ( reader )
 * - - store  ( proxy )   
 * 
 * @Dario Gomez 11.11 
 * Requiere : 
 *              protoConcept
 */
Ext.define('ProtoUL.model.ProtoModel', {
    extend: 'Ext.data.Model',
    alias: 'model.menuModel',

    initComponent: function() {

        console.log ( 'model', this.protoConcept ); 

        // Ext.Ajax.request({
            // url : 'protoExt/protoGetConceptModel' , 
            // params : { 
                // action : this.protoConcept 
                // },
            // method: 'GET',
            // success: function ( result, request ) { 
                // // this.protoDefinition = result ;
                // Ext.MessageBox.alert('Success', 'Data return from the server: '+ result.responseText); 
            // },
            // failure: function ( result, request) { 
                // // this.protoDefinition = result ;
                // Ext.MessageBox.alert('Failed', result.responseText); 
            // },
            // callback: function(){
                // console.log('model Ok');
           // }, 
        // });

        // Si no hay q meterlo al callback o al success 
        console.log('fields ready??..');
        // fields: result.fields  

        this.fields = [
            {name: 'id', type: 'string'},
            {name: 'text', type: 'string'},
            {name: 'leaf', type: 'boolean'},
        ];

        this.reader= {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            // id: result.meta.id ,
            id: 'id',
        };

        this.callParent();

//      Definidos a nivel de STORE -------------------------------------
        // proxy =  {
            // type: 'ajax',
            // url: 'protoExt/protoGetConceptData',
            // method: 'POST'
        // }; 

    },
    
});