// 获取操作列的route信息
// obj:当前用户的路由，currentPath:当前页面的路由，title:资源表中约定的title值

let returnRoute = {}

export function getOperationsRoute(obj, currentPath, title, isFirst) {
  title = title.toLowerCase()
  if (isFirst) { returnRoute = {} }
  // let returnRoute ={}
  obj.forEach(element => {
    if (element.children != null && element.children.length > 0) {
      getOperationsRoute(element.children, currentPath, title, false)
    } else if (
      element.meta != null &&
       element.meta.title.toLowerCase() === title && // detail为事先约定好的值，资源表中存该值
       currentPath === element.meta.parent_path.toLowerCase()
    ) {
      returnRoute = element
    }
  })
  return returnRoute
}
