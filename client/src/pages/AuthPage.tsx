import { ArrowLeft, LockKeyhole, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const register = trpc.auth.register.useMutation({
    onSuccess: async data => { utils.auth.me.setData(undefined, data); toast.success("Cuenta creada correctamente."); setLocation("/"); },
    onError: error => toast.error(error.message),
  });
  const login = trpc.auth.login.useMutation({
    onSuccess: async data => { utils.auth.me.setData(undefined, data); toast.success(`Bienvenido${data.name ? `, ${data.name}` : ""}.`); setLocation(data.role === "admin" ? "/admin" : "/"); },
    onError: error => toast.error(error.message),
  });

  if (!loading && user) return <div className="site-shell"><SiteHeader /><main className="page-main success-page"><UserRound size={54} /><h1>Ya tienes una sesión activa</h1><p>{user.email || user.name || "Cuenta autenticada"}</p><button className="primary-button" onClick={() => setLocation(user.role === "admin" ? "/admin" : "/")}>Continuar</button></main><SiteFooter /></div>;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isRegister) {
      if (password !== confirmPassword) { toast.error("Las contraseñas no coinciden."); return; }
      register.mutate({ name, email, password });
    } else login.mutate({ email, password });
  };
  const pending = register.isPending || login.isPending;

  return <div className="site-shell"><SiteHeader /><main className="auth-page"><div className="auth-card"><Link href="/" className="back-link"><ArrowLeft size={16} /> Volver al inicio</Link><img src="/figma/474-4517.webp" alt="El Tiburón" className="auth-logo" /><LockKeyhole size={28} className="auth-icon" /><h1>{isRegister ? "Regístrate para continuar" : "Inicia sesión"}</h1><p>Accede de forma local y segura para gestionar tus pedidos.</p><form className="auth-form" onSubmit={submit}>{isRegister && <label>Nombre completo<input required minLength={2} value={name} onChange={event => setName(event.target.value)} /></label>}<label>Correo electrónico<input required type="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Contraseña<input required minLength={isRegister ? 8 : 1} type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>{isRegister && <label>Confirmar contraseña<input required minLength={8} type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} /></label>}<button className="primary-button full-button" type="submit" disabled={pending}>{pending ? "Procesando..." : isRegister ? "Crear cuenta" : "Iniciar sesión"}</button></form><span className="auth-switch">{isRegister ? "¿Ya tienes cuenta?" : "¿Primera vez aquí?"} <Link href={isRegister ? "/login" : "/registro"}>{isRegister ? "Inicia sesión" : "Regístrate"}</Link></span></div></main><SiteFooter /></div>;
}
