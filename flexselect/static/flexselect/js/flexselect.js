(function($, that) {

// Namespace.
var flexselect = flexselect || {};

/**
 * Binds base and trigger fields.
 */
flexselect.bind_events = function() {
    if (typeof that.flexselect === 'undefined') return;
    var fields = that.flexselect.fields;
    for (hashed_name in fields) {
    	field = fields[hashed_name];
    	var base_field = field.base_field,
            form_prefix = field.form_prefix;
    	flexselect.bind_base_field(base_field, hashed_name, form_prefix);
    	for (var i in field.trigger_fields) {
    		var trigger_field = field.trigger_fields[i]; 
    		flexselect.bind_trigger_field(trigger_field, hashed_name, 
    			                          base_field, form_prefix);
    	}
	} 
};

/**
 * Binds the change event of a base field to the flexselect.ajax() function.
 */
flexselect.bind_base_field = function(base_field, hashed_name, form_prefix) {
    var $this = flexselect.get_element(base_field, form_prefix);
	$this.live('change', {
		'base_field': base_field,
		'hashed_name': hashed_name,
		'success': function(data) {
			$this.parent().find('span.flexselect_details').html(data.details);
		},
        'data': '&include_options=0&form_prefix=' + form_prefix,
	}, flexselect.ajax);
}

/**
 * Binds the change event of a trigger field to the flexselect.ajax() function.
 */
flexselect.bind_trigger_field = function(trigger_field, hashed_name, 
                                         base_field, form_prefix) {
    var $base_field = flexselect.get_element(base_field, form_prefix);
	flexselect.get_element(trigger_field, form_prefix).live('change', {
		'base_field': base_field,
		'hashed_name': hashed_name,
		'success': function(data) {
			$base_field.html(data.options);
			$base_field.parent().find('span.flexselect_details').html("");
			// If jQueryUI is installed, flash the dependent form field row.
			/*if (typeof $.ui !== 'undefined') {
				$base_field.parents('.form-row').stop()
						    	    .css('background-color', '#F49207')
					                .animate({ backgroundColor: '#FFFFFF' }, 2000);
			}*/
	    },
	    'data': '&include_options=1&form_prefix=' + form_prefix,
	}, flexselect.ajax);
};

/**
 * Performs a ajax call that options the base field. In the event.data it needs
 * the keys "hashed_name", "base_field", "data" and "success".
 */
flexselect.ajax = function(event) {
	$.ajax({
		url: '/admin/flexselect/field_changed',
		data: $('form').serialize() + '&hashed_name=' + event.data.hashed_name
			  + event.data.data,
		type: 'post',
		context: flexselect.get_element(event.data.base_field),
		success: event.data.success,
	    error: function(data) {
	    	alert("Something went wrong with flexselect.");
	    },
	});
}

/**
 * Returns the form element from a field name in the model.
 */
flexselect.get_element = function(field_name, form_prefix) {
    if (form_prefix != '') {
        return $('#id_' + form_prefix + '-' + field_name);
    }
    else {
    	return $('#id_' + field_name);	
    }
};

/**
 * Moves all details fields to after the green plussign.
 */
flexselect.move_after_plussign = function() {
	// Delay execution to after all other initial js have been run.
	window.setTimeout(function() {		
		$('span.flexselect_details').each(function() {
			$(this).next('.add-another').after($(this));
		});
	}, 0);	
};

/**
 * Overrides the original dismissAddAnotherPopup and triggers a change event on
 * the field after the popup has been added.
 */
var _dismissAddAnotherPopup = dismissAddAnotherPopup;

dismissAddAnotherPopup = function(win, newId, newRepr) {
	_dismissAddAnotherPopup(win, newId, newRepr);
	$('#' + windowname_to_id(win.name)).trigger('change');
};
dismissAddAnotherPopup.original = _dismissAddAnotherPopup;

// On Document.ready().
$(function() {
	flexselect.bind_events();
	flexselect.move_after_plussign();
});

})(jQuery || django.jQuery, this);
