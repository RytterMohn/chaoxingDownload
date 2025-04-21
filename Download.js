// ==UserScript==
// @name         超星学习通章节内ppt视频下载
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  按下D下载ppt,pdf,上课视频
// @author       西电网信院的废物rytter & 西电网信院的废物B4a
// @match        *://*/*mycourse/studentstudy*
// @match        *://*/*nodedetailcontroller/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @updateURL
// @installURL
// @downloadURL
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    // --- Styles ---
    // (GM_addStyle remains the same as v1.21)
    GM_addStyle(`
        .cx-download-tips {
            position: fixed;
            top: 15px;
            right: 15px;
            background-color: rgba(230, 247, 255, 0.97);
            padding: 12px 18px;
            z-index: 10001;
            text-align: left; /* Align text left for better readability */
            border-radius: 8px;
            font-size: 13px;
            color: #333;
            border: 1px solid #b3e0ff;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
            max-width: 400px; /* Limit width */
            opacity: 1;
            transition: opacity 0.5s ease-out, transform 0.3s ease-out;
            transform: translateX(0);
        }
        .cx-download-tips.cx-hidden {
            opacity: 0;
            transform: translateX(20px); /* Slide out effect */
            pointer-events: none;
        }
        .cx-download-tips i { /* General message styling */
            font-style: normal;
            display: block;
        }
        .cx-download-tips .progress-container {
            margin-top: 8px;
        }
        .cx-download-tips .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            font-size: 12px;
        }
        .cx-download-tips .progress-filename {
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 250px; /* Limit filename width */
            display: inline-block;
        }
        .cx-download-tips .progress-size {
            color: #555;
            font-size: 11px;
        }
        .cx-download-tips progress {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            overflow: hidden; /* Ensure rounded corners apply to value */
        }
        .cx-download-tips progress::-webkit-progress-bar {
            background-color: #e0e0e0;
            border-radius: 4px;
        }
        .cx-download-tips progress::-webkit-progress-value {
            background-color: #4CAF50; /* Green progress */
            border-radius: 4px;
            transition: width 0.1s linear;
        }
        .cx-download-tips progress::-moz-progress-bar { /* Firefox */
             background-color: #4CAF50;
             border-radius: 4px;
             transition: width 0.1s linear;
        }
        .cx-download-tips .status-icon {
            margin-right: 5px;
            font-weight: bold;
        }
        .cx-download-tips .status-success { color: #28a745; } /* Green */
        .cx-download-tips .status-error { color: #dc3545; } /* Red */

        /* Modal Styles */
        .cx-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 10010;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .cx-modal-content {
            background-color: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        }
        .cx-modal-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .cx-modal-list {
            overflow-y: auto;
            margin-bottom: 20px;
            flex-grow: 1; /* Allow list to take available space */
        }
        .cx-modal-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .cx-modal-list li {
            padding: 10px 8px; /* Slightly more padding */
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            cursor: pointer; /* Make list item clickable */
            transition: background-color 0.15s ease;
        }
         .cx-modal-list li:hover {
            background-color: #f8f9fa;
         }
        .cx-modal-list li:last-child {
            border-bottom: none;
        }
        .cx-modal-list input[type="checkbox"] {
            margin-right: 12px;
            width: 16px;
            height: 16px;
            flex-shrink: 0; /* Prevent checkbox from shrinking */
            pointer-events: none; /* Let the LI handle the click */
        }
        .cx-modal-list label {
            font-size: 14px;
            color: #555;
            flex-grow: 1; /* Allow label to take space */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            /* Remove cursor pointer from label, LI handles it */
            /* cursor: pointer; */
        }
        .cx-modal-list .file-type {
            font-size: 11px;
            color: #888;
            margin-left: 10px;
            background-color: #eee;
            padding: 2px 5px;
            border-radius: 3px;
            white-space: nowrap; /* Prevent type from wrapping */
            flex-shrink: 0; /* Prevent type from shrinking */
        }
         .cx-modal-list .file-error {
             font-size: 11px;
             color: #dc3545;
             margin-left: 10px;
             font-style: italic;
         }
        .cx-modal-actions {
            text-align: right;
            margin-top: 10px; /* Add space above buttons */
        }
        .cx-modal-button {
            padding: 8px 16px;
            margin-left: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cx-modal-button-primary {
            background-color: #007bff;
            color: white;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
        }
        .cx-modal-button-primary:hover {
            background-color: #0056b3;
            box-shadow: 0 3px 6px rgba(0, 123, 255, 0.4);
        }
        .cx-modal-button-secondary {
            background-color: #6c757d;
            color: white;
             box-shadow: 0 2px 4px rgba(108, 117, 125, 0.3);
        }
        .cx-modal-button-secondary:hover {
            background-color: #5a6268;
            box-shadow: 0 3px 6px rgba(108, 117, 125, 0.4);
        }
        /* Button Styles */
        .cx-action-button {
             margin: 6px 0;
             padding: 8px 10px;
             border: none;
             border-radius: 8px;
             cursor: pointer;
             font-size: 12px;
             font-weight: bold;
             width: 85px;
             text-align: center;
             box-shadow: 0 3px 6px rgba(0,0,0,0.15);
             transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
             color: white;
         }
         .cx-action-button:hover {
             opacity: 0.9;
             box-shadow: 0 4px 8px rgba(0,0,0,0.2);
         }
          .cx-action-button:active {
             transform: scale(0.97);
             box-shadow: 0 1px 3px rgba(0,0,0,0.1);
         }
    `);

    // --- Globals ---
    let tipsDiv = null;
    let tipTimeout = null;
    let modalInstance = null;

    // --- Helper Functions ---
    // get_objectids, getTipsDiv, showTip, hideTipsDiv, cleanFilename, fetchResourceDetails, delay
    // (Keep these functions as they were in v1.21)
    function get_objectids() {
        // ... (keep the existing get_objectids function as is) ...
        let objectids = [];
        let ans_classes = document.getElementsByClassName("ans-attach-ct");
        // support old version used by learning.xidian.edu.cn
        if (ans_classes.length === 0) {
            ans_classes = document.getElementsByClassName("ans-cc");
        }

        if (ans_classes.length > 0) {
            // console.log("模式1: 找到资源容器数量：", ans_classes.length);
            for (let j = 0; j < ans_classes.length; j++) {
                const iframe = ans_classes[j].getElementsByTagName("iframe")[0];
                if (iframe && iframe.getAttribute("objectid") != undefined) {
                    objectids.push(iframe.getAttribute("objectid"));
                }
            }
        } else {
            // Try finding objectid in the main iframe content (common case)
            const mainIframe = document.getElementsByTagName("iframe")[0];
            if (mainIframe && mainIframe.contentDocument) {
                 try {
                    ans_classes = mainIframe.contentDocument.body.getElementsByClassName("ans-attach-ct");
                     if (ans_classes.length === 0) {
                         ans_classes = mainIframe.contentDocument.body.getElementsByClassName("ans-cc");
                     }
                    // console.log("模式2: Iframe内找到资源容器数量：", ans_classes.length);
                    for (let j = 0; j < ans_classes.length; j++) {
                        const iframe = ans_classes[j].getElementsByTagName("iframe")[0];
                        if (iframe && iframe.getAttribute("objectid") != undefined) {
                            objectids.push(iframe.getAttribute("objectid"));
                        }
                    }
                 } catch(e) {
                     console.warn("访问iframe内容时出错 (可能是跨域限制):", e);
                     if (mainIframe.getAttribute("objectid") != undefined) {
                         objectids.push(mainIframe.getAttribute("objectid"));
                         // console.log("模式3: 直接在主iframe上找到objectid");
                     }
                 }
            }
        }
        // Remove duplicates
        objectids = [...new Set(objectids)];
        console.log("找到的所有任务对象IDs:", objectids);
        return objectids;
    }

    function getTipsDiv() {
        if (!tipsDiv) {
            tipsDiv = document.createElement('div');
            tipsDiv.className = 'cx-download-tips cx-hidden'; // Start hidden
            document.body.appendChild(tipsDiv);
        }
        return tipsDiv;
    }

    function showTip(message, duration = 3000, isError = false, isSuccess = false) {
        const div = getTipsDiv();
        clearTimeout(tipTimeout); // Clear any existing hide timeout

        let icon = '';
        if (isSuccess) icon = '<span class="status-icon status-success">✔</span>';
        if (isError) icon = '<span class="status-icon status-error">✘</span>';

        div.innerHTML = `<i>${icon}${message}</i>`;
        div.classList.remove('cx-hidden'); // Make visible

        if (duration > 0) {
            tipTimeout = setTimeout(hideTipsDiv, duration);
        }
    }

    function hideTipsDiv() {
        const div = getTipsDiv();
        clearTimeout(tipTimeout);
        div.classList.add('cx-hidden');
    }

    function cleanFilename(filename) {
         return filename.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, ' ');
    }

    /**
     * Fetches details for a single resource object ID.
     * @param {string} objectid
     * @returns {Promise<object>} Resource details object
     */
    async function fetchResourceDetails(objectid) {
        const protocolStr = document.location.protocol;
        const domain = window.location.href.includes("xueyinonline") ? "xueyinonline" : "chaoxing";
        const url = `${protocolStr}//mooc1.${domain}.com/ananas/status/${objectid}?flag=normal`;
        let resource = {
            objectid: objectid,
            filename: `未知资源_${objectid}`,
            downloadUrl: null,
            type: '未知',
            error: null,
            openDirectly: false // Added flag
        };

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const json = await response.json();
            // console.log("Fetched info for", objectid, json);

            let fileUrl = null;
            let fileExtension = 'bin';
            let filename = json.filename || `资源_${objectid}`;

            // Determine type and URL priority
            if (json.pdf) {
                resource.type = 'PDF';
                fileUrl = json.pdf;
                fileExtension = 'pdf';
            } else if (json.http && (json.filename?.toLowerCase().endsWith('.mp4') || json.http.includes('.mp4') || json.mimetype?.includes('video'))) {
                resource.type = '视频';
                fileUrl = json.http;
                fileExtension = json.filename?.split('.').pop() || 'mp4';
            } else if (json.filename?.toLowerCase().includes(".ppt") && json.download) {
                resource.type = 'PPT'; // Special PPT case handled differently (opening link)
                fileUrl = json.download.startsWith('http') ? json.download : 'https://' + json.download;
                fileExtension = json.filename?.split('.').pop() || 'ppt'; // Use original ext
                 // Mark this as needing direct open, not XHR download
                 resource.openDirectly = true;
            } else if (json.download) {
                resource.type = '文件'; // General file
                fileUrl = json.download;
                fileExtension = json.filename?.split('.').pop() || 'bin';
                if (fileExtension.match(/ppt|pptx/i)) resource.type = 'PPT';
                else if (fileExtension.match(/doc|docx/i)) resource.type = '文档';
                else if (fileExtension.match(/xls|xlsx/i)) resource.type = '表格';
                else if (fileExtension.match(/zip|rar|7z/i)) resource.type = '压缩包';
            } else if (json.http) {
                // Treat other http links as potential downloads, but maybe less reliable
                resource.type = '链接/其他';
                fileUrl = json.http;
                fileExtension = json.filename?.split('.').pop() || 'bin';
            }

            // Construct final filename
            let baseName = filename.replace(/\.[^.]+$/, '');
            const prevTitleElement = document.querySelector('.prev_title') || document.querySelector('.tab_highlight');
            const prevTitle = prevTitleElement?.textContent?.trim() || document.title.split(/[ \-_]/)[0] || '课程文件';
            resource.filename = cleanFilename(`${prevTitle}_${baseName}.${fileExtension}`);

            // Ensure protocol for non-direct links
            if (fileUrl && !resource.openDirectly && !fileUrl.startsWith('http')) {
                fileUrl = protocolStr + fileUrl;
            }
             resource.downloadUrl = fileUrl;


        } catch (error) {
            console.error(`获取资源 ${objectid} 信息失败:`, error);
            resource.error = `获取失败 (${error.message})`;
        }
        return resource;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // --- Core Download Logic ---
    /**
     * Downloads a file using XMLHttpRequest. Can show progress or run silently.
     * @param {string} fileUrl The URL of the file to download.
     * @param {string} fullFileName The desired filename for the download.
     * @param {boolean} [showProgress=true] Whether to display detailed progress in the tips div.
     */
    function downloadFile(fileUrl, fullFileName, showProgress = true) {
        const div = getTipsDiv();
        if (showProgress) {
            clearTimeout(tipTimeout); // Prevent auto-hide during download
            div.innerHTML = ''; // Clear previous content for detailed progress
            div.classList.remove('cx-hidden'); // Ensure visible

            console.log(`开始下载 (带进度): ${fullFileName} from ${fileUrl}`);

            // Create progress UI elements
            const container = document.createElement('div');
            container.className = 'progress-container';
            const infoDiv = document.createElement('div');
            infoDiv.className = 'progress-info';
            const fileNameSpan = document.createElement('span');
            fileNameSpan.className = 'progress-filename';
            fileNameSpan.textContent = fullFileName;
            fileNameSpan.title = fullFileName;
            const fileSizeSpan = document.createElement('span');
            fileSizeSpan.className = 'progress-size';
            fileSizeSpan.textContent = '(计算中...)';
            infoDiv.appendChild(fileNameSpan);
            infoDiv.appendChild(fileSizeSpan);
            const progressBar = document.createElement('progress');
            progressBar.value = 0;
            progressBar.max = 100;
            container.appendChild(infoDiv);
            container.appendChild(progressBar);
            div.appendChild(container);
        } else {
            // For batch downloads, maybe just log or show a brief starting message if needed
            console.log(`开始下载 (批量): ${fullFileName} from ${fileUrl}`);
            // Optionally: showTip(`正在尝试下载: ${fullFileName}`, 1500); // Very brief message
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', fileUrl, true);
        xhr.responseType = 'blob';

        xhr.onprogress = function (event) {
            if (showProgress && event.lengthComputable) {
                 const percentComplete = (event.loaded / event.total) * 100;
                 const progressBar = div.querySelector('progress'); // Find progress bar within the tips div
                 const fileSizeSpan = div.querySelector('.progress-size');
                 if(progressBar) progressBar.value = percentComplete;
                 if (fileSizeSpan && fileSizeSpan.textContent === '(计算中...)') {
                      fileSizeSpan.textContent = `(${(event.total / 1024 / 1024).toFixed(2)} MB)`;
                 }
            } else if (showProgress) {
                 // Handle indeterminate progress if needed
                 const progressBar = div.querySelector('progress');
                 const fileSizeSpan = div.querySelector('.progress-size');
                 if(progressBar) progressBar.removeAttribute('value');
                 if(fileSizeSpan) fileSizeSpan.textContent = `(${(event.loaded / 1024 / 1024).toFixed(2)} MB / 未知)`;
            }
        };

        xhr.onload = function (event) {
            if (showProgress) {
                 const progressBar = div.querySelector('progress');
                 if(progressBar) progressBar.value = 100; // Ensure 100% on success
            }

            if (this.status === 200) {
                let blob = this.response;
                let finalFileName = fullFileName;

                // Mime type check and correction (especially for PDF)
                if (blob.type === 'application/pdf' && !finalFileName.toLowerCase().endsWith('.pdf')) {
                    console.log(`Blob type is PDF, correcting filename: ${finalFileName}`);
                    finalFileName = finalFileName.replace(/\.[^.]+$/, '') + '.pdf';
                }
                // Add more mime type checks if necessary

                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = finalFileName;
                document.body.appendChild(a);
                a.click(); // This triggers the download
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);

                console.log(`下载成功: ${finalFileName}`);
                if (showProgress) {
                    showTip(`下载完成: ${finalFileName}`, 4000, false, true);
                } else {
                    // Optionally provide minimal feedback for batch success
                    // console.log(`Batch download success: ${finalFileName}`);
                }

            } else {
                 console.error(`下载失败 (${this.status}): ${finalFileName}`);
                 if (showProgress) {
                     showTip(`下载失败 (${this.status}): ${finalFileName}`, 5000, true, false);
                 } else {
                     // Show error for batch download failure
                     showTip(`下载失败 (${this.status}): ${finalFileName.substring(0, 30)}...`, 4000, true);
                 }
            }
        };

        xhr.onerror = function () {
            if (showProgress) {
                 const progressBar = div.querySelector('progress');
                 if(progressBar) progressBar.value = 0; // Reset progress on error
            }
            console.error("下载时发生网络错误: ", fullFileName);
            if (showProgress) {
                showTip(`下载网络错误: ${fullFileName}`, 5000, true, false);
            } else {
                 showTip(`网络错误: ${fullFileName.substring(0, 30)}...`, 4000, true);
            }
        };

        xhr.send();
    }

    // --- Modal Logic ---
    // createModalElement, populateModalList (Keep as is from v1.21)
    function createModalElement() {
        // If modal already exists, just return it
        if (modalInstance) return modalInstance;

        const overlay = document.createElement('div');
        overlay.className = 'cx-modal-overlay';
        overlay.style.display = 'none'; // Start hidden

        const content = document.createElement('div');
        content.className = 'cx-modal-content';

        const title = document.createElement('div');
        title.className = 'cx-modal-title';
        title.textContent = '选择要下载的资源';

        const listContainer = document.createElement('div');
        listContainer.className = 'cx-modal-list';
        const list = document.createElement('ul');
        listContainer.appendChild(list);

        const actions = document.createElement('div');
        actions.className = 'cx-modal-actions';

        const downloadButton = document.createElement('button');
        downloadButton.className = 'cx-modal-button cx-modal-button-primary';
        downloadButton.textContent = '下载选中';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cx-modal-button cx-modal-button-secondary';
        cancelButton.textContent = '取消';

        actions.appendChild(cancelButton);
        actions.appendChild(downloadButton); // Primary button last

        content.appendChild(title);
        content.appendChild(listContainer);
        content.appendChild(actions);
        overlay.appendChild(content);

        // Close modal listeners
        cancelButton.onclick = () => overlay.style.display = 'none';
        overlay.onclick = (e) => {
            if (e.target === overlay) { // Only close if clicking the overlay itself
                overlay.style.display = 'none';
            }
        };

        document.body.appendChild(overlay);
        modalInstance = { overlay, list, downloadButton }; // Store the instance
        return modalInstance;
    }

    function populateModalList(listElement, resources, preselectPdf = false) {
        listElement.innerHTML = ''; // Clear previous items
        if (resources.length === 0) {
             listElement.innerHTML = '<li><i>未找到可识别的资源。</i></li>';
             return;
        }

        resources.forEach((res, index) => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `cx-res-${index}`;
            checkbox.value = index; // Store index to retrieve resource data later
            checkbox.checked = (preselectPdf && res.type === 'PDF' && !res.error); // Preselect PDFs if requested and valid

            const label = document.createElement('label');
            label.htmlFor = `cx-res-${index}`; // Keep htmlFor for accessibility
            label.textContent = res.filename || '未知文件';
            label.title = res.filename || '未知文件'; // Full name on hover

            li.appendChild(checkbox);
            li.appendChild(label);

            if (res.error) {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'file-error';
                errorSpan.textContent = `(${res.error})`;
                li.appendChild(errorSpan);
                checkbox.disabled = true; // Disable checkbox for errored items
                li.style.opacity = '0.6';
                li.style.cursor = 'not-allowed';
            } else {
                const typeSpan = document.createElement('span');
                typeSpan.className = 'file-type';
                typeSpan.textContent = res.type || '未知';
                li.appendChild(typeSpan);
                // **MODIFIED:** Make clicking the list item toggle the checkbox
                li.onclick = (e) => {
                    // Don't toggle if the click was on the disabled error span
                    if (e.target.classList.contains('file-error')) return;
                    // Toggle the checkbox state directly
                    if (!checkbox.disabled) {
                        checkbox.checked = !checkbox.checked;
                    }
                };
            }
            listElement.appendChild(li);
        });
    }

    async function showResourceSelectionModal(preselectPdf = false) {
        showTip("正在查找资源列表...", 0);

        const objectids = get_objectids();
        if (objectids.length === 0) {
            hideTipsDiv();
            showTip("未找到任何资源对象ID。", 3000, true);
            return;
        }

        const resourcePromises = objectids.map(id => fetchResourceDetails(id));
        const resources = await Promise.all(resourcePromises);

        hideTipsDiv();

        const validResources = resources.filter(res => !res.error && (res.downloadUrl || res.openDirectly));

        if (validResources.length === 0) {
            showTip("未找到可下载的资源。", 3000, true);
            return;
        }

        const modal = createModalElement();
        populateModalList(modal.list, validResources, preselectPdf);

        // **MODIFIED:** Download button click handler using downloadFile for batch
        modal.downloadButton.onclick = async () => {
            const selectedIndices = Array.from(modal.list.querySelectorAll('input[type="checkbox"]:checked'))
                                       .map(cb => parseInt(cb.value, 10));

            if (selectedIndices.length === 0) {
                alert("请至少选择一个要下载的资源。");
                return;
            }

            modal.overlay.style.display = 'none';

            if (selectedIndices.length === 1) {
                // Single download: use downloadFile with progress
                const resource = validResources[selectedIndices[0]];
                 if (resource.openDirectly) {
                     console.log("打开直接链接:", resource.filename);
                     window.open(resource.downloadUrl);
                     showTip(`已尝试打开: ${resource.filename}`, 3000);
                 } else if (resource.downloadUrl) {
                    downloadFile(resource.downloadUrl, resource.filename, true); // Show progress
                 } else {
                     showTip(`无法处理 ${resource.filename}: 无有效链接`, 4000, true);
                 }
            } else {
                // Multiple downloads: use downloadFile without progress, with delay
                const directOpenQueue = [];
                const downloadQueue = [];

                selectedIndices.forEach(index => {
                    const resource = validResources[index];
                    if (resource.openDirectly) {
                        directOpenQueue.push(resource);
                    } else if (resource.downloadUrl) {
                        downloadQueue.push(resource);
                    } else {
                        console.warn(`无法处理 ${resource.filename}: 无有效链接`);
                    }
                });

                let openCount = directOpenQueue.length;
                let downloadTotal = downloadQueue.length;
                showTip(`准备处理 ${openCount} 个直接链接和 ${downloadTotal} 个下载...`, 0);

                // 1. Open direct links
                if (openCount > 0) {
                    console.log(`正在打开 ${openCount} 个直接链接...`);
                    directOpenQueue.forEach(res => {
                        console.log("打开直接链接:", res.filename);
                        window.open(res.downloadUrl);
                    });
                }

                // 2. Process download queue with delay using downloadFile(..., false)
                if (downloadTotal > 0) {
                    console.log(`开始处理 ${downloadTotal} 个下载 (带延迟)...`);
                    let initiatedCount = 0;
                    for (const res of downloadQueue) {
                        // Call downloadFile WITHOUT progress indicator
                        downloadFile(res.downloadUrl, res.filename, false);
                        initiatedCount++;
                        console.log(`已尝试启动下载 (${initiatedCount}/${downloadTotal}): ${res.filename}`);
                        // Update status occasionally
                        if (initiatedCount % 3 === 0 || initiatedCount === downloadTotal) {
                             showTip(`已尝试启动 ${initiatedCount}/${downloadTotal} 个下载...`, 0);
                        }
                        await delay(500); // Wait 500ms between initiating XHR downloads
                    }
                     // Final message after loop
                     setTimeout(() => showTip(`处理完成: ${openCount} 个链接已打开, ${initiatedCount} 个下载已尝试启动。`, 6000), 500);
                } else if (openCount > 0) {
                     // If only direct links were opened
                     setTimeout(() => showTip(`已尝试打开 ${openCount} 个链接。`, 4000), 500);
                } else {
                     showTip(`未找到有效文件进行处理。`, 4000, true);
                }
            }
        };

        modal.overlay.style.display = 'flex';
    }


    // --- Quick Download All PDFs (D key) ---
    // **MODIFIED:** Use downloadFile(..., false) for consistency and robustness
    async function downloadAllPdfsDirectly() {
        showTip("正在查找并下载所有PDF...", 0);

        const objectids = get_objectids();
        if (objectids.length === 0) {
            hideTipsDiv();
            showTip("未找到任何资源对象ID。", 3000, true);
            return;
        }

        const resourcePromises = objectids.map(id => fetchResourceDetails(id));
        const resources = await Promise.all(resourcePromises);

        const pdfResources = resources.filter(res => res.type === 'PDF' && !res.error && res.downloadUrl);

        if (pdfResources.length === 0) {
            hideTipsDiv();
            showTip("未找到可下载的PDF文件。", 3000);
            return;
        }

        hideTipsDiv();
        showTip(`开始下载 ${pdfResources.length} 个PDF文件...`, 0);
        let downloadCount = 0;
        for (const res of pdfResources) {
             // Use downloadFile without progress for D key shortcut as well
             downloadFile(res.downloadUrl, res.filename, false);
             downloadCount++;
             await delay(300); // Keep a small delay
        }

        setTimeout(() => showTip(`已尝试启动 ${downloadCount} 个PDF文件的下载。`, 5000), 500);
    }


    // --- UI and Event Listeners ---
    // (Button creation and keydown listener remain the same as v1.21)
    // Create main action buttons container
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.left = '10px';
    buttonContainer.style.top = '50%';
    buttonContainer.style.transform = 'translateY(-50%)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.zIndex = '10000';

    // **MODIFIED:** Only one button now
    var downloadButton = document.createElement('button');
    downloadButton.className = 'cx-action-button';
    downloadButton.textContent = '下载资源'; // Changed text
    downloadButton.title = '点击选择要下载的文件'; // Changed title
    downloadButton.style.backgroundColor = '#81C784'; // Green color
    downloadButton.addEventListener('click', () => showResourceSelectionModal(false)); // Don't preselect PDF

    // Add the single button to container
    buttonContainer.appendChild(downloadButton);
    document.body.appendChild(buttonContainer);

    // Keyboard shortcut (D key for downloading all PDFs directly)
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        // Check if modal is open, if so, don't trigger D key shortcut
        const modalOverlay = document.querySelector('.cx-modal-overlay');
        if (modalOverlay && modalOverlay.style.display !== 'none') {
            return;
        }

        if (e.key === 'd' || e.key === 'D' || e.keyCode === 68) {
            console.log("检测到 'D' 键按下，开始直接下载所有PDF...");
            e.preventDefault();
            downloadAllPdfsDirectly(); // Call the direct download function
        }
    });


    console.log("超星学习通下载脚本 (v1.22 - 修复多选) 已加载。");

})();