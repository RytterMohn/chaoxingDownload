// ==UserScript==
// @name         超星学习通章节内ppt视频下载
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  按下D下载ppt,pdf,上课视频
// @author       西电网信院的废物rytter & 西电网信院的废物B4a 
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
    // support old version used by learning.xidian.edu.cn
    if (ans_classes.length === 0) {
        ans_classes = document.getElementsByClassName("ans-cc")
    }
    console.log("任务数量： ", ans_classes.length);
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
    console.log("任务对象：", objectids);
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
    // firstly, we need to get the objectid
    var tipsDiv = document.querySelector('.tips');
 
    if (!tipsDiv) {
        // If it doesn't exist, create it and set styles to make it float in the top right corner
        tipsDiv = document.createElement('div');
        tipsDiv.className = 'tips';
        document.body.appendChild(tipsDiv);
 
        // Apply styles directly or add a class
        tipsDiv.style.position = 'fixed';
        tipsDiv.style.top = '10px';
        tipsDiv.style.right = '10px';
        tipsDiv.style.backgroundColor = 'rgb(209 232 255 / 90%)';
        tipsDiv.style.padding = '10px';
        tipsDiv.style.zIndex = '1000'; // Ensure it's on top of other elements
        tipsDiv.style.textAlign = 'right'; // Align text to the right
    }
 
    // unhide
    if (tipsDiv.style.zIndex === '-1') {
        tipsDiv.style.zIndex = '1000';
    }
 
    tipsDiv.innerHTML = '<i></i>';
 
    var objectids = get_xueyinonline_objectid();
    if (objectids.length == 0) {
        objectids = get_chaoxing_objectid();
    }
 
    var objectid = objectids[i % objectids.length];
    console.log(objectid);
 
    var protocolStr = document.location.protocol;
    var url = protocolStr + "//mooc1." + (window.location.href.includes("xueyinonline") ? "xueyinonline" : "chaoxing") + ".com/ananas/status/" + objectid + "?flag=normal";
    console.log("资源URL：", url);
 
    // 使用fetch API获取文件信息
    fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            var fileUrl, fullFileName;
            if (json.pdf === undefined) {
                fileUrl = json.http;
                var fileExtension = json.filename ? json.filename.split('.').pop() : '';
                fullFileName = json.filename;
                if (json.pdf === undefined && fileExtension) {
                    var prevTitle = document.querySelector('.prev_title')?.textContent || 'download';
                    fullFileName = prevTitle + '.' + fileExtension;
                }
            } else {
                // Assuming json.pdf or json.download is the URL to the file you want to download
                fileUrl = json.pdf || json.download;
                fullFileName = json.filename;
            }
 
            // Create elements for file name, file size, and percentage
            var fileNameSpan = document.createElement('span');
            fileNameSpan.textContent = '下载文件： ' + fullFileName;
            fileNameSpan.style.marginRight = '10px'; // Add margin to the right
 
 
            var percentageSpan = document.createElement('span');
            percentageSpan.textContent = '0%';
            percentageSpan.style.marginLeft = '10px'; // Add margin to the right
            percentageSpan.style.width = '60px';
 
            // Create a progress bar element and append it to the tips div
            var progressBar = document.createElement('progress');
            var fileSizeSpan = document.createElement('span');
            fileSizeSpan.textContent = '文件大小：计算中……';
            fileSizeSpan.style.marginRight = '10px'; // Add margin to the right
 
            progressBar.value = 0;
            progressBar.max = 100;
            tipsDiv.appendChild(fileNameSpan);
            tipsDiv.appendChild(fileSizeSpan);
            tipsDiv.appendChild(progressBar);
            tipsDiv.appendChild(percentageSpan);
 
            var xhr = new XMLHttpRequest();
            xhr.open('GET', fileUrl, true);
            xhr.responseType = 'blob';
 
            xhr.onprogress = function(event) {
                if (event.lengthComputable) {
                    var percentComplete = (event.loaded / event.total) * 100;
                    progressBar.value = percentComplete; // Update the progress bar value
                    percentageSpan.textContent = percentComplete.toFixed(2) + '%'; // Update the percentage text
                    fileSizeSpan.textContent = '文件大小：' + (event.total / 1024 / 1024).toFixed(2) + ' MB'; // Update the file size text
                }
            };
 
            xhr.onload = function(event) {
                if (this.status === 200) {
                    var blob = this.response;
 
                    if (blob.type === 'application/pdf') {
                        // Check if the blob type is application/pdf
                        // Modify the filename to have the .pdf extension
                        var extension = '.pdf';
                        if (!fullFileName.endsWith(extension)) {
                            // If the filename doesn't end with .pdf, modify it
                            fullFileName = fullFileName.replace(/\.[^.]+$/, '') + extension;
                        }
                    }
                    var downloadUrl = window.URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.href = downloadUrl;
                    a.download = fullFileName || 'download'; // Set the download filename here
                    document.body.appendChild(a);
                    a.click();
                    a.remove(); // Remove the element after download starts
                    window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
                    tipsDiv.innerHTML = ''; // Optionally clear the progress bar after download
                }
                if (tipsDiv.style.position === 'fixed') {
                    tipsDiv.style.zIndex = '-1';
                }
            };
 
            xhr.onerror = function() {
                console.error("Error fetching the file for download.");
                tipsDiv.innerHTML = '下载失败！'; // Display error message in tips div
            };
 
            xhr.send();
 
        })
        .catch(error => {
            console.error("Error fetching the JSON data:", error);
        });
}
 
 
(function() {
    "use strict";
    var i = 0;
    document.onkeydown = function(e) {
        //对整个页面监听
        var keyNum = window.event ? e.keyCode : e.which; //获取被按下的键值
        if (keyNum == 68) {
            download(i++);
        }
    };
})();