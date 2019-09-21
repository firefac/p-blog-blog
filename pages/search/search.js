var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    lableList: [],
    keywrod: '',
    searchStatus: false,
    articleList: [],
    defaultKeyword: {},
    pageNum: 1,
    pageSize: 20,
    lastPage: false
  },
  //事件处理函数
  closeSearch: function() {
    wx.navigateBack()
  },
  clearKeyword: function() {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function() {

    this.getSearchKeyword();
  },
  inputFocus: function() {
    this.setData({
      searchStatus: false,
      articleList: []
    });
  },
  getSearchKeyword() {
    let that = this;
    util.request(api.ArticleLabel, {
      pageNum: 1,
      pageSize: 30
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          lableList: res.data
        });
      }
    });
  },
  getArticlesList: function() {
    let that = this;
    util.request(api.ArticleList, {
      title: that.data.keyword,
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          searchStatus: true,
          articleList: that.data.articleList.concat(res.data.list),
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
        title: '没有更多商品了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }else{
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getArticlesList();
    }
  },
  onKeywordTap: function(event) {
    wx.navigateTo({
      url: "/pages/articleList/articleList?labelId=" + event.target.dataset.keyword.id + "&labelName=" + event.target.dataset.keyword.name
    });
  },
  getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
    }
    this.setData({
      keyword: keyword,
      pageNum: 1,
      articleList: []
    });

    this.getArticlesList();
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})