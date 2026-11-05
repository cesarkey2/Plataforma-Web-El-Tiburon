import { FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { trpc } from "@/lib/trpc";

export default function ClaimsPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", documentNumber: "", claimType: "claim" as "claim" | "complaint", description: "" });
  const mutation = trpc.claims.create.useMutation({ onSuccess: () => setSent(true), onError: error => toast.error(error.message) });
  if (sent) return <div className="site-shell"><SiteHeader /><main className="page-main success-page"><FileText size={54} /><h1>Registro recibido</h1><p>Tu solicitud fue registrada. El equipo de El Tiburón revisará la información proporcionada.</p><Link href="/" className="primary-button">Volver al inicio</Link></main><SiteFooter /></div>;
  return <div className="site-shell"><SiteHeader /><main className="page-main"><div className="page-hero compact"><span>Atención transparente</span><h1>Libro de Reclamaciones</h1><p>Registra una queja o reclamo y conserva tus datos de contacto.</p></div><form className="claim-form" onSubmit={event => { event.preventDefault(); mutation.mutate(form); }}><div className="notice-box">Este formulario registra la solicitud en el MVP para su atención por el establecimiento.</div><div className="form-row"><label>Nombre completo<input required value={form.fullName} onChange={event => setForm({ ...form, fullName: event.target.value })} /></label><label>Documento de identidad<input required value={form.documentNumber} onChange={event => setForm({ ...form, documentNumber: event.target.value })} /></label></div><div className="form-row"><label>Correo electrónico<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>Teléfono<input required value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label></div><div className="choice-row"><label><input type="radio" checked={form.claimType === "claim"} onChange={() => setForm({ ...form, claimType: "claim" })} /> Reclamo</label><label><input type="radio" checked={form.claimType === "complaint"} onChange={() => setForm({ ...form, claimType: "complaint" })} /> Queja</label></div><label>Descripción<textarea required minLength={20} rows={7} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Describe los hechos con claridad" /></label><button className="primary-button" disabled={mutation.isPending}>{mutation.isPending ? "Registrando..." : "Registrar solicitud"}</button></form></main><SiteFooter /></div>;
}
