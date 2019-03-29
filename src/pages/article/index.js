import React,{Component} from 'react';
import { List,Spin,Avatar,Form,Row,Col,Button,Input,Table,Modal,Select, Card,Popconfirm,message} from 'antd'
import moment from "moment"
import articlesServer from "../../server/article"
import categoryServer from "../../server/category"
require("moment/locale/zh-cn.js");
export default class Article extends Component{
    state={
        items:[],
        editVisible:false,
        commentVisible:false,
        isCreate:true,
        item:{},
        pagination:{},
        title:"",
        keyword:'',
        loading:false,
        selectedRowKeys:[],//选中数组
        category:[],
    }
    componentDidMount(){//指挥执行一次不用willmount
        this.getList();
        categoryServer.list({current:1,pageSize:10}).then(res=>{
            if(res.code == 1){
                this.setState({categories:res.data.items})
            }
        })
    }
    getList = ()=>{
        this.setState({loading:true});
        articlesServer.list({current:this.state.pagination.current,keyword:this.state.keyword}).then(res=>{
            this.setState({loading:false});
            if(res.code == 1){
                const { items,pageNum:current,pageSize,total} = res.data;
                this.setState({
                    items:items.map(item=>(item.key = item._id,item)),
                    pagination:{
                        current,
                        total,
                        pageSize,
                        showTotal:(total)=>`总计${total}条`,
                        showQuickJumper:true,
                        onChange:this.pageChange// 方法名是onChangge    
                    }
                })
            }
        })
    }
    //分页上的方法；
    pageChange=(current)=>{
        console.log(current);
        this.setState({
           pagination:{...this.state.pagination,current} 
        },this.getList)//改变数据执行回调方法
    }
    create=()=>{ // 添加文件
        this.setState({title:"新增文章",editVisible:true,isCreate:true})
    }
    editCancel=()=>{
        this.setState({editVisible:false});
    }
    editOk=()=>{
        let article = this.editform.props.form.getFieldsValue();
        articlesServer[this.state.isCreate ? "create":"update"](article).then(res=>{
            if(res.code == 1){
                this.setState({editVisible:false},this.getList)
            }
        })
    }
    //编辑
    edit = (item)=>{
        this.setState({editVisible:true,item,isCreate:false,title:"编辑文章"});
    }
    view=(item)=>{
        articlesServer.addPV(item._id).then(res=>{
            if(res.code == 1){
                this.setState({viewVisible:true,item,title:"查看文章"},this.getList)
            }else{
                message.error(res.data);
            }
        })
        this.setState({viewVisible:true,item});
    }
    viewCancel=()=>{
        this.setState({viewVisible:false});
    }
    //删除文章
    remove =(ids)=>{
        articlesServer.remove(ids).then(res=>{
            if(res.code == 1){
                this.setState(
                    {},this.getList
                )
            } 
        })
    }
    //搜索
    handleSearch=(keyword)=>{
        this.setState({
            keyword,
            pagination:{...this.state.pagination,current:1}},this.getList);
    }
    comment=(item)=>{
        this.setState({
            commentVisible:true,
            title:"评论详情",
            item
        })
    }
    commentCancel=()=>{
        this.setState({commentVisible:false})
    }
    commentOk=()=>{
        let comment = this.commentForm.props.form.getFieldsValue();//{comment:xxxx};
        articlesServer.addComment(this.state.item._id,comment).then(res=>{
            if(res.code){
                this.setState({commentvisible:false},this.getList);
            }else{
                message.error(res.data);
            }
        })
        // this.setState({commentVisible:false})
    }
    //删除评论
    deleteComment=(article_id,commrnt_id)=>{
        articlesServer.deleteComment(article_id,commrnt_id).then(res=>{
            if(res.code){
                this.setState({
                    commentVisible:false},this.getList)
            }else{
                message.error(res.data);
            }
        })
    }
    render(){
        //标题 内容 阅读量 添加时间哎最后修改时间 评论数 操作
        let columns = [
            {
                title:'标题',
                dataIndex:'title',
                key:'title'
            },{
                title:'内容',
                dataIndex:'content',
                key:'content'
            },{
                title:'分类',
                dataIndex:'category',
                key:'category',
                render:(text) =>{
                    if(text){
                        return text.name || '无'    
                    // return text.name // text本来是一个字符串，populate之后text就是一个分类对象
                    }
                }
            },{
                title:'阅读量',
                dataIndex:'pv',
                key:'pv',
            },{
                title:'创建时间',
                dataIndex:'createAt',
                key:'createAt',
                render:(text)=>{
                   return moment(text).fromNow();
                },
            },{
                title:'评论数',
                dataIndex:'comments',
                key:'comments',
                render:(text)=>text.length,
            },{
                title:'操作',
                dataIndex:'action',
                key:'action',
                render:(text,record,index)=>{
                    return (
                        <Button.Group>
                            <Button
                                style={{marginLeft:5}}
                                type="dashed"
                                onClick={()=>this.view(record)}
                            >查看</Button>
                            <Button
                                style={{marginLeft:5}}
                                type="primary"
                                onClick={()=>this.edit(record)}
                            >编辑</Button>
                            <Button
                                style={{marginLeft:5}}
                                type="dashed"
                                onClick={()=>this.comment(record)}
                            >评论</Button>
                            <Popconfirm onConfirm={()=>this.remove(record._id)}>
                                <Button
                                    style={{marginLeft:5}}
                                    type="danger"
                                >删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            },
            
        ]
        let rowSelection = {
            onChange:(selectedRowKeys)=>{
                this.setState({selectedRowKeys})
            }
        }
        return(
            <div>
                <Row style={{padding:20}}>
                    <Col span={24}>
                        <Row>
                            <Col span={12}>
                                <Button.Group>
                                    <Button
                                        type="dashed"
                                        icon="plus-circle"
                                        onClick={this.create}>添加文章
                                    </Button>                                    
                                    <Button
                                        style={{marginLeft:'8px'}}
                                        type="danger"
                                        onClick={()=>this.remove(this.state.selectedRowKeys)}
                                        icon="delete" >删除文章
                                    </Button>
                                </Button.Group>
                            </Col>
                            <Col span={12}>
                                <Input.Search
                                    enterButton
                                    placeholder="请输入关键字"
                                    onSearch={(keyword)=>this.handleSearch(keyword)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    loading={this.state.loading}
                    bordered
                    dataSource={this.state.items}
                    pagination={this.state.pagination}
                    rowSelection={rowSelection}
                >
                </Table>
                <Modal
                    visible={this.state.editVisible}
                    title={this.state.title}
                    onCancel={this.editCancel}
                    onOk={this.editOk}
                    destroyOnClose
                    >
                    <WrappedEditModal
                        wrappedComponentRef={inst=>this.editform = inst} 
                        isCreate={this.state.isCreate}
                        item={this.state.item}
                        categories={this.state.categories}
                    />
                </Modal>
                <Modal
                    visible={this.state.viewVisible}
                    closable
                    title={this.state.title}
                    footer={null}
                    onCancel={this.viewCancel}
                    destroyOnClose
                    >
                    <WrappedViewModal
                        item={this.state.item}
                    />
                </Modal>
                {/* 评论 */}
                <Modal
                    visible={this.state.commentVisible}
                    title={this.state.title}
                    onCancel={this.commentCancel}
                    onOk={this.commentOk}
                    destroyOnClose
                    >
                    <WrappedCommentModal
                        wrappedComponentRef={inst=>this.commentForm = inst} 
                        isCreate={this.state.isCreate}
                        item={this.state.item}
                        deleteComment={this.deleteComment}
                    />
                </Modal>
            </div>
        )
    }   
}

class EditModal extends Component {
    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <Form>
                <Form.Item>
                    {
                       getFieldDecorator("category",{
                           initialValue:this.props.isCreate?this.props.categories[0]._id:this.props.item.category._id,
                           rules:[{required:true,message:'请输入标题'}]
                       })(
                           <Select>
                               {
                                    this.props.categories.map((item)=>(
                                        <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
                                    ))
                                // [<Select.Option key="1">1</Select.Option>,<Select.Option key="2">2</Select.Option>]
                               }
                           </Select>
                       ) 
                    }
                </Form.Item>
                <Form.Item>
                    {
                       getFieldDecorator("title",{
                           initialValue:this.props.isCreate?'':this.props.item.title,
                           rules:[{required:true,message:'请输入标题'}]
                       })(
                           <Input placeholder="请输入标题" />
                       ) 
                    }
                </Form.Item>
                <Form.Item>
                    {
                       getFieldDecorator("content",{
                           initialValue:this.props.isCreate?'':this.props.item.content,
                           rules:[{required:true,message:'请输入内容'}]
                       })(
                           <Input placeholder="请输入内容" />
                       ) 
                    }
                </Form.Item>
                {
                    !this.isCreate && <Form.Item>
                    {
                       getFieldDecorator("id",{
                           initialValue:this.props.item._id,
                        })(
                            <Input type="hidden" />
                        ) 
                    }
                    </Form.Item>
                }
            </Form>
        )
    }
}
class ViewModal extends Component{
    render(){
        return(
            <Card style={{marginTop:20}}>
                <p>标题：{this.props.item.title}</p>
                <p>内容：{this.props.item.content}</p>
            </Card>
        )
    }
}

class CommentModal extends Component{
    state={
        start:0,//开始的索引
        limit:5,
        loading:false,
        comments:this.props.item.comments.slice(0,5)
    }
    loadMore =()=>{
        this.setState({loading:true});
        setTimeout(()=>{
            this.setState({
                start:this.state.start+this.state.limit,
                
            },()=>{
               this.setState({
                   loading:false,
                   comments:this.props.item.comments.slice(0,this.state.start+this.state.limit)
               })     
            })
        },2000)
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const loadMore =(
            this.state.start + this.state.limit<this.props.item.comments.length && 
            <div style={{marginTop:20,textAlign:'center'}}>
                {this.state.loading?<Spin />: <Button onClick={this.loadMore}>加载更多</Button>}
            </div>    
        )
        return(
            <Row>
                <Col span={24}>
                    <Form>
                        <Form.Item>
                            {
                                getFieldDecorator("content")(
                                    <Input placeholder="请输入评论内容" />
                                )
                            }
                        </Form.Item>
                    </Form>
                    <List
                        loading={this.state.loading}
                        dataSource={this.state.comments}
                        loadMore={loadMore}
                        renderItem={item => (
                            <List.Item actions={[<Button type="danger" icon="delete" 
                                                onClick={()=>this.props.deleteComment(this.props.item._id,item._id)}>删除</Button>]}>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={item.user.email}
                                    description={item.user.userName}
                                />
                                <div>{item.content}</div>
                            </List.Item>
                            )}
                    />
                </Col>
            </Row>
        )
    }
}

const WrappedEditModal = Form.create()(EditModal);
const WrappedViewModal = Form.create()(ViewModal);
const WrappedCommentModal = Form.create()(CommentModal);