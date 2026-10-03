# Deskwell

A responsive e-commerce front end built with **React + Vite**: product browsing, search, filters, a product detail dialog, a shopping cart and saved items.

**Live demo:** https://deskwell-store.vercel.app/

## Features
- Search (debounced), category filter, max-price slider and sorting
- Product detail dialog (native `<dialog>`) with quantity selector, stock limits and sold-out states
- Cart drawer with quantity controls, free-delivery progress bar and live totals in INR
- Saved items (wishlist) with a "Saved items" filter
- Cart and saved items persist across refreshes (localStorage)
- Accessible: keyboard navigation, focus styles, ARIA labels, reduced-motion support
- Responsive from phone to desktop

## Tech and concepts
- React 18 function components and hooks (`useState`, `useEffect`, `useMemo`, `useReducer`, `useRef`, `useCallback`)
- Global state with Context + a `useReducer` cart reducer
- Custom hooks: `useDebounce`, `useLocalStorage`
- Pure utility functions (`filterProducts`, `cartTotals`) covered by unit tests (Vitest)
- Vite for dev server and production build

## Project structure
```
src/
  components/   Header, Controls, ProductGrid, ProductCard, ProductModal, CartDrawer, Toast
  context/      StoreContext (provider + useStore), cartReducer (+ tests)
  hooks/        useDebounce, useLocalStorage
  utils/        format, filterProducts, cartTotals (+ tests)
  data/         products.js (static product list)
```

## Run locally
```bash
npm install
npm run dev      # start dev server
npm test         # run unit tests
npm run build    # production build in /dist
```

## Deploy
- **Netlify:** build command `npm run build`, publish directory `dist`
- **Vercel:** import the repo; settings are detected automatically

## Ideas for next steps
- Replace `products.js` with a real API (Fake Store API or JSON Server)
- Add React Router with a `/product/:id` page
- Add a login page and order history
