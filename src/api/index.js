import requests from "./requests";

export const reqLogin=(data) => {
   return  requests({
    url:'/login',
    method:'post',
    data
   })
}