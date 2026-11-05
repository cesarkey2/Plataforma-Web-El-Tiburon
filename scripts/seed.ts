import { getDb } from "../server/db";
import { products, promotions } from "../drizzle/schema";

const seedProducts = [
  { name: "Causa de cangrejo", description: "Causa limeña rellena con cangrejo y salsa de la casa.", price: "10.00", imageUrl: "/figma/I474-4610;168-132.webp", isAvailable: true },
  { name: "La morenita", description: "Especialidad marina con el sabor tradicional de El Tiburón.", price: "25.00", imageUrl: "/figma/I474-4611;168-132.webp", isAvailable: true },
  { name: "Tiradito de pescado", description: "Láminas de pescado fresco bañadas en leche de tigre.", price: "28.00", imageUrl: "/figma/I474-4612;168-132.webp", isAvailable: true },
  { name: "Ceviche de pescado", description: "Pescado fresco, limón, cebolla, ají y el toque de la casa.", price: "18.00", imageUrl: "/figma/I474-4609;168-132.webp", isAvailable: true },
  { name: "Chicharrón de pescado", description: "Pescado crocante acompañado de sarsa criolla y papas doradas.", price: "22.00", imageUrl: "/figma/I474-4614;168-132.webp", isAvailable: true },
  { name: "Jalea norteña", description: "Jalea marina para compartir con el toque norteño.", price: "26.00", imageUrl: "/figma/I474-4615;168-132.webp", isAvailable: true },
  { name: "La Chitafrita", description: "Fusión marina crocante, generosa y llena de sabor.", price: "30.00", imageUrl: "/figma/I474-4616;168-132.webp", isAvailable: true },
  { name: "Sudado mixto", description: "Pescado y mariscos en un caldo aromático tradicional.", price: "26.00", imageUrl: "/figma/I474-4617;168-132.webp", isAvailable: true },
];

const db = await getDb();
if (!db) throw new Error("DATABASE_URL no disponible");
const existing = await db.select({ id: products.id }).from(products);
if (existing.length === 0) {
  await db.insert(products).values(seedProducts);
  await db.insert(promotions).values({ name: "Bienvenida El Tiburón", description: "Delivery gratis en tu primer pedido.", type: "percentage", value: "0.00", isActive: true });
  console.log(`Seed completado: ${seedProducts.length} productos.`);
} else {
  console.log(`Seed omitido: ya existen ${existing.length} productos.`);
}
