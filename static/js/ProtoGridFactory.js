       
function GridConfigFactory(protoEntityName) {
           
            var protoGrid = new ProtoAutoGrid({
                autoWidth:true
                ,border:false
                ,pagesize:5
                
                ,tbar:[
                    new Ext.Button({
                        text:'add new user'
                        ,iconCls:'icon-user_add'
                        ,scope:this
                        ,handler:function() {
                            
                            UserEditor(arguments[0].findParentByType('AutoGrid'), '');
                        }
                    })
                ]
                ,forceFit:false
                ,stripRows:true
                ,showBbar:true
                ,loadMask:true
                ,sm:new Ext.grid.RowSelectionModel({})
                ,store:new Ext.data.JsonStore({
                    autoLoad:true
                    ,baseParams:{}
                    ,remoteSort:false
                    ,sortInfo: {
                                field: 'id',
                                direction: 'DESC'
                            }
                    ,proxy:new Ext.data.HttpProxy({
                        url:'protoExtjsGridDefinition/?' + protoEntityName
                        ,method:'POST'
                    })
                    ,reader: new Ext.data.JsonReader({
                        root:'rows'
                        ,id:'id'
                    })

                })
            });
            
            return protoGrid;
        
        }



function UserEditor(sender, pk) {
          var editor = new Ext.ux.DjangoForm({
                border:false
                ,intro:'this is a generated form'
                ,showButtons:true
                ,showSuccessMessage:false
                ,url:'protoExtjsFormDefinition' 
                ,baseParamsLoad:{pk:pk}
                ,width:400
                ,height:200
                ,scope:this
                 ,callback:function(form) {
                    //console.log(form, this, editor);
                    form.doLayout();
                    form.findParentByType('window').center();
                 }
           });

           var winEditor = new Ext.Window({
            items:editor
            ,title:'generated proto Form'
           })
           
             editor.on('submitSuccess', function() {
                //console.log('success', this, arguments);
                        if (sender) sender.store.reload();
                        if (winEditor && winEditor.isVisible()) {
                            winEditor.close();
                            winEditor.destroy();
                        }

                    }, sender || this);
           
           winEditor.show();
        }
        

