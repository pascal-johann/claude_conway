# Conway's Game of Life

Eine interaktive Browser-Implementation von Conway's "Game of Life" in TypeScript.

## Überblick

Conway's Game of Life ist ein zellulärer Automat, der von dem britischen Mathematiker John Horton Conway 1970 entwickelt wurde. Das "Spiel" besteht aus einem zweidimensionalen Grid von Zellen, die entweder lebendig oder tot sind. Die Zellen entwickeln sich nach einfachen Regeln von Generation zu Generation.

### Spielregeln

1. Eine lebende Zelle mit 2-3 lebenden Nachbarn überlebt
2. Eine tote Zelle mit genau 3 lebenden Nachbarn wird lebendig
3. Alle anderen lebenden Zellen sterben
4. Alle anderen toten Zellen bleiben tot

## Features

- **Interaktives Canvas**: Klicken Sie auf Zellen, um sie manuell zu aktivieren/deaktivieren
- **Steuerung**: Start, Pause, Reset und Zufallsgenerierung
- **Einstellbare Grid-Größe**: 25x25, 50x50, 75x75, 100x100
- **Farbschemas**: Classic, Dark Mode, Ocean, Sunset
- **Geschwindigkeitsregler**: Passen Sie die Simulationsgeschwindigkeit an (100ms - 1000ms)
- **Generationsanzeige**: Zeigt die aktuelle Generation an

## Installation und Start

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm

### 1. Dependencies installieren

```bash
npm install
```

### 2. TypeScript kompilieren

```bash
npm run build
```

Dies erstellt die JavaScript-Dateien im `dist/` Verzeichnis.

### 3. Projekt starten

Da dies ein reines Frontend-Projekt ist, benötigen Sie einen lokalen Webserver. Nutzen Sie eine der folgenden Optionen:

**Option A: Python HTTP Server**
```bash
npm run serve
```

Das Projekt ist dann unter `http://localhost:8000` erreichbar.

**Option B: Live Server (VS Code Extension)**

Installieren Sie die "Live Server" Extension und öffnen Sie `index.html` mit Live Server.

**Option C: Anderer HTTP Server**

Nutzen Sie einen beliebigen HTTP Server Ihrer Wahl, z.B.:
- `npx http-server`
- `python3 -m http.server 8000`

## Entwicklung

### Watch-Modus

Für die Entwicklung können Sie TypeScript im Watch-Modus ausführen:

```bash
npm run watch
```

Dies kompiliert TypeScript automatisch bei jeder Änderung neu.

### Tests

Das Projekt verfügt über umfassende Unit-Tests mit **100% Code-Coverage**.

**Tests ausführen:**
```bash
npm test
```

**Tests mit Coverage-Report:**
```bash
npm run test:coverage
```

**Test-Suites:**
- **config.test.ts**: Tests für Konfiguration und Farbschemas (39 Tests)
- **grid.test.ts**: Tests für Grid-Verwaltung und Nachbarzählung (41 Tests)
- **game.test.ts**: Tests für Conway's Game of Life Regeln (32 Tests)
- **renderer.test.ts**: Tests für Canvas-Rendering (37 Tests)

**Coverage:**
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

## Projektstruktur

```
game-of-life/
├── src/
│   ├── __tests__/        # Unit-Tests
│   │   ├── config.test.ts
│   │   ├── game.test.ts
│   │   ├── grid.test.ts
│   │   └── renderer.test.ts
│   ├── index.ts          # Entry Point und UI-Logik
│   ├── game.ts           # Conway's Game of Life Regeln
│   ├── grid.ts           # Grid-Verwaltung
│   ├── renderer.ts       # Canvas-Rendering
│   └── config.ts         # Konfiguration und Farbschemas
├── dist/                 # Kompilierte JavaScript-Dateien
├── index.html            # Haupt-HTML-Datei
├── vitest.config.ts      # Vitest-Konfiguration
├── package.json
├── tsconfig.json
└── README.md
```

## Verwendung

1. **Öffnen Sie** `index.html` in Ihrem Browser (über einen lokalen Webserver)
2. **Wählen Sie** die gewünschte Grid-Größe und das Farbschema
3. **Klicken Sie** auf "Zufall", um ein zufälliges Muster zu generieren, oder klicken Sie auf einzelne Zellen, um manuell ein Muster zu erstellen
4. **Klicken Sie** auf "Start", um die Simulation zu starten
5. **Passen Sie** die Geschwindigkeit mit dem Slider an
6. **Pausieren** oder **Zurücksetzen** Sie das Spiel nach Belieben

## Technologie-Stack

- **TypeScript**: Typsichere Entwicklung
- **HTML5 Canvas**: Hochperformante Grafik-Rendering
- **Vanilla TypeScript**: Keine externen Frameworks, nur DOM-API

## Lizenz

MIT
