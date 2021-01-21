import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import App from './app';
import callApi from './utils/callApi';
import { SharedContextProvider } from './context';
import './index.less';

/** 打包时自动移除 */
import VConsole from 'vconsole';
// eslint-disable-next-line no-new
new VConsole();

window.FastClick.attach(document.body);

// 常用方法直接挂到React对象上，方便获取
React.post = callApi;

const render = Component => {
  // eslint-disable-next-line react/no-render-return-value
  return ReactDOM.render(
    <Suspense fallback={<div />}>
      <SharedContextProvider>
        <Component />
      </SharedContextProvider>
    </Suspense>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app.js', () => {
    render(App);
  });
}
