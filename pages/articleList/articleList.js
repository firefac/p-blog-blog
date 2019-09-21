var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    articleList: [],
    labelId: 0,
    label: {},
    pageNum: 1,
    pageSize: 10,
    lastPage: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.labelId) {
      that.setData({
        labelId: parseInt(options.labelId)
      });
    }

    if(options.labelName){
      wx.setNavigationBarTitle({title: options.labelName})
    }

    this.getarticleList();
    this.getLabel()

  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  getLabel: function(){
    var that = this;

    util.request(api.ArticleLabelDetail, {
        id: that.data.labelId
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            label: res.data
          });
        }
      });
  },
  getarticleList: function() {
    var that = this;

    util.request(api.ArticleList, {
        labelId: that.data.labelId,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            articleList: that.data.articleList.concat(res.data.list)
          });

          if(res.data.list.length < that.data.pageSize){
            that.data.lastPage = true
          }
        }
      });
  },
  onReachBottom() {
    if(this.data.lastPage){
      wx.showToast({
        title: '没有更多文章了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }else{
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getarticleList();
    }
  },
  onUnload: function() {
    // 页面关闭
  }
})