## notify 组件Demo

### 使用方法

1. 目录：[component/notify-top](/component/notify-top) 下引入以下五个文件

    `iconfont.wxss`

    `notify-top.js`

    `notify-top.json`

    `notify-top.wxml`

    `notify-top.wxss`
2. 在需要引入组件的页面中的 `json` 文件中配置如下：
    
    ```json
    "usingComponents": {
      "notify-top": "../../component/notify-top/notify-top"
    }
    ```
3. 在 `wxml` 中使用：
    
    ```html
    <notify-top bind:taphandle="notify"></notify-top>
    ```
4. 在 `js` 中指明 `taphandle` 事件
    
    ```js
    // ···
    notify: function(e) {
      console.log(e.detail.fromId)
    }
    // ···
    ```

### 事件

|    名称     |  是否必须  |   类型    |   参数    |
| ---------- |  -------  | -------- | -------- |
| taphandle  |   true    | Function | e（小程序中的点击事件event |