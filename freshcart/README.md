# 🛒 FreshCart E-Commerce App

مشروع E-Commerce كامل مبني بـ React + Redux Toolkit مع Google & Facebook Auth

---

## 🚀 تشغيل المشروع

```bash
# 1. تثبيت الـ dependencies
npm install

# 2. تشغيل المشروع
npm start
```

المشروع هيفتح على: `http://localhost:3000`

---

## 📁 هيكل المشروع

```
src/
├── App.jsx                          ← نقطة الدخول + Routes
├── index.js
├── store/
│   ├── store.js                     ← Redux Store
│   ├── authSlice.js                 ← Auth State (login/register)
│   ├── cartSlice.js                 ← Cart State
│   └── wishlistSlice.js             ← Wishlist State
├── components/
│   ├── Layout/Layout.jsx            ← الهيكل العام
│   ├── Navbar/Navbar.jsx            ← شريط التنقل
│   ├── Footer/Footer.jsx            ← التذييل
│   ├── ProductCard/ProductCard.jsx  ← بطاقة المنتج
│   ├── Loading/Loading.jsx          ← مؤشر التحميل
│   └── ProtectedRoute/              ← حماية الروابط
└── pages/
    ├── Home/Home.jsx                ← الصفحة الرئيسية ✅
    ├── Products/Products.jsx        ← المنتجات + فلتر + بحث ✅
    ├── ProductDetails/              ← تفاصيل المنتج ✅
    ├── Categories/Categories.jsx    ← كل الفئات ✅
    ├── CategoryProducts/            ← منتجات فئة معينة ✅
    ├── Brands/Brands.jsx            ← كل الماركات ✅
    ├── BrandProducts/               ← منتجات ماركة معينة ✅
    ├── Cart/Cart.jsx                ← السلة ✅
    ├── Wishlist/Wishlist.jsx        ← المفضلة ✅
    ├── Checkout/Checkout.jsx        ← الدفع (كاش + أونلاين) ✅
    ├── AllOrders/AllOrders.jsx      ← كل الطلبات ✅
    ├── Login/Login.jsx              ← تسجيل الدخول + Google Auth ✅
    ├── Register/Register.jsx        ← إنشاء حساب ✅
    ├── ForgotPassword/              ← نسيت كلمة المرور (3 خطوات) ✅
    └── NotFound/NotFound.jsx        ← صفحة 404 ✅
```

---

## ⭐ المميزات

### ✅ الأساسي
- [x] صفحة الرئيسية (Hero Slider، Categories، Featured Products)
- [x] قائمة المنتجات مع بحث وفلتر وترتيب وصفحات
- [x] تفاصيل المنتج (صور متعددة، تقييم، منتجات مشابهة)
- [x] صفحة الفئات وصفحة منتجات الفئة
- [x] صفحة الماركات وصفحة منتجات الماركة
- [x] السلة (إضافة، حذف، تعديل الكمية، إفراغ)
- [x] المفضلة / Wishlist كاملة
- [x] صفحة الدفع (كاش + أونلاين)
- [x] عرض كل الطلبات
- [x] تسجيل الدخول / إنشاء حساب
- [x] نسيت كلمة المرور (3 خطوات)
- [x] صفحة 404

### 🌟 البونص
- [x] **Redux Toolkit** — إدارة كاملة لحالة السلة والمفضلة والمصادقة
- [x] **Google Auth** — تسجيل الدخول بحساب Google
- [x] **Facebook Auth** — تسجيل الدخول بحساب Facebook (يحتاج FB SDK)

---

## 🔑 API Base URL

```
https://ecommerce.routemisr.com/api/v1
```

### Endpoints المستخدمة:
| الوصف | Method | URL |
|-------|--------|-----|
| تسجيل دخول | POST | `/auth/signin` |
| إنشاء حساب | POST | `/auth/signup` |
| نسيت كلمة المرور | POST | `/auth/forgotPasswords` |
| التحقق من الرمز | POST | `/auth/verifyResetCode` |
| إعادة تعيين كلمة المرور | PUT | `/auth/resetPassword` |
| المنتجات | GET | `/products` |
| تفاصيل منتج | GET | `/products/:id` |
| الفئات | GET | `/categories` |
| الماركات | GET | `/brands` |
| السلة | GET/POST/PUT/DELETE | `/cart` |
| المفضلة | GET/POST/DELETE | `/wishlist` |
| الطلبات (كاش) | POST | `/orders/:cartId` |
| الطلبات (أونلاين) | POST | `/orders/checkout-session/:cartId` |
| طلبات المستخدم | GET | `/orders/user/:userId` |

---

## 🔧 الـ Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "react-redux": "^9.0.0",
  "@reduxjs/toolkit": "^2.0.0",
  "axios": "^1.6.0",
  "formik": "^2.4.5",
  "yup": "^1.3.2",
  "react-hot-toast": "^2.4.1",
  "@react-oauth/google": "^0.12.1"
}
```

---

## 🎨 Design System

| المتغير | القيمة |
|---------|--------|
| Primary Color | `#0aad0a` |
| Primary Dark | `#088a08` |
| Dark | `#1a1a2e` |
| Font | Cairo (Arabic) |

---

## 📝 ملاحظات

- **Google Auth**: يحتاج Client ID حقيقي في `App.jsx` من [Google Console](https://console.cloud.google.com/)
- **Facebook Auth**: يحتاج إضافة Facebook SDK في `public/index.html`
- **Protected Routes**: السلة، المفضلة، الدفع، والطلبات تحتاج تسجيل دخول
- **Token**: يُخزَّن في `localStorage` باسم `userToken`

---

**Deadline: 17/4 ⏰** — بالتوفيق! 🚀
