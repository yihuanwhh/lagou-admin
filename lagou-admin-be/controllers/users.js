const userModel = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

class UserController {
    hashPassword(pwd) {
        return new Promise((resolve) => {
            bcrypt.hash(pwd, 10, (err, hash) => {
                resolve(hash)
            })
        })
    }
    

    comparePassword(pwd,hash) {
        return new Promise((resolve) => {
            bcrypt.compare(pwd,hash,function(err,res){
                resolve(res)
            })
        })
    }

    genToken(username) {
        //读取公钥
        let key = fs.readFileSync(path.resolve(__dirname,'../keys/rsa_private_key.pem'))
        //返回加密后的签名
        return jwt.sign({username},key,{algorithm:'RS256'})
    }

    async signup(req, res, next) {
        res.set('Content-Type', 'application/json;charset=utf-8')
        
        //查询本次注册的账号是否已存在
        let user = await userModel.select(req.body)
        if(user) {
            res.render('succ',{
                data:JSON.stringify({
                    message:'用户名已存在。'
                })
            })
            return
        }

        //密码加密
        let password  = await userController.hashPassword(req.body.password)
        let result = await userModel.save({ ...req.body,password})

        if (result) {
            res.render('succ', {
                data: JSON.stringify({
                    message: '用户注册成功。'
                })
            })
        } else {
            res.render('fail', {
                data: JSON.stringify({
                    message: '用户注册失败。'
                })
            })
        }
    }

    async signin(req,res,next) {
        res.set('Content-Type', 'application/json;charset=utf-8')
        //根据用户名查询是否有用户信息
        let result = await userModel.select(req.body)
        if (result) {
            //比较密码
            if(await userController.comparePassword(req.body.password,result['password'])){
                //将生成的token写进header传入前端
                res.header('X-Access-Token',userController.genToken(result.username))
                res.render('succ', {
                    data: JSON.stringify({
                        username : result['username'],
                        message: '登录成功。'
                    })
                })
            } else {
                res.render('fail',{
                    data:JSON.stringify({
                        message:'密码错误。'
                    })
                })
            }  
        } else {
            res.render('fail', {
                data: JSON.stringify({
                    message: '用户不存在。'
                })
            })
        }
    }

    
}


const userController = new UserController()

module.exports = userController