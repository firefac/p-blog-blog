// 以下是业务服务器API地址
// 本机开发时使用
//var WxApiRoot = 'http://test-flower.firefac.cn:8081/openapi/';
// 局域网测试使用
// var WxApiRoot = 'http://192.168.0.101:8080/wx/';
// 云平台测试时使用
// var WxApiRoot = 'https://test-lxb43p1pjra1.firefac.cn/openapi/';
// 云平台上线时使用
 var WxApiRoot = 'https://rsp19j88coh7.firefac.cn/openapi/';

module.exports = {
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  IndexBanner: WxApiRoot + 'home/banner', //首页banner

  ArticleList: WxApiRoot + 'article/list', // 文章列表
  ArticleDetail: WxApiRoot + 'article/detail', // 文章详情
  ArticlePoster: WxApiRoot + 'article/poster', // 文章海报
  ArticleLabel: WxApiRoot + 'article/label', // 文章标签
  ArticleLabelDetail: WxApiRoot + 'article/label/detail', // 文章标签
  ArticleGroup: WxApiRoot + 'article/label/group', // 文章标签组
  ArticleCollect: WxApiRoot + 'article/collect', // 文章收藏
  ArticleMyCollect: WxApiRoot + 'article/collect/mine', // 文章收藏
  ArticleMyFootprint: WxApiRoot + 'article/footprint/mine', // 文章收藏

  AuthLoginByWeixin: WxApiRoot + 'user/auth/miniprogram/login', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号

  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  UserFormIdCreate: WxApiRoot + 'formid/create', //用户FromId，用于发送模版消息

  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  IssueList: WxApiRoot + 'issue/list', //帮助信息

};