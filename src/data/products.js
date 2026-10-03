export const FREE_DELIVERY_AT = 999;
export const DELIVERY_FEE = 79;
export const MAX_PRICE = 8000;

export const PRODUCTS = [
  { id: 1,  name: "Mechanical Keyboard 75%",     category: "Keyboards",   price: 3499, rating: 4.7, reviews: 812,  emoji: "⌨️", tile: "#cfe3d8", stock: 14, desc: "Hot-swappable switches, PBT keycaps and a compact 75% layout that saves desk space." },
  { id: 2,  name: "Wireless Mouse",              category: "Accessories", price: 1299, rating: 4.4, reviews: 1290, emoji: "🖱️", tile: "#f7dfb0", stock: 40, desc: "Quiet clicks, 2.4GHz receiver and Bluetooth, with up to 6 months of battery life." },
  { id: 3,  name: "Noise-Cancelling Headphones", category: "Audio",       price: 6999, rating: 4.6, reviews: 540,  emoji: "🎧", tile: "#d6d9f2", stock: 6,  desc: "Over-ear headphones with active noise cancelling and 30 hours of playback." },
  { id: 4,  name: "LED Desk Lamp",               category: "Lighting",    price: 1799, rating: 4.5, reviews: 977,  emoji: "💡", tile: "#fbe7a8", stock: 22, desc: "Adjustable colour temperature, touch dimming and a USB charging port on the base." },
  { id: 5,  name: "Laptop Stand (Aluminium)",    category: "Accessories", price: 1499, rating: 4.3, reviews: 655,  emoji: "💻", tile: "#dbe4ea", stock: 31, desc: "Foldable stand with six height settings. Fits laptops up to 17 inches." },
  { id: 6,  name: "Bluetooth Speaker",           category: "Audio",       price: 2299, rating: 4.2, reviews: 430,  emoji: "🔊", tile: "#f2d0cc", stock: 18, desc: "Water-resistant speaker with 12 hours of battery and a built-in microphone." },
  { id: 7,  name: "Webcam 1080p",                category: "Accessories", price: 2599, rating: 4.1, reviews: 388,  emoji: "📷", tile: "#e0d4ef", stock: 9,  desc: "Full HD webcam with autofocus, a privacy shutter and dual microphones." },
  { id: 8,  name: "Compact Keyboard 60%",        category: "Keyboards",   price: 2799, rating: 4.4, reviews: 301,  emoji: "🎹", tile: "#c9e6e3", stock: 3,  desc: "Tiny 60% board with RGB backlight and a detachable USB-C cable." },
  { id: 9,  name: "Monitor Light Bar",           category: "Lighting",    price: 2199, rating: 4.6, reviews: 702,  emoji: "🔆", tile: "#f5ecc0", stock: 25, desc: "Clips onto your monitor and lights the desk without any screen glare." },
  { id: 10, name: "Earbuds (True Wireless)",     category: "Audio",       price: 1999, rating: 4.0, reviews: 2210, emoji: "🎵", tile: "#e3e9d2", stock: 50, desc: "Pocket-sized earbuds with a charging case and 24 hours of total playtime." },
  { id: 11, name: "Extended Desk Mat",           category: "Accessories", price: 899,  rating: 4.5, reviews: 1504, emoji: "🟫", tile: "#e7d7c8", stock: 60, desc: "900 x 400 mm stitched-edge mat with a smooth surface and a non-slip base." },
  { id: 12, name: "Ambient Backlight Strip",     category: "Lighting",    price: 799,  rating: 3.9, reviews: 264,  emoji: "✨", tile: "#d9d0f5", stock: 0,  desc: "USB-powered RGB strip that sticks behind your monitor. Controlled by app or remote." },
];

export const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
