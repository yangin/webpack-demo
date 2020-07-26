import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './configs/router.config';
// import { hot } from 'react-hot-loader/root';
import 'antd/dist/antd.less';
// const HotRoutes=hot(Routes);

const App = () => {
  return (<div>
    <Routes />
  </div>)
}

if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(<App />, document.getElementById('root'));