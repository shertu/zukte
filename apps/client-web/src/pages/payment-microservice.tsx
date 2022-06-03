import {AppHeader, PaymentMicroservicePage} from 'components';

import React from 'react';

/**
 * The page which demonstrates an online payment service integration.
 */
export function PaymentMicroservice() {
  return (
    <>
      <AppHeader />
      <PaymentMicroservicePage />
    </>
  );
}

export default PaymentMicroservice;
