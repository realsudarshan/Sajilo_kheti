// FRONTEND: src/lib/esewa.utils.ts

import crypto from 'crypto';

export const ESEWA_CONFIG = {
  merchantCode: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE ?? 'EPAYTEST',
  secretKey:    process.env.ESEWA_SECRET_KEY ?? '8gBm/:&EnhH.1/q',
  baseUrl:      process.env.NEXT_PUBLIC_ESEWA_BASE_URL ?? 'https://rc-epay.esewa.com.np',
  appUrl:       process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
};

/**
 * Generates HMAC-SHA256 base64 signature for the INITIATE step.
 * Used when building the form fields to send to eSewa.
 * Message format: "total_amount=X,transaction_uuid=Y,product_code=Z"
 */
export function generateEsewaSignature(params: {
  totalAmount:     number;
  transactionUuid: string;
  productCode:     string;
}): string {
  const message = `total_amount=${params.totalAmount},transaction_uuid=${params.transactionUuid},product_code=${params.productCode}`;
  return crypto
    .createHmac('sha256', ESEWA_CONFIG.secretKey)
    .update(message)
    .digest('base64');
}

/**
 * Verifies the base64 `data` param that eSewa sends on success redirect.
 *
 * KEY FIX: eSewa signs based on `signed_field_names` in the response — which
 * includes ALL fields (transaction_code, status, total_amount, etc.), NOT just
 * the 3 fields we used when initiating. We must build the message from the
 * actual signed_field_names list in the same order.
 *
 * Also: total_amount in the callback is a STRING like "2000.0" — keep it as-is,
 * do NOT convert to number before hashing or the signature won't match.
 */
export function verifyEsewaCallback(encodedData: string): {
  valid:   boolean;
  decoded: EsewaCallbackPayload | null;
} {
  try {
    const decoded: EsewaCallbackPayload = JSON.parse(
      Buffer.from(encodedData, 'base64').toString('utf-8')
    );

    // Build message from signed_field_names in the order eSewa provides
    const signedFields = decoded.signed_field_names.split(',');
    const message = signedFields
      .map((field) => `${field}=${(decoded as any)[field]}`)
      .join(',');

    const expected = crypto
      .createHmac('sha256', ESEWA_CONFIG.secretKey)
      .update(message)
      .digest('base64');

    return { valid: expected === decoded.signature, decoded };
  } catch {
    return { valid: false, decoded: null };
  }
}

/** Builds all fields needed to POST to eSewa payment page */
export function buildEsewaFormFields(params: {
  amount:          number;
  transactionUuid: string;
  successUrl:      string;
  failureUrl:      string;
}): EsewaFormFields {
  const signature = generateEsewaSignature({
    totalAmount:     params.amount,
    transactionUuid: params.transactionUuid,
    productCode:     ESEWA_CONFIG.merchantCode,
  });

  return {
    amount:                  params.amount,
    tax_amount:              0,
    total_amount:            params.amount,
    transaction_uuid:        params.transactionUuid,
    product_code:            ESEWA_CONFIG.merchantCode,
    product_service_charge:  0,
    product_delivery_charge: 0,
    success_url:             params.successUrl,
    failure_url:             params.failureUrl,
    signed_field_names:      'total_amount,transaction_uuid,product_code',
    signature,
  };
}

export interface EsewaFormFields {
  amount:                  number;
  tax_amount:              number;
  total_amount:            number;
  transaction_uuid:        string;
  product_code:            string;
  product_service_charge:  number;
  product_delivery_charge: number;
  success_url:             string;
  failure_url:             string;
  signed_field_names:      string;
  signature:               string;
}

// Note: total_amount is a STRING from eSewa callback (e.g. "2000.0")
export interface EsewaCallbackPayload {
  transaction_code:    string;
  status:              string;
  total_amount:        string;   // ← STRING, not number
  transaction_uuid:    string;
  product_code:        string;
  signed_field_names:  string;
  signature:           string;
}