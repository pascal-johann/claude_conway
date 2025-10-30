# Conway's Game of Life - TypeScript Implementation

## Projektübersicht
Entwickle eine Browser-basierte Implementation von Conway's "Game of Life" mit TypeScript, die auf einem HTML Canvas-Element läuft.

## Technische Anforderungen

### Technologie-Stack
- TypeScript (kompiliert zu JavaScript für Browser)
- HTML5 Canvas für die Visualisierung
- Vanilla TypeScript ohne externe Frameworks (nur DOM-API)

### Projektstruktur
```
game-of-life/
├── src/
│   ├── index.ts          # Entry point
│   ├── game.ts           # Game-Logik (Regeln von Conway)
│   ├── grid.ts           # Grid-Verwaltung
│   ├── renderer.ts       # Canvas-Rendering
│   └── config.ts         # Konfiguration und Farbschemas
├── index.html
├── package.json
└── tsconfig.json
```

## Funktionale Anforderungen

### Core-Funktionalität
1. **Grid-System**
   - Erstelle ein zweidimensionales Grid mit konfigurierbarer Größe
   - Jede Zelle kann entweder "lebendig" oder "tot" sein

2. **Conway's Regeln implementieren**
   - Eine lebende Zelle mit 2-3 lebenden Nachbarn überlebt
   - Eine tote Zelle mit genau 3 lebenden Nachbarn wird lebendig
   - Alle anderen lebenden Zellen sterben, alle anderen toten bleiben tot

3. **Rendering**
   - Zeichne das Grid auf ein Canvas-Element
   - Farben basierend auf gewähltem Farbschema
   - Gitter-Linien optional

4. **Steuerung**
   - Start/Pause-Button für die Simulation
   - Reset-Button um das Grid zurückzusetzen
   - Geschwindigkeitsregler (z.B. 100ms - 1000ms zwischen Generationen)
   - Möglichkeit, Zellen durch Klicken manuell zu aktivieren/deaktivieren

5. **Initial Pattern**
   - Implementiere mindestens ein vordefiniertes Startmuster (z.B. "Glider" oder "Blinker")
   - Oder: Zufällige Initialisierung

### Einstellungen (Settings)

#### Grid-Größe
- Dropdown oder Input-Feld zur Auswahl der Grid-Größe
- Vorschläge: 25x25, 50x50, 75x75, 100x100
- Alternativ: Separate Inputs für Breite und Höhe
- Änderung der Grid-Größe soll das Spiel zurücksetzen

#### Farbschema
- Dropdown zur Auswahl verschiedener Farbschemas
- Mindestens 3-4 vordefinierte Farbschemas:
  - **Classic**: Schwarz (lebend) / Weiß (tot) / Grau (Gitter)
  - **Dark Mode**: Hellgrün (lebend) / Dunkelgrau (tot) / Dunkelgrau (Gitter)
  - **Ocean**: Türkis/Cyan (lebend) / Dunkelblau (tot) / Blau (Gitter)
  - **Sunset**: Orange/Rot (lebend) / Rosa/Lila (tot) / Dunkelrot (Gitter)
- Farbwechsel soll sofort sichtbar sein (kein Reset erforderlich)

## Code-Qualität

- Nutze TypeScript-Typen konsequent (keine `any`)
- Definiere Farbschemas als TypeScript-Interfaces/Types
- Kommentiere komplexe Logik
- Halte Funktionen klein und fokussiert
- Trenne Logik (Game-Regeln) von Präsentation (Rendering) von Konfiguration (Settings)

## UI-Layout (Vorschlag)

```
+----------------------------------+
|  Conway's Game of Life           |
+----------------------------------+
| Settings:                         |
| Grid Size: [50x50 ▼]             |
| Color Scheme: [Classic ▼]        |
| Speed: [---●-----] (500ms)       |
+----------------------------------+
| [Start] [Pause] [Reset] [Random] |
+----------------------------------+
|                                   |
|         Canvas (Game Grid)        |
|                                   |
+----------------------------------+
```

## Ergebnis
Eine lauffähige HTML-Datei, die im Browser geöffnet werden kann und Conway's Game of Life interaktiv mit anpassbaren Einstellungen darstellt.

## Zusätzliche Hinweise
- Das Projekt soll didaktisch sein - Einfachheit geht vor Optimierung
- Build-Setup mit TypeScript-Compiler ist ausreichend
- Keine Bundler notwendig (außer du empfiehlst etwas Simples wie esbuild)
- Canvas soll sich automatisch an gewählte Grid-Größe anpassen
