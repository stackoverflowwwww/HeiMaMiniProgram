const request = require("../../request/index.js");
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  // tabs的标题点击事件，由子组件传递过来
  handleTabsItemChange(e){
    // 获取被点击标题索引
    const {index}=e.detail;
    // 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>{
      v.isActive=i==index;
    });
    this.setData({
      tabs
    });
  },
  // 获取商品列表数据
  async getGoodsList(){
    const result = await request.request({
      url: '/goods/search',
      data:this.QueryParams
    });
    const total=result.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...result.goods]
    });
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品类别id
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
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
  // 刷新数据
  onPullDownRefresh: function () {
    this.setData({
      goodsList:[]
    });
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 加载下一页
  onReachBottom: function () {
    // 判断有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      wx.showToast({
        title: '没有更多内容',
        duration:1500,
        icon:'none'
      })
    }else{
      // 有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})