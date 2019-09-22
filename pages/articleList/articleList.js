var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    articleList: [],
    labelId: 0,
    labelName: '',
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
      that.setData({
        labelName: options.labelName
      })
    }

    this.getarticleList();
    this.getLabel()

  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      var article = res.target.dataset.article
      return {
        title: article.title,
        imageUrl: article.coverUrl,
        path: '/pages/article/article?id=' + article.id
      }
    }

    return {
      title: '来架构师的小院，喝喝茶，谈谈技术',
      path: '/pages/articleList/articleList?labelId=' + this.data.labelId + '&labelName' + this.data.labelName
    }
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
  },
  collectArticle: function(event) {
    var article = event.target.dataset.article

    let that = this;
    util.request(api.ArticleCollect, {
      action: 1,
      articleId: article.id
    }, "POST")
    .then(function(res) {
      if (res.errcode === '0') {
        that.refreshCollectionState(article, 1)
      }
    }); 
  },
  uncollectArticle: function(event) {
    var article = event.target.dataset.article

    let that = this;
    util.request(api.ArticleCollect, {
      action: 0,
      articleId: article.id
    }, "POST")
    .then(function(res) {
      if (res.errcode === '0') {
        that.refreshCollectionState(article, 0)
      }
    });
  },
  refreshCollectionState: function(article, collected){
    for(var i = 0; i < this.data.articleList.length; i++){
      if(article.id == this.data.articleList[i].id){
        this.data.articleList[i].collected = collected
      }
    }
    this.setData({
      articleList: this.data.articleList
    })
  }
})