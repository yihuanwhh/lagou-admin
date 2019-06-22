export default function() {
    //认证
    return $.ajax({
        url : '/api/users/issignin',
        headers:{
            'X-Access-Token' : localStorage.getItem('token') || ''
        },

        success: (result) => {
            return result
        },

        error: (err) => {
            return false
        }
    })
}