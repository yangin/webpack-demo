import React,{Component} from 'react';
import {Button} from 'antd';
import { withRouter } from 'react-router-dom';
import '@styles/index.less';

class Login extends Component{

  constructor(props){
    super(props);
    this.state={};  
  }

  render(){
    return(
      <div>
        <div>
          <span>Login6</span>
        </div>
        <div>
        <Button type="primary"  onClick={()=>{this.login()}}>登录aa</Button>
        </div>
      </div>
    );
  }


  login(){
    this.props.history.push({ pathname: '/home', params:"yangjin"});
    console.log('这是登录按钮');
  }
}

export default withRouter(Login);


