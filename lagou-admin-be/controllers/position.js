var express = require('express')
var app = express()
var server = require('http').Server(app)
const positionModel = require('../models/position')


class PositionController {
    constructor() {

    }

    async save(req, res, next) {
        let result = await positionModel.save(req.body)

        if (result) {
            res.render('succ', {
                data: JSON.stringify({
                    message: '数据保存成功'
                })
            })
        }
    }

    //查询列表所有数据
    async findAll(req, res, next) {
        res.set('Content-Type', 'application/json,charset=utf-8')
        let result = await positionModel.findAll()
        res.render('succ', {
            data: JSON.stringify(result)
        })
    }


    delete(req, res, next) {

    }

    update(req,res,next) {
        
    }
    //根据条件查询某些数据
    async findMany(req, res, next) {
        res.set('Content-Type', 'application/json; charset=utf-8')
    
        // 获取一下前端来的数据
        let { page = 0, pagesize = 10, keywords = '' } = req.query
        let result = await positionModel.findMany({
          page: ~~page, 
          pagesize: ~~pagesize,
          keywords
        })
    
        if (result) {
          res.render('succ', {
            data: JSON.stringify({
              result,
              total: (await positionModel.findAll(keywords)).length
            })
          })
        }
      }
    //查询某一条数据
    async findOne(req, res, next) {
        res.set('Content-Type', 'application/json,charset=utf-8')
        let result = await positionModel.findOne(req.query.id)
        res.render('succ', {
            data: JSON.stringify(result)
        })
    }
}

const positionController = new PositionController()

module.exports = positionController