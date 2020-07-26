import loadable from '@loadable/component';
import React,{Component} from 'react';
import {Button} from 'antd';
import '@styles/base.less';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

// const echarts=  loadable(()=>import('echarts')); 
// const ReactEcharts=  loadable(()=>import('echarts-for-react')); 

class Home extends Component{

  constructor(props){
    super(props);
    this.state={};  
  }

  getOption(){
    const option = {
      title: {
          text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
          data:['销量']
      },
      xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
      }]
  };

  return option;
  }

  render(){
    return(
      <div>
        <div>
          <span>这是Home1页</span>
        </div>
        <div class='echart-container'>
          <ReactEcharts option={this.getOption()} />
        </div>
        <div>
          <Button type="primary" onClick={()=>{this.goback()}}>返回</Button>
        </div>
      </div>
    );
  }


  goback(){
    this.props.history.push({ pathname: '/notfound', params:"yangjin"});
    console.log('这是返回按钮按钮');
  }


}

export default Home;


