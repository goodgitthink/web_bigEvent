$(function() {
  var form = layui.form
  var layer = layui.layer

  form.verify({
    nickneme: function(value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间！';
      }
    }
  })

  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        form.val('formUserInfo',res.data)
      }
    })
  }

  $('#btnReset').on('click',function(e) {
    e.preventDefault()
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit',function(e) {
         e.preventDefault()
         $.ajax({
           method: 'POST',
           url: '/my/userinfo',
           data: $(this).serialize(),
           success: function(res) {
             if (res.status !== 0) {
               return layer.msg('修改用户信息失败！')
             }
             layer.msg('修改用户信息成功！')
             window.parent.getUserInfo()
           }
         })
  })

})