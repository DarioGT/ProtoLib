Ext.ux.AutoEditableGrid = Ext.extend(ProtoAutoGrid, {
    showToolbar: true,
    url: '',
    remoteSort: true,
    sortInfo: {},
    initComponent: function () {

        this.store = new Ext.data.JsonStore({
            autoLoad: true,
            baseParams: {},
            remoteSort: this.remoteSort,
            sortInfo: this.sortInfo,
            proxy: new Ext.data.HttpProxy({
                url: this.url,
                method: 'POST'
            }),
            reader: new Ext.data.JsonReader({
                root: 'rows',
                id: 'id'
            })

        })

        //	console.log('initComponent AutoEditableGrid', this.sortInfo, this.store.sortInfo);
        this.GridCheckboxes = new Ext.grid.CheckboxSelectionModel();
        this.sm = this.GridCheckboxes;
        this.plugin = this.GridCheckboxes;

        this.btn_new = new Ext.Button({
            text: 'add new',
            iconCls: 'icon-user_add',
            scope: this,
            handler: function () {
                this.addRow();
            }

        });
        this.addRow = function () {
            initial = {}
            var myStore = this.getStore();
            var r = new myStore.recordType(initial, 0);
            myStore.insert(0, r);
            this.startEditing(0, 2);
        }
        this.btn_delete = new Ext.Button({
            text: 'delete',
            iconCls: 'icon-user_delete',
            scope: this,
            handler: function () {
                //   alert('del');
                var records = this.getSelectionModel().getSelections();
                dels = [];
                Ext.each(records, function (item, index, all) {
                    dels.push(item.id);
                }, this);

                //   console.log(dels);
                var sure = confirm("Sure to delete these " + dels.length + " items ?");

                if (dels.length > 0) {
                    Ext.Ajax.request({
                        url: this.store.proxy.url,
                        method: 'POST',
                        callback: function (options, success, response) {
                            json = Ext.decode(response.responseText);
                            if (!success || !json.success) {
                                alert("Erreur : " + json.msg);
                            } else {
                                // this.btn_save.stopBlink();
                                // this.btn_save.disable();
                                // this.getStore().commitChanges();
                                this.getStore().reload();
                            }
                        },
                        scope: this,
                        params: {
                            'delete': dels.join(',')
                        }
                    })
                }
            }
        });
        this.btn_save = new Ext.Button({
            text: 'save',
            disabled: true,
            iconCls: 'icon-disk',
            scope: this,
            handler: function () {
                var modified = this.getStore().getModifiedRecords();
                var mod = []
                Ext.each(modified, function (item, index, all) {
                    a = {}
                    a.id = item.id
                    Ext.apply(a, item.getChanges());
                    mod.push(a);
                }, this);

                Ext.Ajax.request({
                    url: this.store.proxy.url,
                    method: 'POST',
                    callback: function (options, success, response) {
                        json = Ext.decode(response.responseText);
                        if (!success || !json.success) {
                            alert("Erreur : " + json.msg);
                        } else {

                            this.getStore().commitChanges();
                            this.getStore().reload();
                            this.btn_save.stopBlink();
                            this.btn_save.disable();
                        }
                    },
                    scope: this,
                    params: {
                        update: Ext.encode(mod)
                    }
                });
            },
            counter: 0,
            blinking: false,
            task_blink: {
                run: function () {
                    if (!this.btn_save) return;
                    nclass = (this.btn_save.counter % 2 == 0) ? 'icon-disk-red' : 'icon-disk';
                    this.btn_save.setIconClass(nclass);
                    this.btn_save.counter += 1;
                },
                scope: this,
                interval: 500
            },
            startBlink: function (e) {
                if (this.blinking) return;
                //    console.log('startBlink', this.task_blink);
                this.enable();
                Ext.TaskMgr.start(this.task_blink);
                this.blinking = true;
            },
            stopBlink: function (e) {
                // console.log('stopblink', this.task_blink);
                Ext.TaskMgr.stop(this.task_blink);
                this.setIconClass('icon-disk');
                this.blinking = false;
            }
        });

        if (this.showToolbar) this.tbar = [
        this.btn_new, this.btn_delete, this.btn_save];

        Ext.ux.AutoEditableGrid.superclass.initComponent.apply(this, arguments);

        this.on('afteredit', function (e) {
            this.btn_save.startBlink();
        }, this);

        this.on('beforedestroy', function (e) {
            this.btn_save.stopBlink();
            return true;
        }, this);
    }

});



Ext.reg('AutoEditableGrid', Ext.ux.AutoEditableGrid);


// dynamic load of a server side form
Ext.ux.DjangoForm = Ext.extend(Ext.FormPanel, {

    url: null,
    baseParamsLoad: null,
    callback: null,
    scope: null

    ,
    border: false,
    custom_config: null,
    default_config: null,
    showButtons: true,
    showSuccessMessage: 'Formulaire bien enregistre'

    ,
    initComponent: function () {
        if (this.showButtons) {
            this.buttons = [{
                name: 'submit',
                xtype: 'button',
                iconCls: 'icon-accept',
                text: 'enregistrer',
                scope: this,
                handler: function (args) {
                    this.submitForm();
                }
            }, {
                name: 'reset',
                xtype: 'button',
                iconCls: 'icon-cancel',
                text: 'reset',
                scope: this,
                handler: function (args) {
                    this.resetForm();
                }
            }]
        }

        this.items = {
            border: false,
            'html': '<img style="vertical-align:middle" src="http://extjs.cachefly.net/ext-3.4.0/resources/images/default/shared/large-loading.gif"/>&nbsp;&nbsp;&nbsp;&nbsp;loading...'
        }
        this.getDefaultButton = function (name) {

        }
        this.gotFormCallback = function (response, options) {

            var res = Ext.decode(response.responseText);
            this.default_config = res;

            this.removeAll();

            if (this.custom_config) {
                // add custom form config to this formpanel
                var newconf = this.custom_config.createDelegate(this, [this])();
                for (var i = 0; i < newconf.items.length; i++) {
                    this.add(Ext.ComponentMgr.create(newconf.items[i]));
                }

                // auto add hidden fields from django form if needed
                for (var i = 0; i < this.default_config.length; i++) {
                    if (this.default_config[i].xtype == 'hidden') {
                        this.add(Ext.ComponentMgr.create(this.default_config[i]));
                    }
                }
                //this.default_config = res;
            } else {

                if (this.intro) {
                    this.add({
                        html: this.intro,
                        style: 'padding-bottom:10px;padding-top:10px;font-size:14px',
                        border: false
                    });
                }
                if (this.startItems) {
                    this.add(this.startItems);
                }

                //  Ext.apply(this, this.default_config);
                for (var i = 0; i < res.length; i++) {
                    this.add(Ext.ComponentMgr.create(res[i]));
                }
            }
            //finally callback your function when ready
            if (this.callback) {
                this.callback.createDelegate(this.scope, [this])();
            }
        }

        var o = {}
        if (this.baseParamsLoad) Ext.apply(o, this.baseParamsLoad);

        Ext.ux.DjangoForm.superclass.initComponent.apply(this, arguments);

        this.addEvents('submitSuccess', 'submitError');

        Ext.Ajax.request({
            url: this.url,
            params: o,
            method: 'GET',
            scope: this,
            success: this.gotFormCallback,
            failure: this.gotFormCallback
        });



    },
    submitSuccess: function () {
        this.fireEvent('submitSuccess');
        if (this.showSuccessMessage) {
            Ext.Msg.show({
                title: 'Succes',
                msg: this.showSuccessMessage,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    },
    submitError: function (msg) {

        this.fireEvent('submitError', msg);
        Ext.Msg.show({
            title: 'Erreur',
            msg: 'Impossible de valider : <br>' + msg + '<br>',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.WARNING
        });
    }

    ,
    validResponse: function (form, action) {
        for (btn in this.buttons) {
            var butt = this.buttons[btn];
            if (butt.name == 'submit') butt.enable();
        }
        if (action && action.result && action.result.success) {
            this.submitSuccess();
        } else {
            this.submitError(action && action.result && action.result.msg || 'erreur');

        }

    },
    invalid: function () {
        //    console.log('invalid: ', this.getForm().getValues());
        Ext.Msg.show({
            title: 'Erreur',
            msg: 'Impossible de valider : formulaire invalide',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.WARNING
        });
    },
    resetForm: function () {
        //            console.log('resetForm');
        this.getForm().reset();
    }

    ,
    submitForm: function () {
        //console.log('submitForm');
        if (this.getForm().isValid()) {
            for (btn in this.buttons) {
                if (this.buttons[btn].name == 'submit') {
                    this.buttons[btn].disable();
                }
            }
            this.getForm().submit({
                scope: this,
                success: this.validResponse,
                failure: this.validResponse
            });
        } else {
            // console.log('invalid form!');
            // var items = this.getForm().items.items;
            // for (f in items) {
            // console.log(f, items[f], items[f].isValid());
            // }
            this.invalid()
        }
    }

});

Ext.ux.DjangoField = function (config) {
    //  console.log(config);
    //         console.log(this);
    var items = config.django_form.default_config;

    for (var i = 0; i < items.length; i++) {
        if (items[i].name == config.name) {

            var bConfig = items[i];
            // prevent infinite loop
            if (config.xtype2) {
                config.xtype = config.xtype2
            } else {
                delete config.xtype
            }

            Ext.apply(bConfig, config);
            // console.log(bConfig); 
            return Ext.ComponentMgr.create(bConfig);
        }
    }
}



Ext.reg("DjangoForm", Ext.ux.DjangoForm);
Ext.reg("DjangoField", Ext.ux.DjangoField);


Ext.ns('Ext.ux.grid');

Ext.ux.grid.DynamicGridPanel = Ext.extend(Ext.grid.GridPanel, {
    loadMask: true,
    stripeRows: true,
    columnLines: true,
    enableGrouping: false,
    initComponent: function () {
        this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            fields: [],
            proxy: new Ext.data.HttpProxy({
                url: this.url,
                method: "POST"
            })
        });
        this.columns = [];
        this.viewConfig = {
            forceFit: true,
            onDataChange: function () {
                this.cm.setConfig(this.ds.reader.jsonData.columns);
                this.syncFocusEl(0);
            }
        };
        Ext.ux.grid.DynamicGridPanel.superclass.initComponent.call(this);
    }
});

Ext.reg("DynamicGridPanel", Ext.ux.grid.DynamicGridPanel);


//function UserEditor(sender, pk) {
//          var editor = new Ext.ux.DjangoForm({
//                border:false
//                ,intro:'this is a generated form'
//                ,showButtons:true
//                ,showSuccessMessage:false
//                ,url:'protoExtjsFormDefinition' 
//                ,baseParamsLoad:{pk:pk}
//                ,width:400
//                ,height:200
//                ,scope:this
//                 ,callback:function(form) {
//                    //console.log(form, this, editor);
//                    form.doLayout();
//                    form.findParentByType('window').center();
//                 }
//           });
//
//           var winEditor = new Ext.Window({
//            items:editor
//            ,title:'generated proto Form'
//           })
//           
//             editor.on('submitSuccess', function() {
//                //console.log('success', this, arguments);
//                        if (sender) sender.store.reload();
//                        if (winEditor && winEditor.isVisible()) {
//                            winEditor.close();
//                            winEditor.destroy();
//                        }
//
//                    }, sender || this);
//           
//           winEditor.show();
//        }