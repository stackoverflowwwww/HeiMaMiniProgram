const asyncWx = require("../../utils/asyncWx");
const request = require("../../request/index");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //处理用户点击授权事件。用于获取用户的token
  handleGetUserInfo(e) {
    try {
      //获取用户信息
      const {
        encryptedData,
        rawData,
        iv,
        signature
      } = e.detail;
      //获取小程序登录成功后的code
      asyncWx.login()
        .then((result) => {
          const {
            code
          } = result;
          const loginParams = {
            encryptedData,
            rawData,
            iv,
            signature,
            code
          };
          //返回值可以是普通数据。如果返回值是Promise对象则会将resolve(data)中的data传入下一个then
          return request.request({
            url: "/users/wxlogin",
            data: loginParams,
            method: "post"
          });
        })
        .then((result) => {
          // console.log(result); //返回值是null。因为该账号不是企业账号。且没有添加到该项目对应的白名单。因此无法从url:"/users/wxlogin"创建订单
          result = { //从黑马api里拿下来的例子 
            "user_id": 23,
            "user_email_code": null,
            "is_active": null,
            "user_sex": "男",
            "user_qq": "",
            "user_tel": "",
            "user_xueli": "本科",
            "user_hobby": "",
            "user_introduce": null,
            "create_time": 1562221487,
            "update_time": 1562221487,
            "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
          }
          const {
            token
          } = result;
          console.log(token);
          wx.setStorageSync('token', token);
          //返回上一层
          wx.navigateBack({
            delta: 1, //表示返回上几层
          })
        });
    } catch (error) {
      console.log(error);
    }
  }
})