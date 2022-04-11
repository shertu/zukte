import {Card} from '@square/web-sdk';

export interface PaymentFormValues {
  card?: Card;
  paymentAmount?: number;
  paymentCurrencyCode?: string;
}

export const fnCard: keyof PaymentFormValues = 'card';
export const fnPaymentAmount: keyof PaymentFormValues = 'paymentAmount';
export const fnPaymentCurrencyCode: keyof PaymentFormValues =
  'paymentCurrencyCode';
