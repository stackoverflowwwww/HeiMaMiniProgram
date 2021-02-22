let ajaxTimes=0;// 同时发送异步请求的次数
module.exports.request = (params) => {
  ajaxTimes++;
  // 请求数据前显示加载图标
  wx.showLoading({//这个同时执行多次无影响，只会显示一次
    title: '加载中',
    mask:true
  })
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        // 关闭加载图标
        if(ajaxTimes==0){
          wx.hideLoading();
        }        
      }
    })
  });
}