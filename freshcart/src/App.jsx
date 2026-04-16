import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './store/store';

// Layout
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Categories from './pages/Categories/Categories';
import CategoryProducts from './pages/CategoryProducts/CategoryProducts';
import Brands from './pages/Brands/Brands';
import BrandProducts from './pages/BrandProducts/BrandProducts';
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';
import Checkout from './pages/Checkout/Checkout';
import AllOrders from './pages/AllOrders/AllOrders';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import NotFound from './pages/NotFound/NotFound';

const GOOGLE_CLIENT_ID = '419256487533-8h7u6i1ij7ol1tnaqn83d0mjftnt2uub.apps.googleusercontent.com';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'categories', element: <Categories /> },
      { path: 'categories/:id', element: <CategoryProducts /> },
      { path: 'brands', element: <Brands /> },
      { path: 'brands/:id', element: <BrandProducts /> },
      {
        path: 'cart',
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      {
        path: 'wishlist',
        element: <ProtectedRoute><Wishlist /></ProtectedRoute>
      },
      {
        path: 'checkout/:cartId',
        element: <ProtectedRoute><Checkout /></ProtectedRoute>
      },
      {
        path: 'allorders',
        element: <ProtectedRoute><AllOrders /></ProtectedRoute>
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: '*', element: <NotFound /> },
    ]
  }
]);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: '12px',
            },
            success: { style: { background: '#0aad0a', color: '#fff' } },
            error: { style: { background: '#dc2626', color: '#fff' } },
          }}
        />
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
