import { createWebhookHandler } from '../handler-factory';
import { CustomerData, WebhookEvent, WebhookHandlerResponse } from "../types";
import { db, UserUsageTable } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { updateUserSubscriptionData } from "../utils";
import Stripe from "stripe";
import { trackLoopsEvent } from '@/lib/services/loops';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

async function getCustomerEmail(customerId: string): Promise<string> {
  try {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    return typeof customer === 'string' ? '' : customer.email || '';
  } catch (error) {
    console.error("Error retrieving customer email:", error);
    return '';
  }
}

async function handleTopUp(userId: string, tokens: number,) {
  console.log("Handling top-up for user", userId, "with", tokens, "tokens");

  await db
    .insert(UserUsageTable)
    .values({
      userId,
      maxTokenUsage: tokens,
      tokenUsage: 0,
      subscriptionStatus: 'active',
      paymentStatus: 'succeeded',
      currentProduct: 'top_up',
      currentPlan: 'top_up',
      billingCycle: 'top-up',
      lastPayment: new Date(),
    })
    .onConflictDoUpdate({
      target: [UserUsageTable.userId],
      set: {
        maxTokenUsage: sql`COALESCE(${UserUsageTable.maxTokenUsage}, 0) + ${tokens}`,
        lastPayment: new Date(),
        subscriptionStatus: 'active',
        paymentStatus: 'succeeded',
      },
    });
}



function createCustomerData(paymentIntent: Stripe.PaymentIntent): CustomerData {
  return {
    userId: paymentIntent.metadata?.userId,
    customerId: paymentIntent.customer?.toString() || "none",
    status: paymentIntent.status,
    billingCycle: "lifetime",
    paymentStatus: paymentIntent.status,
    product: "Lifetime",
    plan: "lifetime",
    lastPayment: new Date(),
  };
}



export const handlePaymentIntentSucceeded = createWebhookHandler(
  async (event) => {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.userId;
    const type = paymentIntent.metadata?.type;
    const tokens = parseInt(paymentIntent.metadata?.tokens || "0");

    if (type === "top_up") {
      await handleTopUp(userId, tokens);
      return {
        success: true,
        message: `Successfully processed top-up for ${userId}`,
      };
    }

    // Handle regular subscription payment
    const customerData = createCustomerData(paymentIntent);
    await updateUserSubscriptionData(customerData);

    return {
      success: true,
      message: `Successfully processed payment intent for ${userId}`,
    };
  },
  {
    requiredMetadata: ['userId'],
  }
); 