import { StatusCodes } from "http-status-codes";
import { Shipping } from "../../../../../SendUBack/src/app/modules/shipping/shipping.model";
import ApiError from "../../../../../SendUBack/src/errors/ApiError";
import config from "../../../../../SendUBack/src/config";
import stripe from "../../../../../SendUBack/src/config/stripe";
import Stripe from "stripe";

export const createCheckoutSession = async (shippingId: string) => {
  // 1️⃣ Find shipping info
  const shipping = await Shipping.findById(shippingId).lean();

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shipping data not found!");
  }

  // 2️⃣ Payment amount → use total_cost
  const amount = shipping.total_cost
    ? Math.round(Number(shipping.total_cost) * 100)
    : null;

  if (!amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid total cost");
  }

  // 3️⃣ Prepare session params
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: shipping.address_to.email, // sender email
    line_items: [
      {
        price_data: {
          currency: "GBP",
          product_data: {
            name: `Shipping: ${shipping.zoneName.toUpperCase()}`,
            description: `From ${shipping.address_from.country} to ${shipping.address_to.country}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.stripe.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/payments/cancel`,

    metadata: {
      shipping_id: String(shipping._id),
    },
  };

  // 4️⃣ Create session
  const session = await stripe.checkout.sessions.create(params);

  return session.url;
};
