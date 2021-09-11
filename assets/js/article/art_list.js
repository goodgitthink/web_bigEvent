$(function() {


  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

// 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable()
  initCate()

  // 定义获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        layer.msg('获取文章列表成功！')
        // console.log(res);
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }

  // 定义获取文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败！')
        }
        // 调用模板引擎动态生成选项
        // console.log(res);
        var htmlstr = template('tpl-cate',res)
        // console.log(htmlstr);
        $('[name=cate_id]').html(htmlstr)
        form.render()
      }
    })
  }

  // 为筛选表单绑定提交事件
  $('#form-search').on('submit',function(e) {
      e.preventDefault()
      // 获取选择框内容
      var cate_id = $('[name=cate_id]').val()
      var state = $('[name=state]').val()
      // 为q赋值
      q.cate_id = cate_id
      q.state = state
      // 重新渲染列表
      initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      //注意，这里的 test1 是 ID，不用加 # 号
      elem: 'pageBox', 
      //数据总数，从服务端得到
      count: total ,
      // 每页显示几条数据
      limit: q.pagesize,
      // 选择每页显示几条数据
      limits: [2,3,5,10],
      // 默认选择第几页
      curr: q.pagenum,
      // 增加其他选项
      layout: ['count','limit','prev', 'page', 'next','skip'],
      // 分页发生切换的时候，触发此回调函数
      junp: function(obj,first) {
        // 拿到最新的页码值
       q.pagenum = obj.curr
       q.pagesize = obj.limit
       if (!first) {
         initTable()
       }
      }

    });
  }

  // 用代理的方式给删除按钮绑定点击事件
  $('tbody').on('click','.btn-delete',function () {
    var len = $('.btn-delete').length
    var id = $(this).attr('data-id')
    // 询问是否删除
    layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if (res.status !== 0) {
           return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 
          }
          initTable()
        }
      })
      
      layer.close(index);
    });
  })

})