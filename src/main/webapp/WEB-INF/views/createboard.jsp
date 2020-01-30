<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<head>
    <link href="/css/style.css" rel="stylesheet" type="text/css">
    <meta charset="UTF-8">
</head>
<h1></h1>
<form id="form1" action="creatboard_submit" method="GET">
    <table class="type01">
        <tbody>
        <tr>
            <th scope="row">제목</th>
            <td>
                <input type="text" name="tittle" />
            </td>
        </tr>
        <tr>
            <th scope="row">내용</th>
            <td>
                <input type="text" name="content" />
            </td>
        </tr>
        </tbody>
    </table>
    <div class="wrap"><a class="button" href="#" onclick="document.getElementById('form1').submit()">글 작성</a></div>
</form>