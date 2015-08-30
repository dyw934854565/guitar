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
					var $ul = $('.search_res_ul').empty();
					$.each(data, function(i, item) {
						var li = "<li class='pu_li'><p>"+item['pu_name']+"</p>";
						li += "<div class='pic_wrap'>";
						$.each(item.picArr, function(k, pic) {
							li += "<img src='http://7xlehn.com1.z0.glb.clouddn.com"+pic.src+"-n' />";
						});
						li += "</div>";
						li += "</li>";
						$ul.append(li);
					});
				},
  				dataType: 'json'
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