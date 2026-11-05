import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import { sampleProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

export function ProductsPage() {
  const { data } = trpc.products.list.useQuery();
  const products = data?.length ? data : sampleProducts;
  return <div className="site-shell"><SiteHeader /><main className="page-main"><div className="page-hero"><span>El sabor del mar peruano</span><h1>Nuestro menú</h1><p>Elige tus favoritos y arma tu pedido en pocos pasos.</p></div><div className="product-grid product-grid-large">{products.map(product => <ProductCard product={product} key={product.id} />)}</div></main><SiteFooter /></div>;
}

export function ProductDetailPage() {
  const [, params] = useRoute("/productos/:id");
  const id = Number(params?.id);
  const { data } = trpc.products.getById.useQuery({ id }, { enabled: Number.isInteger(id) && id > 0 });
  const product = data ?? sampleProducts.find(item => item.id === id);
  const { addItem } = useCart();
  if (!product) return <div className="site-shell"><SiteHeader /><main className="page-main empty-state"><h1>Producto no encontrado</h1><Link href="/productos" className="primary-button">Volver al menú</Link></main><SiteFooter /></div>;
  return <div className="site-shell"><SiteHeader /><main className="page-main"><Link href="/productos" className="back-link"><ArrowLeft size={16} /> Volver al menú</Link><div className="detail-card"><img src={product.imageUrl} alt={product.name} /><div><span className="eyebrow">Especialidad de la casa</span><h1>{product.name}</h1><p>{product.description}</p><strong className="detail-price">S/ {Number(product.price).toFixed(2)}</strong><button className="primary-button" onClick={() => { addItem(product); toast.success("Producto agregado al carrito"); }}><ShoppingCart size={18} /> Agregar al carrito</button><Link href="/carrito" className="text-link">Ir al carrito <ArrowRight size={16} /></Link></div></div></main><SiteFooter /></div>;
}
