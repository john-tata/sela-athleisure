import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Shop } from '@/pages/Shop';
import { Navbar } from "@/components/Navbar";
import { Collections } from '@/pages/Collections';
import { CartDrawer } from "@/components/CartDrawer";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingShopButton } from "@/components/FloatingShopButton";
import { Checkout } from '@/pages/Checkout';


import Footer from "@/sections/Footer";

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
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;