export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
};

export const sampleProducts: Product[] = [
  { id: 1, name: "Causa de cangrejo", description: "Causa limeña rellena con cangrejo y salsa de la casa.", price: "10.00", imageUrl: "/figma/I474-4610;168-132.webp", isAvailable: true },
  { id: 2, name: "La morenita", description: "Especialidad marina con el sabor tradicional de El Tiburón.", price: "25.00", imageUrl: "/figma/I474-4611;168-132.webp", isAvailable: true },
  { id: 3, name: "Tiradito de pescado", description: "Láminas de pescado fresco bañadas en leche de tigre.", price: "28.00", imageUrl: "/figma/I474-4612;168-132.webp", isAvailable: true },
  { id: 4, name: "Ceviche de pescado", description: "Pescado fresco, limón, cebolla, ají y el toque de la casa.", price: "18.00", imageUrl: "/figma/I474-4609;168-132.webp", isAvailable: true },
  { id: 5, name: "Chicharrón de pescado", description: "Pescado crocante acompañado de sarsa criolla y papas doradas.", price: "22.00", imageUrl: "/figma/I474-4614;168-132.webp", isAvailable: true },
  { id: 6, name: "Jalea norteña", description: "Jalea marina para compartir con el toque norteño.", price: "26.00", imageUrl: "/figma/I474-4615;168-132.webp", isAvailable: true },
  { id: 7, name: "La Chitafrita", description: "Fusión marina crocante, generosa y llena de sabor.", price: "30.00", imageUrl: "/figma/I474-4616;168-132.webp", isAvailable: true },
  { id: 8, name: "Sudado mixto", description: "Pescado y mariscos en un caldo aromático tradicional.", price: "26.00", imageUrl: "/figma/I474-4617;168-132.webp", isAvailable: true },
];
