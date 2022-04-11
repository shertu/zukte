import {AppPage, PaymentFormik} from 'components';
import {Card, Typography} from '@mui/material';
import {CreatePaymentRequest, SquareServiceApi} from '@zukte/api-client';

import React from 'react';
import dynamic from 'next/dynamic';
import {ZUKTE_CONFIGURATION} from 'logic/configuration/zukte';
import Link from '../next-link-composed/next-link-composed';

const DynamicReactJson = dynamic(import('react-json-view'), {ssr: false});

const SLATE_CARD_CLASSNAME = 'p-4 bg-slate-100';

/**
 * An {@link AppPage} where the user can process a payment online using a third party payment provider and gateway.
 */
export function PaymentMicroservicePage() {
  const api = new SquareServiceApi(ZUKTE_CONFIGURATION);

  const [createPaymentResponse, setCreatePaymentResponse] = React.useState<
    object | null | undefined
  >();

  const [createPaymentError, setCreatePaymentError] =
    React.useState<boolean>(false);

  /**
   * The event called when the create payment form is submitted.
   */
  async function handleCreatePaymentRequest(request: CreatePaymentRequest) {
    try {
      let raw: Response;

      try {
        const response = await api.squareServiceCreatePaymentRaw({
          createPaymentRequest: request,
        });

        raw = response.raw;
      } catch (error) {
        raw = error as Response;
      }

      const json = await raw.json();
      setCreatePaymentResponse(json);
      setCreatePaymentError(false);
    } catch (error) {
      setCreatePaymentResponse(null);
      setCreatePaymentError(true);
    }
  }

  return (
    <AppPage className="space-y-4">
      <Typography>
        To use this service please input the payment amount and select the
        payment currency and for the card information please&nbsp;
        <Link href="https://developer.squareup.com/docs/testing/test-values">
          use one of the test numbers documented here.
        </Link>
      </Typography>
      <Typography>
        This service <strong>mocks</strong> the behaviour of a real payment
        gateway, i.e. no payments will actually be processed.
      </Typography>

      <Card className={SLATE_CARD_CLASSNAME}>
        <PaymentFormik
          handleCreatePaymentRequest={handleCreatePaymentRequest}
        />
      </Card>

      {(createPaymentResponse || createPaymentError) && (
        <Card className={SLATE_CARD_CLASSNAME}>
          {createPaymentResponse && (
            <DynamicReactJson src={createPaymentResponse} />
          )}

          {createPaymentError && (
            <Typography color="error">
              An unexpected error occurred while processing the payment.
            </Typography>
          )}
        </Card>
      )}
    </AppPage>
  );
}

export default PaymentMicroservicePage;
