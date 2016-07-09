<%--
  Created by IntelliJ IDEA.
  User: Lix
  Date: 2016-7-1
  Time: 10:23 上午
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <meta name ="viewport" content ="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
  <meta charset="UTF-8">
  <title>欢迎</title>
  <link rel="stylesheet" href="www/css/main.css" />
</head>
<body>
<div class="app app-sub white">
  <div class="app-view">
    <div class="app-view-content pad-1">
      <div class="row" style="height:90%;">
        <div class="col v-m t-c">
          <img style="width:14rem;" src="www/img/app-logo.png" />
          <p style="font-size:1.2rem;color:#767676;margin-top:2rem;">自习室座位预约系统</p>
        </div>
      </div>
      <div class="row" style="height:10%;">
        <div class="col t-c v-m" style="font-size:1rem;color:#767676;">
          版权所有 : 北京九州微众科技有限公司
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  setTimeout(function(){
    window.location="www/login.html";
  },3000)
</script>
</body>
</html>