# chaoxingDownload 超星章节内ppt下载

作者：西电网信院的废物rytter

按下d可弹出该ppt的pdf网页，点击网页保存即可下载

有问题联系ryttermohn@gmail.com

本脚本可在 Edge浏览器101.0.1210.39 (正式版本)下运行

脚本发布页面：https://greasyfork.org/zh-CN/scripts/444744

使用方法介绍：https://www.bilibili.com/video/BV19M411b7Co
欢迎任何人来提交pr



0.3版本：如果该页面内含有多个元素，第一次点击d下载第一个文件，第二次点击下载第二个，如果点击次数超过元素数量即从零开始
0.4版本：添加更新地址
0.5-0.8版本：修复一些bug
0.9版本：这一次遇到一种情况，就是老师发出来一个链接，这个链接是老师的课程链接，里面有ppt，不是正常学生课程里面的ppt，所以进行了更新，可以下载老师发送的课程链接的ppt
0.10版本：改bug
1.00版本：大更新，添加视频下载，还可以循环下载（具体看更新日志）

1.01版本：改bug，我有罪，我只指定了pdf，忘记指定了ppt，我是大傻子

1.02版本：删除了QQ联系方式，感谢一些同学的反馈，但是总是会有人加我好友问我能不能刷网课，？？？，我实在是烦了，就删除了联系方式

1.03版本：更改了match，适用网站更多

1.04版本：更改了match，适用网站更多

1.05版本：更改了match，适用网站更多

1.06版本：适应了学银在线的网站

1.07版本：超星系统更新，脚本同步更新，要是不管用你拿棍子抡我！！！！！

1.08版本：终于发现这个问题了，就是对于ppt源文件，下载直接保存为ppt，而不是pdf，但是问题是这个超星的问题会显示文件不安全，大家直接设置一下直接下载就可以了

1.09版本：由 [Guochengjie](https://github.com/guochengjie) 提交。将下载方式改为XHR下载，再也不用在弹出的页面手动下载了。加入进度条，当完成后直接在当前页面弹出下载。同时为学在西电优化，自动跳转https，兼容旧版超星。修改了非PDF的文件名获取方式。

对于部分有下面这种tips的页面：
<img width="100%" alt="tips" src="https://github.com/Guochengjie/chaoxingDownload/assets/13282380/f4bd7e98-3299-4d2d-840c-7aa218590fb7">

会直接复用，替换内容：
<img width="100%" alt="tips-progress-bar" src="https://github.com/Guochengjie/chaoxingDownload/assets/13282380/4f6b51fb-aae2-443e-bcc7-ac1c61e1b188">

否则会在右上角新建悬浮窗，显示下载进度。
<img width="100%" alt="float-progress-bar" src="https://github.com/Guochengjie/chaoxingDownload/assets/13282380/6ddc722a-7fd2-4e6e-bfae-d2bee81ad72c">

不知道为啥，超星的ppt没法直接下载，写了个脚本完成这个，希望和大家学习交流，技术交流，脚本建议或者bug反馈可以直接在这里留言，会自动有邮件提醒我，欢迎各位一起来学习讨论一起进步，其他Android或web技术也可以一起交流一下，本人技术很菜，希望大家不要嫌弃。

因为超星用的是网页嵌套的方式，所以打开页面后不要直接点到ppt，不然就会定位到另外一个网页中，打开页面，直接按D，就可以下载


ps：超星我星星你个星星，前端写那么乱，找半天响应文件。
