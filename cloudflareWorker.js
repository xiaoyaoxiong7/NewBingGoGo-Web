let joinStats = true;  //可选加入统计。 加入统计不会收集任何隐私信息，仅统计访问量。
let webPath = 'https://github.com/xiaoyaoxiong7/NewBingGoGo-Web/tree/main/src/main/resources'; //web页面地址，可以修改成自己的仓库来自定义前端页面
let serverConfig = { //此配置需要插件需要2023.5.22.0以上版本才会生效
    "h1": "NewBingGoGo",
    "h2": "简单开始和NewBing聊天",
    "p": "",
    "firstMessages":[
        "好的，我已清理好板子，可以重新开始了。我可以帮助你探索什么?",
        "明白了，我已经抹去了过去，专注于现在。我们现在应该探索什么?",
        "重新开始总是很棒。问我任何问题!",
        "好了，我已经为新的对话重置了我的大脑。你现在想聊些什么?",
        "很好，让我们来更改主题。你在想什么?",
        "谢谢你帮我理清头绪! 我现在能帮你做什么?",
        "没问题，很高兴你喜欢上一次对话。让我们转到一个新主题。你想要了解有关哪些内容的详细信息?",
        "谢谢你! 知道你什么时候准备好继续前进总是很有帮助的。我现在能为你回答什么问题?",
        "当然，我已准备好进行新的挑战。我现在可以为你做什么?"
    ],
    "firstProposes":[
        "教我一个新单词",
        "我需要有关家庭作业的帮助",
        "我想学习一项新技能",
        "最深的海洋是哪个?",
        "一年有多少小时?",
        "宇宙是如何开始的?",
        "寻找非虚构作品",
        "火烈鸟为何为粉色?",
        "有什么新闻?",
        "让我大笑",
        "给我看鼓舞人心的名言",
        "世界上最小的哺乳动物是什么?",
        "向我显示食谱",
        "最深的海洋是哪个?",
        "为什么人类需要睡眠?",
        "教我有关登月的信息",
        "我想学习一项新技能",
        "如何创建预算?",
        "给我说个笑话",
        "全息影像的工作原理是什么?",
        "如何设定可实现的目标?",
        "金字塔是如何建成的?",
        "激励我!",
        "宇宙是如何开始的?",
        "如何制作蛋糕?"
    ]
}
let cookies = [
"_U=1dynr6jbI1IZT1tbvRnkIVGPtPW7YupIdKDvTXV9Sa_hZbpQ9sy3TPAxwiSgZzLqkzOC1dbgu_WnupfrC6519wP2ctZH9STZtSimDt6uZCT9HwTz91gF1fQ51TBDrbXPTddiSc8R75VlwgPeN9TUcSoqmKOZsj_Akk0WR40BbU7eyanEZAZyBfkWcreJ4WTfbmHkeCenx27_pDngURueaMV-07nxw30xtGRDEHqQNoRc"
]



export default {
    async fetch(request, _env) {
        return await handleRequest(request);
    }
}
let serverConfigString = JSON.stringify(serverConfig);
/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    let url = new URL(request.url);
    let path = url.pathname;

    if(path === '/challenge'){//过验证的接口
        let r = url.searchParams.get('redirect');
        if (r){
            return getRedirect(r);
        }
        return new Response(`验证成功`,{
            status: 200,
            statusText: 'ok',
            headers: {
                "content-type": "text/html; charset=utf-8"
            }
        })
    }

    if (path === '/sydney/ChatHub') { //魔法聊天
        return bingChatHub(request)
    }
    if (path === "/turing/conversation/create") { //创建聊天
        return goUrl(request, "https://www.bing.com/turing/conversation/create");
    }

    if(path==="/edgesvc/turing/captcha/create"){//请求验证码图片
        return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/create");
    }
    if(path==="/edgesvc/turing/captcha/verify"){//提交验证码
        return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/verify?"+ url.search);
    }

    if (path.startsWith('/msrewards/api/v1/enroll')) { //加入候补
        return goUrl(request, "https://www.bing.com/msrewards/api/v1/enroll" + url.search);
    }
    if (path === '/images/create') { //AI画图
        return goUrl(request, "https://www.bing.com/images/create" + url.search, {
            "sec-fetch-site": "same-origin",
            "referer": "https://www.bing.com/search?q=bingAI"
        });
    }
    if (path.startsWith('/images/create/async/results')) { //请求AI画图图片
        url.hostname = "www.bing.com";
        return goUrl(request, url.toString(), {
            "sec-fetch-site": "same-origin",
            "referer": "https://www.bing.com/images/create?partner=sydney&showselective=1&sude=1&kseed=7000"
        });
    }
    if (path.startsWith('/rp')) { //显示AI画图错误提示图片
        url.hostname = "www.bing.com";
        return goUrl(request, url.toString(), {
            "sec-fetch-site": "same-origin",
            "referer": "https://www.bing.com/search?q=bingAI"
        });
    }
    //用于测试
    if (path.startsWith("/test/")) {
        let a = path.replace("/test/",'');
        return goUrl(request, a);
    }
    //请求服务器配置
    if(path==='/web/resource/config.json'){
        return new Response(serverConfigString,{
            status: 200,
            statusText: 'ok',
            headers: {
                "content-type": "application/x-javascript; charset=utf-8",
                "cache-control":"max-age=14400"
            }
        })
    }
    if (path.startsWith("/web/")||path === "/favicon.ico") { //web请求
        if(!joinStats){
            if(path==="/web/js/other/stats.js"){
                return new Response("console.log(\"未加入统计\");",{
                    status: 200,
                    statusText: 'ok',
                    headers: {
                        "content-type": "application/x-javascript; charset=utf-8",
                        "cache-control":"max-age=14400"
                    }
                })
            }
        }
        let a = `${webPath}${path}`;
        return await goWeb(a);
    }
    return getRedirect('/web/NewBingGoGo.html');
}


async function goWeb(path) {
    let res = await fetch(path);
    let mimeType;
    if (path.endsWith(".html")) {
        mimeType = "text/html; charset=utf-8";
    } else if (path.endsWith(".js")) {
        mimeType = "application/x-javascript; charset=utf-8";
    } else if (path.endsWith(".css")) {
        mimeType = "text/css; charset=utf-8";
    } else if (path.endsWith(".png")) {
        mimeType = "image/png";
    } else if (path.endsWith(".ico")) {
        mimeType = "image/png";
    }
    return new Response(res.body, {
        status: 200,
        statusText: 'ok',
        headers: {
            "content-type": mimeType,
            "cache-control":"max-age=14400"
        }
    });
}

//请求某地址
async function goUrl(request, url, addHeaders) {
    //构建 fetch 参数
    let fp = {
        method: request.method,
        headers: {}
    }
    //保留头部信息
    let reqHeaders = request.headers;
    let dropHeaders = ["user-agent", "accept", "accept-language"];
    for (let h of dropHeaders) {
        if (reqHeaders.has(h)) {
            fp.headers[h] = reqHeaders.get(h);
        }
    }
    if (addHeaders) {
        //添加头部信息
        for (let h in addHeaders) {
            fp.headers[h] = addHeaders[h];
        }
    }


    let cookieID = 0;
    if(reqHeaders.get('NewBingGoGoWeb')){//如果是web版
        //添加配置的随机cookie
        if (cookies.length === 0) {
            return getReturnError("没有任何可用cookie，请前在第一行代码cookies变量中添加cookie");
        }
        cookieID = Math.floor(Math.random() * cookies.length);
        let userCookieID = reqHeaders.get("cookieID");
        if (userCookieID) {
            if (userCookieID >= 0 && userCookieID <= cookies.length-1) {
                cookieID = userCookieID;
            } else {
                return getReturnError("cookieID不存在，请刷新页面测试！");
            }
        }
        fp.headers["cookie"] = cookies[cookieID];
    }else {//如果是插件版
        fp.headers["cookie"] = reqHeaders.get('cookie');
    }

    //客户端指定的随机地址
    let randomAddress = reqHeaders.get("randomAddress");
    if(!randomAddress){
        randomAddress = "12.24.144.227";
    }
    //添加X-forwarded-for
    fp.headers['X-forwarded-for'] = randomAddress;

    let res = await fetch(url, fp);
    let headers = new Headers(res.headers);
    headers.set("cookieID",cookieID);
    return new Response(res.body,{
        status:res.status,
        statusText:res.statusText,
        headers:headers
    });
}

//获取用于返回的错误信息
function getReturnError(error) {
    return new Response(JSON.stringify({
        value: 'error',
        message: error
    }), {
        status: 200,
        statusText: 'ok',
        headers: {
            "content-type": "application/json",
            "NewBingGoGoError":'true'
        }
    })
}

//返回重定向
function getRedirect(url) {
    return new Response("正在重定向到" + url, {
        status: 302,
        statusText: 'redirect',
        headers: {
            "content-type": "text/html",
            "location": url
        }
    })
}

//websocket
function bingChatHub(request) {
    // 如果请求包含 Upgrade 头，说明是 WebSocket 连接
    if (request.headers.get('Upgrade') === 'websocket') {
        const webSocketPair = new WebSocketPair()
        const serverWebSocket = webSocketPair[1]
        var bingws = new WebSocket('wss://sydney.bing.com/sydney/ChatHub')
        serverWebSocket.onmessage = event => {
            bingws.send(event.data);
        }
        bingws.onmessage = event => {
            serverWebSocket.send(event.data)
        }
        bingws.onopen = event => {
            serverWebSocket.accept();
        }
        bingws.onclose = event => {
            serverWebSocket.close(event.code, event.reason);
        }
        bingws.onerror = event => {
            serverWebSocket.send(JSON.stringify({
                type: 'error',
                mess: "workers接到bing错误：" + event
            }));
            serverWebSocket.close();
        }
        serverWebSocket.onerror = event => {
            serverWebSocket.close();
        }
        serverWebSocket.onclose = event => {
            bingws.close(event.code, event.reason);
        }

        return new Response(null, { status: 101, webSocket: webSocketPair[0] })
    } else {
        return new Response('这不是websocket请求！')
    }
}
