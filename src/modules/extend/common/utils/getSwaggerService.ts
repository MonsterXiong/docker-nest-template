
const puppeteer = require('puppeteer-core')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const axios = require('axios')
const _ = require('lodash')
const folderPath = path.join(__dirname, '../service/module/businessService')
let chromiumpath = path.resolve(__dirname, '../../../../../public/tool/chrome-win/chrome.exe')
console.log(chromiumpath);

// let chromiumpath = '/usr/bin/google-chrome'
let replayCount = 0
let userInfoMap = {
  'http://192.168.2.231:8062':{
    account: 'jwadmin',
    password: '123456',
  }
}
axios.interceptors.request.use(async (config)=>{
  let {baseUrl,account,password} = config
  if(!account) {
   const param = getLocalUserInfo(baseUrl)
   account = param.account
   password = param.password
  }
  const cookie = await getCookie({baseUrl,account,password})
  // 在发送请求之前做些什么
  config.headers = {
    'X-Custom-Header': 'foobar',
    Cookie: cookie.name + '=' + cookie.value,
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
axios.interceptors.response.use(async (response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if(replayCount>=3){
    replayCount = 0
    return response
  }
  if(response.data.code == 401) {
    clearCookie(response.config.baseUrl)
    replayCount++
    return await axios(response.config)
  } else {
    replayCount = 0
    return response;
  }
},(error) => {
  return Promise.reject(error);
});
function getLocalUserInfo(baseUrl){
  return userInfoMap[baseUrl]
}
function setLocalUserInfo({baseUrl,password,account}){
  userInfoMap[baseUrl] = {
    ...userInfoMap[baseUrl],
    account:account,
    password:password,
  }
}
function clearCookie(baseUrl){
  global.globalCookie[baseUrl] = null
}
async function getCookie(param) {
  const { baseUrl } = param
  if(!global.globalCookie) global.globalCookie = {}
  if(!global.globalCookie[baseUrl]){
    global.globalCookie[baseUrl] = await login(param)
  }
  return global.globalCookie[baseUrl]
}
async function login({ account, password, baseUrl }) {
  const browser = await puppeteer.launch({
    executablePath: chromiumpath,
    headless: false,
  })
  try {
    const page = await browser.newPage()
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })

    const accountInput = await page.$('input[type="text"], input:not([type])')
    await accountInput.type(account)

    const passwordInput = await page.$('input[type="password"]')
    await passwordInput.type(password)

    const loginButton = await page.$('button')
    await Promise.all(
      [loginButton.click(),page.waitForNavigation({ waitUntil: 'domcontentloaded', url:baseUrl })]
    )
    const [cookie] = await page.cookies(baseUrl)
    return cookie
  } finally {
    browser.close()
  }
}
export async function getGroupList({ baseUrl, account, password}) {
  let { data } = await axios.get(baseUrl + '/swagger-resources/', {baseUrl,account,password})
  if(data.length){
    setLocalUserInfo({baseUrl,account,password})
  }
  return data
}
function writeFileBatch(fileDataList){
  fileDataList.map(fileData=>writeFile(fileData))
}
function writeFile(fileData){
  const {filePath,text} = fileData
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        console.log('文件创建失败', err)
        return
      } else {
        console.log(filePath, '文件创建成功')
        return
      }
    })
}
async function genCode(service) {
  const fileName = service.serviceName + '.js'
  const filePath = path.join(folderPath, fileName)
    let template = `import { service } from '@/services/http' 
export default class <%= service.serviceName %> {
  <% service.interfaceList.forEach((interface) => { -%>
/**
  * @description <%= interface.description -%>
  <% if(interface.methodName == 'postQueryAndBody'){ -%>
  * @param { Object } urlParams 请求头参数
  * @param { Object } bodyParams 请求体参数<% -%>
  <% } else if(interface.methodName == 'postQuery' || interface.methodName == 'postFormData' || interface.methodName == 'postQueryToBlob'){ -%>
  <% interface.params.forEach((param)=>{ %>
  * @param { <%= interface.typeList.find(item => item.name == param).type -%>
   } <%= param %> 请求参数 <% }) -%>
  <% } else if ((interface.bodyParams.length > 0 || interface.params.length > 0)&& interface.methodName != 'postQueryAndBody'){ %>
  * @param { Object } param 请求参数<% } %>
  * @returns
  */<% if(interface.methodName == 'postQueryAndBody'){ %>
  static async <%= interface.interfaceName %>(urlParams, bodyParams){
    return service.postQueryAndBody('<%= interface.url %>', urlParams, bodyParams)
  }<% } else if (interface.methodName == 'postQuery' || interface.methodName == 'postFormData' || interface.methodName == 'postQueryToBlob'){ %>
  static async <%= interface.interfaceName %>(<%= interface.params.join(', ') %>){
    return service.<%= interface.methodName %>('<%= interface.url %>', {<%= interface.params.join(', ') %>})
  }<% } else if (interface.bodyParams.length > 0 || interface.params.length > 0){ %>
  static async <%= interface.interfaceName %>(param){
    return service.<%= interface.methodName %>('<%= interface.url %>', param)
  }<% } else { %>
  static async <%= interface.interfaceName %>(){
    return service.<%= interface.methodName %>('<%= interface.url %>')
  }<% } %>

  <% }) %>

}`
  const text = await ejs.render(
    template,
    { service: service }
  )
  return {filePath,text,fileName}
}
function getMethodName({methodName,pathProperty,bodyParams,formDataParams,urlParams}){
  let method = methodName
  if(methodName == 'get') return method
  if (urlParams.length) {
    method = 'postQuery'
    if (bodyParams.length) {
      method = 'postQueryAndBody'
    }
  }
  if (formDataParams.length) {
    method = 'postFormData'
  }
  if (pathProperty.produces[0] == 'application/octet-stream') {
    method = 'postQueryToBlob'
  }
  return method
}
function getParamsAndTypeList(parameters) {
  let typeList = [],
      urlParams = [],
      bodyParams = [],
      formDataParams = []
  parameters?.forEach((item) => {
    typeList.push({
      name: item.name,
      type: item.type ? upFirstletter(item.type) : 'Object'
    })
    if (item.in == 'query') {
      urlParams.push(item.name)
    } else if (item.in == 'body') {
      bodyParams.push(item.name)
    } else if (item.in == 'formData' || item.in == 'form-data') {
      formDataParams.push(item.name)
    }
  })
  return {typeList,urlParams,bodyParams,formDataParams}
}
function upFirstletter(str){
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function formatInterface(data){
  const keys = Object.keys(data)
  let interfaceList = keys.map((key) => {
    let [methodName] = Object.keys(data[key])
    let pathProperty = data[key][methodName]

    const {bodyParams,urlParams,formDataParams,typeList} = getParamsAndTypeList(pathProperty.parameters)
    methodName = getMethodName({methodName,pathProperty,urlParams,bodyParams,formDataParams})

    let splitedPath = _.cloneDeep(key).split('/')
    let serviceName = splitedPath[splitedPath.length - 2] || splitedPath[splitedPath.length - 1]

    return {
      interfaceName: splitedPath[splitedPath.length - 1],
      methodName,
      url: key,
      deprecated: pathProperty.deprecated,
      serviceName: upFirstletter(serviceName) + 'Service',
      params: [...urlParams, ...formDataParams],
      bodyParams: [...bodyParams],
      description: pathProperty.summary,
      typeList,
    }
  })
  return interfaceList
}
function formatService(interfaceList){
  let serviceList = []
  interfaceList = interfaceList.filter((item) => !item.deprecated)
  interfaceList.forEach((item) => {
    let service = serviceList.find((e) => e.serviceName == item.serviceName)
    if (!service) {
      service = {
        serviceName: item.serviceName,
        interfaceList: [],
      }
      serviceList.push(service)
    }
    service.interfaceList.push(item)
  })
  return serviceList
}
export async function getInterfaceBatch(baseUrl, groupList) {
  return Promise.all(groupList.map((group)=> getInterface(group,baseUrl)))
}
export async function getInterface(group,baseUrl) {
  let { data } = await axios.get(baseUrl + encodeURI(group.url), {baseUrl})
  return data?.paths || {}
}
function flatToObject(array){
  let res = {}
  array.forEach((item)=>{
    res = {
      ...res,
      ...item,
    }
  })
  return res
}
export async function getServiceBatch(baseUrl, groupList) {
  let interfaceGroup = await getInterfaceBatch(baseUrl,groupList,)
  const interfaceList = formatInterface(flatToObject(interfaceGroup))
  return formatService(interfaceList)
}
export async function genCodeBatch(serviceList){
  return Promise.all(serviceList.map(service=>genCode(service)))
}
export default  {
      getGroupList,
  getInterfaceBatch,
  getServiceBatch,
  genCodeBatch,
  writeFileBatch,
}
// module.exports = {
//   getGroupList,
//   getInterfaceBatch,
//   getServiceBatch,
//   genCodeBatch,
//   writeFileBatch,
// }
