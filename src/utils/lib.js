// 通用方法
const LastPageType = 1 //叶子节点的meta.type
const listRouteType = -2 //list路由的meta.type
import Layout from '@/layout'
import {
  option
} from 'runjs'
import columns_name from '@/lang/zh'
// 格式化菜单
export function formatMenu(list) {

  let res = []
  list.forEach(item => {

    let obj = {
      path: item.path,
      name: item.name,
      meta: item.meta,
      redirect: item.redirect
      // ,
      // type: item.type
    }
    if (item.type != null && item.type != undefined)
      obj.meta.type = item.type
    if (item.parent_id != null && item.parent_id != undefined)
      obj.parent_id = item.parent_id
    if (item.hidden != null && item.hidden != undefined)
      obj.hidden = Boolean(item.hidden)
    // 惰性递归 **** 
    if (item.component === "Layout") {
      obj.component = Layout
    } else {
      // 惰性递归 **** 
      //webpack的现在的实现方式不能实现完全动态,所以通过字符串模板来提供部分信息给webpack这样，
      //编译时会编译所有@/views下的模块
      if (typeof (item.component) !== 'undefined') {
        obj.component = resolve => require([`@/views${item.component}`], resolve)
      }

    }
    //if (hasChild(item)) {
    if (("children" in item) && item.children.length > 0) {
      if (item.type != LastPageType) {
        obj.children = formatMenu(item.children)
      }
    }
    if (item.type != listRouteType) {
      res.push(obj)
    }

    //if (Boolean(item.hasButtonList))//如果children是butoonlist，提取出来与其父级同级
    if (item.meta.type == LastPageType) {
      let buttonlist = formatButtonListRoutes(item)
      buttonlist.forEach(bitem => {
        res.push(bitem)
      })
    }
  })
  return res
}


function formatButtonListRoutes(parent) {
  let res = []
  parent.children.forEach(item => {
    let obj = {
      path: parent.path + '/' + item.path,
      name: item.name,
      meta: item.meta,
      hidden: true
      // ,
      // type: item.type
    }
    if (item.type != null && item.type != undefined)
      obj.meta.type = item.type
    // obj.meta.breadcrumb=false
    obj.meta.is_bottom_page_children = true //是否是最后一层页面的children
    obj.meta.parent_path = parent.path //最后一层页面的path
    obj.meta.parent_title = parent.meta.title
    if (item.parent_id != null && item.parent_id != undefined)
      obj.parent_id = item.parent_id
    // 惰性递归 **** 
    if (item.component === "Layout") {
      obj.component = Layout
    } else {
      // 惰性递归 **** 
      //webpack的现在的实现方式不能实现完全动态,所以通过字符串模板来提供部分信息给webpack这样，
      //编译时会编译所有@/views下的模块
      if (typeof (item.component) !== 'undefined') {
        obj.component = resolve => require([`@/views${item.component}`], resolve)
      }
      // obj.component = () => import(`@/views${item.component}`)

    }
    //if (hasChild(item)) {
    if (("children" in item) && item.children.length > 0) {
      obj.children = formatButtonListRoutes(item.children)
    }
    if (obj.meta.type != listRouteType) {
      res.push(obj)
    }
  })
  return res
}

// export function  getOperations(that,typeCode,dataName) { 
//   getDatadictItemList({
//     type_code: typeCode,
//     limit: 100000,
//     offset: 0
//   })
//     .then(response => {
//         that[dataName] = {...response.data}
//     })
//     .catch(error => {
//       console.log(error)
//     })
// }

///检查是否是身份证号码
export function checkIdNo(pId) {
  //检查身份证号码
  var arrVerifyCode = [1, 0, "x", 9, 8, 7, 6, 5, 4, 3, 2];
  var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var Checker = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  if (pId.length != 15 && pId.length != 18) {
    //return "身份证号共有15位或18位"
    // alert("身份证号共有15位或18位")
    return null
  }
  var Ai = pId.length == 18 ? pId.substring(0, 17) : pId.slice(0, 6) + "19" + pId.slice(6, 16);
  if (!/^\d+$/.test(Ai)) {
    //return "身份证除最后一位外，必须为数字！"
    // alert("身份证除最后一位外，必须为数字！")
    return null
  }
  var yyyy = Ai.slice(6, 10),
    mm = Ai.slice(10, 12) - 1,
    dd = Ai.slice(12, 14);
  var d = new Date(yyyy, mm, dd),
    now = new Date();
  var year = d.getFullYear(),
    mon = d.getMonth(),
    day = d.getDate();
  if (year != yyyy || mon != mm || day != dd || d > now || year < 1800) {
    //return "身份证输入错误！"
    // alert("身份证格式错误！")
    return null
  }
  for (var i = 0, ret = 0; i < 17; i++) {
    ret += Ai.charAt(i) * Wi[i]
  }
  Ai += arrVerifyCode[ret %= 11];
  return pId.length == 18 && pId != Ai ? null : Ai;
}

//index 从0开始
export function getLetterByIndex(index) {
  let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  if (index <= 25) {
    return letters[index]
  } else if (index > 26) {
    //取整
    let integer = parseInt(index / 26)
    let remainder = index % 26
    return letters[remainder] + integer.toString()
    //取余
  }
}

//转换单选题试题选项和答案，添加序号A,B,C;解析答案
export function ConvertSingleChoiceQuestionAnswerAnalysis(options) {
  console.log(options)
  let questionList = []
  questionList.push(options.firstContent)
  // questionList.push(options.secondContent)
  options.content.forEach(item => {
    questionList.push(item)
  })

  let questionBySequenceList = [] //添加了序号A，B，C的试题
  questionList.forEach((item, itemIndex) => {
    questionBySequenceList.push({
      id: item.id,
      value: item.value,
      index: getLetterByIndex(itemIndex)
    })
  })
  //添加了序号A,B,C的答案
  let questionAnswer = questionBySequenceList.filter(item => item.id == options.answer)
  // questionAnswer.push(questionBySequenceList.filter(item => item.id == options.answer)) //添加了序号A,B,C的答案

  let result = {}
  result.question_choice = questionBySequenceList
  result.question_answer = {
    answer: questionAnswer
  }
  // result.question_analysis = options.analyze
  return result
}


//转换多选题试题选项和答案，添加序号A,B,C;解析答案
export function ConvertMultipleChoiceQuestionAnswerAnalysis(options) {

  let questionList = []
  questionList.push(options.firstContent)
  // questionList.push(options.secondContent)
  options.content.forEach(item => {
    questionList.push(item)
  })

  let questionBySequenceList = [] //添加了序号A，B，C的试题
  let questionAnswer = [] //添加了序号A,B,C的答案
  questionList.forEach((item, itemIndex) => {
    let itemObject = {
      id: item.id,
      value: item.value,
      index: getLetterByIndex(itemIndex)
    }

    questionBySequenceList.push(itemObject)
    if (item.check == true) {
      questionAnswer.push(itemObject)
    }
  })
  let result = {}
  result.question_choice = questionBySequenceList
  result.question_answer = {
    answer: questionAnswer
  }
  // result.question_analysis = options.analyze
  return result
}
//转换填空题
export function ConvertBlankQuestionAnswerAnalysis(options) {
  let questionList = []
  questionList.push(options.firstContent)
  options.content.forEach(item => {
    questionList.push(item)
  })

  let questionBySequenceList = [] //添加了序号A，B，C的试题
  let questionAnswer = [] //添加了序号A,B,C的答案
  questionList.forEach((item, itemIndex) => {
    questionBySequenceList.push({
      value: '',
      index: itemIndex
    })

    questionAnswer.push({
      value: item.value,
      index: itemIndex
    })
  })
  let result = {}
  result.question_choice = questionBySequenceList
  result.question_answer = {
    answer: questionAnswer
  }
  // result.question_analysis = options.analyze
  return result
}


// fromIndex: 当前元素所在位置索引, toIndex: 移动到交换的位置索引
export function swapItem(arr, fromIndex, toIndex) {
  arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0];
  return arr
};

// 上移,index: 当前元素索引,arr数组对象
export function moveUpItem(arr, index) {
  if (index == 0) {
    return
  }
  swapItem(arr, index, index - 1);
}
//下移,index: 当前元素索引,arr数组对象
export function moveDownRecord(arr, index) {
  if (index == arr.length - 1) {
    return
  }
  swapItem(arr, index, index + 1);
}

//移动至首位 fromIndex: 当前元素所在位置索引
export function moveItemToFirst(arr, fromIndex) {
  let item
  for (let k in arr) {
    item = arr[k]
    if (k == fromIndex) {
      arr.splice(k, 1)
      break
    }
  }
  arr.unshift(item)
}

//排序移动 fromIndex: 当前元素所在位置索引, toIndex: 移动到指定索引
export function moveItem(arr, fromIndex, toIndex) {
  for (let k in arr) {
    let item = arr[k]
    if (k == fromIndex) {
      arr.splice(k, 1)
      arr.splice(toIndex, 0, item)
      break
    }
  }
  return arr
}

export function showRequestErrorInfo(data) {
  // debugger
  const columns = Object.assign({}, columns_name)
  let result = ''
  let objColumns = {}
  if (data.model) {
    objColumns = columns[data.model.substr(0, 1).toLowerCase() + data.model.substr(1)]
  }
  if (data.error_message) {
    data.error_message.forEach(item => {
      let msg = ''
      item.msg.forEach(item_msg => {
        msg += item_msg
      })
      let columName = objColumns && objColumns[item.column]
      if (typeof columName === 'undefined') {
        columName = '错误信息'
      }
      result += `${columName}：${msg}`
    })
  } else {
    const res = new Blob([data])
    console.log(res.stream(), data)
    result = '错误信息:' + (data.message || '')
  }
  console.log(result)
  return result
}
