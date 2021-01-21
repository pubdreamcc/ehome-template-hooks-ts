import React from 'react';
import { Link } from 'react-router-dom';
import { toUpper } from 'lodash-es';

import { useSharedContext } from 'context';
import style from './home.module.less';

export default function Home() {
  const [context, setContext] = useSharedContext();

  return (
    <div>
      <h1 className={style.header}>{toUpper('home')}</h1>
      <br />
      <h4 className={style.count}>当前count值为: {context?.count} </h4>
      <br />
      <Link
        to={'/home/detail'}
        onClick={() =>
          setContext({
            ...context,
            count: context?.count + 1
          })
        }
        className={style.route}
      >
        去详情页
      </Link>
    </div>
  );
}
