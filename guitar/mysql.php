<?php
   class Mysql{
   	  public $conn;
   	  public $dbname="qdm114475292_db";
   	  public $username="qdm114475292";
   	  public $password="DO923315";
   	  public $host="qdm114475292.my3w.com";
   	  public function __construct(){
   	  	$this->conn=mysql_connect($this->host,$this->username,$this->password);
   	  	if(!$this->conn){
   	  		die("数据库连接失败".mysql_errno());
   	  	}
   	  	mysql_query("set names utf8",$this->conn) or die(mysql_errno());
   	  	mysql_select_db($this->dbname,$this->conn);
   	  }
   	  
   	  //执行dql语句
   	  public function execute_dql($sql){
   	  	$res=mysql_query($sql,$this->conn) or die("execut".mysql_errno());
   	  	return $res;
   	  }
   	  
   	  //执行dml语言
   	  public function execute_dml($sql){
   	  	$b=mysql_query($sql,$this->conn) or die("execut".mysql_errno());;
   	  	if(!$b){
   	  		return 0;
   	  	}else{
   	  		if(mysql_affected_rows($this->conn)>0){
   	  			return 1;//执行OK
   	  		}else{
   	  			return 2;//没有行收到影响	
   	  			 }
   	  		}
   	  	}
   	  
   	  //关闭连接
   	  public function close_connet(){
   	  	if (!empty($this->conn)){
   	  		mysql_close($this->conn);
   	  	}
   	  }
   }
?>