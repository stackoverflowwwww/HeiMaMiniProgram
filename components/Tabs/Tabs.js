// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
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
    handleItemTap(e){
      const {index}=e.target.dataset;
      // 触发Tabs组件中的事件(与外部交互)
      // 第二个参数对应于事件对象的detail属性
      // this指向传入Component构造器的对象
      this.triggerEvent("tabsItemChange",{index});


      // 也可以通过setData改变properties中的值从而进行动态渲染, 但按正常逻辑应该改变外界的数据
      
      // let {tabs}=this.properties;
      // tabs.forEach((v,i)=>{
      //   v.isActive=i==index;
      // });
      // this.setData({
      //   tabs
      // });
    }
  }
})
