import requests from "./requests";

export const reqLogin=(data) => {
   return  requests({
    url:'/login',
    method:'post',
    data
   })
}
//请求菜单栏
export const reqMenu=() => {
   return  requests({
    url:'/menus',
    method:'get',
   })
}
//请求用户数据
export const reqUserInfo=({query,pagenum,pagesize}) => {
   return  requests({
      url:`/users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`,
      method:'get',            
     })
}

//修改用户状态
export const reqUserStatus=({id,mg_state})=>{
   return  requests({
      url:`/users/${id}/state/${mg_state}`,
      method:'put',
     })
}
export const reqUser=(data)=>{
   return  requests({
      url:`/users`,
      method:'post',
      data
     })
}
//通过id查找用户
export const reqUserId=(id)=>{
   return  requests({
      url:`/users/${id}`,
      method:'get'
     })
}
//通过编辑用户信息
export const editUserId=(id, data)=>{
   return  requests({
      url:`/users/${id}`,
      method:'put',
      data
     })
}
//删除用户信息
export const delUserId=(id)=>{
   return  requests({
      url:`/users/${id}`,
      method:'delete',
     })
}

//获取权限
export const reqPowerList=()=>{
   return  requests({
      url:`/rights/list`,
      method:'get',
     })
}
//获取角色
export const reqRolesList=()=>{
   return  requests({
      url:`/roles`,
      method:'get',
     })
}
//删除角色指定权限
export const delRolePower=(roleId,rightId)=>{
   return  requests({
      url:`/roles/${roleId}/rights/${rightId}`,
      method:'delete',
     })
}
//获取所有权限
export const reqGetAllPower=(type)=>{
   return  requests({
      url:`/rights/${type}`,
      method:'get',
     })
}

// 授予权限
export const reqsetPower=(roleId,data)=>{
   return  requests({
      url:`/roles/${roleId}/rights`,
      method:'post',
       data
     })
}
//分配用户角色
export const reqSetRole=(id,data)=>{
   return  requests({
      url:`/users/${id}/role`,
      method:'put',
       data
     })
}
//请求商品分类列表
export const reqCateList=(params)=>{
   return  requests({
      url:`/categories`,
      method:'get',
       params
     })
}
//添加
export const reqAddCate=(data)=>{
   return  requests({
      url:`/categories`,
      method:'post',
      data
     })
}
//请求参数列表
export const reqAttr=(id,data)=>{
   return  requests({
      url:`/categories/${id}/attributes`,
      method:'get',
      params:data
     })
}
//添加参数属性
export const reqAddAttr=(id,data)=>{
   return  requests({
      url:`/categories/${id}/attributes`,
      method:'post',
     data
     })
}
//根据id查询参数
export const reqAttrById=(id,attrId,params)=>{
   return  requests({
      url:`/categories/${id}/attributes/${attrId}`,
      method:'get',
      params
     })
}
//修改参数属性
export const reqMAttr=(id,attrId,data)=>{
   return  requests({
      url:`/categories/${id}/attributes/${attrId}`,
      method:'put',
     data
     })
}
//删除参数属性
export const reqDelAttr=(id,attrId)=>{
   return  requests({
      url:`/categories/${id}/attributes/${attrId}`,
      method:'delete',
     })
}

//请求商品列表数据
export const reqGoodsInfo=({query,pagenum,pagesize}) => {
   return  requests({
      url:`/goods?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`,
      method:'get',            
     })
}
//删除商品信息
export const delGoodsId=(id)=>{
   return  requests({
      url:`/goods/${id}`,
      method:'delete',
     })
}
//add商品信息
export const addGoods=(data)=>{
   return  requests({
      url:`/goods`,
      method:'post',
      data
     })
}
//getOrderList
export const reqOrderList=(params)=>{
   return  requests({
      url:`/orders`,
      method:'get',
      params
     })
}
//查看物流
export const reqWuLiu=(params)=>{
   return  requests({
      url:`/kuaidi/1106975712662`,
      method:'get',
      params
     })
}
//图表数据
export const reqReport=()=>{
   return  requests({
      url:`/reports/type/1`,
      method:'get',
     })
}


