const userModel = require('../models/users')
const bcrypt = require('bcrypt')

class UserController {
    // _hashPassword(pwd) {
    //     return new Promise((resolve, reject) => {
    //         bcrypt.hash(pwd, 10, (err, hash) => {
    //             resolve(hash)
    //         })
    //     })

    // }
    _hashPassword(pwd) {
        return new Promise((resolve) => {
            bcrypt.hash(pwd, 10, (err, hash) => {
                resolve(hash)
            })
        })
    }

    _comparePassword() {

    }

    async signup(req, res, next) {
        res.set('Content-Type', 'application/json;charset=utf8')

        let password = req.body.password

        let hash = await userController._hashPassword(password)

        let result = await userModel.save({ ...req.body, password: hash })
        

        if (result) {
            res.render('succ', {
                data: JSON.stringify({
                    message: '数据插入成功。'
                })
            })
        } else {
            res.render('fail', {
                data: JSON.stringify({
                    message: '数据插入失败。'
                })
            })
        }
    }
}


const userController = new UserController()

module.exports = userController