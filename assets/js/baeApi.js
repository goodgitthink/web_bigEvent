// 在这个函数中，可以拿到我们提供给ajax的配置对象
$.ajaxPrefilter(function(options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  
  // 为有权限的的接口设置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  options.complete =  function(res) {
    if (res.responseJSON.status === 1 &&
      res.responseJSON.message === '身份认证失败！') {
       //  强制清空token
       localStorage.removeItem('token')
       // 强制跳转到登录页面
       location.href = 'login.html'
      }
  }
})