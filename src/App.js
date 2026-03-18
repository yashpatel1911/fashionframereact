import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';

// Import styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'aos/dist/aos.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import SearchPopup from './components/layout/SearchPopup';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop'; // ✅ Import ScrollToTop

// Pages
import Home from './pages/Home';
import Categories from './pages/shop/Categories';
import SubCategory from './pages/shop/SubCategory';
import Products from './pages/shop/Products';
import ProductDetails from './pages/shop/ProductDetails';
import Cart from './pages/cart/Cart';
import CartAddressSelection from './pages/cart/CartAddressSelection';
import PaymentMethodSelection from './pages/cart/PaymentMethodSelection';
import Checkout from './pages/cart/Checkout';
import FinalOrderSummary from './pages/cart/FinalOrderSummary';
import Registration from './pages/auth/Registration';
import Login from './pages/auth/Login';
import UserProfile from './pages/auth/UserProfile';
import ContactUs from './components/home/ContactUs';
import Pages from './pages/Pages';
import WishListProducts from './pages/shop/WishListProducts';

// Import UserProvider
import { UserProvider } from './context/UserContext';
import MyOrdersScreen from './pages/auth/MyOrdersScreen';

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Add homepage class to body
    document.body.classList.add('homepage');

    // Handle preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 800);
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('homepage');
    };
  }, []);

  return (
    <Router>
      <UserProvider>
        <div className="App">
          <ScrollToTop /> {/* ✅ Add ScrollToTop component here */}
          <div className="preloader text-white fs-6 text-uppercase overflow-hidden">
            <div>Loading...</div>
          </div>
          <SearchPopup />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/collection/:c_slug" element={<SubCategory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:subcategory" element={<Products />} />
            <Route path="/wishlist" element={<WishListProducts />} />
            <Route path="/order-history" element={<MyOrdersScreen />} />
            <Route path="/product/:p_slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/address" element={<CartAddressSelection />} />
            <Route path="/payment-method" element={<PaymentMethodSelection />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/summary" element={<FinalOrderSummary />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/pages/:slug" element={<Pages />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;