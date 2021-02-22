module.exports.chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      // 不管用户此前是否拒绝授权。不过只能在真机上有此效果。
      // 在模拟器上如果此前用户拒绝授权, 会进入fail函数
      // 此外, openSetting现在不能直接打开, 详见
      // https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};