// pages/index/index.js
const app = getApp()
import {config} from '../../lib/config.js'
const md5 = require("../../lib/md5.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchFont:"",
    hasMore:true,
    // 分页
    start:0,
    falsepage:1,
    falseFlag: false,
    // falseFlag: true,
    imgs:[],
    hotimgs:[],
    searchUrl:"https://pic.sogou.com/pics/json.jsp?",
    baseUrl:"https://pic.sogou.com/pic/emo/index.jsp?from=emo_search",
    teachImg:"",
    // 热门搜索词
    hotFonts: [],
    hotSearch:[],
    // 是否出现教程开关
    teachFlag:false,
    testimg:"",
    // 搜索展示搜索页面开关
    showSearch:false,
    // 是否添加跳转图 开关
    jumpFlag:true,
    // 回退开关
    backFlag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseUrl = this.data.baseUrl;
    let imgReg = /<img[^>]+rsrc=['"]([^'"]+)['"]+/g;
    app.req.login().then(res => {
      wx.showLoading({
        title: '正在加载...',
      })
      app.req.hotwords().then(res=>{
          console.log(res);
          // let hotFonts = res.d.Results;
          let hotFonts = [];
          if (res.d.Results.length < 30){
            hotFonts = [{ Name: "斗图", IsHot: 0 }, { Name: "滑稽", IsHot: 1 }, { Name: "要饭", IsHot: 0 }, { Name: "旅行青蛙", IsHot: 1 }, { Name: "皮皮虾", IsHot: 0 }, { Name: "纯文字", IsHot: 0 }, { Name: "熊猫头", IsHot: 0 }, { Name: "假笑男孩", IsHot: 1 }, { Name: "汪星人", IsHot: 0 }, { Name: "喵星人", IsHot: 0 }, { Name: "跳一跳", IsHot: 1 }, { Name: "欧美圈", IsHot: 0 }, { Name: "金馆长", IsHot: 1 }, { Name: "猥琐萌", IsHot: 1 }, { Name: "吃鸡", IsHot: 0 }, { Name: "全是猪", IsHot: 0 }, { Name: "王者荣耀", IsHot: 1 }, { Name: "宋民国", IsHot: 1 }, { Name: "敲里吗", IsHot: 0 }, { Name: "高飞", IsHot: 1 }, { Name: "霉霉", IsHot: 0 }, { Name: "小猪佩奇", IsHot: 0 }, { Name: "皮皮虾", IsHot: 1 }, { Name: "傻儿子", IsHot: 0 }, { Name: "阿鲁", IsHot: 0 }, { Name: "猫和老鼠", IsHot: 0 }, { Name: "萌娃", IsHot: 1 }, { Name: "全是猪", IsHot: 1 }];
          }else{
            hotFonts = res.d.Results;
          }
          let hotSearch = this.getRand(hotFonts);
          this.setData({
            hotSearch: hotSearch,
            hotFonts: hotFonts,
          })
      })
      this.getHotimg();
    }).catch(error => { console.log(error) });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  // 获取首页热门表情
  getHotimg:function(){
    app.req.hotimg().then(res => {
      wx.hideLoading();
      let obj = { actionname: "../../imgs/morexcx.jpg", state: "1" };
      let hotimgs = res.d;
      hotimgs.splice(2, 0, obj);
      hotimgs.map(function (item) {
        item.loadFlag = false;
        return item;
      })
      // console.log(hotimgs);
      if (res.f === 1) {
        this.setData({
          hotimgs: hotimgs,
        })
      }
    })
  },
  // input搜索词改变
  changeSearch: function(e){
    // console.log(e);
    let searchFont =  e.detail.value;
    let showSearch = this.data.showSearch;
    if (searchFont == ""){
      showSearch = false;
      this.setData({
        backFlag: true,
      })
    }
    this.setData({
      searchFont: searchFont,
      showSearch: showSearch,
    })
  },
  // 回退
  backStart:function(){
    this.setData({
      searchFont: "",
      showSearch: false,
      backFlag: true,
    })
    this.getHotimg();
  },
  // 搜索表情
  searchFace: function(){
    let searchFont = this.data.searchFont;
    if (searchFont !== ""){
      this.setData({
        imgs: [],
        start: 0,
        showSearch: true,
        jumpFlag: true,
        backFlag:false,
      })
      this.getImgs();
      app.req.submitAdvid(searchFont).then(res => {
        console.log(res);
      })
    }else{
      this.setData({
        imgs: [],
        start: 0,
        showSearch: false,
        jumpFlag: true,
      })
    }
  },
  getImgs:function(){
    if (!this.data.hasMore) return
    wx.showLoading({
      title: "正在加载...",
    })
    this.setData({
      loadInfo: '正在加载...'
    })
    if (!this.data.falseFlag){
      let searchFont = this.data.searchFont ? this.data.searchFont : "斗图";
      let searchUrl = this.data.searchUrl + "query=" + searchFont + "表情&st=5&start=" + this.data.start + "&xml_len=60&callback=dataCallback&reqFrom=wap_result&";
      let imgReg = /['"]picUrl['"][:]['"]([^'"]+)['"]+/g;
      console.log(searchUrl);
      wx.request({
        url: searchUrl,
        success: res => {
          // console.log("搜索成功", res.data);
          // 获取请求字符串
          let dataDtr = res.data;
          let imgs = this.data.imgs;
          // 正则匹配表情地址
          let imgData = dataDtr.match(imgReg);
          // 是否有更多
          let hasMore = true;
          // 判断是否正则匹配到图片
          if (imgData !== null) {
            // console.log(imgData);
            wx.hideLoading();
            // 对图片地址处理
            console.log("开始处理图片");
            imgData = imgData.map(function (item) {
              if (item.indexOf("sogoucdn.com") == "-1") {
                item = config.host + "/emoji/image?imgUrl=" + item.slice(10, -1);
                // item = item.slice(10, -1);
              } else {
                if (item.indexOf("https") == "-1") {
                  item = "https" + item.slice(14, -1);
                } else {
                  item = item.slice(10, -1);
                }
              }
              return item;
            })
            console.log("处理图片完成");
            // 对处理好的图片加入loadFlag(处理部分图片无法加载)
            let imgLoad = [];
            imgData.forEach(function (item) {
              let obj = {};
              obj.loadFlag = false;
              obj.loading = false;
              obj.imgUrl = item;
              imgLoad.push(obj)
            })
            console.log("打印图片数据");
            imgs = imgs.concat(imgLoad)
            if(this.data.jumpFlag){
              this.setData({
                jumpFlag:false,
              })
              imgs.splice(2, 0, { imgUrl:'../../imgs/more_xcx_demo.gif',jump:"1"});
            }
            // console.log(imgs);
            this.setData({
              imgs: imgs,
              hasMore: hasMore,
              start: this.data.start + 60,
            })
          } else {
            wx.hideLoading();
            this.setData({
              falseFlag: true,
            })
            this.getImgs();
          }
        },
        fail: res => {
          console.log("请求失败了");
          this.setData({
            falseFlag:true,
          });
          this.getImgs();
        }
      })
    }else{
      let searchFont = this.data.searchFont;
      app.req.search(searchFont, this.data.falsepage).then(res => {
        wx.hideLoading();
        console.log(res);
        if (res.f === 1) {
          let imgs = this.data.imgs;
          // 是否有更多
          let hasMore = true;
          let imgData = res.d.Results;
          if (res.d.TotalCount < res.d.Page * res.d.Pagesize) {
            hasMore = false
          }
          imgData = imgData.map(function (item) {
            if (item.PicUrl.indexOf("sogoucdn.com") == "-1") {
              item = config.host + "/emoji/image?imgUrl=" + item.PicUrl;
              // item = item.slice(10, -1);
            } else {
              console.log(item.PicUrl);
              if (item.PicUrl.indexOf("https") == "-1") {
                item = "https" + item.PicUrl.slice(4);
              } else {
                item = item.PicUrl;
              }
            }
            return item;
          })
          console.log(imgData);
          // 对处理好的图片加入loadFlag(处理部分图片无法加载)
          let imgLoad = [];
          imgData.forEach(function (item) {
            let obj = {};
            obj.loadFlag = false;
            // obj.loading = false;
            obj.imgUrl = item;
            imgLoad.push(obj)
          })
          // console.log(imgLoad);
          imgs = imgs.concat(imgLoad);
          if (this.data.jumpFlag) {
            this.setData({
              jumpFlag: false,
            })
            imgs.splice(2, 0, { imgUrl: '../../imgs/more_xcx_demo.gif', jump: "1" });
          }
          this.setData({
            imgs: imgs,
            hasMore: hasMore,
            falsepage: this.data.falsepage + 1,
          })
        }
      }).catch(error => { console.log(error)})
    }
  },
  // 预览表情
  previewImg:function(e){
    let teachImg = e.currentTarget.dataset.imgsrc;
    let page = this.data.searchFont;
    if(page !== ""){
      let action = md5.hex_md5(teachImg);
      let actionName = teachImg;
      app.req.submitAdvid(page, action, actionName).then(res => {
        console.log(res);
      })
    }
    wx.getStorage({
      key: 'teach',
      success: res=>{
        wx.previewImage({
          current: teachImg, // 当前显示图片的http链接  
          urls: [teachImg] // 需要预览的图片http链接列表  
        })  
      },
      fail:res=>{
        this.setData({
          teachImg: teachImg,
          teachFlag: true,
        })
        wx.setStorage({
          key: "teach",
          data: "teach"
        })
      }
    })
  }, 
  // 已经知道
  hasKnow:function(){
    let teachImg = this.data.teachImg;
    this.setData({
      teachFlag: false,
    })
    wx.previewImage({
      current: teachImg, // 当前显示图片的http链接  
      urls: [teachImg] // 需要预览的图片http链接列表  
    })
  },
  // 获取八个随机热词 加入跳转词语
  getRand:function(fonts){
    let newFonts = [];
    let obj = {Name:"更多神器",IsHot:"3"};
    let fixNum;
    for (let i = 0; i < fonts.length;i ++){
      if (fonts[i].IsFix == "1"){
        fixNum = i;
        console.log(fonts[i])
        newFonts.push(fonts[i])
      }
    }
    while (newFonts.length < 8){
      let randNum = Math.floor(Math.random()*fonts.length);
      if (newFonts.indexOf(fonts[randNum]) == "-1" && randNum != fixNum){
        newFonts.push(fonts[randNum])
      }
    }
    newFonts.splice(2, 0, obj);
    return newFonts;
  },
  // 跳转小程序
  gojump:function(){
    wx.navigateToMiniProgram({
      appId: 'wx06623ade52f0ec4b',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success:res=>{
        // 打开成功
        console.log(res);
      },
      fail:res=>{
        console.log(res);
      }
    })
  },
  // 更换热词
  changeFont:function(){
    let hotFonts = this.data.hotFonts;
    let hotSearch = this.getRand(hotFonts);
    this.setData({
      hotSearch: hotSearch,
    })
  },
  // 选择热门关键词
  selectFont: function (e) {
    let searchFont = e.currentTarget.dataset.hotfont;
    this.setData({
      searchFont: searchFont,
    })
    this.searchFace();
  },
  // 图片加载出错
  imageError:function(e){
    let indexnum = e.currentTarget.dataset.indexnum;
    let imgs = this.data.imgs;
    // console.log(indexnum);
    imgs[indexnum].loadFlag = true;
    this.setData({
      imgs: imgs,
    })
  },
  imageLoad:function(e){
    // 处理加载状态
    // let indexnum = e.currentTarget.dataset.indexnum;
    // let imgs = this.data.imgs;
    // imgs[indexnum].loading = true;
    // this.setData({
    //   imgs: imgs,
    // })
  },
  // 热门表情加载出错
  hotError:function(e) {
    console.log(e);
    let indexnum = e.currentTarget.dataset.indexnum;
    let hotimgs = this.data.hotimgs;
    console.log(indexnum);
    hotimgs[indexnum].loadFlag = true;
    console.log(hotimgs);
    this.setData({
      hotimgs: hotimgs,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.searchFont !== ""){
      this.getImgs();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target.dataset.sharesrc);
      var sharesrc = res.target.dataset.sharesrc;
      if (sharesrc){
        sharesrc = sharesrc;
      }else{
        sharesrc = "";
      }
    }
    return {
      title: '',
      path: '/pages/index/index',
      imageUrl: sharesrc,
      success: res => {
        // 转发成功
        if (res.errMsg) {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  }
})