import React from 'react';
import { Link } from 'react-router-dom';
import { useSharedContext } from 'context';
import style from './detail.module.less';

function Detail() {
  const [context, setContext] = useSharedContext();

  return (
    <div>
      <h1 className={style.header}>detail</h1>
      <br />
      <h4 className={style.count}>当前count值：{context.count}</h4>
      <br />
      <Link
        to={'/home'}
        onClick={() =>
          setContext({
            ...context,
            count: context.count + 1
          })
        }
        className={style.route}
      >
        去home页
      </Link>
    </div>
  );
}

export default Detail;
