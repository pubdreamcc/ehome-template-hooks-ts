/* eslint-disable */
// 框架依赖
import React, { Component, PureComponent } from 'react';
import { callApi } from 'ehome-utils';
import { Button, Toast, Menu, NavBar } from 'antd-mobile';
import { Base64 } from 'js-base64';
import sha256 from 'sha256';
import './index.less';

class Logon extends (PureComponent || Component) {
  state = {
    userRelatedScenes: [],
    allCommunities: [],
    allAddressList: [],
    allApps: [],
    appItem: {},
    communityItem: {},
    organizationItem: {},
    showCommunityList: false,
    showAppList: false
  };

  userIdentifier = '12000001802';

  password = sha256('123456');

  namespaceId = '11';

  componentDidMount() {
    const oHead = document.getElementsByTagName('HEAD').item(0);
    const oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = 'https://fe-cdn.zuolin.com/unifiedRoute/dist/parse.min.js';
    oHead.appendChild(oScript);

    this.logon(() => {
      this.initComponent();
    });
  }

  initComponent = () => {
    const fulfillments = [this.listUserAddress(), this.listAllCommunities()];
    Promise.all(fulfillments).then(values => {
      let userRelatedScenes = [];
      let allCommunities = [];
      for (let i = 0; i < values.length; i++) {
        const { dtos = [] } = values[i] || {};
        const temp = dtos.slice();
        if (i === 0) {
          temp.forEach(item => {
            const { id, communityInfoDtos = [], type } = item;
            let obj = {};
            if (Number(type) === 0) {
              obj.familyId = id;
            } else if (Number(type) === 1) {
              obj.organizationId = id;
            }
            if (communityInfoDtos.length > 0) {
              obj.communityId = String(communityInfoDtos[0].id);
            }
            obj = JSON.stringify(obj);

            return Object.assign(item, { sceneToken: Base64.encode(obj) });
          });

          userRelatedScenes = temp;
        } else if (i === 1) {
          temp.forEach(item => {
            const { id } = item;
            let obj = { communityId: String(id) };
            obj = JSON.stringify(obj);
            return Object.assign(item, { sceneToken: Base64.encode(obj) });
          });
          allCommunities = temp;
        }
      }
      // 整合地址信息。将userRelatedScenes，除userRelatedScenes所在园区的其他园区整合在一起
      const allAddressList = userRelatedScenes.slice();
      for (let i = 0; i < allCommunities.length; i++) {
        let exist = false;
        for (let j = 0; j < userRelatedScenes.length; j++) {
          const { communityInfoDtos = [] } = userRelatedScenes[j];
          const { id = '' } =
            communityInfoDtos.length > 0 ? communityInfoDtos[0] : {};
          if (String(allCommunities[i].id) === String(id)) {
            exist = true;
            break;
          }
        }
        if (!exist) {
          allAddressList.push(allCommunities[i]);
        }
      }

      const pAllCommunities = allCommunities.map(
        (communityItem, communityIndex) => {
          communityItem.label = communityItem.aliasName;
          communityItem.value = communityItem.id;

          const children = [];
          userRelatedScenes.map((sceneItem, sceneIndex) => {
            sceneItem.label = sceneItem.aliasName;
            sceneItem.value = sceneItem.id;
            const inCommunityItem = sceneItem.communityInfoDtos.filter(item => {
              return item.id === communityItem.id;
            })[0];
            if (inCommunityItem) {
              children.push(sceneItem);
            }
          });
          return { ...communityItem, children };
        }
      );
      this.setState({
        userRelatedScenes,
        allCommunities: pAllCommunities,
        allAddressList
      });
    });
  };

  listUserAddress = () => {
    return new Promise((resolve, reject) => {
      callApi({
        api: '/user/listUserAddress',
        data: {},
        success: (res = []) => {
          resolve(res);
        }
      });
    });
  };

  listAllCommunities = () => {
    return new Promise((resolve, reject) => {
      callApi({
        api: '/community/listAllCommunities',
        data: {},
        success: (res = []) => {
          resolve(res);
        }
      });
    });
  };

  logon = cb => {
    callApi({
      api: '/user/logon',
      data: {
        userIdentifier: this.userIdentifier,
        password: this.password,
        namespaceId: this.namespaceId
      },
      success: ({ contentServer, loginToken }) => {
        cb && cb();
      },
      error: res => console.log('登录失败', `${JSON.stringify(res)}`)
    });
  };

  selectCommunity = item => {
    this.setState({
      scene: item
    });
  };

  handleClick = e => {
    e && e.preventDefault(); // Fix event propagation on Android
    this.setState({
      showCommunityList: !this.state.showCommunityList
    });
  };

  handleAppClick = e => {
    e && e.preventDefault(); // Fix event propagation on Android
    this.setState({
      showAppList: !this.state.showAppList
    });
  };

  selectApp = value => {
    let appItem = {};
    const { allApps } = this.state;

    allApps.forEach(dataItem => {
      if (dataItem.value === value[0]) {
        appItem = dataItem;
      }
    });
    this.setState({
      appItem
    });
    this.handleAppClick();
  };

  selectCommunity = value => {
    let communityItem = {};
    let organizationItem = {};
    const { allCommunities } = this.state;
    allCommunities.forEach(dataItem => {
      if (dataItem.value === value[0]) {
        communityItem = dataItem;
        if (dataItem.children && value[1]) {
          dataItem.children.forEach(cItem => {
            if (cItem.value === value[1]) {
              organizationItem = cItem;
            }
          });
        }
      }
    });
    this.setState(
      {
        communityItem,
        organizationItem
      },
      () => {
        this.getLastLaunchPadLayoutByScene(communityItem, organizationItem);
        this.handleClick();
      }
    );
  };

  onMaskClick = () => {
    this.setState({
      showCommunityList: false,
      showAppList: false
    });
  };

  // /ui/launchpad/getLastLaunchPadLayoutByScene
  getLastLaunchPadLayoutByScene = (communityItem, organizationItem) => {
    callApi({
      api: '/ui/launchpad/getLastLaunchPadLayoutByScene',
      data: {
        name: 'ServiceMarketLayout',
        sceneToken: communityItem.sceneToken
      },
      success: (res = {}) => {
        const layoutData = JSON.parse(res.layoutJson);
        const pGroups = layoutData.groups.filter(ele => {
          return ele.widget === 'Navigator';
        });
        const fulfillments = [];

        pGroups.map(item => {
          fulfillments.push(
            this.getAppInfo(communityItem, organizationItem, item)
          );
        });
        const self = this;
        const allApps = [];
        Promise.all(fulfillments).then(values => {
          values.map(category => {
            if (category.categoryDtos && category.categoryDtos.length > 0) {
              category.categoryDtos[0].appDtos &&
                category.categoryDtos[0].appDtos.map(item => {
                  allApps.push({
                    ...item,
                    label: item.name,
                    value: item.appId
                  });
                });
            }
          });
          self.setState({
            allApps
          });
        });
        // this.getApps()
      }
    });
  };

  getAppInfo = (communityItem, organizationItem, item) => {
    return new Promise((resolve, reject) => {
      callApi({
        api: '/launchpad/listAllApps',
        data: {
          groupId: item.groupId,
          context: {
            communityId: communityItem.id,
            organizationId: organizationItem.id
          }
        },
        success: (res = []) => {
          resolve(res);
        }
      });
    });
  };

  goHome = () => {
    const { appItem, communityItem, organizationItem } = this.state;
    const { clientHandlerType, router } = appItem;
    const params = {
      initContext: 1,
      aliasName: encodeURI(appItem.name),
      ns: this.namespaceId,
      familyId: organizationItem.id,
      communityId: communityItem.id,
      organizationId: organizationItem.id,
      sceneToken: communityItem.sceneToken
    };
    const link = window.parseRoute({
      clientHandlerType,
      router,
      baseParams: params,
      useScene: 'mobileJump'
    });
    console.log(link);
    if (link) {
      if (link.indexOf('.html') > -1) {
        const array = link.split('.html');
        const query = array[1] || '';
        location.href = `${location.protocol}//${location.host}${query}`;
      }
    } else {
      Toast.info('无效的链接');
    }
    // if (link) {
    // 	window.location.href = link;
    // }
  };

  render() {
    const {
      allApps = [],
      appItem = {},
      showAppList,
      allCommunities = [],
      communityItem = {},
      organizationItem = {},
      showCommunityList,
      scene = {}
    } = this.state;

    const menuEl = (
      <Menu
        className="foo-menu"
        data={allCommunities}
        onChange={item => this.selectCommunity(item)}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    const appMenuEl = (
      <Menu
        className="single-foo-menu"
        data={allApps}
        level={1}
        onChange={item => this.selectApp(item)}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    return (
      <div>
        {/* <Button onClick={() => this.logon()}>点击登录</Button> */}
        <div>
          <NavBar
            leftContent="选择项目"
            mode="light"
            onLeftClick={this.handleClick}
            className="top-nav-bar"
          >
            {communityItem.aliasName || '园区'}-
            {organizationItem.aliasName || '企业'}
          </NavBar>
        </div>

        <div>
          {communityItem.id && (
            <NavBar
              leftContent="选择应用"
              mode="light"
              onLeftClick={this.handleAppClick}
              className="single-top-nav-bar"
            >
              {appItem.name || '应用名'}
            </NavBar>
          )}
        </div>
        {showCommunityList ? menuEl : null}
        {communityItem.id && showAppList ? appMenuEl : null}
        {showCommunityList || showAppList ? (
          <div className="menu-mask" onClick={this.onMaskClick} />
        ) : null}

        <div style={{ width: '100vw', position: 'fixed', bottom: '0' }}>
          <Button
            onClick={() => {
              this.goHome();
            }}
          >
            带配置去首页
          </Button>
          <Button
            onClick={() => {
              location.href = `${window.location.protocol}//${window.location.host}/#/home`;
            }}
          >
            首页
          </Button>
        </div>
      </div>
    );
  }
}
export default Logon;
