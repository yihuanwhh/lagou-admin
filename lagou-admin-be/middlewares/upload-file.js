const multer = require('multer')
const path = require('path')
const randomString = require('node-random-string')

class FileUpload {
    filefilter (req,file,cb) {
        let mimeRegxp = new RegExp('(image\/png|image\/jpg|image\/jpeg|image\/gif)','gi')
        if(mimeRegxp.test(file.mimetype)) {
            cb(null,true)
        } else {
            cb(null,false)
            cb(new Error('文件格式不正确'))
        }
    }
    uploadFile(req,res,next) {
        res.set('Content-Type','application/json;charset=utf-8')\
        let filename = ''
        let storage = multer.diskStorage({
            destination:(req,file,cb)=> {
                let fileOriName = file.originalname
                let lastDot = fileOriName.lastIndexOf('.')
                let extFilename = fileOriName.slice(lastDot)
                let rs = randomString({
                    length:10,
                    lowerCase : true
                })
                filename = rs + extFilename

                cb(null,filename)
            }
        })

        var upload = multer({
            storage,
            limits:{
                fileSize:1024*1024*10
            },
            filefilter:FileUpload.filefilter
        }).single('companyLogo')
    }
}