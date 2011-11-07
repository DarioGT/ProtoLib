    

ProtoAutoGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {

//	No se requiere, pues pasare el dato en el evento metaChange del store 	
	metaProto: {},
	
	deferredRender : true,
	initComponent : function() {

		if (this.columns && (this.columns instanceof Array)) {
			this.colModel = new Ext.grid.ColumnModel(this.columns);
			delete this.columns;
		}
		
		// Create a empty colModel if none given
		if (!this.colModel) {
			this.colModel = new Ext.grid.ColumnModel([]);
		}
		
		ProtoAutoGridPanel.superclass.initComponent.call(this);
		
		// register to the store's metachange event
		if (this.store) {
			
			// DGT: Ver el store 
//			console.log('this.store', this.store);
			
			// this.store.on("load", this.onStoreLoad, this);
			// DGT: GEnera el evento MetaChange 
			this.store.on("metachange", this.onMetaChange, this);
			//     this.store.on("beforeload", function() {alert('beforeload')}, this);
			//     this.store.on("loadexception ", function() {alert('loadexception ')}, this);
			//    this.store.on("load", function() {alert('load');}, this);
			//console.log('init this.store', this.store.sortInfo);
		}
		
		// Store the column model to the server on change
		if (this.autoSave) {
			this.colModel.on("widthchange", this.saveColumModel, this);
			this.colModel.on("hiddenchange", this.saveColumModel, this);
			this.colModel.on("columnmoved", this.saveColumModel, this);
			this.colModel.on("columnlockchange", this.saveColumModel, this);
			this.on("columnresize", this.saveColumModel, this);
		}

		//  Declara y relanza los eventos 
		this.on("show", this.onShow, this);
		//    this.on("render", this.onRender, this);

	},
	
	
	// onBeforeLoad: function(store, meta) {
	// this.el.mask("Chargement...");
	// },
	// onLoad: function(store, meta) {
	// this.el.unmask();
	// },

	onShow : function() {
		// console.log('autogrid onShow');
	},

	// onRender:function() {
	// console.log('autogrid onRender');
	// },
	
	// Es un evento del store,  internmanete se encarga de extraer la meta del json request 
	onMetaChange : function(store, meta) {
		
		// DGT: Meta Change 
		// console.log("onMetaChange Tabs, Detailles", meta.protoDetails );
		this.metaProto = meta.protoDetails; 
		
		// loop for every field, only add fields with a header property (modified copy from ColumnModel constructor)
		//alert('store onmetachange');
		
		var c;
		var config = [];
		var lookup = {};

		//  alert('onMetaChange');
		if (this.plugin) {
			// console.log(this.plugin);
			config[config.length] = this.plugin;
		}

		//for (var i = 0, len = meta.listeners.length; i < len; i++) {
		// l = meta.listeners;
		// for( var obj in l) {
		// TODO : check double metachange
		// console.log(obj);
		// console.log(l[obj]);
		//this.on( meta.listeners);
		//}
		//}

		for ( var i = 0, len = meta.fields.length; i < len; i++) {
			c = meta.fields[i];

			if (c.header !== undefined) {
				if (typeof c.dataIndex == "undefined") {
					c.dataIndex = c.name;
				}
				if (typeof c.renderer == "string") {
					c.renderer = Ext.util.Format[c.renderer];
				}
				if (typeof c.id == "undefined") {
					c.id = 'c' + i;
				}

                if (typeof c.sortable == "undefined") {
                    c.sortable = true;
                }

				//delete c.editor;
				config[config.length] = c;
				//config[config.length].editor = c.editor;
				lookup[c.id] = c;
				//    console.log(config);
			}
		}
		// Store new configuration

		//
		// Re-render grid
		//alert(this.rendered);

		this.getColumnModel().setConfig(config);

		// if remoteSort=false then dont overrride local sortInfo
		// if (!this.remoteSort) {
		// store.sortInfo = this.sortInfo
		// }
		// console.log(store.sortInfo.field, meta.sortInfo.field);

		if (this.rendered) {

			//this.store.reader.jsonData.metaData.fields);         
			this.getView().syncFocusEl(0);

			var reinit_btn = this.getView().hmenu
					.getComponent('reset_colModel');
			if (!reinit_btn) {
				this.getView().hmenu.add({
					id : "reset_colModel",
					text : "Réinitialiser les colonnes",
					cls : "xg-hmenu-reset-columns",
					handler : function(btn, event) {
						this.razColumModel();
					},
					scope : this
				});
			}

		}

	},

	onStoreLoad : function() {
		//console.log('onStoreLoad 1');
		var view = this.getView();
		if ((true === view.forceFit) || (true === this.forceFit)) {
			view.fitColumns();
		}
		//console.log('onStoreLoad 2');
		//alert('onStoreLoad 2');
	},

	razColumModel : function() {
		Ext.Ajax.request({
			url : this.saveUrl,
			params : {
				raz : true
			},
			scope : this,
			success : function() {
				this.store.reload();

			}

		})
	},

	saveColumModel : function() {
		// Get Id, width and hidden propery from every column
		// console.log('saveColumModel');
		var c, config = this.getColumnModel().config;
		var fields = [];
		for ( var i = 0, len = config.length; i < len; i++) {
			c = config[i];
			fields[i] = {
				name : c.name,
				width : c.width
			};
			if (c.hidden) {
				fields[i].hidden = true;
			}
		}
		var sortState = this.store.getSortState();
		// Send it to server
		//console.log("save config", fields);         
		Ext.Ajax.request({
			url : this.saveUrl,
			params : {
				fields : Ext.encode(fields),
				sort : Ext.encode(sortState)
			}
		});
	}
});

// 

ProtoAutoGrid =  Ext.extend(ProtoAutoGridPanel, {
     showBbar:false
    ,stripeRows:true
    ,deferredRender :true
    ,autoSave:false
    ,remoteSort:true
    ,sortInfo:{}

    // ,sm:new Ext.grid.RowSelectionModel({})
    // ,reader: new Ext.data.JsonReader({
            // root:'rows'
            // ,id:'id'
     // })

    ,initComponent:function() {
        this.pagesize = this.pagesize || 50;
        
        if (this.showBbar) this.bbar = new Ext.PagingToolbar({
                pageSize: this.pagesize,
                store:  this.store,
                displayInfo: true,
                displayMsg: '{0} à {1} sur {2}',
                emptyMsg: "Aucun élément à afficher"
        });
        
        
        // DGT  Variable de config 
        var config = {  
            store:  this.store
            ,stripeRows: true
            ,loadMask: true
            ,autoSave: this.autoSave
        };
        Ext.apply(this.initialConfig, config);
        ProtoAutoGrid.superclass.initComponent.apply(this, arguments);

        // DGT  Variable de config 
//		console.log('this.store AutoGrid', this.store);

    } 

 
}); 

Ext.reg('AutoGrid', ProtoAutoGrid); 

