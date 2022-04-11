import {Breadcrumbs, BreadcrumbsProps} from '@mui/material';

import {Home} from '@mui/icons-material';
import Link from '../next-link-composed/next-link-composed';
import React from 'react';
import {useRouter} from 'next/router';

/**
 * A {@link Breadcrumbs} component for the router's location.
 */
export function LocationBreadcrumb(props: BreadcrumbsProps) {
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
  return <Breadcrumbs {...props}>{breadcrumbItems}</Breadcrumbs>;
}

export default LocationBreadcrumb;
