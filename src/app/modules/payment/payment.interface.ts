import { Types } from 'mongoose';

export type IPayment = {
  _id: Types.ObjectId;
  email: string;
  dateTime: Date;
  shippingId: Types.ObjectId;
  amount: number;
  transactionId: string;
  description?: string;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
};