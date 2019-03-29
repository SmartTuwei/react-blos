import React,{Component} from 'react';
import { Row,Col,Table,Modal,Popconfirm,Button,Input, message,Form} from 'antd';
import categoryServer from "../../server/category";
export default class Category extends Component{
    state ={
        items:[],
        item:{},
        title:'',
        keyword:'',
        isCreate:true, //标识是否添加分类；如果是true是添加分类，如果是false就是修改
        editVisible:false,
        selectRowKeys:[],//选中行的keys的数组；
        pagination:{}
    }
    //开始执行添加操作
    create =()=>{
        this.setState({
            title:"添加分类",
            isCreate:true,
            editVisible:true
        })
    }
    componentWillMount(){
        this.getList();
    }
    pageChange =(current)=>{
        console.log(current);
        this.setState({
           pagination:{...this.state.pagination,current} 
        },this.getList)//改变数据执行回调方法
    }
    getList = () => {
        categoryServer.list({current:this.state.pagination.current,keyword:this.state.keyword}).then(res=>{
            if(res.code == 1){
                let {items,pageNum:current,pageSize,total} = res.data;
                this.setState({
                    items:res.data.items.map(item=>(item.key = item._id,item)),
                    pagination:{
                        current,
                        pageSize,
                        total,
                        showTotal:(total)=>`总计${total}条`,
                        showQuickJumper:true,
                        onChange:this.pageChange// 方法名是onChangge
                    }
                })
           }else{
               message.error(res.error)
           } 
        });
    }
    //点击的时候要求将模态窗关闭
    editCancel = ()=>{
        this.setState({
            editVisible:false
        })
    }
    //点击ok按钮的时候，要把分类保存在后台，并且关闭窗口
    editOk =()=>{
       let category = this.editform.props.form.getFieldsValue();
       categoryServer[this.state.isCreate?'create':'updata'](category).then(res=>{
           if(res.code == 1){
               this.setState({editVisible:false});
                this.getList();
           }else{
               message.error(res.error);
           }
       }) 
    }
    edit = (item)=>{
        console.log(item);
        this.setState({title:'更新分类',editVisible:true,isCreate:false,item})
    }
    remove = (id)=>{
        categoryServer.remove(id).then(res=>{
            if(res.code == 1){
                this.setState({
                    pagination:{
                        ...this.state.pagination,current:1
                    }
                },this.getList)
            }
        });
    }
    render(){
        const columns = [
            {
                title:"名称",
                dataIndex:"name",
                width:500,
                key:"name"
            },
            {
                title:"操作",
                dataIndex:"operation",
                key:"operation",
                render:(text,record,index)=>{
                    return(
                        <Button.Group>
                            <Button type='primary' onClick={()=>this.edit(record)}>修改</Button>
                            <Popconfirm onConfirm={()=>{this.remove(record._id)}}>
                                <Button type='danger'>删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ]
        const rowSelection = {
            //参数为选中行的建的数组
            onChange:(selectRowKeys)=>{
                this.setState({selectRowKeys});
            }
        }
        return(
            <div>
                <Row style={{padding:'20px'}}>
                    <Col span={10}>
                        <Button.Group>
                            <Button type="default" icon="plus-circle-o" onClick={this.create}>添加分类</Button>
                            <Button type="danger" icon="delete" onClick={()=>this.remove(this.state.selectRowKeys)}>删除所选分类</Button>
                        </Button.Group>
                    </Col> 
                    <Col span={14} style={{textAlign:"right"}}>
                        <Input.Search
                            style={{ width: 200 }} 
                            enterButton
                            placeholder="请输入关键字"
                            onSearch={keyword => this.setState({keyword},this.getList)}     
                        />
                    </Col>
                </Row>
                <Table 
                    dataSource={this.state.items}
                    columns={columns}
                    style={{padding:"10px"}}
                    bordered
                    rowSelection={rowSelection}
                    pagination={this.state.pagination}
                />
                <Modal
                    title={this.state.title}
                    visible={this.state.editVisible}
                    onCancel={this.editCancel}
                    onOk={this.editOk}
                    destroyOnClose
                >
                        <WrappedEditModal 
                            wrappedComponentRef={inst=>this.editform = inst}
                            isCreate={this.state.isCreate}
                            item={this.state.item}
                        />
                </Modal>
            </div>
        )
    }
}

class EditModal extends Component{
    render(){
        const {getFieldDecorator} = this.props.form;
        console.log(this.props.item.name);
        return(
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('name',{
                            initialValue:this.props.isCreate?'':this.props.item.name,
                            rules:[{required:true,message:'请输入分类名称'}]
                        })(<Input placeholder="请输入分类名称" />)
                    }
                </Form.Item>
                {
                !this.props.isCreate &&(
                <Form.Item>
                    {   
                        getFieldDecorator("id",{
                            initialValue:this.props.item._id
                        })(<Input type="hidden"/>)
                    }
                </Form.Item>
                )
                }
            </Form>
            
        )
    }
}
//凡是传给WrappedEditModal的属性也会原封不动的传递给EditModal;
const WrappedEditModal = Form.create()(EditModal);