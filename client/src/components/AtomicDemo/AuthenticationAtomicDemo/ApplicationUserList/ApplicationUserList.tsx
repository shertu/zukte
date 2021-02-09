import {ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest} from '../../../../openapi-generator';
import {InfiniteScrollPageList, OnLoadInformation} from '../../../InfiniteScrollPageList/InfiniteScrollPageList';

import {ApplicationUserListItem} from './ApplicationUserListItem/ApplicationUserListItem';
import {ListProps} from 'antd';
import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserList(props: {
  mineApplicationUsers?: ApplicationUser[];
}): JSX.Element {
  const {mineApplicationUsers} = props;

  const client = new ApplicationUserServiceApi();
  const paginationPageSize: number = 30;

  const [infoState, setInfoState] =
    React.useState<OnLoadInformation<ApplicationUser>>();

  console.log('ApplicationUserList', {
    infoState: infoState,
  });

  /** an event which will attempt to load additional items */
  async function onLoadMore(info: OnLoadInformation<ApplicationUser>) {
    const request: ApplicationUserServiceGetListRequest = {
      maxResults: paginationPageSize,
    };

    if (info.nextPageToken) {
      request.pageToken = info.nextPageToken;
    }

    const response: ApplicationUserListResponse =
      await client.applicationUserServiceGetList(request);

    const currItems: ApplicationUser[] = info.items || [];
    const additionalItems: ApplicationUser[] = response.items || [];

    const newInfoState: OnLoadInformation<ApplicationUser> = {
      items: currItems.concat(additionalItems),
      nextPageToken: response.nextPageToken,
      hasMadeAtLeastOneFetch: true,
    };

    setInfoState(newInfoState);
  }

  const USED_INFO_STATE: OnLoadInformation<ApplicationUser> = {
    ...infoState,
  };

  // this should be set using state mutations but it works for now
  if (mineApplicationUsers?.length) {
    const items: ApplicationUser[] = infoState?.items || [];
    const filteredForMine: ApplicationUser[] = items
        .filter((a) => !mineApplicationUsers.find((b) => b.id === a.id));
    USED_INFO_STATE.items = mineApplicationUsers.concat(filteredForMine);
  }

  const listProps: ListProps<ApplicationUser> = {
    renderItem: (item: ApplicationUser, index: number) => <ApplicationUserListItem
      user={item} mineApplicationUsers={mineApplicationUsers} />,
    itemLayout: 'vertical',
  };

  return (
    <InfiniteScrollPageList
      onLoadInformation={USED_INFO_STATE}
      onLoadNextAsync={onLoadMore}
      paginationPageSize={paginationPageSize}
      list={listProps}
    />
  );
}
