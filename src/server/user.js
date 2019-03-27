import Server from "./index.js"

console.log(Server);
const usersApi = '/api/users/';
function signup(data){ //{username,password,email}
    return Server.post(usersApi+"signup",data);
}
function signin(data){
    return Server.post(usersApi+"signin",data);
}
function signout(){
    return Server.get(usersApi+"signout");
}
export default {
    signup,
    signin,
    signout
}