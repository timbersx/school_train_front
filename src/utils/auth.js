import Cookies from 'js-cookie'

const TokenKey = 'Funa_Exam_Backend_Vue'
const SessionKey = 'Top_Menu_Active_Index'
const SessionUserInfoKey = 'Funa_Exam_Backend_User_Info'
const SessionUserFirstRoute = 'funa_exam_from_route'
const UserTypeKey = 'Funa_Exam_User_Type'
export function getToken() {
  //return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  //return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  //return Cookies.remove(TokenKey)
  return sessionStorage.removeItem(TokenKey)
}

export function getTopNavMenuIndex() {
  return sessionStorage.getItem(SessionKey)
}

export function setTopNavMenuIndex(index) {

  return sessionStorage.setItem(SessionKey, index)
}

export function removeTopNavMenuIndex() {
  return sessionStorage.removeItem(SessionKey)
}

export function getUserInfo() {
  let obj = JSON.parse(sessionStorage.getItem(SessionUserInfoKey))
  return obj
}

export function setUserInfo(userInfo) {
  return sessionStorage.setItem(SessionUserInfoKey, userInfo)

}
export function removeUserInfo() {
  return sessionStorage.removeItem(SessionUserInfoKey)
}

export function setUserFirstrout(router) {
  return sessionStorage.setItem(SessionUserFirstRoute, router);
}

export function getUserFirstrout() {
  return sessionStorage.getItem(SessionUserFirstRoute);
}

export function removeUserFirstrout() {
  return sessionStorage.removeItem(SessionUserFirstRoute);
}

export function getSessionUserType() {
  //return Cookies.get(TokenKey)
  return JSON.parse(sessionStorage.getItem(UserTypeKey))
}

export function setSessionUserType(userType) {
  //return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(UserTypeKey, userType)
}

export function removeSessionUserType() {
  //return Cookies.remove(TokenKey)
  return sessionStorage.removeItem(UserTypeKey)
}
