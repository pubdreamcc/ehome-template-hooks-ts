import React from 'react';
import { pages } from '../app_config';

const routes = [];

const routeKeys = Object.keys(pages);

routeKeys.forEach(item => {
  const path = pages[item];
  const component = React.lazy(() =>
    import(
      /* webpackPrefetch: true */
      `${item}`
    )
  );
  routes.push({
    path,
    component
  });
});

export default routes;
