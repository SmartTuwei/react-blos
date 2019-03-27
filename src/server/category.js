import Server from "./index.js"
// import qs from "qs";
const ENTITY = "./api/categories";

//{pagename:'111',pagrsize:'111'}
function list({current=1,pageSize=5,keyword=''}){
    return Server.get(ENTITY+"?pageNum="+current+"&pageSize="+pageSize+"&keyword="+keyword);
}
function create(category){
    return Server.post(ENTITY,category);
}
function updata(category){
    return Server.put(ENTITY+'/'+category.id,category)
}
//
function remove(ids){
    if(typeof ids == "string"){
        ids = [ids];
    }
    return Server.del(ENTITY+"/"+ids[0],{ids});
}
export default {
    list,
    create,
    updata,
    remove
}