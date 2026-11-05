import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-panel">
        <img src="/figma/474-4517.webp" alt="El Tiburón" />
      </div>
      <div className="footer-info">
        <div>
          <strong>DIRECCIÓN</strong>
          <p>Victor Alzamora 201 - Lima, Perú</p>
          <strong>ÁREA DE SERVICIO</strong>
          <p>Santiago de Surco · Miraflores · Surquillo</p>
        </div>
        <div>
          <strong>HORARIO DE ATENCIÓN</strong>
          <p>Lunes a sábado: 9:00 a. m. - 5:00 p. m.<br />Domingo: 9:00 a. m. - 3:00 p. m.</p>
        </div>
        <div className="footer-links">
          <strong>PIDE POR:</strong>
          <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer">WhatsApp</a>
          <strong>ENCUÉNTRANOS EN:</strong>
          <div className="social-links">
            <a href="#instagram" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#facebook" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#youtube" aria-label="YouTube"><Youtube size={22} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2025 El Tiburón S.A.C. | Todos los derechos reservados · <Link href="/estado-pedido">Estado de mi pedido</Link> · <Link href="/reclamaciones">Libro de Reclamaciones</Link></div>
    </footer>
  );
}
