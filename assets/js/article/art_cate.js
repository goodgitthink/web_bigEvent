$(function() {


  // 调用获取文章列表的方法
  initArtCateList()

  // 定义获取文章列表的方法
  var layer = layui.layer
  var form = layui.form

  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
       var htmlStr = template('tpl-table',res)
       $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮添加点击事件
  var indexAdd = null
  $('#btnAddCate').on('click',function() {
   indexAdd = layer.open({
      type: 1,
      area: ['500px','250px'],
      title: '添加文章分类'
      ,content: $('#dialog-add').html()
    });     
  })

  // 用代理的方式为添加按钮添加提交事件
  $('body').on('submit','#form-add',function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        layer.msg('新增分类成功！')
        initArtCateList()
        layer.close(indexAdd)
      }
    })
  })


  // 为编辑按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click','.btn-edit',function() {
    indexEdit = layer.open({
      type: 1,
      area: ['500px','250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })   

    var id = $(this).attr('data-id')
    // console.log(id);
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        // console.log(res);
        // form.val('form-edit',res.data)
        form.val("form-edit", res.data)
      }
    })

    // 通过代理形式，为修改分类的表单绑定提交事件
    $('body').on('submit','#form-edit',function(e) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('修改分类失败！')
          }
          layer.msg('修改分类成功！')
          layer.close(indexEdit)
          initArtCateList()
        }
      })
    })

  })

 // 为删除按钮点击事件
 $('tbody').on('click','.btn-delete',function() {
  var id = $(this).attr('data-id')
  layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
    //do something
    $.ajax({
      method: 'GET',
      url: '/my/article/deletecate/' + id,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('删除失败！')
        }
        layer.msg('删除成功！')
        layer.close(index)
        initArtCateList()
      }
    })
    
    
  });
})

})