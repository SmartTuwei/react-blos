import React,{Component} from 'react';
import { Row,Icon,Col, Menu,link } from 'antd';
import user from "../../server/user";
import {withRouter,Link} from "react-router-dom";

class Navleft extends Component{
    handleClick = (item,key)=>{
        this.props.history.push(key)
    }
    render(){
        console.log(window.location.hash.slice(1))
        return (
            <div>   
                <Menu
                mode="inline"
                theme='light'
                onClick={this.handleClick}
                defaultSelectedKeys={[window.location.hash.slice(1)]}    
                >
                    <Menu.Item key="/admin" title="文章管理">
                        <Link to="/admin"><Icon type="lock" />首页</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/category" title="分类管理">
                    <Link to="/admin/category">
                        <Icon type="lock" />分类管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/article" title="文章管理">
                    <Link to="/admin/article">
                        <Icon type="book" />文章管理</Link>
                    </Menu.Item>
                    {/* <Menu.Item key="/mail/article" title="文章管理"><Icon type="book" />文章管理</Menu.Item> */}
                </Menu>
            </div>
        )
    }
}
export default withRouter(Navleft);