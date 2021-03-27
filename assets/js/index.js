$(function(){
//调用这个getUserInfo函数获取用户信息
    getUserInfo()

    var layer = layui.layer

    $('#btnLogout').on('click',function(){
       //提示用户是否确认退出
       layer.confirm('确定退出登录?', {icon: 3, title:'提示'},
        function(index){
        //do something
        //1. 清空本地存储的 token
        localStorage.removeItem('token')
        //2. 重新跳转到登录页
        location.href = '/login.html'
        layer.close(index);
      });
    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
           if(res.status !== 0) {
               return layui.layer.msg('获取用户信息失败')
           }
           //调用renderAvatar渲染用户头像
           renderAvatar(res.data)
        },
        //无论成功还是失败都会调用complete
        // complete: function(res) {
        //     //在complete 回调中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1. 强制清空 token
        //         localStorage.removeItem('token')
        //         //2. 强制跳转到登录页
        //         location.href = '/login.html'
        //     }
        // }

    })
}
function  renderAvatar(user) {
    //1 获取用户名称
    var name = user.nickname || user.username
    //2 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+ name)
    //3 按需渲染用户头像
    if(user.user_pic !== null) {
        //3.1 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2 渲染文本图像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show

    }
}