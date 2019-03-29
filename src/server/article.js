import Server from "./index.js"
// import qs from "qs";
const ENTITY = "./api/articles";

//{pagename:'111',pagrsize:'111'}
function list({current=1,pageSize=5,keyword=''}){
    return Server.get(ENTITY+"?pageNum="+current+"&pageSize="+pageSize+"&keyword="+keyword);
}
function create(item){
    return Server.post(ENTITY,item);
}
function update(item){
    return Server.put(ENTITY+'/'+item.id,item)
}
//
function remove(ids){
    if(typeof ids == "string"){
        ids = [ids];
    }
    debugger
    return Server.del(ENTITY+"/"+ids[0],{ids});
}
function addPV(id){
    return Server.get(ENTITY+"/pv/"+id);
}
//添加评论
function addComment(article_id,content){
    return Server.post(ENTITY+"/comment/"+article_id,content);
}
//删除评论
//   /api/articles/文章id/comment/评论id
function deleteComment(article_id,acomment_id){
    return Server.del(ENTITY+"/"+article_id+"/comment/"+acomment_id);
}
export default {
    list,
    create,
    update,
    remove,
    addPV,
    addComment,
    deleteComment
}