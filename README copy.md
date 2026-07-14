# 🎮 Portfolio Noura — Pixel Art Edition 2026

## Structure des fichiers
```
portfolio-pixel/
├── index.html          ← Page principale (tout est ici)
├── style.css           ← Tout le CSS pixel art
├── script.js           ← Canvas city, personnage guide, interactions
├── img/
│   ├── pp.jpeg         ← Photo de profil
│   └── projet/
│       └── bataille-navale.jpeg
└── docs/
    ├── CV_INFORMATIQUE_noura.pdf
    └── projet/
        ├── epreuve-e4.pdf
        ├── bataille_navale/
        ├── bubbly/
        ├── gite/
        ├── hotel-neptune/
        ├── mii-project/
        └── python/
```

## Personnalisation

- **Couleurs** : Variables CSS dans `:root` dans `style.css`
- **Personnage** : Modifie les sprites dans `script.js` → tableau `frames`
- **Contenu** : Directement dans `index.html` dans les sections
- **Modals projets** : Templates `<template id="modal-xxx">` en bas de `index.html`

## Pour mettre en ligne
Héberge simplement le dossier `portfolio-pixel/` sur n'importe quel hébergeur statique (GitHub Pages, Netlify, Vercel).
