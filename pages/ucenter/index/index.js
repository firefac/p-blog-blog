var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    hasLogin: false,
    collectArticleList: [],
    collectPageNum: 1,
    collectPageSize: 10,
    collectLastPage: false,
    footprintArticleList: [],
    footprintPageNum: 1,
    footprintPageSize: 10,
    footprintLastPage: false,
    tabIndex: 0
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getCollectArticleList()
    this.getFootprintArticleList()
  },
  onReady: function() {

  },
  onShow: function() {

    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });

      let that = this;
      util.request(api.UserIndex).then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            order: res.data.order
          });
        }
      });
    }
  },
  onReachBottom() {
    if(this.data.tabIndex == 0){
      if(this.data.collectLastPage){
        wx.showToast({
          title: '没有更多文章了',
          icon: 'none',
          duration: 2000
        });
        return false;
      }else{
        this.data.collectPageNum = this.data.collectPageNum + 1
        this.getCollectArticleList();
      }
      return false;
    }else if(this.data.tabIndex == 1){
      if(this.data.footprintLastPage){
        wx.showToast({
          title: '没有更多文章了',
          icon: 'none',
          duration: 2000
        });
        return false;
      }else{
        this.data.footprintPageNum = this.data.footprintPageNum + 1
        this.getFootprintArticleList();
      }
      return false;    
    }
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },
  goHelp: function () {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },  
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }

        util.request(api.AuthLogout, {}, 'POST');
        app.globalData.hasLogin = false;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    })
  },
  getCollectArticleList: function() {
    var that = this;

    util.request(api.ArticleMyCollect, {
        pageNum: that.data.collectPageNum,
        pageSize: that.data.collectPageSize
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            collectArticleList: that.data.collectArticleList.concat(res.data.list)
          });

          if(res.data.list.length < that.data.collectPageSize){
            that.data.collectLastPage = true
          }
        }
      });
  },
  getFootprintArticleList: function() {
    var that = this;

    util.request(api.ArticleMyFootprint, {
        pageNum: that.data.footprintPageNum,
        pageSize: that.data.footprintPageSize
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            footprintArticleList: that.data.footprintArticleList.concat(res.data.list)
          });

          if(res.data.list.length < that.data.footprintPageSize){
            that.data.footprintLastPage = true
          }
        }
      });
  },
  switchCate: function(event) {
    if(event.detail.index == 0){
      this.data.tabIndex = 0
      return false;
    }

    this.data.tabIndex = event.detail.index;
  },
})