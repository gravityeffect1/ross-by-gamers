# Histo by Gamers
### An interactive pixel companion to Ross Histology

A serialised browser-based pixel platformer where you navigate the interior architecture of human tissues as a pathogen. Each chapter covers one body system from Ross & Pawlina — zoned, colour-coded, and annotated to match real histological compartments. Built with React 18 + HTML5 Canvas, no install or build step required.

Developed by a medical student, for medical students

## Chapter index

| Chapter | System | Worlds | Status |
|---------|--------|--------|--------|
| **II** | **Lymphatic System** | Bloodstream → Lymph Node → Spleen | ✅ live |
| III | Cardiovascular System | — | 🔧 planned |
| IV | Respiratory System | — | 🔧 planned |
| V | Digestive System | — | 🔧 planned |
| ... | *one chapter per Ross section* | — | — |

> Chapter I is reserved for an introductory module (cell biology / basic tissues) to be released alongside a later chapter.

---

## Chapter II — The Lymphatic System

### What you'll learn

| World | Compartments covered | Key concepts |
|-------|---------------------|--------------|
| **1 — The Vessel** | Bloodstream · Loose connective tissue · Afferent lymphatic | Macrophage polarisation, neutrophil extravasation, T-cell activation signals |
| **2 — The Lymph Node** | Subcapsular sinus · Superficial cortex (follicles) · Paracortex (HEVs) · Medullary cords · Efferent lymphatic | Germinal centre reaction, somatic hypermutation, HEV diapedesis, plasma cell morphology |
| **3 — The Spleen** | White pulp (PALS + follicle) · Marginal zone · Red pulp (Cords of Billroth) · Venous sinusoids | Open vs. closed circulation, RBC senescence & recycling, haem catabolism, asplenia risk |

Educational content is delivered through:
- **Proximity fact banners** — triggered when the player enters a new zone or approaches an immune cell enemy
- **NPC dialogues** — each key cell type (B cell, reticular cell, marginal zone macrophage, red pulp macrophage) delivers a scripted multi-line lecture; advance with **E / Enter**
- **Quest rewards** — delivering antigens to follicular dendritic cells (World 2) and recycling senescent RBCs to the red pulp macrophage (World 3) unlocks additional facts and ATP

### Source material
> Ross & Pawlina — *Histology: A Text and Atlas with Correlated Cell and Molecular Biology*, 8th edition.
> Zone boundaries, compartment naming, cell-type facts, and architectural descriptions are adapted directly from the relevant chapters.

---

## How to run

No install, no build step.

```bash
git clone https://github.com/gravityeffect1/histo-by-gamers
cd histo-by-gamers
open index.html   # or just double-click it
```

React 18 + Babel are loaded from CDN — you need an internet connection on first load.

Also playable directly via GitHub Pages (no clone needed):
**[gravityeffect1.github.io/histo-by-gamers](https://gravityeffect1.github.io/histo-by-gamers)**

---

## Controls

| Action | Key |
|--------|-----|
| Move | Arrow keys / A · D |
| Jump | Space / W / ↑ |
| Double-jump | Space × 2 (mid-air) |
| Climb ladder / shaft | ↑ ↓ or W · S while on a shaft |
| Advance NPC dialogue | E / Enter / Z |
| Pause / world select | Escape |


## Stack

- **React 18** (CDN production build, pinned to 18.3.1 — no bundler)
- **HTML5 Canvas** — dual-canvas system: 320×180 pixel buffer upscaled 4× nearest-neighbour for the game world; separate 1280×720 overlay for crisp HUD and dialogue text
- **Web Audio API** — procedural sound effects (no audio files)
- **Babel standalone 7.26.5** — JSX compiled in-browser

---

## Planned additions

- **Chapter III** — Cardiovascular System (next)
- **Undertale-style quiz encounters** — NPC dialogue transitions to a full-screen quiz, immunology questions, ATP rewards
- **Touch / mobile controls** — on-screen D-pad for tablet study sessions
- **Collectible histology flashcards** — per-zone, exportable
- **localStorage progress** — carry ATP and chapter progress between sessions


<sub>Made by <a href="https://github.com/gravityeffect1">Sara Sovix</a> · MS2 · Faculty of Medicine, Bucharest · built at the intersection of code and cellular biology</sub>
