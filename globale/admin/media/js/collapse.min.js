(function($) {
	$(document).ready(function() {
		// Add anchor tag for Show/Hide link
		$("fieldset.collapse").each(function(i, elem) {
			// Don't hide if fields in this fieldset have errors
			if ( $(elem).find("div.errors").length == 0 ) {
				$(elem).addClass("collapsed");
				$(elem).find("h2").first().append(' (<a id="fieldsetcollapser' +
					i +'" class="collapse-toggle" href="#">' + gettext("Show") +
					'</a>)');
			}
		});

		$("div.collapse").each(function(i, elem) {
			// Don't hide if fields in this div have errors
			if ( $(elem).find("div.errors").length == 0 ) {
				$(elem).addClass("collapsed");
//				$(elem).parents('.inline-related').children('fieldset.module').addClass('collapsed')
//				$(elem).closest("fieldset").addClass("collapsed");
				$(elem).find("h2").first().append(' (<a id="divcollapser' +
					i +'" class="collapse-toggle" href="#">' + gettext("Show") +
					'</a>)');
			}
		});
		
		// ------------------------------------------------------------
		// Add toggle to anchor tag
		$("fieldset.collapse a.collapse-toggle").toggle(
			function() { // Show
				$(this).text(gettext("Hide"));
				$(this).closest("fieldset").removeClass("collapsed");
				return false;
			},
			function() { // Hide
				$(this).text(gettext("Show"));
				$(this).closest("fieldset").addClass("collapsed");
				return false;
			}
		);

		$("div.collapse a.collapse-toggle").toggle(
				function() { // Show
					$(this).text(gettext("Hide"));
					$(this).closest("div").removeClass("collapsed");
//					$(this).parents('.inline-related').children('fieldset.module').removeClass('collapsed')
					return false;
				},
				function() { // Hide
					$(this).text(gettext("Show"));
					$(this).closest("div").addClass("collapsed");
//					$(this).parents('.inline-related').children('fieldset.module').addClass('collapsed')
					return false;
				}
			);

	
	});
})(django.jQuery);
