//app.js
import req from "./lib/request.js"

App({
  onLaunch: function () {
  },
  onShow: function (options) {
    if (options && options.scene == 1038) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },
  globalData: {
    userInfo: null
  },
  req: req
})