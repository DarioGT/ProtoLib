
// **********************  AJAX 

    Ext.Ajax.request({url: 'file9.xml', callback: myCallback}); 
    Ext.Ajax.request({url: 'file10.xml', callback: myCallback}); 
    function myCallback(){ 
        if(++this.counter<10) return; 
    
        // all files are done loading, do stuff 
    } 
    myCallback.counter = 0;  

//---

    Ext.Ajax.timeout = 60000; // 60 seconds
    Ext.Ajax.request({
        url : 'ajax.php' , 
        params : { action : 'getDate' },
        method: 'GET',
        success: function ( result, request ) { 
            Ext.MessageBox.alert('Success', 'Data return from the server: '+ result.responseText); 
        },
        failure: function ( result, request) { 
            Ext.MessageBox.alert('Failed', result.responseText); 
        },
        callback: function(){
                    console.log('run');
       },
    });



//********************   AJAX 
