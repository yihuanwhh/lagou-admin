import userTpl from '../views/user.html'

class Users {
    constructor() {
        // this._renderUerTpl({isSignin: false})
        this._init()
    }

    async _init() {
        this._renderUerTpl()
    }

    _renderUerTpl() {
        let template = Handlebars.compile(userTpl)
        let renderedUserTpl = template()
        $('.user-menu').html(renderedUserTpl)
        
    }
}

export default Users