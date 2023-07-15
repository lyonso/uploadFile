module.exports = {
	// 环境变量 development || production
	NODE_ENV: process.env.NODE_ENV,

  // 请求域名
  HTTP_REQUEST_URL: process.env.VUE_APP_BASE_API,

  // Socket链接前缀
	WSS_SERVER_URL: process.env.VUE_APP_WSS,

  // 心跳间隔
  PINGINTERVAL: 10000,

  // 主题色
  PRIMARY_COLOR: '#47e3a7',

  TITLE: '太湖流域（水文水资源）xxxx平台'
}
