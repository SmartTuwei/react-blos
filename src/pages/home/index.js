import React,{Component} from 'react';
import {Form,Input,Icon,Button,message,Modal} from 'antd';
import server from "../../server/user";
import {withRouter} from "react-router-dom";
class Home extends Component{
    state = {
        visible: false,
    }
    fatherRef =(ref)=>{
        this.child = ref
        // console.log(ref) // -> 获取整个Child元素
    }
    handleClick=()=>{
       this.child.changeisSignUp() // -> 通过this.child可以拿到child所有状态和方法
    }
    handleOk=()=>{
        this.setState({
            visible: false,
        });
    }
    handleSubmit = (isSignUp,user)=>{
        // var thar = this;
        server[isSignUp?'signup':'signin'](user).then(res=>{
            if(res.code == 1){
                if(!isSignUp){
                    sessionStorage.setItem("username",res.data.user.userName);
                    this.props.history.push("/admin");
                }else{
                    this.setState({
                        visible:true
                    })
                     this.handleClick();
                    // this.child.changeisSignUp();
                    this.props.history.push("/");
                }
                
            }else{
                message.error(res.error);
            }
        })
    }
    render(){
        return(
             <div className="home-page">
                <div className="login-form">
                    <h1>欢饮光临，我的博客</h1>
                    <WarppedUserFrom onSubmit={this.handleSubmit} onRef={this.fatherRef}/>
                    <Modal
                        title="Basic Modal"
                        onOk={this.handleOk}
                        onCancel={this.handleOk}
                        visible={this.state.visible}
                    >
                        <h3>注册成功!即将跳转登录页面</h3>    
                    </Modal>
                </div>
             </div>   
        )
    }
}

class UserForm extends Component{
    constructor(props){
        super(props);
        this.state = {isSignUp:true,info:"222"};//默认是一个注册表单
    }
    componentWillMount(){
        //父元素调用子元素原理，子元素讲this引用传递到父组件 让父组件进行调用，达到调用的原理
        this.props.onRef(this);
    }
    changeisSignUp =()=>{
        this.setState({
            isSignUp:false
        })
    }
    checkUsername =(rule,value,callback)=>{
        if(!value){
            callback("用户名为空");
        }else if(!/^1\d{10}$/.test(value)){
            callback("用户名不合法,必须为手机号")
        }else{
            callback();
        }
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <Form onSubmit={(e)=>{
                e.preventDefault();    
                this.props.onSubmit(
                    this.state.isSignUp,
                    this.props.form.getFieldsValue()
                )}
            }>
                <Form.Item>
                    {
                        getFieldDecorator('userName',{
                            rules:[{validator:this.checkUsername},{required:true,message :"请输入用户名"}]
                        })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password',{
                            rules:[{required:true,message :"请输入密码"}]
                        })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)
                    }
                </Form.Item>
                {
                    this.state.isSignUp && <Form.Item> 
                    {
                        getFieldDecorator('email',{
                            rules:[{required:true,message :"请输入邮箱"}]
                        })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="email" />)
                    }
                    </Form.Item>
                }
                <Form.Item>
                     <Button 
                        htmlType="submit" 
                        className="login-from-button">
                        {this.state.isSignUp ? "注册":"登录" }
                     </Button>
                     <a onClick={()=>this.setState({isSignUp:!this.state.isSignUp})}>{this.state.isSignUp?'已有账号,直接登录':"没有账号,请注册"}</a>
                </Form.Item>
            </Form>
        )
    }
}
const WarppedUserFrom = Form.create()(UserForm);

export default withRouter(Home)