const path = require('path');

const resolvePath = url => path.resolve(__dirname, '../src', url);

module.exports = {
  'babel-runtime': path.dirname(require.resolve('babel-runtime/package.json')),
  lang: resolvePath('lang'),
  components: resolvePath('components'),
  config: resolvePath('app_config.js'),
  hooks: resolvePath('hooks'),
  svg: resolvePath('images/svg-sprite'),
  images: resolvePath('images'),
  context: resolvePath('context')
};
