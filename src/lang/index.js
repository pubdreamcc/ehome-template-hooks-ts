import enUsLangs from '../../.kiwi/en-US';
import zhCNLangs from '../../.kiwi/zh-CN';
// 引入kwiInit，也提供了获取当前语言的getCurrentLang包
import { kiwiInit } from 'ehome-utils';
// 初始化，传入中英文目录
const I18N = kiwiInit(enUsLangs, zhCNLangs);
export default I18N;
