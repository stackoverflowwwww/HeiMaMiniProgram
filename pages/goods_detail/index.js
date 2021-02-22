const request = require("../../request/index.js");
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  goods_id:0,
 goodsInfo:{},
  async getGoodsDetail(){
    const result=await request.request({
      url:'/goods/detail',
      data:{
        goods_id:this.goods_id
      }
    });
    this.goodsInfo=result;//保存完整数据，方便其他业务逻辑实现
    this.setData({
      // 只储存需要渲染的数据
      goodsObj:{
        goods_name:result.goods_name,
        goods_price:result.goods_price,
        // iphone部分手机不支持webp图片格式，所以进行后缀替换(前提是后台有jpg格式的图片)
        goods_introduce:result.goods_introduce.replace(/\.webp/g,".jpg"),
        pics:result.pics
      }
    });
  },
  // 点击轮播图进行预览的事件
  handlePreviewImg(e){
    const pics=this.goodsInfo.pics.map((v)=>{
      return v.pics_mid;
    });
    const {index}=e.currentTarget.dataset;
    wx.previewImage({
      urls: pics,
      current:pics[index]
    })
  },
  // 购物车添加事件
  handleCartAdd(){
    let cart=wx.getStorageSync('cart')||[];
    let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(index===-1){
      // 原始购物车不存在该商品
      this.goodsInfo.num=1;
      cart.push(this.goodsInfo);
    }else{
      // 已存在该商品
      cart[index].num++;
    }
    // 重新添加至缓存
    wx.setStorageSync('cart', cart);
    // 添加弹窗提示
    wx.showToast({
      title: '已添加',
      icon:'success',
      mask:true //禁止用户在这期间的操作
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goods_id=options.goods_id;
    this.getGoodsDetail();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})