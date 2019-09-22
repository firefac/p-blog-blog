var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    article: {}
  },
  onShareAppMessage: function() {
    return {
      title: this.data.article.title,
      path: '/pages/articleList/articleList?id=' + this.data.id
    }
  },
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: parseInt(options.id)
      });
      this.getArticleInfo();
    }
  },
  // 获取商品信息
  getArticleInfo: function() {
    let that = this;
    util.request(api.ArticleDetail, {
      id: that.data.id
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          article: res.data
        });

        if(res.data.type === 1){
          WxParse.wxParse('detail', 'html', res.data.longContent, that);
        }
      }
    });
  },

 
  onShow: function() {
    
  },

  
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  onReady: function() {
    // 页面渲染完成

  }

})