/**
 * Konfigurationsdatei für Conway's Game of Life
 * Enthält Farbschemas, Grid-Größen und Default-Einstellungen
 */

export interface ColorScheme {
  name: string;
  aliveColor: string;
  deadColor: string;
  gridColor: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Classic",
    aliveColor: "#000000",
    deadColor: "#FFFFFF",
    gridColor: "#CCCCCC"
  },
  {
    name: "Dark Mode",
    aliveColor: "#00FF00",
    deadColor: "#1a1a1a",
    gridColor: "#333333"
  },
  {
    name: "Ocean",
    aliveColor: "#00CED1",
    deadColor: "#001F3F",
    gridColor: "#0074D9"
  },
  {
    name: "Sunset",
    aliveColor: "#FF6347",
    deadColor: "#FFB6C1",
    gridColor: "#8B0000"
  }
];

export interface GridSize {
  width: number;
  height: number;
  label: string;
}

export const GRID_SIZES: GridSize[] = [
  { width: 25, height: 25, label: "25x25" },
  { width: 50, height: 50, label: "50x50" },
  { width: 75, height: 75, label: "75x75" },
  { width: 100, height: 100, label: "100x100" }
];

export const DEFAULT_CONFIG = {
  gridSize: GRID_SIZES[1], // 50x50
  colorScheme: COLOR_SCHEMES[0], // Classic
  speed: 500, // Millisekunden zwischen Generationen
  minSpeed: 100,
  maxSpeed: 1000,
  cellSize: 10, // Pixel pro Zelle
  showGrid: true
};
