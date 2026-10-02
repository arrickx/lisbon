# 🚋 Lisbon — Mobile Pocket Guide

A fast, lightweight, and responsive web application optimized specifically for mobile devices, designed to run directly out of the box on **GitHub Pages**.

🔗 **Live GitHub Pages URL** (once enabled): [https://arrickx.github.io/lisbon/](https://arrickx.github.io/lisbon/)

---

## 📱 Mobile-First Features

- **Mobile Viewport Optimization**: Built from the ground up for phone touchscreens, with edge-to-edge layout, safe-area inset support, haptic feedback, and large tap targets. (On desktop browsers, it automatically renders inside a clean simulated mobile device frame).
- **Curated Lisbon Explorer**: Filter top viewpoints (*Miradouros*), historic landmarks (Tram 28, Belém Tower), cafés (*pastéis de nata*), nightlife (Bairro Alto & Pink Street), and day trips (Sintra).
- **Interactive Itinerary & Checklist**: 10 essential Lisbon experiences with dynamic progress tracking and custom traveler note creation.
- **Audio Portuguese Phrasebook**: Practical phrases with phonetics and native European Portuguese pronunciation (`SpeechSynthesis`).
- **Lisbon Survival Guide**: Essential local advice on navigating *Calçada Portuguesa* cobblestones, restaurant *couvert* etiquette, and saving money on transit (*Zapping* / *Navegante*).
- **Live Lisbon Status Bar**: Real-time Lisbon local clock (`Europe/Lisbon` timezone), live weather, and sunset indicators.
- **"Surprise Me" Decision Maker**: Randomly picks an authentic Lisbon spot when you aren't sure where to wander next.
- **Favorites & Offline Support**: Save favorite locations locally with `localStorage` and browse offline via the built-in Service Worker.
- **Dark & Light Mode**: Seamless theme switching with automatic system preference detection.

---

## 🚀 How to Enable on GitHub Pages

Because this project is built with vanilla modern HTML5, CSS3, and JavaScript, **no build step is required**. You can enable GitHub Pages in 2 clicks:

1. Open your repository on GitHub: [github.com/arrickx/lisbon](https://github.com/arrickx/lisbon)
2. Go to **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` and folder `/ (root)`
4. Click **Save**.

GitHub will deploy your page in ~1 minute at:
**`https://arrickx.github.io/lisbon/`**

---

## 💻 Local Development

To run locally on your machine, simply serve the folder using any static HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Or using npx serve
npx serve .
```

Open `http://localhost:8000` in your mobile browser or desktop browser (with mobile device emulation in DevTools).
