import {Breadcrumbs} from '@material-ui/core';
import {Home} from '@material-ui/icons';
import Link from '../next-link-composed/next-link-composed';
import React from 'react';
import {useRouter} from 'next/router';

/**
 * A breadcrumb component for the window's location.
 */
export function LocationBreadcrumb() {
  const router = useRouter();
  const pathSnippets = router.pathname.split('/').filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Link key={index} href={url} className="align-middle">
        {_}
      </Link>
    );
  });

  const breadcrumbItems = [
    <Link key="home" href="/">
      <Home className="align-middle" />
    </Link>,
  ].concat(extraBreadcrumbItems);

  return (
    <Breadcrumbs className="flex items-center h-16" aria-label="breadcrumb">
      {breadcrumbItems}
    </Breadcrumbs>
  );
}
