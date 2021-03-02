const asyncWx = require('../../utils/asyncWx');
const request = require('../../request/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function () {
    // onLoad只在页面加载时触发,而onShow在设置完地址回到购物车页面时也能触发
    const address = wx.getStorageSync('address');
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    // 获取购物车数据
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    //按道理是可以从购物车页面传来总价格和总数量的数据，以及商品信息。但这比较麻烦，又因为
    //计算量不大，因此在这重新计算
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  //提交订单事件
  handleOrderPay() {
    //先获取用户授权后的token, 用来创建订单
    const token = wx.getStorageSync('token');
    if (!token) { //判断是否已经存在token
      wx.navigateTo({
        url: '/pages/auth/index', //在授权页面获取token
      });
      return;
    }
    //请求头
    const header = {
      Authorization: token
    };
    //请求体
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const goods = this.data.cart.map((v) => {
      return {
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }
    });
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    };
    let order_number = '';
    request.request({ //创建订单
      url: '/my/orders/create',
      method: 'POST',
      data: orderParams,
      header: header
    }).then((result) => {
      //result为订单数据
      order_number = result.order_number; //订单编号
      return request.request({ //发起预支付
        url: '/my/orders/req_unifiedorder',
        method: 'POST',
        header,
        data: {
          order_number
        }
      });
    }).then((result) => {
      const {
        pay
      } = result;
      return asyncWx.requestPayment(pay); //发起微信支付,在这一步会报错，因为发起支付
      //AppID是不在白名单上的，因此没有权限 "requestPayment:fail no permission"
    }).then((result) => {
      return request.request({ //支付成功后还要进行订单状态查询，确保支付订单状态为支
        //付成功
        url: '/my/orders/chkOrder',
        method: 'POST',
        data: {
          order_number
        },
        header
      });
    }).then((result) => {
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });
      //支付成功后要清除购物车中已支付商品
      let cart = wx.getStorageSync('cart');
      cart = cart.filter(v => !v.checked);
      wx.setStorageSync('cart', cart);
      //接着跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      });
    }).catch((err) => {
      wx.showToast({
        title: '支付失败',
        icon: 'none',
        success: () => {
          //支付成功后要清除购物车中已支付商品
          let cart = wx.getStorageSync('cart');
          cart = cart.filter(v => !v.checked);
          wx.setStorageSync('cart', cart);
          //接着跳转到订单页面
          wx.navigateTo({
            url: '/pages/order/index',
          });
        }
      });

    });

  },


})