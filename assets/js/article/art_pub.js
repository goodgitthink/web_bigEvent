$(function() {

  var layer = layui.layer
  var form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 定义获取文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 调用 form.render() 方法
        form.render()
      }
    })
  }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
  
    // 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮添加点击事件
    $('#btnChooseImage').on('click',function() {
      $('#coverFile').click()
    })

    // 获取 coverFile 的change事件
    $('#coverFile').on('change',function(e) {
      var file = e.target.files
      if (file.length === 0) {
        return 
      }
      var newImgURL = URL.createObjectURL(file[0])
      $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布'

    // 为存为草稿按钮添加提交事件
    $('#btnSave2').on('click',function() {
      art_state = '草稿'
    })

    // 基于表单创建FormData对象
    $('#form-pub').on('submit',function(e) {
      e.preventDefault()
      var fd = new FormData($(this)[0])

      fd.append('state',art_state)

      // fd.forEach(function(v,k) {
      //   console.log(k=v);
      // }) 
      $image
           .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
           }).toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            fd.append('cover_img',blob)
            publishArticle(fd)

         })
      })
      // 定义发布文章的方法
      function publishArticle(fd) {
        $.ajax({
          method: 'POST',
          url: '/my/article/add',
          data: fd,
          contentType: false,
          processData: false,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('文章发布失败！')
            }
            layer.msg('文章发布成功！')
            location.href = '/大事件项目/article/art_list.html'
          }
        })
      }

    

})