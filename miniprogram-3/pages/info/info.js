// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_path:'/img/gold.png',
    flag:true,
    src:'/src/BackButtonSound.mp3',
    check:true,
    agg:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    setTimeout(function(){
     that.setData({
      flag:false
     });
   }, 3300);
  },
  start(){
    if(this.data.agg){
    this.play();
    wx.navigateTo({
      url: '../index/index',
    })
  }else
  {
    wx.showToast({
      title: '请同意相关协定',
      image:'/img/tree1.png',
      duration: 1000,
    })
  }
  },
  play(){
    let audio = wx.createInnerAudioContext();
    audio.src = this.data.src;
    audio.play();
  },
  checkboxchange() {
    var temp=!(this.data.agg);
    this.setData({
      agg:temp,
    })
    console.log(temp)
  }
})