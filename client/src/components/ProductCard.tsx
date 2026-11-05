import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/data/products";
import { Link } from "wouter";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link href={`/productos/${product.id}`} className="product-image-link" aria-label={`Ver ${product.name}`}>
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </Link>
      <div className="product-content">
        <div className="product-title-row">
          <Link href={`/productos/${product.id}`} className="product-name">{product.name}</Link>
          <button className="buy-button" onClick={() => addItem(product)}><ShoppingCart size={14} /> Comprar</button>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="stars" aria-label="5 estrellas">{[1, 2, 3, 4, 5].map(star => <Star key={star} size={15} fill="currentColor" />)}</span>
          <strong>S/ {Number(product.price).toFixed(2)}</strong>
        </div>
      </div>
    </article>
  );
}
