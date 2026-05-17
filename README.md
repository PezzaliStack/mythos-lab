# Mythos Lab

Red→Blue Scenario Framework per formazione difensiva, detection engineering e hardening.

## Cosa contiene la v3

- Scenario Engine funzionante
- Caricamento reale da `public/scenarios/index.json`
- Viewer file `.md`, `.txt`, `.json`
- Tabs: Overview, Payload Demo TXT, Detection, Mitigation, Indicators
- Detection Mapping collegato allo scenario
- Hardening Center collegato allo scenario
- Report Builder TXT/HTML
- Workspace Notes con salvataggio locale
- Build GitHub Pages da `/docs`

## Installazione locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
rm -rf docs
cp -R dist docs
```

## Deploy GitHub Pages

Impostare:

- Settings → Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /docs

## Filosofia

Mythos Lab non è un exploit framework. Gli scenari sono sanitizzati, leggibili e orientati a detection, mitigazione e hardening.
