// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: "" //问题提交文本域中的值
  },
  // 上传后的图片在服务器中的路径数组
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    const {
      index
    } = e.detail;
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => {
      v.isActive = (index == i);
    });
    this.setData({
      tabs
    });
  },
  //点击"+"号添加图片
  handleChooseImg() {
    wx.chooseImage({ //调用小程序内置api
      count: 9, //一次最多选多少张
      sizeType: ['original', 'compressed'], //图片尺寸，原始还是经压缩过的
      sourceType: ['album', 'camera'], //图片来源
      success: (res) => {
        this.setData({
          chooseImgs: this.data.chooseImgs.concat(res.tempFilePaths)
        });
      }
    })
  },
  handleRemoveImg(e) { //点击删除图片时的处理函数
    const {
      src
    } = e.detail;
    let {
      chooseImgs
    } = this.data;
    const ind = chooseImgs.indexOf(src);
    chooseImgs.splice(ind, 1);
    this.setData({
      chooseImgs
    });
  },
  handleTextInput(e) { //获取实时变化的输入文本(表单值不会自动更新到data域里)
    this.setData({
      textVal: e.detail.value
    });
  },
  handleFormSubmit() { //处理点击提交按钮的事件
    // 1 获取文本域的内容 图片数组
    const {
      textVal,
      chooseImgs
    } = this.data;
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }

    // 准备上传图片 到专门的图片服务器 
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    //上传文件
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          filePath: v,
          name: 'file',
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          success: (res) => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            // 所有的图片都上传完毕了才触发  
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              //  提交都成功了
              // 重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });

            }
          },
          fail: (err) => {
            console.log(err);
          }
        })

      });

    }else{ //没有图片
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }
  }
})