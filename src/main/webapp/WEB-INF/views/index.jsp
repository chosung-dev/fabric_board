<%@page import="java.util.Date"%>
<%@ page import="org.json.JSONArray" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
     pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
     <title>Fabric_board</title>
     <link href="/css/style.css" rel="stylesheet" type="text/css">
     <meta charset="UTF-8">
</head>
<body>
     <h1>
          Fabric Board
     </h1>
     <table class="type01">
          <% JSONArray board_json = (JSONArray)request.getAttribute("board_json");%>
          <% for (int i=0; i<board_json.length(); i++) { %>
          <% String Key = (String)board_json.getJSONObject(i).get("Key"); %>
          <% String tittle = (String)board_json.getJSONObject(i).getJSONObject("Record").get("tittle"); %>
          <% String content = (String)board_json.getJSONObject(i).getJSONObject("Record").get("content"); %>
          <tr>
               <th scope="row">
                    <%out.print(tittle);%>
               </th>
               <td>
                    <%out.print(content);%>
               </td>
               <td style="width : 40px; border-left:hidden; padding-left:-30px;">
                    <a href="/repair?board_id=<%out.print(Key);%>&board_title=<%out.print(tittle);%>&board_content=<%out.print(content);%>" style="width:100%;  margin:-20px; padding:-10px; color: #BDBDBD;">수정</a>
               </td>

               <td style="width : 40px; border-left:hidden; padding-left:-30px;">
                    <a href="/delete?board_id=<%out.print(Key);%>" style="width:100%; margin:-20px; padding:-10px; color: #BDBDBD;">삭제</a>
               </td>
          </tr>
          <% } %>
     </table>
     <div class="wrap"><a class="button" href="createboard">글 작성</a></div>
</body>

