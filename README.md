# Next.js + shadcn/ui Enterprise Starter

This is a production-ready, highly optimized **Next.js** application starter pre-configured with **shadcn/ui**, **TypeScript**, and **Tailwind CSS**.

##  Features

*   **Next.js App Router** – Modern routing with support for React Server Components.
*   **shadcn/ui Integration** – Beautiful, accessible, copy-and-paste primitives powered by Radix UI.
*   **Tailwind CSS** – Utility-first CSS framework for rapid UI styling.
*   **TypeScript Archetype** – Strict type safety across the entire engineering pipeline.
*   **Dark Mode Support** – Optimized light and dark variants utilizing `next-themes`.
*   **Code Quality Pipelines** – Built-in linting and code formatting routines.

---

##  Tech Stack

*   **Framework:** [Next.js](https://nextjs.org)
*   **Component Architecture:** [shadcn/ui](https://ui.shadcn.com/)
*   **Styling Engine:** [Tailwind CSS](https://tailwindcss.com)
*   **Primitive Primitives:** [Radix UI](https://radix-ui.com)
*   **Icons Engine:** [Lucide React](https://lucide.dev)

---

##  Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repository-url>
cd <your-project-name>

# Install packages using your preferred package manager
npm install
# or
pnpm install
# or
yarn install
```

### 2. Run the Development Server

Execute the local development script to spin up the local compiler:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) inside your browser to inspect the application.

---

##  Working with Components

This project leverages the **shadcn/ui CLI** to fetch modular code components straight into your workspace. Do not install components via standard npm packages.

### Adding New Primitives

To install a clean atomic component (e.g., a Button, Dialog, or Card), run the CLI installer:

```bash
npx shadcn@latest add button
```

This will automatically create or inject the corresponding code inside the `@/components/ui/` folder layer. 

### Customizing Components

Because you own the code, you can open any UI script inside `src/components/ui/` and directly alter the Tailwind utilities or React logic to fit your specific branding needs.

---

##  Project Architecture

```text
├── public/          # Static public assets (images, icons)
├── src/
│   ├── app/         # Next.js App Router folders, layouts, and page views
│   ├── components/  # Reusable application blocks
│   │   └── ui/      # Radix UI primitives injected by shadcn/ui
│   ├── lib/         # Shared utility scripts (e.g., cn tailwind class merger)
│   └── styles/      # Global CSS files housing layout-wide styles
├── components.json  # Manifest file mapping shadcn CLI pathways
├── tailwind.config  # System-wide design system configurations
└── tsconfig.json    # TypeScript configurations and module aliases
```

---

##  Production Deployment

### Build the Application

Generate an optimized, production-grade static build output:

```bash
npm run build
```

### Preview Locally

Validate production bundles locally before pushing code changes live:

```bash
npm run start
```

Deploy the codebase frictionlessly to cloud hosting engines like [Vercel](https://vercel.com).
