Ext.onReady(function () {

    Ext.define('Company', {
        extend: 'Ext.data.Model',
        fields: ['id', 'name', 'founded', 'people']
    });

    var store_company = new Ext.data.Store({
        model: 'Company',
        proxy: {
            type: 'ajax',
            url: 'company.json',
            reader: {
                type: 'json',
                root: 'companies'
            }
        }
    });


    var grid_company = Ext.create('Ext.grid.Panel', {
        store: store_company,
        columns: [{
            text: 'Company Name',
            dataIndex: 'name'
        }, {
            text: 'Founded',
            width: 200,
            dataIndex: 'founded'
        }, {
            text: 'Key People',
            width: 250,
            dataIndex: 'people'
        }],
        height: 200,
        width: 550,
        title: 'Company List',
        renderTo: 'grid-company',
        viewConfig: {
            stripeRows: true
        },
        listeners: {
            itemclick: function () {
                var data = grid_company.getSelectionModel().selected.items[0].data;
                grid_product.setTitle(data.name + ' Products List');
                
                store_product.clearFilter();
                store_product.filter('company_id', data.id);
                store_product.load();
            }
        }
    });

    store_company.load();

    Ext.define('Product', {
        extend: 'Ext.data.Model',
        fields: ['company_id', 'name', 'type']
    });

    var store_product = new Ext.data.Store({
        model: 'Product',
        proxy: {
            type: 'ajax',
            url: 'products.json',
            reader: {
                type: 'json',
                root: 'products'
            }
        }
    });

    var grid_product = Ext.create('Ext.grid.Panel', {
        store: store_product,
        columns: [{
            text: 'Product Name',
            dataIndex: 'name',
            width: 350,
        }, {
            text: 'Type',
            width: 200,
            dataIndex: 'type'
        }],
        height: 200,
        width: 550,
        title: 'Product List',
        renderTo: 'grid-product',
        viewConfig: {
            stripeRows: true
        }
    });
});