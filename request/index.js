let ajaxTimes=0;// 同时发送异步请求的次数
module.exports.request = (params) => {
  let header={...params.header};//保证了能通过参数params传入其他header参数, 实用解构
  //而不是直接令header=params.header是为了防止header为undefined(当params.header为
  //不存在时)
  if(params.url.includes("/my/")){ //当请求路径含有该文件夹，说明为私有路径，需要请求
    //头中有token
    header['Authorization']=wx.getStorageSync('token');
  }
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
      header,
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