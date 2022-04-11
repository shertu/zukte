import {
  ApplicationError,
  TokenResult,
  TokenizationError,
} from '@square/web-sdk';
import {Formik, FormikErrors} from 'formik';
import {List, ListItem} from '@mui/material';

import {CreatePaymentRequest} from '@zukte/api-client';
import {PaymentForm} from './payment-form/payment-form';
import {PaymentFormValues} from './payment-form/values';
import React from 'react';
import {SQUARE_LOCATION_ID} from 'logic/configuration/square';
import {asyncnoop} from 'logic/noop';

import {Chance} from 'chance';
import {TokenStatus} from 'logic/token-status';

const ERROR_MESSAGE_REQUIRED = 'required';

export interface PaymentFormikProps {
  handleCreatePaymentRequest?: (request: CreatePaymentRequest) => Promise<void>;
}

/**
 * A {@link Formik} form used to submit a payment via the application's payment gateway service.
 */
export function PaymentFormik(props: PaymentFormikProps) {
  const {handleCreatePaymentRequest = asyncnoop} = props;

  const [tokenizationError, setTokenizationError] = React.useState<
    TokenizationError | null | undefined
  >();

  const chance = React.useMemo<Chance.Chance>(() => new Chance(), []);

  return (
    <Formik
      validate={async (values: PaymentFormValues) => {
        const {card, paymentAmount, paymentCurrencyCode} = values;

        const errors: FormikErrors<PaymentFormValues> = {};

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
      onSubmit={async (values: PaymentFormValues, formikHelpers) => {
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
            locationId: SQUARE_LOCATION_ID,
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
