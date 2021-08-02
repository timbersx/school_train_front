// 精确搜索相关

// 返回精确查询请求接口使用的data
// litmit :每页显示的行数，默认显示10
// exactSearchData :待处理的精确搜索的条件
export function exactSearchFilterData(limit = 10, offset = 0, exactSearchData) {

  let exactSearchFilter = {
    limit: limit,
    offset: offset
  }
  for (let key in exactSearchData) {
    if (exactSearchData[key].type != '' && exactSearchData[key].type != undefined) {
      switch (exactSearchData[key].type) {
        case key + "__notnull":
          exactSearchFilter[key + "__isnull"] = "False"
          break
        case key + "__isnull":
          exactSearchFilter[key + "__isnull"] = "True"
          break
        case key + "__range":
          if (exactSearchData[key].value_range != '' && exactSearchData[key].value_range != undefined) {
            exactSearchFilter[exactSearchData[key].type] = exactSearchData[key].value_range
          }
          break
        default:
          if (exactSearchData[key].value != '' && exactSearchData[key].value != undefined) {
            exactSearchFilter[exactSearchData[key].type] = exactSearchData[key].value
          }
          break
      }
    }
  }
  return exactSearchFilter
}
