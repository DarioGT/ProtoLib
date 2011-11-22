
Ext.define('ProtoUL.view.Properties', {

    extend: 'Ext.grid.property.Grid',
    alias: 'widget.properties',

//    xtype: 'treepanel',

    propertyNames: {
        tested: 'QA',
        borderWidth: 'Border Width'
    },
    source: {
        "(name)": "Properties Grid",
        "grouping": false,
        "autoFitColumns": true,
        "productionQuality": false,
        "created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
        "tested": false,
        "version": 0.01,
        "borderWidth": 1
    }
});
