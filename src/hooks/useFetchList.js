import React, { useState } from 'react';
import { useAsyncRetry } from 'react-use';

/**
 * 配合ehome-rcm ListView组件封装列表逻辑，快速完成一个基础列表页
 *
 * @param {api} 请求api
 * @param {data} 请求参数，参数中无需传pageSize和pageAnchor
 * @param {pageSize} 分页，默认10条
 * @param {responseParams} response中的数组参数名
 */
function useFetchList({ api, data, pageSize = 10, responseParams = 'list' }) {
  const [refreshing, setRefreshing] = useState(false);
  const [pageAnchor, setPageAnchor] = useState(1);
  const [list, setListData] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);

  const state = useAsyncRetry(async () => {
    const response = await React.post({
      api,
      data: { ...data, pageSize, pageAnchor }
    });
    const { nextPageAnchor } = response;
    const _list = response[responseParams];

    setPageAnchor(nextPageAnchor);
    refreshing ? setListData(_list) : setListData([...list, ..._list]);
    setRefreshing(false);
    setNoMoreData(!nextPageAnchor);

    return response;
  }, [pageSize, api]);

  const reFetchList = () => {
    setRefreshing(true);
    setPageAnchor(1);
    state.retry();
  };

  return {
    refreshing,
    list,
    noMoreData,
    reFetchList,
    isLoading: state.loading,
    fetchList: state.retry
  };
}

export default useFetchList;
