var infomation=[[1,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1],[1,0,1,1,0,0,1,1,1,1,0,0,1,1,0,1],[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],[0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1],[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],[0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],[0,1,0,1,1,0,0,0,0,0,0,1,1,0,1,0],[1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1],[1,0,1,1,1,1,0,0,0,0,1,1,1,1,0,1],[0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0],[0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0],[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],[1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1],[0,1,0,1,1,0,0,0,1,0,0,0,0,1,0,1],[0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0],[0,1,1,1,0,1,0,0,0,0,1,0,1,1,1,0],[0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,],[0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1]];                           //预置20个关卡
var ii=0;                                              //表示现在第几关
var pass=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];    //表示关卡通过，长度为20
Page({
data:{
  color_check:'#808080',
  disabled:false,
  color:[{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''},{color1:''}],
  a:[].concat(infomation[ii]),                         //深拷贝
  src:'/src/LevelWinSound.mp3',   
  src1:'/src/ConFlipSound.mp3',
  src2:'/src/BackButtonSound.mp3',
  src4:'/src/d_gen_bottlebroken.mp3',
  img_path:'/img/Title.png',
  img_path1:'/img/hit.png',
  img_path2:'/img/go.png',
  seq:1,
  imgbg:'/img/OtherSceneBg.png',
  array:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
  type:0,
  choseQuestionBank:"选择关卡",
  mHidden:true,
  gHidden:true,
  index:1
  
},
onLoad: function(options) {
  let that=this;
  that.start();   //渲染页面函数
},
OKK:function(){
  this.setData({
    mHidden:true
  })
  this.play_break();
  var temp=this.check_after_hit();
  if(temp==1){    //返回值为1，表明使用金锤后闯关成功
    this.check(); //调用检查函数
  }
  else{
    if(temp==2){    //返回值为2，表明已经已经通关，无需使用金锤
      wx.showToast({
        title: '无需使用小锤哦!',
        image:'/img/tree1.png',
        duration: 2000,
      })
    }else           //否则闯关失败，输出相应提示信息
    {
    wx.showToast({
      title: '闯关失败!',
      image:'/img/fail.png',
      duration: 2000,
    })
  }
  }
},
go(){             //跳转至困难版的页面

  this.setData({
    gHidden:true
  })
  wx.navigateTo({
    url: '../more/more',
  })
},
Cancel:function(){//点击取消，则关闭模态窗口即可
  this.setData({
    mHidden:true,
    gHidden:true
  })
},
bindPickerChange: function (e) {//选择关卡函数
  var that=this
  ii=e.detail.value;
  that.data.a=[].concat(infomation[ii]);
  var temp=that.Ispass_color(pass[ii]);
  that.setData({
   type: e.detail.value,
   choseQuestionBank: "第"+that.data.array[e.detail.value]+"关",
   seq:(ii*1+1*1)*1,
   disabled:false,
   color_check:temp
  })
  wx.showToast({
    title: '第'+that.data.seq+'关!',
    image:'/img/tree1.png',
    duration: 1000,
  })
  that.start();
 },
a1:function(){          //第一个按钮(以下15个按钮同理)
  if(this.data.index)   //如果音效按钮没有关系
  this.play_flip();     //音效播放
  var that =this;
  that.data.a[0]=(!(that.data.a[0]))*1;//数组元素取反，表明金块翻转
  that.data.a[1]=(!(that.data.a[1]))*1;
  that.data.a[4]=(!(that.data.a[4]))*1;
  var co=that.modify(that.data.a[0]*1);
  var co1=that.modify(that.data.a[1]*1)
  var co2=that.modify(that.data.a[4]*1)
  var temp="color["+0+"].color1";
  var temp1="color["+1+"].color1";
  var temp2="color["+4+"].color1";
      that.setData({  //渲染至页面
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2
      })
  this.check();       //检查是否通关
},
a2:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[1]=(!(that.data.a[1]))*1;
  that.data.a[0]=(!(that.data.a[0]))*1;
  that.data.a[2]=(!(that.data.a[2]))*1;
  that.data.a[5]=(!(that.data.a[5]))*1;
  var co=that.modify(that.data.a[1]*1);
  var co1=that.modify(that.data.a[0]*1);
  var co2=that.modify(that.data.a[2]*1);
  var co3=that.modify(that.data.a[5]*1);
  var temp="color["+1+"].color1";
  var temp1="color["+0+"].color1";
  var temp2="color["+2+"].color1";
  var temp3="color["+5+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3

      })
  this.check();
},
a3:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[2]=(!(that.data.a[2]))*1;
  that.data.a[1]=(!(that.data.a[1]))*1;
  that.data.a[3]=(!(that.data.a[3]))*1;
  that.data.a[6]=(!(that.data.a[6]))*1;
  var co=that.modify(that.data.a[2]*1);
  var co1=that.modify(that.data.a[1]*1);
  var co2=that.modify(that.data.a[3]*1);
  var co3=that.modify(that.data.a[6]*1);
  var temp="color["+2+"].color1";
  var temp1="color["+1+"].color1";
  var temp2="color["+3+"].color1";
  var temp3="color["+6+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3

      })
  this.check();
},
a4:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[3]=(!(that.data.a[3]))*1;
  that.data.a[2]=(!(that.data.a[2]))*1;
  that.data.a[7]=(!(that.data.a[7]))*1;
  var co=that.modify(that.data.a[3]*1);
  var co1=that.modify(that.data.a[2]*1);
  var co2=that.modify(that.data.a[7]*1);
  var temp="color["+3+"].color1";
  var temp1="color["+2+"].color1";
  var temp2="color["+7+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2
      })
  this.check();
},
a5:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[4]=(!(that.data.a[4]))*1;
  that.data.a[5]=(!(that.data.a[5]))*1;
  that.data.a[0]=(!(that.data.a[0]))*1;
  that.data.a[8]=(!(that.data.a[8]))*1;
  var co=that.modify(that.data.a[4]*1);
  var co1=that.modify(that.data.a[5]*1);
  var co2=that.modify(that.data.a[0]*1);
  var co3=that.modify(that.data.a[8]*1);
  var temp="color["+4+"].color1";
  var temp1="color["+5+"].color1";
  var temp2="color["+0+"].color1";
  var temp3="color["+8+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
      [temp3]:co3
      })
  this.check();
},
a6:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[5]=(!(that.data.a[5]))*1;
  that.data.a[4]=(!(that.data.a[4]))*1;
  that.data.a[6]=(!(that.data.a[6]))*1;
  that.data.a[1]=(!(that.data.a[1]))*1;
  that.data.a[9]=(!(that.data.a[9]))*1;
  var co=that.modify(that.data.a[5]*1);
  var co1=that.modify(that.data.a[4]*1);
  var co2=that.modify(that.data.a[6]*1);
  var co3=that.modify(that.data.a[1]*1);
  var co4=that.modify(that.data.a[9]*1);
  var temp="color["+5+"].color1";
  var temp1="color["+4+"].color1";
  var temp2="color["+6+"].color1";
  var temp3="color["+1+"].color1";
  var temp4="color["+9+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3,
     [temp4]:co4
      })
  this.check();
},
a7:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[6]=(!(that.data.a[6]))*1;
  that.data.a[5]=(!(that.data.a[5]))*1;
  that.data.a[7]=(!(that.data.a[7]))*1;
  that.data.a[2]=(!(that.data.a[2]))*1;
  that.data.a[10]=(!(that.data.a[10]))*1;
  var co=that.modify(that.data.a[6]*1);
  var co1=that.modify(that.data.a[5]*1);
  var co2=that.modify(that.data.a[7]*1);
  var co3=that.modify(that.data.a[2]*1);
  var co4=that.modify(that.data.a[10]*1);
  var temp="color["+6+"].color1";
  var temp1="color["+5+"].color1";
  var temp2="color["+7+"].color1";
  var temp3="color["+2+"].color1";
  var temp4="color["+10+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3,
     [temp4]:co4
      })
  this.check();
},
a8:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[7]=(!(that.data.a[7]))*1;
  that.data.a[6]=(!(that.data.a[6]))*1;
  that.data.a[3]=(!(that.data.a[3]))*1;
  that.data.a[11]=(!(that.data.a[11]))*1;
  var co=that.modify(that.data.a[7]*1);
  var co1=that.modify(that.data.a[6]*1);
  var co2=that.modify(that.data.a[3]*1);
  var co3=that.modify(that.data.a[11]*1);
  var temp="color["+7+"].color1";
  var temp1="color["+6+"].color1";
  var temp2="color["+3+"].color1";
  var temp3="color["+11+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3
      })
  this.check();
},
a9:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[8]=(!(that.data.a[8]))*1;
  that.data.a[9]=(!(that.data.a[9]))*1;
  that.data.a[4]=(!(that.data.a[4]))*1;
  that.data.a[12]=(!(that.data.a[12]))*1;
  var co=that.modify(that.data.a[8]*1);
  var co1=that.modify(that.data.a[9]*1);
  var co2=that.modify(that.data.a[4]*1);
  var co3=that.modify(that.data.a[12]*1);
  var temp="color["+8+"].color1";
  var temp1="color["+9+"].color1";
  var temp2="color["+4+"].color1";
  var temp3="color["+12+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3
      })
  this.check();
},
a10:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[9]=(!(that.data.a[9]))*1;
  that.data.a[8]=(!(that.data.a[8]))*1;
  that.data.a[10]=(!(that.data.a[10]))*1;
  that.data.a[5]=(!(that.data.a[5]))*1;
  that.data.a[13]=(!(that.data.a[13]))*1;
  var co=that.modify(that.data.a[9]*1);
  var co1=that.modify(that.data.a[8]*1);
  var co2=that.modify(that.data.a[10]*1);
  var co3=that.modify(that.data.a[5]*1);
  var co4=that.modify(that.data.a[13]*1);
  var temp="color["+9+"].color1";
  var temp1="color["+8+"].color1";
  var temp2="color["+10+"].color1";
  var temp3="color["+5+"].color1";
  var temp4="color["+13+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3,
     [temp4]:co4
      })
  this.check();
},
a11:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[10]=(!(that.data.a[10]))*1;
  that.data.a[9]=(!(that.data.a[9]))*1;
  that.data.a[11]=(!(that.data.a[11]))*1;
  that.data.a[6]=(!(that.data.a[6]))*1;
  that.data.a[14]=(!(that.data.a[14]))*1;
  var co=that.modify(that.data.a[10]*1);
  var co1=that.modify(that.data.a[9]*1);
  var co2=that.modify(that.data.a[11]*1);
  var co3=that.modify(that.data.a[6]*1);
  var co4=that.modify(that.data.a[14]*1);
  var temp="color["+10+"].color1";
  var temp1="color["+9+"].color1";
  var temp2="color["+11+"].color1";
  var temp3="color["+6+"].color1";
  var temp4="color["+14+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3,
     [temp4]:co4
      })
  this.check();
},
a12:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[11]=(!(that.data.a[11]))*1;
  that.data.a[10]=(!(that.data.a[10]))*1;
  that.data.a[7]=(!(that.data.a[7]))*1;
  that.data.a[15]=(!(that.data.a[15]))*1;
  var co=that.modify(that.data.a[11]*1);
  var co1=that.modify(that.data.a[10]*1);
  var co2=that.modify(that.data.a[7]*1);
  var co3=that.modify(that.data.a[15]*1);
  var temp="color["+11+"].color1";
  var temp1="color["+10+"].color1";
  var temp2="color["+7+"].color1";
  var temp3="color["+15+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3
      })
  this.check();
},
a13:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[12]=(!(that.data.a[12]))*1;
  that.data.a[13]=(!(that.data.a[13]))*1;
  that.data.a[8]=(!(that.data.a[8]))*1;
  var co=that.modify(that.data.a[12]*1);
  var co1=that.modify(that.data.a[13]*1);
  var co2=that.modify(that.data.a[8]*1);
  var temp="color["+12+"].color1";
  var temp1="color["+13+"].color1";
  var temp2="color["+8+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2
      })
  this.check();
},
a14:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[13]=(!(that.data.a[13]))*1;
  that.data.a[12]=(!(that.data.a[12]))*1;
  that.data.a[14]=(!(that.data.a[14]))*1;
  that.data.a[9]=(!(that.data.a[9]))*1;
  var co=that.modify(that.data.a[13]*1);
  var co1=that.modify(that.data.a[12]*1);
  var co2=that.modify(that.data.a[14]*1);
  var co3=that.modify(that.data.a[9]*1);
  var temp="color["+13+"].color1";
  var temp1="color["+12+"].color1";
  var temp2="color["+14+"].color1";
  var temp3="color["+9+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3
      })
  this.check();
},
a15:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[14]=(!(that.data.a[14]))*1;
  that.data.a[15]=(!(that.data.a[15]))*1;
  that.data.a[13]=(!(that.data.a[13]))*1;
  that.data.a[10]=(!(that.data.a[10]))*1;
  var co=that.modify(that.data.a[14]*1);
  var co1=that.modify(that.data.a[15]*1);
  var co2=that.modify(that.data.a[13]*1);
  var co3=that.modify(that.data.a[10]*1);
  var temp="color["+14+"].color1";
  var temp1="color["+15+"].color1";
  var temp2="color["+13+"].color1";
  var temp3="color["+10+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2,
     [temp3]:co3
      })
  this.check();
},
a16:function(){
  if(this.data.index)
  this.play_flip();
  var that =this;
  that.data.a[15]=(!(that.data.a[15]))*1;
  that.data.a[14]=(!(that.data.a[14]))*1;
  that.data.a[11]=(!(that.data.a[11]))*1;
  var co=that.modify(that.data.a[15]*1);
  var co1=that.modify(that.data.a[14]*1);
  var co2=that.modify(that.data.a[11]*1);
  var temp="color["+15+"].color1";
  var temp1="color["+14+"].color1";
  var temp2="color["+11+"].color1";
      that.setData({
     [temp]:co,
     [temp1]:co1,
     [temp2]:co2
      })
  this.check();
},
check(){        //检查是否通关函数
  for(var i=0;i<16;i++){
    if(this.data.a[i]==1){
      continue;
    }
      else{
        return;   //通关失败
      }
  }
  pass[ii]=1;     //标记为1，表明这一关通过
  var temp=this.Ispass_color(pass[ii]);
  this.setData({
    disabled:true,
    color_check:temp,
    img_path:'/img/LevelCompletedDialogBg.png'//将成功的图片渲染至页面
  })
  this.play_succeed();    //播放成功音效
  wx.showToast({          //输出消息
    title: 'successful!',
    image:'/img/info.png',
    duration: 4000,
  })
},
modify(e){//颜色改变函数
  if(e==1){
    return 'gold';
  }else{
    return 'silver';
  }
},
start(){//渲染金块颜色函数
  for(var i=0;i<16;i++){
    var temp="color["+i+"].color1";
    var co=this.modify(this.data.a[i])
      this.setData({
        [temp]:co
      })
      
  }
},
change:function(){
  this.data.index=1*(!(this.data.index));
},
before:function(){//上一关按钮点击事件
  this.play_op();
  if(ii-1>=0){
    ii=ii-1;
  this.data.a=[].concat(infomation[ii]);
  var temp=this.Ispass_color(pass[ii]);
  this.setData({
    seq:this.data.seq-1*1,
    disabled:false,
    color_check:temp,
    choseQuestionBank: "目前为第"+this.data.array[ii]+"关",
    img_path:'/img/Title.png'
  })
  wx.showToast({
    title: '第'+(ii+1*1)+'关!',
    image:'/img/tree1.png',
    duration: 1000,
  })
  this.start()
}
  else{
    wx.showToast({
      title: '已经是第1关了!',
      image:'/img/fail.png',
      duration: 1000,
    })
  }

},
resrart:function(){//重新开始
  this.play_op();
  this.setData({
    a:[].concat(infomation[ii]),
    disabled:false,
    img_path:'/img/Title.png'
  })
  wx.showToast({
    title: '第'+(ii+1*1)+'关!',
    image:'/img/tree1.png',
    duration: 1000,
  })
  this.start()
},
next:function(){//下一关
  this.play_op();
  if((ii*1+1)<20){
    ii=ii*1+1;
  this.data.a=[].concat(infomation[ii]);
  var temp=this.Ispass_color(pass[ii]);
  this.setData({
    seq:this.data.seq+1*1,
    disabled:false,
    color_check:temp,
    choseQuestionBank: "目前为第"+this.data.array[ii]+"关",
    img_path:'/img/Title.png'
  })
  wx.showToast({
    title: '第'+(ii+1*1)+'关!',
    image:'/img/tree1.png',
    duration: 1000,
  })
  this.start()
  }
  else
  {
    wx.showToast({
      title: '已经是最后1关了!',
      image:'/img/fail.png',
      duration: 1000,
    })
  }
},
Ispass_color(e){//通关的标题背景颜色不一样，根据e的值进行返回
  if(e==1)
  return '#7FFFAA';
  else
  return '#808080';
},
check_after_hit(){//利用小金锤帮助通关
  var count=0;
  var ss=[];
  for(var i=0;i<16;i++){//检查0的个数
    if(this.data.a[i]==0){
      ss.push(i);
      count++;
    }
  }
  if(count==2){//0的个数为2，满足通关条件
    console.log("sucess"+ss);
      var temp="color["+ss[0]+"].color1";
      var temp2="color["+ss[1]+"].color1";
      this.data.a[ss[0]]=1;
      this.data.a[ss[1]]=1;
      var co1=this.modify(1)
        this.setData({
          [temp]:co1,
          [temp2]:co1,
        })
    return 1;
  }
  if(count==0){//已经通关
    return 2;
  }
  else//不满足，返回0
  {
    console.log("fail");
    return 0;
  }
},
play_flip(){//金块翻动音效
  let audio = wx.createInnerAudioContext();
  audio.src = this.data.src1;
  audio.play();
},
play_op(){//其余按钮音效
  let audio = wx.createInnerAudioContext();
  audio.src = this.data.src2;
  audio.play();
},
play_succeed(){//成功音效
  let audio = wx.createInnerAudioContext();
  audio.src = this.data.src;
  audio.play();
},
play_break(){//金锤音效
  let audio = wx.createInnerAudioContext();
  audio.src = this.data.src4;
  audio.play();
},
hit:function(){
  this.play_op();
  this.setData({
    mHidden:false
  })
},
hitt:function(){
  this.play_op();
  this.setData({
    gHidden:false
  })
},
backtoinfo(){//跳转至主页
  this.play_op();
  wx.navigateTo({
    url: '../info/info',
  })
}
})