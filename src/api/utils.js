import request from '@/utils/request'

export function fileupload(data) {
  return request({
    url: '/system/fdfsfileupload/',
    method: 'post',
    data
  })
}

export function import_log(params) {
  return request({
    url: '/system/importlog/',
    method: 'get',
    params: params
  })
}

export function import_log_detail(id) {
  return request({
    url: `/system/importlog/${id}/`,
    method: 'get'
  })
}

export function downloadAttachment(id) {
  return request({
    url: `/system/attachmentinfo/${id}/download/`,
    responseType: 'arraybuffer',
    method: 'get'
  })
}

// 获取后台系统管理中constants.py中的数据
export function getSysconst(code) {
  return request({
    url: '/system/sysconst/',
    method: 'get',
    params: {
      code: code
    }
  })
}

export function getSsoLogin(data) {
  return request({
    url: '/sso_login/',
    method: 'post',
    data
  })
}

export class CkImageUploadAdapter {
  constructor(loader) {
    // Save Loader instance to update upload progress.
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(file => new Promise((resolve, reject) => {
      const fileData = new FormData();
      fileData.append('dir_name', 'question')
      fileData.append('file', file)
      fileupload(fileData).then(response => {
        let resData = {
          //   uploaded: 1, // 写死，不需要改
          //   fileName: file.name, // 图片名
          default: response.data.url //上传到后台后可访问的图片的url
        }
        // let resData = {
        //   default: 'http://172.81.254.42:8000/media/question/20190909/201909091732348472364887.jpg'
        // } 
        resolve(resData);
      }).catch(err => {
        reject(error)
      })
      // let resData = {
      //     uploaded: 1, // 写死，不需要改
      //     fileName: 'filename', // 图片名
      //     url: 'http://172.81.254.42:8000/media/photo/default.png' //上传到后台后可访问的图片的url
      // }
      //resolve(resData);
    }))
  }
}
