import { COOKIE_NAME } from "@shared/const";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  claims,
  contactMessages,
  orderItems,
  orders,
  products,
  promotions,
  users,
} from "../drizzle/schema";
import type { User } from "../drizzle/schema";
import { getDb } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { hashPassword, verifyPassword, createLocalSession } from "./localAuth";
import { notifyByFormSubmit } from "./forms";

const fallbackProducts = [
  { id: 1, name: "Causa de cangrejo", description: "Causa limeña rellena con cangrejo y salsa de la casa.", price: "10.00", imageUrl: "/figma/I474-4610;168-132.webp", isAvailable: true },
  { id: 2, name: "La morenita", description: "Especialidad marina con el sabor tradicional de El Tiburón.", price: "25.00", imageUrl: "/figma/I474-4611;168-132.webp", isAvailable: true },
  { id: 3, name: "Tiradito de pescado", description: "Láminas de pescado fresco bañadas en leche de tigre.", price: "28.00", imageUrl: "/figma/I474-4612;168-132.webp", isAvailable: true },
  { id: 4, name: "Ceviche de pescado", description: "Pescado fresco, limón, cebolla, ají y el toque de la casa.", price: "18.00", imageUrl: "/figma/I474-4609;168-132.webp", isAvailable: true },
  { id: 5, name: "Chicharrón de pescado", description: "Pescado crocante acompañado de sarsa criolla y papas doradas.", price: "22.00", imageUrl: "/figma/I474-4614;168-132.webp", isAvailable: true },
  { id: 6, name: "Jalea norteña", description: "Jalea marina para compartir con el toque norteño.", price: "26.00", imageUrl: "/figma/I474-4615;168-132.webp", isAvailable: true },
  { id: 7, name: "La Chitafrita", description: "Fusión marina crocante, generosa y llena de sabor.", price: "30.00", imageUrl: "/figma/I474-4616;168-132.webp", isAvailable: true },
  { id: 8, name: "Sudado mixto", description: "Pescado y mariscos en un caldo aromático tradicional.", price: "26.00", imageUrl: "/figma/I474-4617;168-132.webp", isAvailable: true },
];

const productInput = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(5).max(1000),
  price: z.number().positive().max(99999),
  imageUrl: z.string().trim().min(1).max(255),
  isAvailable: z.boolean().default(true),
});

const orderInput = z.object({
  customerName: z.string().trim().min(2).max(160),
  customerEmail: z.string().email().max(320),
  customerPhone: z.string().trim().min(7).max(32),
  attentionType: z.enum(["delivery", "pickup"]),
  address: z.string().trim().max(500).optional(),
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive().max(20) })).min(1).max(30),
});

function normalizeProduct(product: typeof fallbackProducts[number] | typeof products.$inferSelect) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: String(product.price),
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
  };
}

function publicUser(user: User) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function ensureDatabase(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) {
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "La base de datos no está disponible en este momento." });
  }
  return db;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user ? publicUser(opts.ctx.user) : null),
    register: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(160),
      email: z.string().trim().email().max(320),
      password: z.string().min(8).max(128),
    })).mutation(async ({ input, ctx }) => {
      const db = ensureDatabase(await getDb());
      const email = input.email.toLowerCase();
      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing.length) throw new TRPCError({ code: "CONFLICT", message: "Ya existe una cuenta con ese correo." });
      const passwordHash = await hashPassword(input.password);
      await db.insert(users).values({ name: input.name, email, passwordHash, openId: null, loginMethod: "local", role: "user" });
      const created = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const user = created[0];
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No se pudo crear la cuenta." });
      const token = await createLocalSession(user);
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: 1000 * 60 * 60 * 24 * 7 });
      return publicUser(user);
    }),
    login: publicProcedure.input(z.object({
      email: z.string().trim().email().max(320),
      password: z.string().min(1).max(128),
    })).mutation(async ({ input, ctx }) => {
      const db = ensureDatabase(await getDb());
      const user = await db.select().from(users).where(eq(users.email, input.email.toLowerCase())).limit(1);
      const found = user[0];
      if (!found?.passwordHash || !(await verifyPassword(input.password, found.passwordHash))) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Correo o contraseña incorrectos." });
      }
      if (found.accountStatus !== "active") {
        throw new TRPCError({ code: "FORBIDDEN", message: found.accountStatus === "suspended" ? "Tu cuenta está suspendida." : "Tu cuenta está cancelada." });
      }
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, found.id));
      const token = await createLocalSession(found);
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: 1000 * 60 * 60 * 24 * 7 });
      return publicUser(found);
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return { success: true } as const;
    }),
  }),
  products: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return fallbackProducts;
      const rows = await db.select().from(products).where(eq(products.isAvailable, true));
      return rows.length ? rows.map(normalizeProduct) : fallbackProducts;
    }),
    getById: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return fallbackProducts.find(product => product.id === input.id) ?? null;
      const rows = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      return rows[0] ? normalizeProduct(rows[0]) : null;
    }),
  }),
  orders: router({
    create: publicProcedure.input(orderInput).mutation(async ({ input, ctx }) => {
      const db = ensureDatabase(await getDb());
      const selected = await Promise.all(input.items.map(item => db.select().from(products).where(eq(products.id, item.productId)).limit(1)));
      const lines = selected.map((rows, index) => {
        const product = rows[0];
        if (!product || !product.isAvailable) throw new TRPCError({ code: "BAD_REQUEST", message: "Uno de los productos seleccionados no está disponible." });
        const quantity = input.items[index].quantity;
        const unitPrice = Number(product.price);
        return { product, quantity, unitPrice, subtotal: unitPrice * quantity };
      });
      const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
      const code = `ET-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${nanoid(5).toUpperCase()}`;
      await db.insert(orders).values({
        code,
        userId: ctx.user?.id ?? null,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        attentionType: input.attentionType,
        address: input.address || null,
        subtotal: subtotal.toFixed(2),
        total: subtotal.toFixed(2),
        status: "pending",
      });
      const created = await db.select().from(orders).where(eq(orders.code, code)).limit(1);
      const order = created[0];
      if (!order) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No se pudo confirmar el pedido." });
      await db.insert(orderItems).values(lines.map(line => ({
        orderId: order.id,
        productId: line.product.id,
        productName: line.product.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice.toFixed(2),
        subtotal: line.subtotal.toFixed(2),
      })));
      return { code, status: order.status, total: order.total };
    }),
    byCode: publicProcedure.input(z.object({ code: z.string().trim().min(4).max(32) })).query(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      const found = await db.select().from(orders).where(eq(orders.code, input.code)).limit(1);
      const order = found[0];
      if (!order) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    }),
  }),
  claims: router({
    create: publicProcedure.input(z.object({
      fullName: z.string().trim().min(3).max(160),
      email: z.string().email().max(320),
      phone: z.string().trim().min(7).max(32),
      documentNumber: z.string().trim().min(8).max(32),
      claimType: z.enum(["claim", "complaint"]),
      description: z.string().trim().min(20).max(3000),
    })).mutation(async ({ input, ctx }) => {
      const db = ensureDatabase(await getDb());
      await db.insert(claims).values({ ...input, userId: ctx.user?.id ?? null, status: "registered" });
      void notifyByFormSubmit("Nuevo reclamo — Cevichería El Tiburón", {
        nombre: input.fullName,
        correo: input.email,
        teléfono: input.phone,
        documento: input.documentNumber,
        tipo: input.claimType,
        descripción: input.description,
      });
      return { success: true } as const;
    }),
  }),
  contact: router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(80),
      lastName: z.string().trim().min(2).max(80),
      email: z.string().email().max(320),
      message: z.string().trim().min(5).max(2000),
    })).mutation(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      await db.insert(contactMessages).values({ ...input, status: "unread" });
      void notifyByFormSubmit("Nuevo mensaje de contacto — Cevichería El Tiburón", input);
      return { success: true } as const;
    }),
  }),
  admin: router({
    dashboard: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      const [productRows, orderRows, claimRows] = await Promise.all([
        db.select({ id: products.id }).from(products),
        db.select({ id: orders.id }).from(orders),
        db.select({ id: claims.id }).from(claims),
      ]);
      return { products: productRows.length, orders: orderRows.length, claims: claimRows.length };
    }),
    products: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      return db.select().from(products).orderBy(desc(products.createdAt));
    }),
    createProduct: adminProcedure.input(productInput).mutation(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      await db.insert(products).values({ ...input, price: input.price.toFixed(2) });
      return { success: true } as const;
    }),
    updateProduct: adminProcedure.input(z.object({ id: z.number().int().positive(), ...productInput.shape })).mutation(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      await db.update(products).set({
        name: input.name,
        description: input.description,
        price: input.price.toFixed(2),
        imageUrl: input.imageUrl,
        isAvailable: input.isAvailable,
      }).where(eq(products.id, input.id));
      return { success: true } as const;
    }),
    promotions: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      return db.select().from(promotions).orderBy(desc(promotions.createdAt));
    }),
    createPromotion: adminProcedure.input(z.object({ name: z.string().trim().min(2).max(160), description: z.string().trim().min(2).max(1000), type: z.enum(["percentage", "fixed"]), value: z.number().positive(), isActive: z.boolean().default(true) })).mutation(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      await db.insert(promotions).values({ ...input, value: input.value.toFixed(2), type: input.type });
      return { success: true } as const;
    }),
    orders: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      return db.select().from(orders).orderBy(desc(orders.createdAt));
    }),
    updateOrderStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]) })).mutation(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
      return { success: true } as const;
    }),
    claims: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      return db.select().from(claims).orderBy(desc(claims.createdAt));
    }),
    updateClaimStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["registered", "in_review", "resolved"]) })).mutation(async ({ input }) => {
      const db = ensureDatabase(await getDb());
      await db.update(claims).set({ status: input.status }).where(eq(claims.id, input.id));
      return { success: true } as const;
    }),
    messages: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    }),
    users: adminProcedure.query(async () => {
      const db = ensureDatabase(await getDb());
      return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, accountStatus: users.accountStatus, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.createdAt));
    }),
    updateUserStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), accountStatus: z.enum(["active", "suspended", "cancelled"]) })).mutation(async ({ input, ctx }) => {
      if (input.id === ctx.user?.id) throw new TRPCError({ code: "BAD_REQUEST", message: "No puedes cambiar el estado de tu propia cuenta." });
      const db = ensureDatabase(await getDb());
      await db.update(users).set({ accountStatus: input.accountStatus }).where(eq(users.id, input.id));
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
