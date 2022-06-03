import {Card} from '@square/web-sdk';

export interface PaymentFormV {
  card?: Card;
  paymentAmount?: number;
  paymentCurrencyCode?: string;
}

export const fnCard: keyof PaymentFormV = 'card';
export const fnPaymentAmount: keyof PaymentFormV = 'paymentAmount';
export const fnPaymentCurrencyCode: keyof PaymentFormV = 'paymentCurrencyCode';
