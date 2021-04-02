$(function () {
    var layar = layui.layar
    var form = layui.form

    initCate()
    initEditor()
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败')
                }
                //调用模板引擎，渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
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

    //为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverfile的change事件获取用户选择文件列表
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        var file = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0])
        //为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布'

    //为存为草稿绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于form表单，快速创建一个formDate对象
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)


        //将封面给裁剪过后的图片输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                publishArticle(fd)
            })

    })
    //发布文章方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交的是formdata格式的数据必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if(res.status !== 0) {
                    return layar.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }

})