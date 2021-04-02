$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(ate)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    //定义补零函数
    function padZero(n) {
        n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//默认请求第一页的数据
        pagesize: 2,//默认每页显示几条数据，2
        cate_id: '',//文章分类id
        state: ''//文章发布状态
    }
    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //通过layui重新渲染表单区域的UI结构
                form.render()
            }

        })
    }

    //为筛选表单绑定 submit事件
    $('form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象Q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件重新渲染表格中的数据
        initTable()
    })
    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total,   //总数居条数
            limit: q.pagesize,  //每页显示几条数据
            curr:   q.pagenum,   //设置默认被选中的分页
            layout: ['count','limit','prve','page','next','skip'],
            limits: [2,3,5,10],

            //分页切换时，触发jump回调
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表，并渲染
                if(!first) {
                    initTable()
                }

            }


        })
     }

     //通过代理的形式，为删除按钮绑定点击事件处理函数
     $('tbody').on('click','.btn-delete',function() {
         //获取删除按钮的个数
         var len = $('.btn-delete').length
         //获取到文章id
         var id = $(this).attr('data-id')

        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //删除数据完成后，需要判断当前页中是否有数据
                    //没数据则让页码-1
                    //重新调initTable() 
                    if(len ===1) {
                        //页码最小值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 :q.pagenum - 1
                        
                    }


                    initTable() 
                }
            })
            
            layer.close(index);
          })
     })

     

})
