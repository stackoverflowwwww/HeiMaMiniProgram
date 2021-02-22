const asyncWx = require('../../utils/asyncWx');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{}
  },
  // 地址选择事件
  handleChooseAddress() {
    asyncWx.chooseAddress() //Promise对象
      .then((result) => {
        // 储存数据,方便其他页面使用
        wx.setStorageSync('address',result);
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // onLoad只在页面加载时触发,而onShow在设置完地址回到购物车页面时也能触发
    const address=wx.getStorageSync('address');
    this.setData({
      address
    });
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