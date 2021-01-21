const chalk = require('chalk');
const pkgDir = require('pkg-dir');
const fs = require('fs-extra');

class LogProxyPlugin {
  log(proxy) {
    // eslint-disable-next-line no-console
    console.log(`${chalk.yellow(proxy)} -- 当前代理地址`);
  }

  apply(compiler) {
    compiler.plugin('done', async () => {
      const rootDir = await pkgDir(__dirname);
      const proxy = await fs.readFile(`${rootDir}/scripts/.cached`);
      this.log(proxy);
    });
  }
}

module.exports = LogProxyPlugin;
