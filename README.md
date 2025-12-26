# ASCII QR Generator

A simple web tool that converts your text into ASCII-based QR codes. Perfect for embedding QR codes in terminals, source code comments, plain text files, or anywhere you need a text-only representation.

## What it does

Enter some text, and the app generates a QR code using ASCII characters that you can copy and paste anywhere. Everything runs in your browser - no data leaves your device.

## Features

- **Multiple display styles** - Choose between compact, block, or other character variants
- **Error correction levels** - Select how resilient the QR code should be to damage
- **Invert option** - Flip the colors for different backgrounds
- **One-click copy** - Easily grab the output for pasting elsewhere

## Running locally

Make sure you have Node.js installed, then:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or similar, check your terminal output).

## Building for production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

---

Built with React, TypeScript, and Vite.
