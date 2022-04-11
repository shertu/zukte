import {
  ApplicationError,
  TokenResult,
  TokenizationError,
} from '@square/web-sdk';
import {Formik, FormikErrors} from 'formik';
import {List, ListItem} from '@mui/material';

import {CreatePaymentRequest} from '@zukte/api-client';
import {PaymentForm} from './payment-form/payment-form';
import {PaymentFormV} from './payment-form/values';
import React from 'react';

import {Chance} from 'chance';
import {asyncnoop, TokenStatus} from 'business';

const ERROR_MESSAGE_REQUIRED = 'required';

export interface PaymentFormikP {
  /**
   * The hook called after the form is succesfully submitted and the server receives the responses.
   */
  onSuccessHook?: (request: CreatePaymentRequest) => Promise<void>;
}

/**
 * A {@link Formik} form used to submit a payment via the application's payment gateway service.
 */
export function PaymentFormik(props: PaymentFormikP) {
  const {onSuccessHook: handleCreatePaymentRequest = asyncnoop} = props;

  const [tokenizationError, setTokenizationError] = React.useState<
    TokenizationError | null | undefined
  >();

  const chance = React.useMemo<Chance.Chance>(() => new Chance(), []);

  return (
    <Formik
      validate={async (values: PaymentFormV) => {
        const {card, paymentAmount, paymentCurrencyCode} = values;

        const errors: FormikErrors<PaymentFormV> = {};

        if (!card) {
          errors.card = ERROR_MESSAGE_REQUIRED;
        }

        if (!(paymentAmount || paymentAmount === 0)) {
          errors.paymentAmount = ERROR_MESSAGE_REQUIRED;
        }

        if (!paymentCurrencyCode) {
          errors.paymentCurrencyCode = ERROR_MESSAGE_REQUIRED;
        }

        return errors;
      }}
      onSubmit={async (values: PaymentFormV, formikHelpers) => {
        const {card, paymentAmount, paymentCurrencyCode} = values;

        // part 1 - tokenize the card
        let newTokenResult: TokenResult | undefined;

        try {
          newTokenResult = await card?.tokenize();
          setTokenizationError(null);
        } catch (error) {
          setTokenizationError(error as TokenizationError);
          formikHelpers.setSubmitting(false);
        }

        if (newTokenResult?.status === TokenStatus.OK) {
          // part 2 - handle successful token result
          const request: CreatePaymentRequest = {
            locationId: process.env.SQUARE_LOCATION_ID,
            sourceId: newTokenResult.token,
            idempotencyKey: chance.guid(),
            amountMoney: {
              amount: paymentAmount,
              currency: paymentCurrencyCode,
            },
          };

          try {
            // wait for the create payment handler to finish
            await handleCreatePaymentRequest(request);
          } finally {
            // and regardless of the result, end the submission
            formikHelpers.setSubmitting(false);
          }
        } else {
          formikHelpers.setSubmitting(false);
        }
      }}
      initialValues={{
        card: undefined,
        paymentAmount: 0,
        paymentCurrencyCode: 'AUD',
      }}
    >
      {props => (
        <div className="space-y-4">
          <PaymentForm {...props} />

          {tokenizationError && (
            <List>
              {tokenizationError.errors.map(
                (error: ApplicationError, index) => (
                  <ListItem key={index}>{error.message}</ListItem>
                )
              )}
            </List>
          )}
        </div>
      )}
    </Formik>
  );
}

export default PaymentFormik;
