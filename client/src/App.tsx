import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import ClaimsPage from "./pages/ClaimsPage";
import CheckoutPage from "./pages/CheckoutPage";
import Home from "./pages/Home";
import { ProductDetailPage, ProductsPage } from "./pages/ProductsPage";
import NotFound from "./pages/NotFound";
import OrderStatusPage from "./pages/OrderStatusPage";
import AboutPage from "./pages/AboutPage";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/productos/:id" component={ProductDetailPage} />
    <Route path="/productos" component={ProductsPage} />
    <Route path="/carrito" component={CartPage} />
    <Route path="/checkout" component={CheckoutPage} />
    <Route path="/estado-pedido" component={OrderStatusPage} />
    <Route path="/login"><AuthPage mode="login" /></Route>
    <Route path="/registro"><AuthPage mode="register" /></Route>
    <Route path="/reclamaciones" component={ClaimsPage} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/nosotros" component={AboutPage} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><CartProvider><Router /></CartProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
