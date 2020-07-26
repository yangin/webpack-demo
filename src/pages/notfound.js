import React,{Component} from 'react';
import {Button} from 'antd';
import { withRouter } from 'react-router-dom';
import '@styles/other.less';

class NotFound extends Component{

  constructor(props){
    super(props);
    this.state={};  
  }

  render(){
    return(
      <div>
        <div class="container">
          <span>这是NotFound页</span>
        </div>
        <div>
          <Button type="primary" onClick={()=>{this.goback()}}>返回</Button>
        </div>
      </div>
    );
  }


  goback(){
    console.log('这是NotFound按钮按钮');
  }


}

export default NotFound;


