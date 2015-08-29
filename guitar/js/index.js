$(function() {
	var search = function(text) {
		if (text == '') {
			return;
		} else {
			$.ajax({
				url: './dql.php',
				type: 'POST',
				data: {type:'pu_search',text:text},
				success: function(data) {
					alert(data);
				},
  				dataType: 'text'
			});
		}
	}
	var searchTimer;
	var searchDelay = 500;
	$('.search_input').on('keyup', function() {
		var $self = $(this);
		clearTimeout(searchTimer);
		searchTimer = setTimeout(function() {
			search($self.val());
		}, searchDelay);
	});
});