const request = require("../../request/index.js");
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单
    leftMenuList: [],
    // 右侧内容
    rightContentList: [],
    currentIndex: 0,
    scrollTop: 0 //右侧内容滚动条的位置, 在点击菜单不同选项时保证新的滚动条在顶端
  },
  Cates: [], //不放在data里面是因为它不与渲染层交互，只是临时资源
  interval: 1000 * 60 * 60 * 24 * 1, //本地数据过期时间, 因为api会不断更新
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //采用缓存方法，避免频繁访问接口

    //在web中，不管什么类型数据都先转成String再存储，而小程序中不存在类型转换
    const Cates = wx.getStorageSync('cates');
    if (!Cates) { //没有旧数据
      this.getCates();
    } else { //有旧数据
      //判断有没有过期,因为api会不断更新
      const interval = this.interval;
      if (Date.now() - Cates.time > interval) { //数据已过期
        this.getCates();
      } else { //数据还没过期
        this.Cates = Cates.data;
        //左侧菜单
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //右侧内容
        let rightContentList = this.Cates[this.data.currentIndex].children;
        this.setData({
          leftMenuList,
          rightContentList
        });
      }
    }
  },

  // 获取分类数据
  async getCates() {
    // request.request({
    //   url: '/categories',
    // }).then((result) => {
    //   this.Cates = result.data.message;
    //   //把接口数据储存到本地缓存中
    //   wx.setStorageSync('cates', {
    //     time: Date.now(),
    //     data: this.Cates
    //   });
    //   //左侧菜单
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   //右侧内容
    //   let rightContentList = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContentList
    //   });
    // });


    // 使用async语法
    const result = await request.request({
      url: '/categories'
    });
    this.Cates = result;
    //把接口数据储存到本地缓存中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    });
    //左侧菜单
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //右侧内容
    let rightContentList = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContentList
    });

  },

  //左侧菜单点击事件
  handleItemTap(e) {
    // 获取被点击菜单的索引值
    const {
      index
    } = e.currentTarget.dataset;
    //获取右边的内容
    let rightContentList = this.Cates[index].children;
    //会根据data里面的值进行动态渲染
    this.setData({
      currentIndex: index,
      rightContentList,
      scrollTop: 0
    });
  }

})