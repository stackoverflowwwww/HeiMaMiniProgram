const request = require("../../request/index.js");
import regeneratorRuntime from '../../lib/runtime/runtime';
import _fn from '../../utils/_fn';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  goods_id: 0,
  goodsInfo: {},
  collectInit:false, //页面刚加载时的收藏状态
  async getGoodsDetail() {
    const result = await request.request({
      url: '/goods/detail',
      data: {
        goods_id: this.goods_id
      }
    });
    this.goodsInfo = result; //保存完整数据，方便其他业务逻辑实现
    this.setData({
      // 只储存需要渲染的数据
      goodsObj: {
        goods_name: result.goods_name,
        goods_price: result.goods_price,
        // iphone部分手机不支持webp图片格式，所以进行后缀替换(前提是后台有jpg格式的图片)
        goods_introduce: result.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: result.pics
      }
    });
  },
  // 点击轮播图进行预览的事件
  handlePreviewImg(e) {
    const pics = this.goodsInfo.pics.map((v) => {
      return v.pics_mid;
    });
    const {
      index
    } = e.currentTarget.dataset;
    wx.previewImage({
      urls: pics,
      current: pics[index]
    })
  },
  // 购物车添加事件
  handleCartAdd() {
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    if (index === -1) {
      // 原始购物车不存在该商品
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true; //购物车选中状态
      cart.push(this.goodsInfo);
    } else {
      // 已存在该商品
      cart[index].num++;
    }
    // 重新添加至缓存
    wx.setStorageSync('cart', cart);
    // 添加弹窗提示
    wx.showToast({
      title: '已添加',
      icon: 'success',
      mask: true //禁止用户在这期间的操作
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goods_id = options.goods_id;
    this.getGoodsDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const options = _fn.getOptionsOnShow(); //获取当前页面的options，因为在onShow中不能直接传递options参数
    const {
      goods_id
    } = options;
    let collect = wx.getStorageSync('collect') || [];
    let isCollect = collect.some((v) => {
      return v.goods_id == goods_id;
    });
    this.collectInit=isCollect;
    this.setData({
      isCollect
    });
  },
  handleShouchangTap() { //点击收藏的处理事件
    this.setData({
      isCollect: !this.data.isCollect
    });
    const {
      isCollect
    } = this.data;
    if (isCollect) {
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      })
    }
  },
  onHide: function () { //在离开页面时才更新缓存，避免频繁操作读取缓存
    this.updateCollectState();
  },
  onUnload() { //在离开页面时才更新缓存，避免频繁操作读取缓存
    this.updateCollectState();
  },
  updateCollectState() {
    const {
      isCollect
    } = this.data;
    if(this.collectInit==isCollect){ //如果最终的收藏状态与初始值没变化，则结束函数
      return;
    }
    let collect = wx.getStorageSync('collect') || [];
    if (isCollect) { //离开页面时是收藏状态
      //更新缓存
      // if (!collect.some((v) => v.goods_id == this.goods_id)) { //如果原先没有则更新
      //由于上面的判断条件（初始与最终收藏状态有差别），所以缓存中一定没有该商品
        //添加一些属性，清除一些无关属性
        let goodsObj = this.data.goodsObj;
        goodsObj.goods_small_logo = goodsObj.pics[0].pics_sma;
        goodsObj.goods_id = this.goods_id;
        delete goodsObj.goods_introduce;
        delete goodsObj.pics;

        collect.push(goodsObj);
        wx.setStorageSync('collect', collect);
      // }
    } else { //离开页面时是不收藏状态
      const i = collect.findIndex(v => v.goods_id == this.goods_id);
      // if (i >= 0) { //如果缓存的收藏商品中有该商品则应去除
      //由于上面的判断条件（初始与最终收藏状态有差别），所以缓存中一定有该商品
        collect.splice(i, 1);
        wx.setStorageSync('collect', collect);
      // }
    }

  }
})