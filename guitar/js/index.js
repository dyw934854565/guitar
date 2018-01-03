$(function() {

	//输入就搜索，之后改，浪费流量
	var searchTimer;
	var searchDelay = 500;
	$('.search_input').on('keyup', function() {
		var $self = $(this);
		clearTimeout(searchTimer);
		searchTimer = setTimeout(function() {
			search($self.val());
		}, searchDelay);
	});
	//search
	var search = function(text, page) {
		var page = page || '1';
		if (text == '') {
			return;
		} else {
			$.ajax({
				url: './dql.php',
				type: 'POST',
				data: {type:'pu_search',text:text,page:page},
				success: function(data) {
					$('#find_tip').hide();
					var $ul = $('.search_res_ul');
					if (page == 1) {
						$ul.empty();
					}
					console.log(JSON.stringify(data));
					$.each(data, function(i, item) {
						var picArr = [];
						var li = '<li class="pu">';
						li += "<pu-item pu_name='" + item.pu_name + "' pu_src='" + JSON.stringify(item.picArr) + "' class='pu_item'>";
						li += '</pu-item>';
						li += '</li>';

						$ul.append(li);
					});
				},
				dataType: 'json'
			});
		}
	}

	$('.search_res_ul').on('click', '.pu_li', function() {
		var $self = $(this);
		$puItem = $self.parents('.pu_item');
		console.log($self.data('id'), $self.data('num'), JSON.parse($puItem.attr('pu_src')));
		$('#player').attr({
			pu_src: $puItem.attr('pu_src'),
			now: $self.data('num')
		});
	});

	//test
	(function() {
			var data = [{"id":"2513","pu_name":"突然好想你—五月天手写经典歌曲弹唱版","pu_up":"0","pu_down":"0","picArr":[{"id":"6972","src":"/201586FY6hRzAJ/1.jpg"},{"id":"6973","src":"/201586THkRKGhD/2.jpg"}]},{"id":"2688","pu_name":"琅琅吉他原版编配笑忘歌---五月天编配：余杨","pu_up":"0","pu_down":"0","picArr":[{"id":"7486","src":"/201586cGEQEDcn/1.jpg"},{"id":"7487","src":"/201586kFphijKy/2.jpg"}]},{"id":"2899","pu_name":"时光机完善版-五月天","pu_up":"0","pu_down":"0","picArr":[{"id":"8144","src":"/201586jBFnisKa/1.gif"},{"id":"8145","src":"/20158623hsT8hd/2.gif"},{"id":"8146","src":"/201586QCj2PdQD/3.gif"}]},{"id":"2961","pu_name":"五月天-出头天","pu_up":"0","pu_down":"0","picArr":[{"id":"8350","src":"/20158647pJ4y38/1.gif"},{"id":"8351","src":"/201586fXcnMW4w/2.gif"}]},{"id":"2999","pu_name":"琅琅吉他原版编配知足---五月天","pu_up":"0","pu_down":"0","picArr":[{"id":"8469","src":"/201586RMisayP3/1.jpg"}]}];
			var $ul = $('.search_res_ul');
			alert('aaa');
			$.each(data, function(i, item) {
				var picArr = [];
				var li = '<li class="pu">';
				li += "<pu-item pu_name='" + item.pu_name + "' pu_src='" + JSON.stringify(item.picArr) + "' class='pu_item'>";
				li += '</pu-item>';
				li += '</li>';

				$ul.append(li);
			});
	})();
});