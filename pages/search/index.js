import request from '../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false, //决定取消按钮的存在
    inpValue:''
  },
  timeId:-1,
  handleInput(e){ //输入框输入事件，当输入值变化时就会触发该事件
    let {value}=e.detail; //获取输入框的值
    let {isFocus}=this.data;
    value=value.trim();
    if(!value){ //值不合法
      if(isFocus){ //避免没必要的更新data值(耗费时间)
        isFocus=false;
        this.setData({isFocus});
      }
      return;
    }
    if(!isFocus){//避免没必要的更新data值(耗费时间)
      isFocus=true;
      this.setData({isFocus});
    }
    clearTimeout(this.timeId);
    this.timeId=setTimeout(()=>{ //添加定时器，避免输入一变化就立刻触发搜索请求（防抖）
    //根据value请求数据
    request.request({
      url:'/goods/qsearch',
      data:{
        query:value
      }
    }).then((res)=>{
      this.setData({goods:res});
    });
    },1000);
  },

  //点击取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    });
  }
})