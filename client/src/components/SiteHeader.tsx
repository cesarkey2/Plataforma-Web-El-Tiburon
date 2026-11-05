import { BookOpen, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Productos", href: "/productos" },
  { label: "Libro de Reclamaciones", href: "/reclamaciones" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const go = (href: string) => {
    setOpen(false);
    setLocation(href);
  };

  const goToContact = () => {
    setOpen(false);
    const scrollToContact = () => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.pathname === "/") {
      window.history.replaceState(null, "", "/#contacto");
      scrollToContact();
      return;
    }
    setLocation("/#contacto");
    window.setTimeout(scrollToContact, 120);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="El Tiburón, inicio">
          <img src="/figma/474-4517.webp" alt="Logo El Tiburón" />
        </Link>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navegación principal">
          {navItems.map(item => (
            <button key={item.href} onClick={() => go(item.href)}>{item.label}</button>
          ))}
          <button onClick={goToContact}>Contáctanos</button>
        </nav>
        <div className="header-actions">
          <Link href="/reclamaciones" className="icon-link claims-link" aria-label="Libro de Reclamaciones" title="Libro de Reclamaciones">
            <BookOpen size={19} />
          </Link>
          <Link href="/carrito" className="icon-link cart-link" aria-label="Ver carrito">
            <ShoppingBag size={19} />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
          {user ? <div className="user-menu"><button className="login-pill" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu"><UserRound size={15} /> {user.name || user.email || "Mi cuenta"}</button>{open && <div className="user-menu-dropdown" role="menu"><span>{user.email || "Sesión local"}</span>{user.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)}>Panel administrativo</Link>}<button onClick={() => { setOpen(false); void logout(); }}>Cerrar sesión</button></div>}</div> : <Link href="/login" className="login-pill"><UserRound size={15} /> Iniciar Sesión</Link>}
          <button className="mobile-menu" onClick={() => setOpen(value => !value)} aria-label="Abrir menú">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
