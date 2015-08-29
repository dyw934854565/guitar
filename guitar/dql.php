<?php
	require_once './mysql.php';

	$type = $_POST['type'];
	$text = $_POST['text'];

	if($type == 'pu_search') {
		$sql = "select pu_list.id,pu_list.pu_name,pu_list.pu_up,pu_list.dowm,pu_pic_list.pu_path from pu_list,pu_pic_list where pu_list.id=pu_pic_list.pu_id and pu_name like '%$text%'";
		$res = array();
		$res['sql'] = $sql;
		echo json_encode($res);
	}
?>