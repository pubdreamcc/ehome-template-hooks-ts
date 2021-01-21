import { useRef, useEffect } from 'react';
import { useToggle } from 'react-use';

/**
 * 按钮操作防抖，第一次点击后ms内不能重复操作
 *
 * @param {*} fn 按钮回调
 * @param {*} ms n秒内不允许再触发操作
 * @returns
 */
function useBtnDebounce(fn, ms) {
  const [onOff, toggle] = useToggle(true);
  const Lock = useRef(true);

  useEffect(() => {
    !Lock.current && fn();
    let timer = setTimeout(() => {
      Lock.current = false;
    }, ms);
    Lock.current = true;
    return () => {
      clearTimeout(timer);
      timer = null;
    };
  }, [fn, ms, onOff]);

  return [toggle];
}

export default useBtnDebounce;
