// ==UserScript==
// @name         超星学习通章节内ppt视频下载
// @namespace    http://tampermonkey.net/
// @version      1.08
// @description  按下D下载ppt,pdf,上课视频
// @author       西电网信院的废物rytter
// @match        http://*.chaoxing.com/mycourse/*
// @match        https://*.chaoxing.com/mycourse/*
// @match        http://*.chaoxing.com/*
// @match        https://*.chaoxing.com/*
// @match        https://mooc1.*/*
// @match        http://mooc1.*/*
// @match        https://mooc1.xueyinonline.com/*
// @match        http://mooc1.xueyinonline.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @updateURL
// @installURL
// @downloadURL
// @license      MIT
// ==/UserScript==
 
function get_xueyinonline_objectid() {
    var ans_classes = document.getElementsByClassName("ans-attach-ct");
    console.log(ans_classes.length);
    var objectids = new Array();
    for (var j = 0; j < ans_classes.length; j++) {
      console.log(ans_classes[j]);
      if (
        ans_classes[j]
          .getElementsByTagName("iframe")[0]
          .getAttribute("objectid") != undefined
      ) {
        objectids = objectids.concat(
          ans_classes[j]
            .getElementsByTagName("iframe")[0]
            .getAttribute("objectid")
        );
      }
    }
    console.log(objectids);
    return objectids;
  }
  function get_chaoxing_objectid() {
    var ans_classes = document
      .getElementsByTagName("iframe")[0]
      .contentDocument.body.getElementsByClassName("ans-attach-ct");
    console.log(ans_classes.length);
    var objectids = new Array();
    for (var j = 0; j < ans_classes.length; j++) {
      console.log(ans_classes[j]);
      if (
        ans_classes[j]
          .getElementsByTagName("iframe")[0]
          .getAttribute("objectid") != undefined
      ) {
        objectids = objectids.concat(
          ans_classes[j]
            .getElementsByTagName("iframe")[0]
            .getAttribute("objectid")
        );
      }
    }
    console.log(objectids);
    return objectids;
  }
   
  function download(i) {
    // firstly，we need to get the objectid
    var objectids = get_xueyinonline_objectid();
    if (objectids.length == 0) {
      var objectids = get_chaoxing_objectid();
    }
   
    var objectid = objectids[i % objectids.length];
    console.log(objectid);
   
    var protocolStr = document.location.protocol;
    var urls = [];
    if (protocolStr == "http:") {
      if (window.location.href.includes("xueyinonline")) {
        urls = [
          "http://mooc1.xueyinonline.com/ananas/status/" +
            objectid +
            "?flag=normal",
          "http://mooc1.chaoxing.com/ananas/status/" + objectid + "?flag=normal",
        ];
      }
    } else if (protocolStr == "https:") {
      urls = [
        "https://mooc1.xueyinonline.com/ananas/status/" +
          objectid +
          "?flag=normal",
        "https://mooc1.chaoxing.com/ananas/status/" + objectid + "?flag=normal",
      ];
    }
    console.log("this is urls");
    console.log(urls);
    try {
      var xhr = new XMLHttpRequest(); //实例化XMLHttpRequest 对象
      xhr.open("GET", urls[0], false); //建立连接，要求同步响应
      xhr.send(); //发送请求
    } catch (error) {
      console.log("error occur! but don't be worry");
      var xhr = new XMLHttpRequest(); //实例化XMLHttpRequest 对象
      xhr.open("GET", urls[1], false); //建立连接，要求同步响应
      xhr.send(); //发送请求
    }
    var json = JSON.parse(xhr.responseText);
    console.log(json);
    if (json.pdf == undefined) {
      console.log(json); //接收数据
      window.open(json.http, "_blank");
    } else {
      if (json.filename.includes(".ppt")) {
        window.open(json.download, "_blank");
      } else {
        window.open(json.pdf, "_blank");
      }
      console.log(json); //接收数据
    }
  }
   
  (function () {
    "use strict";
    var i = 0;
    // Your code here...
    document.onkeydown = function (e) {
      //对整个页面监听
      var keyNum = window.event ? e.keyCode : e.which; //获取被按下的键值
      if (keyNum == 68) {
        download(i++);
      }
    };
  })();