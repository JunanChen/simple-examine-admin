import request from '@/utils/axios'

export function getHeaderData() {
    return request({
      url: '/index/header/data',
      method: 'get'
    })
}