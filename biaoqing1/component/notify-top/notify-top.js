const app = getApp()

Component({
  properties: {
  },
  data: {
    className: '',
    animation: {}
  },
  ready: function () {
    this.animation = wx.createAnimation({ duration: 300 })
  },
  methods: {
    close: function (e) {
      this.animation.translateY(-38).step().height(0).step()
      this.setData({ animation: this.animation.export() })
    },
    slove: function (e) {
      console.log('notify-top 组件')
      console.log(e)
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('taphandle', myEventDetail, myEventOption)
    }
  }
})