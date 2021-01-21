// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const inquirer = require('inquirer');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config.dev.js');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;
const cachedPath = './scripts/.cached';

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
let cachedProxySetting;
try {
  cachedProxySetting = fs.readFileSync(cachedPath, 'utf8');
} catch (err) {
  cachedProxySetting = 'http://opv2-beta.zuolin.com';
}

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    "If this was unintentional, check that you haven't mistakenly set it in your shell."
  );
  console.log(
    `Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

console.log(chalk.blue('===================== 我哈慈悲 ====================='));
console.log(
  chalk.green('                       _oo0oo_                      ')
);
console.log(
  chalk.green('                      o8888888o                     ')
);
console.log(
  chalk.green('                      88" . "88                     ')
);
console.log(
  chalk.white('                      (| -_- |)                     ')
);
console.log(
  chalk.white('                      0\\  =  /0                     ')
);
console.log(
  chalk.white('                    ___/‘---’\\___                   ')
);
console.log(
  chalk.white("                  .' \\|       |/ '.                 ")
);
console.log(
  chalk.white('                / \\\\||||'),
  chalk.green('Aha'),
  chalk.white('|||// \\                ')
);
console.log(
  chalk.white('                / _||||- '),
  chalk.yellow('卍'),
  chalk.white('-|||||_\\               ')
);
console.log(
  chalk.white('               |   | \\\\\\  -  /// |   |              ')
);
console.log(
  chalk.white("               | \\_|  ''\\---/''  |_/ |              ")
);
console.log(
  chalk.white("               \\  .-\\__  '-'  ___/-. /              ")
);
console.log(
  chalk.white("             ___'. .'  /--.--\\  '. .'___            ")
);
console.log(
  chalk.white('          ."" ‘<  ‘.___\\_<|>_/___.’ >’ "".          ')
);
console.log(
  chalk.white('         | | :  ‘- \\‘.;‘\\ _ /’;.’/ - ’ : | |        ')
);
console.log(
  chalk.white('         \\  \\ ‘_.   \\_ __\\ /__ _/   .-’ /  /        ')
);
console.log(
  chalk.white('     =====‘-.____‘.___ \\_____/___.-’___.-’=====     ')
);
console.log(
  chalk.white('                       ‘=---=’                      ')
);
console.log(
  chalk.white('                                                    ')
);
console.log(chalk.blue('=================== 哈哥开光,永无BUG ==============='));
console.log();
console.log();

inquirer
  .prompt([
    {
      type: 'input',
      name: 'proxy',
      message: '需要代理的服务器地址？',
      default: cachedProxySetting,
      validate(value) {
        const pass = value.match(/^https?:\/\/+./i);
        if (pass) {
          return true;
        }
        return '服务器地址格式错误';
      }
    }
  ])
  .then(answers => {
    fs.writeFileSync(cachedPath, answers.proxy);

    const { checkBrowsers } = require('react-dev-utils/browsersHelper');
    checkBrowsers(paths.appPath, isInteractive)
      .then(() => {
        // We attempt to use the default port but if it is busy, we offer the user to
        // run on a different port. `choosePort()` Promise resolves to the next free port.
        return choosePort(HOST, DEFAULT_PORT);
      })
      .then(port => {
        if (port == null) {
          // We have not found a port.
          return;
        }
        const config = configFactory;
        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const appName = require(paths.appPackageJson).name;
        const useTypeScript = fs.existsSync(paths.appTsConfig);
        const urls = prepareUrls(
          protocol,
          HOST,
          port,
          paths.publicUrlOrPath.slice(0, -1)
        );
        const devSocket = {
          warnings: warnings =>
            devServer.sockWrite(devServer.sockets, 'warnings', warnings),
          errors: errors =>
            devServer.sockWrite(devServer.sockets, 'errors', errors)
        };
        // Create a webpack compiler that is configured with custom messages.
        const compiler = createCompiler({
          appName,
          config,
          devSocket,
          urls,
          useYarn,
          useTypeScript,
          webpack
        });
        // Load proxy config
        const proxySetting = answers.proxy;
        const proxyConfig = prepareProxy(
          proxySetting,
          paths.appPublic,
          paths.publicUrlOrPath
        );
        // Serve webpack assets generated by the compiler over a web server.
        const serverConfig = createDevServerConfig(
          proxyConfig,
          urls.lanUrlForConfig
        );
        const devServer = new WebpackDevServer(compiler, serverConfig);
        // Launch WebpackDevServer.
        devServer.listen(port, HOST, err => {
          if (err) {
            return console.log(err);
          }
          if (isInteractive) {
            clearConsole();
          }

          // We used to support resolving modules according to `NODE_PATH`.
          // This now has been deprecated in favor of jsconfig/tsconfig.json
          // This lets you use absolute paths in imports inside large monorepos:
          if (process.env.NODE_PATH) {
            console.log(
              chalk.yellow(
                'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
              )
            );
            console.log();
          }

          console.log(chalk.cyan('Starting the development server...\n'));
          openBrowser(urls.localUrlForBrowser);
        });

        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
          process.on(sig, function () {
            devServer.close();
            process.exit();
          });
        });
      })
      .catch(err => {
        if (err && err.message) {
          console.log(err.message);
        }
        process.exit(1);
      });
  });
// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
