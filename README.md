<div align="center">
  <h1><img src="https://gocartshop.in/favicon.ico" width="20" height="20" alt="ShopVerse Favicon">
   ShopVerse</h1>
  <p>
    An open-source multi-vendor e-commerce platform built with Next.js and Tailwind CSS.
  </p>
  <p>
    <a href="https://github.com/GreatStackDev/goCart/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/GreatStackDev/goCart?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/GreatStackDev/goCart/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
    <a href="https://github.com/GreatStackDev/goCart/issues"><img src="https://img.shields.io/github/issues/GreatStackDev/goCart?style=for-the-badge" alt="GitHub issues"></a>
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [👥 User Roles & Permissions](#-user-roles--permissions)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📱 User Interface](#-user-interface)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

- **Multi-Vendor Architecture:** Allows multiple vendors to register, manage their own products, and sell on a single platform.
- **Customer-Facing Storefront:** A beautiful and responsive user interface for customers to browse and purchase products.
- **Vendor Dashboards:** Dedicated dashboards for vendors to manage products, view sales analytics, and track orders.
- **Admin Panel:** A comprehensive dashboard for platform administrators to oversee vendors, products, and commissions.
- **Role-Based Access Control:** Different dashboards and features based on user roles (Admin, Store Owner, User).
- **Complete Account Management:** Personal account pages with role-specific dashboards, orders, wishlist, and addresses.

## 👥 User Roles & Permissions

### Admin (role: 'admin')
- **Dashboard Access:** Admin Dashboard with platform analytics
- **Store Management:** Approve/reject store registrations, manage all stores
- **User Oversight:** Monitor all users and platform activity
- **Platform Control:** Full administrative privileges

### Store Owner (role: 'store')
- **Store Dashboard:** Manage products, categories, and orders
- **Product Management:** Add, edit, delete products with image uploads
- **Category Management:** Create and manage product categories
- **Order Fulfillment:** Track and manage customer orders
- **Store Analytics:** View store performance metrics

### Regular User (role: 'user')
- **Personal Account:** Access to orders, wishlist, addresses, and profile
- **Shopping Experience:** Browse products, add to cart, make purchases
- **Account Dashboard:** Overview of account features and quick access

## 🛠️ Tech Stack <a name="-tech-stack"></a>

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React for icons
- **State Management:** Redux Toolkit
- **Database:** Prisma ORM
- **Authentication:** JWT-based authentication
- **Image Handling:** Next.js Image component

## 🚀 Getting Started <a name="-getting-started"></a>

First, install the dependencies. We recommend using `npm` for this project.

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 User Interface

### Navigation Structure
- **Public Pages:** Home, Shop, Cart, Wishlist
- **Authentication:** Sign In, Sign Up, Profile/Account
- **Role-Based Access:**
  - Admin users see "Admin Dashboard" link
  - Store owners see "Store Dashboard" link
  - All authenticated users see "My Account" link

### Account System
- **Dashboard Tab:** Role-specific dashboard with relevant metrics and actions
- **Profile Tab:** Personal information management
- **Addresses Tab:** Delivery address management
- **Orders Tab:** Order history and tracking
- **Wishlist Tab:** Saved products for future purchase

### Store Management (Store Role)
- **Product Management:** Add, edit, delete products with image uploads
- **Category Management:** Create and organize product categories
- **Order Management:** Track and fulfill customer orders
- **Store Analytics:** Performance metrics and insights

### Admin Panel (Admin Role)
- **Store Approvals:** Review and approve store registrations
- **Platform Analytics:** Overall platform statistics
- **User Management:** Monitor and manage all users
- **System Oversight:** Complete platform administration

---

## 🤝 Contributing <a name="-contributing"></a>

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to get started.

---

## 📜 License <a name="-license"></a>

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
