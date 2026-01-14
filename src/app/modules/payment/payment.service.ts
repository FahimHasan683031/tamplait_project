import QueryBuilder from "../../../../../SendUBack/src/app/builder/QueryBuilder";
import { createCheckoutSession } from "./createCheckoutSession"
import { IPayment } from "./payment.interface";
import { Payment } from "./payment.model";

// Create seassion
const creatSession = async (quoteId: string,) => {
  const url = await createCheckoutSession(quoteId)

  return { url }
}

// create payment
const createPayment = async (payload: Partial<IPayment>) => {
  const payment = await Payment.create(payload);
  return payment;
};

// get payments
const getPayments = async (query: Record<string, unknown>) => {
  const paymentQueryBuilder = new QueryBuilder(Payment.find(), query)
    .filter()
    .sort()
    .paginate();

  const payments = await paymentQueryBuilder.modelQuery;
  const paginationInfo = await paymentQueryBuilder.getPaginationInfo();

  return {
    data: payments,
    meta: paginationInfo,
  };
};

// get payment by id
const getPaymentById = async (id: string) => {
  const payment = await Payment.findById(id).populate('quoteId');
  return payment;
};



export const PaymentService = {
  creatSession,
  createPayment,
  getPayments,
  getPaymentById,
}