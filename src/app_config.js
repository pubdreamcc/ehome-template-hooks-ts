const pages = {
  './home/index': '/home', // 首页
  './home/routes/detail/index': '/home/detail' // 首页详情页
};

// 映射关系，统一维护
const AlarmTypeEnum = new Map([
  [1, '火警'],
  [2, '故障'],
  [3, '联动']
]);

const api = {
  // 查询消防告警楼层
  listFloors: '/fireAlarm/listFloors'
};

export { pages, api, AlarmTypeEnum };
