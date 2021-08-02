// const user_type=[
//     {
//    value: 'A',
//    name: '后台管理'
//  },
//     {
//    value: 'T',
//    name: '讲师'
//  },
//     {
//    value: 'S',
//    name: '学员'
//  }
//   ] 

import {
  getSessionUserType
} from '@/utils/auth'

export function getUserType() {
  return getSessionUserType()
}

//根据value返回user_type的名称
export function filterUserTypeName(valueList) {

  let userType = getSessionUserType()
  let userTypeName = ''
  valueList.forEach(element => {
    userType.forEach(item => {
      if (item.code == element)
        userTypeName += ' ' + item.name
    })
  })
  return userTypeName
}


//系统角色类型code，固定的
const arry_user_type = ['Student', 'Teacher', 'Admin']
export {
  arry_user_type
}
//允许登录的用户角色code
const allow_login_user_role_code = ['Teacher', 'Admin']
export {
  allow_login_user_role_code
}
