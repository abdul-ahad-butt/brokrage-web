/**
 * Mock Payments Service
 * Simulates split-payment processing.
 */
export const paymentsService = {
  /**
   * Process a bid acceptance via Stripe Connect split-payment.
   */
  async processBidAcceptance(params: {
    loadId: string;
    shipperId: string;
    carrierId: string;
    shipperTotal: number;
    carrierBidAmount: number;
  }): Promise<{
    bookingFeeCharged: number;
    carrierPayoutAmount: number;
    platformAccountTxnId: string;
    carrierPayoutInvoiceId: string;
  }> {
    const bookingFeeCharged = Math.round(params.shipperTotal * 0.1 * 100) / 100;
    const carrierPayoutAmount = params.carrierBidAmount;

    // Simulate external API network latency
    const delay = Math.floor(Math.random() * 300) + 100;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return {
      bookingFeeCharged,
      carrierPayoutAmount,
      platformAccountTxnId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      carrierPayoutInvoiceId: `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };
  },
};
