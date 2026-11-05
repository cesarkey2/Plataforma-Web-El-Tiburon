import { relations } from "drizzle-orm";
import {
  claims,
  contactMessages,
  orderItems,
  orders,
  products,
  promotions,
  users,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  claims: many(claims),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  user: one(users, {
    fields: [claims.userId],
    references: [users.id],
  }),
}));

export const promotionsRelations = relations(promotions, () => ({}));
export const contactMessagesRelations = relations(contactMessages, () => ({}));
