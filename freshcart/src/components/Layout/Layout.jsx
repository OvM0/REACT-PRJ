import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { fetchCart } from '../../store/cartSlice';
import { fetchWishlist } from '../../store/wishlistSlice';

export default function Layout() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
