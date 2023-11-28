var controll = 2; // 1未生产环境  2为开发环境
let API_BASE_URL = '';
let token = ''
if (controll === 1) {
    API_BASE_URL = '';
} else if (controll === 2) {
    API_BASE_URL = 'http://152.136.158.210:8086';
    //API_BASE_URL = 'http://121.36.107.198:9002';
}
export const request = (options) => {
    return new Promise((resolve, reject) => {
        // const openid = uni.getStorageSync('OPENID')
        if (options.auth === false) {
            token = ''
        } else {
            token = (token || uni.getStorageSync('token'))
            if (!token) {
                uni.navigateTo({
                    url: '../pages/signin/signin'
                })
            }
        }

        uni.request({
            url: API_BASE_URL + options.url,
            method: options.method || "GET",
            data: options.data || {},
            header: {
                token
            },
            dataType: 'json',
            success(res) {
                if (controll === 2) {
                    console.log(options.url,res.data)
                }
                if (res && res.data.status !== 200) {
                    let err = {}
                    switch (res.data.status) {
                        case 301:
                            err.message = '请求的数据具有新的位置且更改是永久的';
                            break
                        case 302:
                            err.message = '请求的数据临时具有不同 URI';
                            break
                        case 304:
                            err.message = '未按预期修改文档';
                            break
                        case 305:
                            err.message = '必须通过代理来访问请求的资源';
                            break
                        case 400:
                            err.message = '请求中有语法问题，或不能满足请求';
                            break
                        case 402:
                            err.message = '所使用的模块需要付费使用';
                            break
                        case 403:
                            err.message = '当前操作没有权限';
                            break
                        case 404:
                            err.message = '服务器找不到给定的资源';
                            break
                        case 407:
                            err.message = '客户机首先必须使用代理认证自身';
                            break
                        case 415:
                            err.message = '请求类型不支持，服务器拒绝服务';
                            break
                        case 417:
                            err.message = '未绑定登录账号，请使用密码登录后绑定';
                            break
                        case 426:
                            err.message = '用户名不存在或密码错误';
                            break
                        case 429:
                            err.message = '请求过于频繁';
                            break
                        case 500:
                            err.message = '服务器内部错误，无法完成请求';
                            break
                        case 501:
                            err.message = '服务不支持请求';
                            break
                        case 502:
                            err.message = '网络错误，服务器接收到上上游服务器无效响应';
                            break
                        case 503:
                            err.message = '服务器无法处理请求';
                            break
                        case 504:
                            err.message = '网络请求超时';
                            break
                        case 999:
                            err.message = '系统未知错误，请反馈给管理员';
                            break
                    } 
                    uni.showToast({
                        title: err.message,
                        icon: 'none',
                        duration: 1000
                    });
                    resolve(res)
                }
                if (res.data.status === 401) {
                    uni.showToast({
                        title: '登录失效，请重新登录',
                        icon: 'none',
                        duration: 2000
                    });
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '../pages/signin/signin'
                        })
                    }, 1500)
                    reject()
                }

                if (res.data.status === 1002) {
                    uni.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                    reject(res.data.msg)
                }
                return resolve(res)
            },
            fail(error) {
                uni.showToast({
                    title: '连接服务器失败!',
                    icon: 'none',
                    duration: 2000
                });
                reject(error);
            }
        })

    })

}
export const upload = (options) => {
    return new Promise((resolve, reject) => {
        token = (token || uni.getStorageSync('token')) ?? 'Not login,redirect to login'
        try {
            const uploadTask = uni.uploadFile({
                url: API_BASE_URL + '/media/' + options.type,
                header: {
                    token
                },
                name: options.type,
                filePath: options.file,
                formData: options.data || {},
                timeout: options.timeout || 1000,
                success: (res) => {
                    resolve(res.data)
                },
                fail: (e) => {
                    console.log(`文件${options.file}上传失败!`)
                    reject(e)
                },
                complete: () => {
                    reject({})
                }
            })
        } catch (e) {
            console.log(e)
            reject({
                status: 100,
                msg: 'fail'
            })
        }
    })

}