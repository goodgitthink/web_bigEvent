// 在这个函数中，可以拿到我们提供给ajax的配置对象
$.ajaxPrefilter(function(options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  console.log(options.url);
})