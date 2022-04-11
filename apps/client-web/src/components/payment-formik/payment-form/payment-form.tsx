import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  PaymentFormValues,
  fnCard,
  fnPaymentAmount,
  fnPaymentCurrencyCode,
} from './values';

import {CurrencySelect} from 'src/components/currency-select/currency-select';
import {FormikProps} from 'formik';
import React from 'react';

const PAYMENT_CURRENCY_CODE_LABEL = 'Payment Currency';

/** The underlying form component. */
export function PaymentForm(props: FormikProps<PaymentFormValues>) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = props;

  const cardContainerRef = React.useRef<HTMLDivElement>(null);

  /**
   * Initializes the Web Payments SDK by calling Square.payments().
   * Initializes the Card payment method by calling the Payments .card() method and
   * attaching the payment method to the page DOM by calling the Card .attach() method.
   */
  async function configureSquarePayments(
    element: HTMLElement,
    applicationId: string,
    locationId?: string
  ) {
    const payments = (await import('@square/web-sdk')).payments;

    if (element.childElementCount === 0) {
      const value = await payments(applicationId, locationId);

      if (value) {
        const card = await value.card();
        card.attach(element);
        setFieldValue(fnCard, card);
      }
    }
  }

  React.useEffect(() => {
    const SQUARE_APP_ID = process.env.SQUARE_APP_ID;
    const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

    if (cardContainerRef.current && SQUARE_APP_ID) {
      configureSquarePayments(
        cardContainerRef.current,
        SQUARE_APP_ID,
        SQUARE_LOCATION_ID
      );
    }
  }, [cardContainerRef]);

  return (
    <form noValidate onSubmit={handleSubmit} className="p-4 space-y-4">
      <TextField
        className="bg-white"
        fullWidth
        name={fnPaymentAmount}
        label="Payment Amount"
        type="number"
        value={values.paymentAmount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.paymentAmount && !!errors.paymentAmount}
        helperText={touched.paymentAmount && errors.paymentAmount}
      />

      <FormControl fullWidth>
        <InputLabel id="paymentCurrencyCode-label">
          {PAYMENT_CURRENCY_CODE_LABEL}
        </InputLabel>
        <CurrencySelect
          className="bg-white"
          name={fnPaymentCurrencyCode}
          label={PAYMENT_CURRENCY_CODE_LABEL}
          labelId="paymentCurrencyCode-label"
          value={values.paymentCurrencyCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.paymentCurrencyCode && !!errors.paymentCurrencyCode}
        />
        <FormHelperText>
          {touched.paymentCurrencyCode && errors.paymentCurrencyCode}
        </FormHelperText>
      </FormControl>

      <div ref={cardContainerRef} />

      <FormControl fullWidth className="items-end">
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          process payment
        </Button>
      </FormControl>
    </form>
  );
}
