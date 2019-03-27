import axios from 'axios';
const baseURL = "http://192.168.0.167:7001";
const config = {
    baseURL,
    timeout:8000,
    withCredentials:true //跨域请求时携带cookie，
}
class Sever {
    async get(url){
        const res = await axios({
             ...config,
             method: "get",
             url,
         });
         return res.data;
     }
    async post(url,data){
        const res = await axios({
             ...config,
             method: "post",
             url,
             data
         });
         return res.data;
     }
     async put(url,data){
         const res = await axios({
             ...config,
             method: "put",
             url,
             data
         });
         return res.data;
     }
     async del(url,data){
         const res = await axios({
             ...config,
             method: "delete",
             url,
             data
         });
         return res.data;
     }
}
export default new Sever();