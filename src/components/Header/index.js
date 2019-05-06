import React,{Component} from 'react';
import { Row,Icon,Col } from 'antd';
import user from "../../server/user";
import {withRouter} from "react-router-dom";

class Header extends Component{
    state={
        userName:''
    }
    componentWillMount(){
        let userName = sessionStorage.getItem("username");
        this.setState({userName});
    }
    logout = ()=>{
        user.signout().then(data=>{
            if(data.code){
                sessionStorage.removeItem("username");
                this.props.history.push("/");
            }
        })
    }   
    render(){
        return(
            <Row className="admin-header">
                <Col span={6} >
                    <h2>图图博客</h2>
                </Col>
                <Col span={18}>
                    <div style={{float:'right',fontSize:16}}>
                        <Icon type="smile" />欢迎&nbsp&nbsp{this.state.userName}
                        <a onClick={this.logout}><Icon type="logout" />退出</a>
                    </div>
                </Col>
            </Row>
        )
     }
 }
export default withRouter(Header);