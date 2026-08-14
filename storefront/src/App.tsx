import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Shop } from '@/pages/Shop';
import { Navbar } from "@/components/Navbar";
import { Collections } from '@/pages/Collections';
import { PaymentSuccess } from '@/pages/PaymentSuccess';
import { CartDrawer } from "@/components/CartDrawer";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingShopButton } from "@/components/FloatingShopButton";
import { Checkout } from '@/pages/Checkout';

import Contact from "@/pages/Contact";
import About from "@/pages/About";
import SizeGuide from "@/pages/SizeGuide";
import FAQs from "@/pages/FAQS";
import TrackOrder from "@/pages/TrackOrder";
import Footer from "@/sections/Footer";
import Shipping from "@/pages/Shipping";
import Account from "@/pages/Account";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";

import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";

import { useCartStore } from "@/stores/cartStore";

function App() {
  const loadCart = useCartStore((s) => s.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />

      <Navbar />
      <CartDrawer />
      <FloatingShopButton />

      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/cookies" element={<Cookies />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route
  path="/shop/new-arrivals"
  element={<Navigate to="/shop?sort=newest" replace />}
/>
<Route
  path="/shop/sports-bras"
  element={<Navigate to="/shop?category=sports-bras" replace />}
/>

<Route
  path="/shop/leggings"
  element={<Navigate to="/shop?category=leggings" replace />}
/>

<Route
  path="/shop/shorts"
  element={<Navigate to="/shop?category=shorts" replace />}
/>

<Route
  path="/shop/accessories"
  element={<Navigate to="/shop?category=accessories" replace />}
/>
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/collections/:slug" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/verify" element={<PaymentSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;