const db = require('../utils/db')

class UserModel {
    constructor() {
        this.userModel =  db.model('users',{
            username : String,
            password : String
        })
    }
    //数据存储
    save(data) {
        //实例化一个model，同时传入要插入的数据
        const users = new this.userModel(data)
        console.log(data)
        //执行插入操作
        return users.save()
    }

    //查询单个用户数据
    select(data) {
        return this.userModel.findOne({username:data.username})
    }
}


module.exports = new UserModel()
