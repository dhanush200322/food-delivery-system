🚀 I’m excited to share my latest Full-Stack project: A complete, production-ready Food Delivery System!

I built this platform to challenge myself with complex state management, relational database design, and end-to-end deployment workflows. 

🍔 What I built:
A seamless food discovery and ordering platform with distinct Customer and Admin workflows. 

⚙️ Key Engineering Highlights:
- **Transactional Data Integrity:** Used Prisma ORM with PostgreSQL to ensure that checkout flows perfectly synchronize cart clearing and order generation, utilizing price snapshots so historical receipts remain accurate even if restaurant prices change later.
- **Secure Authentication:** Implemented stateless JWT-based authentication with strict role-based access controls and customized bcrypt password hashing.
- **Optimized UI/UX:** Built with Next.js, Tailwind CSS, and Framer Motion. The UI dynamically responds to state changes (favorites, cart quantities) instantly, while gracefully handling backend cloud cold-start latencies via intelligent abort-timeout configurations and background health pings.
- **Strict Security:** Enforced strict CORS origin whitelisting on the Express backend and utilized Helmet for fundamental HTTP security.

🏗 Architecture:
Next.js (App Router) ➔ Express / Node.js ➔ Prisma ➔ PostgreSQL

☁️ Deployment:
Frontend deployed on Vercel, Backend deployed on Render.

Building this reinforced how critical it is to handle edge cases—like ensuring the frontend doesn't hang up too early when a free-tier backend is waking up, and protecting API routes from unauthorized cross-origin requests.

Check out the live demo and the source code below! 👇

🔗 Live Demo: [https://food-delivery-system-blush.vercel.app/](https://food-delivery-system-blush.vercel.app/)
💻 GitHub: [https://github.com/dhanush200322/food-delivery-system](https://github.com/dhanush200322/food-delivery-system)

#FullStackDevelopment #WebDevelopment #ReactJS #NextJS #NodeJS #PostgreSQL #SoftwareEngineering #PortfolioProject
