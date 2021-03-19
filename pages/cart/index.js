const asyncWx = require('../../utils/asyncWx');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  // 地址选择事件
  handleChooseAddress() {
    asyncWx.chooseAddress() //Promise对象
      .then((result) => {
        // 储存数据,方便其他页面使用
        wx.setStorageSync('address', result);
      })
      .catch((err) => {
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
    const address = wx.getStorageSync('address');
    if(address!=''){
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    this.setData({
      address
    });
    }
    // 获取购物车数据
    const cart = wx.getStorageSync('cart') || [];
    this.setCart(cart);
  },


  // 全选点击事件
  handleItemAllChange() {
    let {
      cart,
      allChecked
    } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },


  // 购物车的商品复选框变化处理事件
  handleItemChange(e) {
    const index = e.currentTarget.dataset.index;
    let {
      cart
    } = this.data;
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 商品数量修改事件
  handleItemNumEdit(e) {
    const {
      index,
      operation
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    if (cart[index].num == 1 && operation == -1) {
      asyncWx.showModel({
          content: '您是否删除该商品？'
        })
        .then((res) => {
          if (res.confirm) {
            cart.splice(index, 1);
            // 因为这里是异步操作，所以this.setCart(cart)不能与下面的else语句里的this.setCart(cart)合并在一起放在外层[1]
            this.setCart(cart);
          }
        });
    } else {
      cart[index].num += operation; // 在设置状态变量时可以根据其实际意义进行定义，比如这里的operation就设为-1和+1，方便修改数量
      this.setCart(cart);
    }
    // this.setCart(cart); [1]
  },


  //点击支付事件
  handlePay(){
    const {address}=this.data;
    if(!address.userName){ //判断有没有选择收货地址
      wx.showToast({
        title: '您还没有添加收货地址',
        icon:'none'
      });
      return;
    }
    //判断用户有没有选购商品
    if(this.data.totalNum==0){
      wx.showToast({
        title: '您还没有选择商品',
        icon:'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },


  // 当cart变化后，对购物车页面进行修改的封装函数, 传入变化后的cart参数
  setCart(cart) {
    // 空数组调用every返回true
    // const allChecked=cart.length?cart.every(v=>v.checked):false; //是否全选

    // 在下方循环处理全选内容
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
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