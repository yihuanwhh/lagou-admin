import positionTpl from '../views/position-list.html'
import positionAddTpl from '../views/position-add.hbs'
import positionUpdateTpl from '../views/position-update.hbs'
import oAuth from '../utils/oAuth'
import randomstring from 'randomstring'
import _ from 'lodash'

export const render = async (req, res, next) => {
    let result = await oAuth()
    if (result.data.isSignin) {
        let page = req.query && req.query.page || 0
        let pagesize = req.query && req.query.pagesize || 5
        let keywords = req.query && req.query.keywords || ''
        $.ajax({
            url: '/api/position/find',
            headers: {
                'X-Access-Token': localStorage.getItem('token')
            },
            data: {
                page,
                pagesize,
                keywords
            },
            success(result) {
                let list = template.render(positionTpl, {
                    data: result.data.result,  //显示数据
                    hasResult: result.data.result.length > 0, //数据为空显示提示
                    url: location.hash.split('?')[0],  //翻页链接的路径
                    total: result.data.total,//配合最后一页删除处理
                    page: ~~page, //当前页
                    pagesize,  //每页数据条数
                    keywords,  //搜索关键字
                    pagecount: _.range(1,Math.ceil(result.data.total / ~~pagesize) + 1)  //页码数组 
                })
                console.log(result)
                res.render(list)
            }
        })
        bindPositionListEvent(res)
    } else {
        res.go('/')
    }


}

export const add = (req, res, next) => {
    //渲染添加页面
    res.render(positionAddTpl({}))
    bindPositionAddEvent(res)
}

//为列表页面的按钮绑定事件
function bindPositionListEvent(res) {
    //为添加按钮绑定事件
    $('#router-view').off('click', '#addbtn').on('click', '#addbtn', (e) => {
        console.log(1)
        //跳转添加的前天路由
        res.go('/position_add')
    })
    //为删除按钮绑定事件
    $('#router-vieiw').off('click', '.btn-delete').on('click', '.btn-delete', function (e) {
        $.ajax({
            url: '/api/position',
            type: 'DELETE',
            data: {
                id: $(this).closest('tr').attr('data-id')
            },
            headers: {
                //将token放进header里边传入后台，判断是否有权限进行删除
                'X-Access-Token': localStorage.getItem('token')
            },
            success: (result) => {
                //分页逻辑，获取req.query中的page，pagesize，keywords作为分页的依据，如果没有使用默认值
                let { page = 0 ,pagesize = 5,keywords=''} = req.query || {}
                let total = ~~$(this).closest('tr').attr('data-total')

                page = (page * pagesize === total - 1) && (page > 0) ? page -1 : page

                if(result.ret) {
                    result.gp('/position' + randomstring.generate(7) + `?page=${page}&pagesize=&{pagesize}&keywords=${keywords || ''}`)
                } else {
                    alert(result.data)
                }
            }
        })
    })
    $('#router-view').off('click','.btn-updata').on('click','.btn-update',function(e){
        res.go('/position_update/' + $(this).closest('tr').attr('data-id'))
    })
    $('#router-view').off('clcik','#possearch').on('click','#possearch',function(e){
        res.go('/position/1/' + `?keywords=${('#keywords').val()}`)
    })
}

//为添加页面的按钮绑定事件
function bindPositionAddEvent(res) {
    $('#posback').off('click').on('click', (e) => {
        res.back()
    })
    $('#possubmit').off('click').on('click', (e) => {
        $('#possave').ajaxSubmit({
            resetForm : true,
            headers:{
                'X-Access-Token':localStorage.getItem('token')
            },
            success(result) {
                if(result.ret) {
                    res.back()
                } else {
                    alert(result.data)
                }
            }
        })
    })
}