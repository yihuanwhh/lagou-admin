import menuTpl from '../views/menu.html'
import homeTpl from '../views/home.hbs'

import Users from './users'

export const render = (req, res, next) => {
  // 转载menu
  $('.sidebar-menu').html(menuTpl)

  // 渲染登录注册
  new Users()
  _signup()
  
  // 返回路由的home页
  res.render(homeTpl({}))
}

//用户注册
function _signup() {
  $('#confirm').on('click',()=> {
    $.ajax({
      url: '/api/users/signup',
      type: 'POST',
      data: $('#user-form').serialize()
    })
  })
}