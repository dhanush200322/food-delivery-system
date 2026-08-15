# Portfolio Project: Food Delivery System

## Short Version
A production-ready full-stack food delivery application built with Next.js, Express, and PostgreSQL. Features include secure JWT authentication, dynamic cart management, complex relational search/filtering, and transactional checkout processing. Deployed on Vercel and Render.

## Medium Version
The Food Delivery System is a comprehensive full-stack e-commerce platform that connects hungry customers with local restaurant menus. Architected with a decoupled Next.js frontend and an Express/Node.js REST API, it utilizes Prisma ORM and PostgreSQL for robust data integrity. Key features include role-based authentication, real-time cart state management, complex database queries for food discovery (searching, filtering, sorting), and a highly transactional checkout flow that preserves historical price snapshots.

## Detailed Version
This Food Delivery System was built to demonstrate advanced full-stack engineering principles, focusing on data integrity, security, and user experience. 

The frontend leverages Next.js App Router, Tailwind CSS, and Framer Motion to deliver a highly interactive, responsive, and accessible user interface. State management is cleanly handled via React Context, enabling instantaneous UI updates for shopping carts and user favorites.

The backend is an Express Node.js application that serves a strictly validated REST API. Authentication is stateless, utilizing secure HTTP headers and JWTs. The database layer is managed by Prisma and PostgreSQL, heavily relying on relational data modeling. A major technical achievement within the system is the transactional checkout flow: when an order is placed, the system atomically copies current food prices into immutable order items, guaranteeing that future menu updates do not retrospectively alter user receipts.

Furthermore, the deployment architecture tackles real-world infrastructure constraints, implementing intelligent client-side timeouts and background "wake-up" pings to seamlessly handle cold-start latencies inherent in free-tier cloud environments (Render).

## Feature Highlights
- **Role-Based JWT Auth:** Complete separation of Customer and Admin privileges.
- **Relational Discovery:** Search, filter, and sort foods seamlessly across categories and restaurants.
- **Persistent State:** React Context-driven Cart and Favorites systems.
- **Transactional Checkout:** Atomic database transactions ensuring receipt integrity.
- **Responsive UI:** Edge-to-edge imagery, skeleton loaders, and micro-animations via Framer Motion.

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL
- **Deployment:** Vercel (Frontend), Render (Backend)

## Live Links
- **Demo:** [https://food-delivery-system-blush.vercel.app/](https://food-delivery-system-blush.vercel.app/)
- **GitHub:** [https://github.com/dhanush200322/food-delivery-system](https://github.com/dhanush200322/food-delivery-system)
