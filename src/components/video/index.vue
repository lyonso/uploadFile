<template>
  <div
    id='videoPlayerBox'
    ref='videoPlayerBox'
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div>
      <div
        :id='"playBox" + videoName'
        class='playBox'
        :style="{
          width: width + 'px',
          height: height + 'px',
          //top: top + 'px',
          //left: left + 'px',
        }"
        v-html="oWebControl === null ? playText : ''"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'videoPlayer',
  props: {
    videoName: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 370
    },
    height: {
      type: Number,
      default: 206
    },

    playHeight: {
      type: Number,
      default: 206
    },
    monitorDeviceNo: {
      type: String,
      default: ''
    }
    // detail: {
    //   type: Object,
    //   default: {},
    // },
  },
  data() {
    return {
      oWebControl: null,
      pubKey: '', // 公钥
      appkey: '22540716',
      secret: 'Apk82OJaopkgcrDlzWXH',
      ip: '10.8.45.230',
      port: 444,
      //width: 600,
      //height: 360, // 弹框高度
      //playHeight: 360,
      layout: '1x1',
      left: '',
      top: '',
      buttonIDs: '0,16,256,257,515',
      initCount: 0,
      playMode: 0, // 0 预览 1回放
      playText: '启动中。。。',
      cameraIndexCode: '' // 监控点编号
    }
  },
  watch: {
    monitorDeviceNo(newV, oldV) {
      this.cameraIndexCode = newV
      if (newV && this.playMode === 0) {
        this.previewVideo()
      }
    }
  },

  beforeDestroy() {
    if (this.oWebControl) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'stopAllPreview'
      })
      this.oWebControl.JS_HideWnd()
      this.oWebControl.JS_Disconnect().then(
        () => {
          // 断开与插件服务连接成功
        },
        () => {
          // 断开与插件服务连接失败
        }
      )
      this.oWebControl = null
    }
  },
  mounted() {
    this.cameraIndexCode = this.monitorDeviceNo
    let bodyW = document.body.clientWidth
    let bodyH = document.body.clientHeight
    this.left = bodyW / 2 - this.width / 2
    this.top = bodyH / 2 - this.height / 2


    // $(window).resize(() => {
    //   if (this.oWebControl != null) {
    //     this.oWebControl.JS_Resize(this.width, this.playHeight);
    //
    //     this.setWndCover();
    //   }
    // });
    window.onresize = () => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(this.width, this.playHeight)

        this.setWndCover()
      }
    }
    window.addEventListener('scroll', () => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(this.width, this.playHeight)
        this.setWndCover()
      }
    })
    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    // $(window).scroll(() => {
    //   if (this.oWebControl != null) {
    //     this.oWebControl.JS_Resize(this.width, this.playHeight);
    //     this.setWndCover();
    //   }
    // });
    // 标签关闭
    // $(window).unload(() => {
    //   if (this.oWebControl != null) {
    //     this.oWebControl.JS_HideWnd(); // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
    //     this.oWebControl.JS_Disconnect().then(
    //         () => {
    //           // 断开与插件服务连接成功
    //         },
    //         () => {
    //           // 断开与插件服务连接失败
    //         }
    //     );
    //   }
    // });
    this.$nextTick(() => {
      this.initPlugin(() => {
        this.previewVideo()
      })
    })
  },
  methods: {
    setWndCover() {
      let iWidth = $(window).width()
      let iHeight = $(window).height()
      let oDivRect = $('#playBox' + this.videoName).get(0).getBoundingClientRect()
      let iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0
      let iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0
      let iCoverRight =
        oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0
      let iCoverBottom =
        oDivRect.bottom - iHeight > 0
          ? Math.round(oDivRect.bottom - iHeight)
          : 0

      iCoverLeft = iCoverLeft > this.width ? this.width : iCoverLeft
      iCoverTop = iCoverTop > this.playHeight ? this.playHeight : iCoverTop
      iCoverRight = iCoverRight > this.width ? this.width : iCoverRight
      iCoverBottom =
        iCoverBottom > this.playHeight ? this.playHeight : iCoverBottom

      this.oWebControl.JS_RepairPartWindow(
        0,
        0,
        this.width + 1,
        this.playHeight
      ) // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft != 0) {
        this.oWebControl.JS_CuttingPartWindow(
          0,
          0,
          iCoverLeft,
          this.playHeight
        )
      }
      if (iCoverTop != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, this.width + 1, iCoverTop) // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight != 0) {
        this.oWebControl.JS_CuttingPartWindow(
          this.width - iCoverRight,
          0,
          iCoverRight,
          this.playHeight
        )
      }
      if (iCoverBottom != 0) {
        this.oWebControl.JS_CuttingPartWindow(
          0,
          this.playHeight - iCoverBottom,
          this.width,
          iCoverBottom
        )
      }
    },

    previewVideo() {
      let cameraIndexCode = this.cameraIndexCode // 获取输入的监控点编号值，必填
      let streamMode = 0 // 主子码流标识：0-主码流，1-子码流
      let transMode = 1 // 传输协议：0-UDP，1-TCP
      let gpuMode = 0 // 是否启用GPU硬解，0-不启用，1-启用
      let wndId = -1 // 播放窗口序号（在2x2以上布局下可指定播放窗口）

      this.oWebControl.JS_RequestInterface({
        funcName: 'startPreview',
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode.trim(), // 监控点编号
          streamMode: streamMode, // 主子码流标识
          transMode: transMode, // 传输协议
          gpuMode: gpuMode, // 是否开启GPU硬解
          wndId: wndId // 可指定播放窗口
        })
      })
    },

    //创建播放实例
    initPlugin(callback) {
      /* eslint-disable */
      ``
      let that = this
      // 这边报错
      // eslint-disable-next-line no-undef
      that.oWebControl = new WebControl({
        szPluginContainer: 'playBox' + that.videoName, // 指定容器id
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: function() {
          // 创建WebControl实例成功
          that.oWebControl
            .JS_StartService('window', {
              // WebControl实例创建成功后需要启动服务
              dllPath: './VideoPluginConnect.dll' // 值"./VideoPluginConnect.dll"写死
            })
            .then(
              function() {
                // 启动插件服务成功
                that.oWebControl.JS_SetWindowControlCallback({
                  // 设置消息回调
                  cbIntegrationCallBack: that.cbIntegrationCallBack
                })

                that.oWebControl
                  .JS_CreateWnd('playBox' + that.videoName, that.width, that.playHeight)
                  .then(function() {
                    // JS_CreateWnd创建视频播放窗口，宽高可设定
                    that.init(callback) // 创建播放实例成功后初始化
                  })
              },
              function() {
                // 启动插件服务失败
              }
            )
        },
        cbConnectError: function() {
          // 创建WebControl实例失败
          that.oWebControl = null
          that.playText = '插件未启动，正在尝试启动，请稍候...'
          WebControl.JS_WakeUp('VideoWebPlugin://') // 程序未启动时执行error函数，采用wakeup来启动程序
          that.initCount++
          if (that.initCount < 3) {
            setTimeout(function() {
              that.initPlugin()
            }, 3000)
          } else {
            that.playText =
              '插件启动失败，请检查插件是否安装！<a target="_blank" style="color: #30a8ff;text-decoration: underline;" href="http://61.160.81.178:23401/VideoWebPlugin.exe">下载地址(软件大小：62.7MB)</a>'
          }
        },
        cbConnectClose: function(bNormalClose) {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          console.log('cbConnectClose')
          that.oWebControl = null
        }
      })
    },

    // 获取公钥
    getPubKey(callback) {
      this.oWebControl
        .JS_RequestInterface({
          funcName: 'getRSAPubKey',
          argument: JSON.stringify({
            keyLength: 1024
          })
        })
        .then((oData) => {
          if (oData.responseMsg.data) {
            this.pubKey = oData.responseMsg.data
            callback()
          }
        })
    },

    // 推送消息
    cbIntegrationCallBack(oData) {
      console.log(oData, '推送消息')
    },

    // RSA加密
    setEncrypt(value) {
      /* eslint-disable */
      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.pubKey)
      return encrypt.encrypt(value)
    },

    //初始化
    init(callback) {
      let that = this
      this.getPubKey(() => {
        //  请自行修改以下变量值
        let appkey = this.appkey // 综合安防管理平台提供的appkey，必填
        let secret = that.setEncrypt(this.secret) // 综合安防管理平台提供的secret，必填
        let ip = this.ip // 综合安防管理平台IP地址，必填
        let playMode = this.playMode // 初始播放模式：0-预览，1-回放
        let port = 444 // 综合安防管理平台端口，若启用HTTPS协议，默认443
        let snapDir = 'D:\\SnapDir' // 抓图存储路径
        let videoDir = 'D:\\VideoDir' // 紧急录像或录像剪辑存储路径
        let layout = this.layout // playMode指定模式的布局
        let enableHTTPS = 1 // 是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
        let encryptedFields = 'secret' // 加密字段，默认加密领域为secret
        let showToolbar = 1 // 是否显示工具栏，0-不显示，非0-显示
        let showSmart = 1 // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        let buttonIDs = this.buttonIDs // 自定义工具条按钮
        // /// 请自行修改以上变量值
        that.oWebControl
          .JS_RequestInterface({
            funcName: 'init',
            argument: JSON.stringify({
              appkey: appkey, // API网关提供的appkey
              secret: secret, // API网关提供的secret
              ip: ip, // API网关IP地址
              playMode: playMode, // 播放模式（决定显示预览还是回放界面）
              port: port, // 端口
              snapDir: snapDir, // 抓图存储路径
              videoDir: videoDir, // 紧急录像或录像剪辑存储路径
              layout: layout, // 布局
              enableHTTPS: enableHTTPS, // 是否启用HTTPS协议
              encryptedFields: encryptedFields, // 加密字段
              showToolbar: showToolbar, // 是否显示工具栏
              showSmart: showSmart, // 是否显示智能信息
              buttonIDs: buttonIDs // 自定义工具条按钮
            })
          })
          .then((oData) => {
            that.oWebControl.JS_Resize(that.width, that.playHeight) // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            if (callback) {
              callback()
            }
          })
      })
    }
  }
}
</script>

<style lang='less' scoped>
::v-deep .el-form-item {
  margin-bottom: 4px;
}
</style>
