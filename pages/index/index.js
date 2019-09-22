const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    hotArticles: [],
    articles: [],
    groups: [],
    tabIndex: 0,
    pageNum: 1,
    pageSize: 10,
    lastPage: false
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
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.resetData();
    this.getIndexData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  resetData: function() {
    this.setData({
      hotArticles: [],
      articles: [],
      groups: [],
      pageNum: 1,
      pageSize: 10,
      lastPage: false
    })
  },
  getIndexData: function() {
    this.getHotArticlesList();
    this.getArticlesList();
    this.getGroupList();
  },
  onLoad: function(options) {
    this.getIndexData();
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
    for(var i = 0; i < this.data.articles.length; i++){
      if(article.id == this.data.articles[i].id){
        this.data.articles[i].collected = collected
      }
    }

    for(var i = 0; i < this.data.groups.length; i++){
      var articleList = this.data.groups[i].articleList
      if(articleList == undefined || articleList == null){
        continue
      }
      for(var j = 0; j < articleList.length; j++){
        if(article.id == articleList[j].id){
          articleList[j].collected = collected
        }
      }
    }
    this.setData({
      articles: this.data.articles,
      groups: this.data.groups
    })
  },
  getHotArticlesList: function() {
    let that = this;
    util.request(api.IndexBanner)
    .then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          hotArticles: res.data
        })
      }
    });
  },
  naviToBanner:function(event){
    var banner = event.target.dataset.banner

    if(banner.link != null && banner.link != ''){
      wx.navigateTo({
        url: banner.link
      });
    }

  },
  getArticlesList: function() {
    let that = this;
    util.request(api.ArticleList, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {

          that.setData({
            articles: that.data.articles.concat(res.data.list)
          })

          if(res.data.list.length < that.data.pageSize){
            that.data.lastPage = true
          }
        }
      });
  },
  getGroupList: function() {
    let that = this;
    util.request(api.ArticleGroup, {
        pageNum: 1,
        pageSize: 100
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          that.setData({
            groups: res.data
          })
        }
      });
  },
  onReachBottom() {
    if(this.data.tabIndex != 0){
      var group = this.data.groups[this.data.tabIndex - 1]

      if(group.lastPage){
        wx.showToast({
          title: '没有更多文章了',
          icon: 'none',
          duration: 2000
        });
        return false;
      }else{
        group.pageNum = group.pageNum + 1
      }
      
      this.getGroupArticleList()
      return false;
    }

    if(this.data.lastPage){
      wx.showToast({
        title: '没有更多文章了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }else{
      this.data.pageNum = this.data.pageNum + 1
      this.getArticlesList();
    }
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    //wx.hideTabBar({})
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  getCoupon(e) {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index
    util.request(api.CouponReceive, {
      couponId: couponId
    }, 'POST').then(res => {
      if (res.errcode === '0') {
        wx.showToast({
          title: "领取成功"
        })
      }
      else{
        util.showErrorToast(res.errmsg);
      }
    })
  },
  switchCate: function(event) {
    if(event.detail.index == 0){
      this.data.tabIndex = 0
      return false;
    }

    this.data.tabIndex = event.detail.index;

    var group = this.data.groups[this.data.tabIndex - 1]

    if(!group.chooseOne && group.labels.length > 0){
      group.label = group.labels[0]
      group.pageSize = 10
      group.pageNum = 1
      group.lastPage = false
      group.articleList = []
      group.chooseOne = true

      group.labels[0].active = true

      this.getGroupArticleList()
    }
  },
  choseLabel: function(event) {
    var label = event.target.dataset.label
    var group = this.data.groups[this.data.tabIndex - 1]

    group.label = label
    group.pageSize = 10
    group.pageNum = 1
    group.lastPage = false
    group.articleList = []
    group.chooseOne = true

    for(var i = 0; i < group.labels.length; i++){
      if(group.labels[i].active && group.labels[i].id != label.id){
        group.labels[i].active = false
        continue
      }

      if(group.labels[i].id == label.id){
        group.labels[i].active = true
      }
    }
    
    this.getGroupArticleList()
  },
  getGroupArticleList: function() {
    var that = this;

    var group = this.data.groups[this.data.tabIndex - 1]

    util.request(api.ArticleList, {
        labelId: group.label.id,
        pageNum: group.pageNum,
        pageSize: group.pageSize
      }, "POST")
      .then(function(res) {
        if (res.errcode === '0') {
          var group = that.data.groups[that.data.tabIndex - 1]

          group.articleList = group.articleList.concat(res.data.list)

          that.setData({
            groups: that.data.groups
          });

          if(res.data.list.length < group.pageSize){
            group.lastPage = true
          }
        }
      });
  },
})