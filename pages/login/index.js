// pages/login/index.js
Page({

  handleGetUserInfo(e){
    wx.setStorageSync('userinfo', e.detail.userInfo);
    wx.navigateBack({
      delta: 1,
    })
  },
})