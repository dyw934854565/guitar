<?php
	require_once './mysql.php';

	$type = $_POST['type'];

	$mysql = new Mysql();
	if($type == 'pu_search') {
		$text = $_POST['text'];
		$page = $_POST['page'];
		$pagecount = 10;
		$start = $pagecount*($page-1);

		$sql = "select pu_list.id as pu_id,pu_list.pu_name,pu_list.pu_up,pu_list.pu_down,pu_pic_list.id as pic_id,pu_pic_list.pu_path from pu_list,pu_pic_list where pu_list.id=pu_pic_list.pu_id and pu_name like '%$text%' limit $start,$pagecount";
		$response = array();
		$res = $mysql->execute_dql($sql);
		while ($row = mysql_fetch_assoc($res)) {
			// array_push($response,$row);
			// continue;
			$length = count($response);
			$has = false;
			for($i=0; $i<$length; $i++) {
				if($response[$i]['id'] == $row['pu_id']) {
					$pic['id'] = $row['pic_id'];
					$pic['src'] = substr($row['pu_path'], 7);
					array_push($response[$i]['picArr'],$pic);
					$has = true;
				}
			}
			if(!$has) {
				$arow['id'] = $row['pu_id'];
				$arow['pu_name'] = $row['pu_name'];
				$arow['pu_up'] = $row['pu_up'];
				$arow['pu_down'] = $row['pu_down'];
				$pic['id'] = $row['pic_id'];
				$pic['src'] = substr($row['pu_path'], 7);
				$picArr = array();
				array_push($picArr,$pic);
				$arow['picArr'] = $picArr;
				array_push($response,$arow);
			}
		}
		echo json_encode($response);
	}
?>