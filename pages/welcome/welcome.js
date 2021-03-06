const app = getApp()

Page({
  data: {
    enterButton: 0,
    userID: "",
    firstLogin: false,
    code: ""
  },

  onLoad: function (event) {
    console.log("load the welcome page")
    var that=this

    wx.login({
      success: function (res) {
        console.log(res.code)
        that.setData({
          code: res.code
        })
      }
    })

    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo
        })
        console.log(res.userInfo)
      }
    })

    wx.getStorageInfo({
      success: function (res) {
        console.log(res.keys)
        if (res.keys.indexOf('UserID')==-1) {
          that.setData({
            firstLogin: true
          })
        } else {
          that.setData({
            enterButton: 1
          })
          wx.getStorage({
            key: 'UserID',
            success: function (res) {
              console.log(res)
              that.setData({
                userID: res.data
              })
              app.globalData.id = res.data
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },

  userIDInput: function (e) {
    var IDnumber = e.detail.value
    this.setData({
      userID: e.detail.value
    })
    var isCorrect = 0;
    if (IDnumber > 3140000000 && IDnumber < 3180000000) 
        isCorrect = 1;  
    this.setData({
        enterButton: isCorrect
    })
    
  },

  onTapJump: function (event) {

    var tempID = this.data.userID
    var co = this.data.code
    var that = this
    var notJump = false

    if (this.data.enterButton == 1 && this.data.firstLogin == true) {
      wx.request({
        url: 'https://www.horseee.top/login',
        data: {
          UserName: app.globalData.userInfo.nickName,
          StudentID: tempID,
          UserUrl: app.globalData.userInfo.avatarUrl,
          LoginCode : co,
          province: app.globalData.userInfo.province,
          city: app.globalData.userInfo.city
        },
        header: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.statusCode == 500 || res.data == -1) {
            wx.showToast({
              title: '登录出现了小问题',
              image: '/assets/icons/error3.png',
              duration: 2000  
            })
            notJump = true
          }
          else {
            app.globalData.id = res.data;
            wx.setStorage({
              key: 'UserID',
              data: res.data,
            })

            wx.switchTab({
              url: '/pages/index/index',
              success: function () {
                console.log("jump to index success")
              },
              fail: function () {
                console.log("jump failed")
              },
              complete: function () {
                console.log("jump to index complete")
              }
            })

          }
        }
      })
    } else if (this.data.enterButton == 1 && this.data.firstLogin == false){
      wx.switchTab({
        url: '/pages/index/index',
        success: function () {
          console.log("jump to index success")
        },
        fail: function () {
          console.log("jump failed")
        },
        complete: function () {
          console.log("jump to index complete")
        }
      })
    }
  },

  onUnload: function (event) {

  },

  onHide: function (event) {

  },

  onShareAppMessage: function () {
    return {
      title: "L'oreal X A-one",
      desc: "一个答题+美妆的小程序，快来体验吧",
      path: "pages/welcome/welcome"
    }
  },
})