import { CheckCircle2, Clock3, Search, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { trpc } from "@/lib/trpc";

const steps = ["pending", "confirmed", "preparing", "ready", "delivered"];
const labels: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmado", preparing: "En preparación", ready: "Listo", delivered: "Entregado", cancelled: "Cancelado" };

export default function OrderStatusPage() {
  const [code, setCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const query = trpc.orders.byCode.useQuery({ code: submittedCode }, { enabled: submittedCode.length > 0 });
  const order = query.data;
  const currentIndex = order ? steps.indexOf(order.status) : -1;
  return <div className="site-shell"><SiteHeader /><main className="page-main"><div className="page-hero compact"><span>Seguimiento</span><h1>Consulta tu pedido</h1><p>Ingresa el código que recibiste al confirmar tu pedido.</p></div><form className="status-search" onSubmit={event => { event.preventDefault(); setSubmittedCode(code.trim().toUpperCase()); }}><input required minLength={4} value={code} onChange={event => setCode(event.target.value)} placeholder="Ejemplo: ET-20261006-AB12C" /><button className="primary-button" type="submit"><Search size={17} /> Consultar</button></form>{submittedCode && query.isLoading && <p className="status-message">Consultando el pedido...</p>}{submittedCode && !query.isLoading && !order && <p className="status-message error-message">No encontramos un pedido con ese código.</p>}{order && <section className="order-status-card"><div className="order-status-top"><div><span className="eyebrow">Código de pedido</span><h2>{order.code}</h2></div><span className={`status-chip ${order.status === "cancelled" ? "status-cancelled" : ""}`}>{labels[order.status]}</span></div><div className="status-stepper">{steps.map((step, index) => <div className={`status-step ${index <= currentIndex ? "done" : ""}`} key={step}><div className="status-dot">{index <= currentIndex ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</div><span>{labels[step]}</span></div>)}</div><div className="order-status-summary"><p><b>{order.customerName}</b> · {order.attentionType === "delivery" ? "Delivery" : "Recojo en local"}</p><p>Total: <b>S/ {Number(order.total).toFixed(2)}</b></p></div>{order.status === "delivered" && <Truck size={28} className="status-delivered-icon" />}</section>}<div className="centered-action"><Link href="/productos" className="text-link">Volver al menú</Link></div></main><SiteFooter /></div>;
}
