module.exports = function babelPluginRemoveVconsole({ types: t }) {
  return {
    name: 'babel-plugin-remove-vconsole',
    visitor: {
      ImportDeclaration(path, state) {
        const node = path.node;
        if (node.source.value === 'VConsole') {
          path.remove();
        }
      },
      NewExpression(path, state) {
        const node = path.node;
        if (t.isIdentifier(node.callee, { name: 'VConsole' })) {
          // 获取节点的父路径
          const parentPath = path.parentPath;
          parentPath.remove();
        }
      }
    }
  };
};
