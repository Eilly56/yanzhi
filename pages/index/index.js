const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wh:0,
    position:'front',
    src:'',
    isShowPic:false,
    faceInfo:null,
    map:{
      emotion: {
        angry: '愤怒',
        disgust: '厌恶',
        fear: '恐惧',
        happy: '高兴',
        sad: '伤心',
        surprise: '惊讶',
        neutral: '无表情',
        pouty: '撅嘴',
        grimace: '鬼脸'
      },
      expression: {
        none: '不笑', smile: '微笑', laugh: '大笑'
      },
      gender: {
        male: '男生', female: '女生'
      },
      glasses: {
        none: '无眼镜', common: '普通眼镜', sun: '墨镜'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sysInfo = wx.getSystemInfoSync()
    console.log(sysInfo)
    this.setData({
      wh:sysInfo.windowHeight
    })
  },

  reverseCamera(){
    const newPoistion=this.data.position==='front'?'back':'front'
    this.setData({
      position:newPoistion
    })
  },

  takephoto(){
    const ctx=wx.createCameraContext()
    ctx.takePhoto({
      quality:'high',
      success:(res)=>{
        this.setData({
          src: res.tempImagePath,
          isShowPic: true
        },()=>{
          this.getFaceInfo()
        })
       
      },
      fail:()=>{
        console.log('普照失败')
        this.setData({
          src:''
        })
      }
    })
  },

  albumCamera(){
    wx.chooseImage({
      count:1,
      //原图
      sizeType:['original'],
      //只允许从相册选
      sourceType:['album'],
      success:(res)=>{
        if(res.tempFilePaths.length>0){
          this.setData({
            src:res.tempFilePaths[0],
            isShowPic: true
          },() => {
            this.getFaceInfo()
          })
        }
       
      },
      fail:()=>{
        console.log('选择照片失败！')
      }

    })
  },

  rechoose(){
    this.setData({
      isShowPic:false,
      src:''
    })
  },

  getFaceInfo(){
    const token=app.globalData.access_token
    console.log(token)
    if(!token){
      return wx.showToast({
        tutle:'失败'
      })
    }

    const file =wx.getFileSystemManager()
//如何把用户图片转为base64的格式
const fileStr=file.readFileSync(this.data.src,'base64')
    console.log(fileStr)

wx.request({
  method:'post',
  url:'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token='+token,
  header:{
    'Content-Type':"application/json"
  },
  data:{
    image: fileStr,
    image_type:'BASE64',
    image:fileStr,
    face_field:'age,beauty,expression,gender,glasses,emotion'

  },
  success:(res)=>{
    console.log(res)
    if(res.data.result.face_num<=0){
      return wx.showToast({
        title:'未检测到人脸',
        icon:'none'
      })
    }
    this.setData({
      faceInfo:res.data.result.face_list[0]
    })

  },fail:(res)=>{
    wx.showToast({
      title:'测验失败',
      icon:'none'
    })
  }
})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
