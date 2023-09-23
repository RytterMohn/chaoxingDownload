// ==UserScript==
// @name         超星学习通章节内ppt视频下载
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  按下D下载ppt,pdf,上课视频
// @author       西电网信院的废物rytter
// @match        http://*.chaoxing.com/mycourse/*
// @match        https://*.chaoxing.com/mycourse/*
// @match        http://*.chaoxing.com/*
// @match        https://*.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @updateURL
// @installURL
// @downloadURL
// @license      MIT
// ==/UserScript==
 
(function() {
    'use strict';
    var i=0;
    // Your code here...
    document.onkeydown=function(e){//对整个页面监听
        var keyNum=window.event ? e.keyCode :e.which;//获取被按下的键值
 
        if(keyNum==68){
        if(document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct")[i]== undefined){
 
            var objectid=document.getElementsByClassName("ans-attach-ct")[i].getElementsByTagName('iframe')[0].getAttribute('objectid');
        }else{
            var objectid=document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct")[i].getElementsByTagName('iframe')[0].getAttribute('objectid');
        }
        console.log(objectid)
 
var protocolStr = document.location.protocol;
var url= '';
if(protocolStr == "http:")
{
   url= 'http://mooc1.chaoxing.com/ananas/status/' + objectid + '?flag=normal';
}
else if(protocolStr == "https:")
{
   url= 'https://mooc1.chaoxing.com/ananas/status/' + objectid + '?flag=normal';
}
if(document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct")[i]==undefined){
    FileType='.pdf';
}else{
    var FileType=JSON.parse(document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct")[i].getElementsByTagName('iframe')[0].getAttribute('data')).type;
 
}
if(FileType=='.pdf'){
    console.log("it is a test and it function")
    var xhr = new XMLHttpRequest();;//实例化XMLHttpRequest 对象
        xhr.open("GET", url, false); //建立连接，要求同步响应
        xhr.send();//发送请求
        var json = JSON.parse(xhr.responseText);
        console.log(json.pdf); //接收数据
        window.open(json.pdf,'_blank');
        i=i+1;
        if(i==document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct").length){
            i=0;
        }
 
}else if(FileType==".mp4"){
    var xhr = new XMLHttpRequest();;//实例化XMLHttpRequest 对象
        xhr.open("GET", url, false); //建立连接，要求同步响应
        xhr.send();//发送请求
        var json = JSON.parse(xhr.responseText);
        console.log(json); //接收数据
        window.open(json.http,'_blank');
 
        if(i==document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct").length-1){
            i=0;
        }else{
            i=i+1;
        }
 
    }else{
    var xhr = new XMLHttpRequest();;//实例化XMLHttpRequest 对象
        xhr.open("GET", url, false); //建立连接，要求同步响应
        xhr.send();//发送请求
        var json = JSON.parse(xhr.responseText);
        console.log(json.pdf); //接收数据
        window.open(json.pdf,'_blank');
        i=i+1;
        if(i==document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct").length){
            i=0;
        }
    }
 
    }
 
    }
})();