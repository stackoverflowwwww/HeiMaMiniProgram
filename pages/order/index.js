import regeneratorRuntime from '../../lib/runtime/runtime';
import request from "../../request/index";
import _fn from '../../utils/_fn';
// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders:[]
  },
  changeItemByIndex(index){ //改变tabs栏的item
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => {
      v.isActive = i == index;
    });
    this.setData({
      tabs
    });

  },
  // tabs的标题点击事件，由子组件传递过来
  handleTabsItemChange(e) {
    // 获取被点击标题索引
    const {
      index
    } = e.detail;
    // 修改原数组
    this.changeItemByIndex(index);
    this.getOrder(index+1);
  },
  onShow() { // onShow无法接收options参数
    const token = wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }


;
    const {
      type
    } = _fn.getOptionsOnShow();
    this.changeItemByIndex(parseInt(type)-1); //根据页面参数定向tabs栏的item
    this.getOrder(type);
  },
  // onLoad(options) { // onShow无法接收options参数
  //   console.log(options);
  // },
  async getOrder(type) { //根据参数type请求数据
   const res=await request.request({url:"/my/orders/all",data:{type}});
   this.setData({
     orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())})) //将时间戳转换为日期
   })
  }
})