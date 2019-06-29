import userTpl from '../views/user.html'
import oAuth from '../utils/oAuth'

class Users {
    constructor() {
        this._init()
    }

    async _init() {
        let result = await oAuth()
        if (result) {
            this._renderUserTpl({ ...result.data })
        } else {
            this._renderUserTpl({ isSignin: false })
        }
    }

    _renderUserTpl({ isSignin = false, username = '' }) {
        let template = Handlebars.compile(userTpl)
        let renderedUserTpl = template({
            isSignin,
            username
        })
        $('.user-menu').html(renderedUserTpl)
        this._user()

    }

    //渲染user模板，绑定登陆注册事件
    _user() {
        let that = this

        //注销移除token
        $('.user-menu').on('click', '#signout', () => {
            localStorage.removeItem('token')
            location.reload()
        })

        //登陆注册点击事件
        $('#user').on('click', 'span', function (e) {
            if ($(this).attr('id') === 'user-signin') {
                $('.box-title').html('登录')
                that._doSign('/api/users/signin', 'signin')
            } else {
                $('.box-title').html('注册')
                that._doSign('/api/users/signup', 'signup')
            }
        })
    }

    //登陆注册的ajax
    _doSign(url, type) {
        $('#confirm').off('click').on('click', async () => {
            return $.ajax({
                url,
                type: 'POST',
                data: $('#user-form').serialize(),
                success: (result, statusCode, jqXHR) => {
                    if (type === 'signin') {
                        this.signinSucc(result, jqXHR)
                    } else {
                        alert(result.data.message)
                    }

                }
            })
        })
    }

    signinSucc(result, jqXHR) {
        if (result.ret) {
            this._renderUserTpl({
                isSignin: true,
                username: result.data.username
            })

            //存储token
            localStorage.setItem('token', jqXHR.getResponseHeader('X-Access-Token'))
        }
    }
}

export default Users