// components/Upimg/Upimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRemoveImg(e){ //不能是匿名函数，this指向有问题
      const {src}=e.target.dataset;
      this.triggerEvent("RemoveImg",{src});
    }
  }
})
