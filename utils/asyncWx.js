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

// 传入参数是一个对象，用{content}对其进行解构
module.exports.showModel = ({content}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success: (res) => {
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  });
}

//用户登录的封装
module.exports.login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout: 10000, //超时设置
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  });
}


//发起支付函数封装
module.exports.requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success:(res)=>{resolve(res);},
      fail:(err)=>{reject(err);}
    })
  });
}