import { ArrowRight, Clock3, MapPin, MessageCircle, ShieldCheck, Star, Truck, Utensils } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import { sampleProducts } from "@/data/products";
import { trpc } from "@/lib/trpc";

const benefits = [
  { icon: Truck, title: "Delivery gratis", text: "Todas las órdenes" },
  { icon: ArrowRight, title: "Devoluciones", text: "Devolución del dinero" },
  { icon: Utensils, title: "Oferta y regalo", text: "En todos los pedidos" },
  { icon: ShieldCheck, title: "Pago seguro", text: "Tu seguridad es primero" },
];

const reviews = [
  { name: "Roberto Chang Mendoza", text: "Pedí ceviche por delivery y honestamente no esperaba mucho. El pescado llegó fresco, el limón en su punto y la plataforma fue muy fácil de usar." },
  { name: "Susan Ramírez Torres", text: "Como familia amante del ceviche, quedamos encantados. La porción es generosa, todo llega bien presentado y sabe igual que en la playa." },
  { name: "Carmen Villegas de Hudman", text: "Trabajo desde casa y ahora puedo pedir un plato fresco en pocos minutos. El servicio es rápido y la comida siempre llega deliciosa." },
];

export default function Home() {
  const { data } = trpc.products.list.useQuery();
  const products = data?.length ? data : sampleProducts;
  const contact = trpc.contact.create.useMutation({ onSuccess: () => toast.success("Mensaje enviado. Pronto nos pondremos en contacto."), onError: () => toast.error("No se pudo enviar el mensaje. Inténtalo nuevamente.") });
  const [form, setForm] = useState({ name: "", lastName: "", email: "", message: "" });

  const submitContact = (event: React.FormEvent) => {
    event.preventDefault();
    contact.mutate(form);
  };

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section" id="inicio">
          <img src="/figma/I474-4670;474-4715.webp" alt="Ceviche fresco de El Tiburón" className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-copy">
            <p className="eyebrow">UNA PARTE DE NUESTRA ESENCIA</p>
            <h1>Cocinamos con Pasión</h1>
            <p>En El Tiburón somos peruanos y estamos hechos del mar. Preparamos comida marina fresca con recetas tradicionales y el cariño de siempre.</p>
            <Link className="primary-button" href="/productos">Explorar el menú <ArrowRight size={18} /></Link>
          </div>
        </section>

        <section className="section-block about-section" id="nosotros">
          <div className="section-heading"><span>Tradición e innovación</span><h2>Nosotros</h2></div>
          <div className="about-grid">
            <div className="about-media"><img src="/figma/474-4621.webp" alt="Plato marino servido en El Tiburón" /><div className="play-badge">▶</div></div>
            <div className="about-copy">
              <h3>¿Por qué elegirnos?</h3>
              <p>Ofrecemos productos del mar frescos y de alta calidad, preparados artesanalmente cada día: ceviches, tiraditos, chicharrones y más especialidades marinas auténticas.</p>
              <p>Ahora puedes explorar nuestro menú completo, conocer promociones y hacer tu pedido desde nuestra plataforma web.</p>
              <Link href="/nosotros" className="outline-button">Conoce nuestra historia <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="benefit-grid">{benefits.map(({ icon: Icon, title, text }) => <div className="benefit-card" key={title}><Icon size={32} /><div><strong>{title}</strong><span>{text}</span></div></div>)}</div>
        </section>

        <section className="section-block products-section" id="productos">
          <div className="section-heading"><span>Frescura en cada plato</span><h2>Lista de Productos</h2></div>
          <div className="product-grid">{products.slice(0, 8).map(product => <ProductCard product={product} key={product.id} />)}</div>
          <div className="centered-action"><Link href="/productos" className="primary-button">Ver menú completo <ArrowRight size={18} /></Link></div>
        </section>

        <section className="section-block reviews-section" id="resenas">
          <div className="section-heading"><span>Lo dicen nuestros clientes</span><h2>Opinión del Cliente</h2></div>
          <div className="reviews-grid">{reviews.map(review => <article className="review-card" key={review.name}><div className="review-header"><div className="review-avatar">{review.name.charAt(0)}</div><div><strong>{review.name}</strong><span>Cliente feliz</span><span className="stars">{[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}</span></div></div><p>“{review.text}”</p></article>)}</div>
        </section>

        <section className="section-block contact-section" id="contacto">
          <div className="section-heading"><span>Estamos para atenderte</span><h2>Contacte con Nosotros</h2></div>
          <div className="contact-grid">
            <form className="contact-form" onSubmit={submitContact}>
              <div className="form-row"><label>Nombre<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Ingrese su nombre" /></label><label>Apellido<input required value={form.lastName} onChange={event => setForm({ ...form, lastName: event.target.value })} placeholder="Ingrese su apellido" /></label></div>
              <label>Dirección de correo electrónico<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="usuario@gmail.com" /></label>
              <label>Tu mensaje<textarea required rows={5} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="Introduce tu pregunta o mensaje" /></label>
              <button className="primary-button" type="submit" disabled={contact.isPending}>Enviar mensaje</button>
            </form>
            <img src="/figma/474-4541.webp" alt="Mascota de El Tiburón" className="contact-illustration" />
          </div>
          <div className="contact-details"><span><MapPin size={18} /> Victor Alzamora 201 · Lima, Perú</span><span><Clock3 size={18} /> Lunes a sábado · 9:00 a. m. - 5:00 p. m.</span><span><MessageCircle size={18} /> Atención cálida por WhatsApp</span></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
