import { createStateContext } from 'react-use';

const context = JSON.parse(window.sessionStorage.getItem('context'));

/**
 * count : 计数
 */
const [useSharedContext, SharedContextProvider] = createStateContext(
  context || { count: 0 }
);

export { useSharedContext, SharedContextProvider };
