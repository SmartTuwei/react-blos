import React,{Component} from 'react';
import {Row,Col} from 'antd';
import {Route} from "react-router-dom";
import Header  from  "../../components/Header";
import Navleft  from  "../../components/Navleft";
import Welcome  from  "../../components/welcome";
import Category  from  "../Category";
import Article  from  "../article";
export default class Admin extends Component {
    render(){
        return (
            <div>
                <Row className="admin-page">
                    <Col span={24}>
                        <Header />
                    </Col>   
                </Row>
                <Row>
                    <Col span={3}>
                        <Navleft /> 
                    </Col>
                    <Col span={21}>
                        <Route exact path="/admin" component={Welcome} />
                        <Route path="/admin/category" component={Category} />
                        <Route path="/admin/article" component={Article} />
                    </Col>
                </Row>   
            </div>
        )
    }
}

