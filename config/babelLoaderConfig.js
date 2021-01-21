const babelPluginRemoveVconsole = require('./plugins/babel-plugin-remove-vconsole');
module.exports = [
  [
    require.resolve('babel-plugin-named-asset-import'),
    {
      loaderMap: {}
    }
  ],
  [
    'import',
    {
      libraryName: 'antd-mobile',
      style: true
    },
    'antd-mobile'
  ],
  [
    'import',
    {
      libraryName: 'ehome-rcm',
      style: true
    },
    'ehome-rcm'
  ],
  [
    'import',
    {
      libraryName: 'ehome-utils',
      camel2DashComponentName: false
    },
    'ehome-utils'
  ],
  // 开启局部热更新，可选链语法
  'react-hot-loader/babel',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  'transform-class-properties',
  ...(process.env.NODE_ENV === 'production'
    ? [babelPluginRemoveVconsole, 'babel-plugin-resolve-login']
    : [])
];
