import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { useMount } from 'react-use';
import { Spin } from 'ehome-rcm';
import Login from './routes/login';

import AuthComponent from './components/AuthComponent';
import routes from './routes';
import { useSharedContext } from './context';

const App = () => {
  const [spinning, setSpinning] = useState(true);
  const [context] = useSharedContext();

  useEffect(() => {
    // 存入sessionStorage，防止刷新丢失数据
    window.sessionStorage.setItem('context', JSON.stringify(context));
  }, [context]);

  useMount(() => {
    if (document.getElementById('loading-container') !== null) {
      document.body.removeChild(document.getElementById('loading-container'));
    }
  });

  return (
    <Spin spinning={spinning}>
      <Router>
        <AuthComponent
          showPage={() => setTimeout(() => setSpinning(false), 300)}
        >
          {/* 打包的时候会把Login替换成Home组件 */}
          <Route path="/login" component={Login} />
          <Route
            render={() =>
              routes.map(route => {
                const { path, exact = true, component: C } = route;
                return (
                  <Route key={path} path={path} exact={exact} component={C} />
                );
              })
            }
          />
          <Redirect from="/" to="/home" />
        </AuthComponent>
      </Router>
    </Spin>
  );
};

export default App;
