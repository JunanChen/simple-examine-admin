import request from '@/utils/axios'


export function login(params) {
  return request({
    url: '/admin/login',
    method: 'post',
    data:params
  })
}
export function logout(params) {
  return request({
    url: '/admin/logOut',
    method: 'post',
    data:params
  })
}


export function getUserInfo(params) {
  return request({
    url: '/admin/info/get',
    method: 'get',
    data:params
  })
}

export function getUserList(reqData) {
  return request({
    url:'/admin/list/get',
    method: 'get',
    data: reqData
  })
}


