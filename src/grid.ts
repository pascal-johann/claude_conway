/**
 * Grid-Klasse zur Verwaltung des Zellrasters
 * Verantwortlich für Initialisierung, Reset und Zustandsmanagement
 */

export class Grid {
  private width: number;
  private height: number;
  private cells: boolean[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = this.createEmptyGrid();
  }

  /**
   * Erstellt ein leeres Grid (alle Zellen tot)
   */
  private createEmptyGrid(): boolean[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => false)
    );
  }

  /**
   * Gibt die aktuelle Breite des Grids zurück
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * Gibt die aktuelle Höhe des Grids zurück
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * Gibt den Zustand einer bestimmten Zelle zurück
   */
  getCell(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    return this.cells[y][x];
  }

  /**
   * Setzt den Zustand einer bestimmten Zelle
   */
  setCell(x: number, y: number, alive: boolean): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.cells[y][x] = alive;
    }
  }

  /**
   * Wechselt den Zustand einer Zelle (lebendig <-> tot)
   */
  toggleCell(x: number, y: number): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.cells[y][x] = !this.cells[y][x];
    }
  }

  /**
   * Setzt das komplette Grid zurück (alle Zellen tot)
   */
  clear(): void {
    this.cells = this.createEmptyGrid();
  }

  /**
   * Initialisiert das Grid mit zufälligen Werten
   * @param probability Wahrscheinlichkeit, dass eine Zelle lebendig ist (0.0 - 1.0)
   */
  randomize(probability: number = 0.3): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = Math.random() < probability;
      }
    }
  }

  /**
   * Zählt die lebenden Nachbarn einer Zelle
   */
  countNeighbors(x: number, y: number): number {
    let count = 0;

    // Prüfe alle 8 Nachbarzellen
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        // Überspringe die Zelle selbst
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        // Prüfe ob Nachbar im gültigen Bereich und lebendig ist
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          if (this.cells[ny][nx]) {
            count++;
          }
        }
      }
    }

    return count;
  }

  /**
   * Erstellt eine Kopie des aktuellen Grid-Zustands
   */
  clone(): boolean[][] {
    return this.cells.map(row => [...row]);
  }

  /**
   * Setzt das Grid auf einen bestimmten Zustand
   */
  setState(newState: boolean[][]): void {
    if (newState.length === this.height &&
        newState[0].length === this.width) {
      this.cells = newState.map(row => [...row]);
    }
  }

  /**
   * Ändert die Grid-Größe und erstellt ein neues leeres Grid
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.cells = this.createEmptyGrid();
  }

  /**
   * Fügt ein vordefiniertes Pattern in das Grid ein
   * @param pattern Das Pattern (2D-Array von boolean-Werten)
   * @param startX X-Position für das Pattern
   * @param startY Y-Position für das Pattern
   */
  insertPattern(pattern: boolean[][], startX: number, startY: number): void {
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        const targetX = startX + x;
        const targetY = startY + y;
        if (targetX >= 0 && targetX < this.width &&
            targetY >= 0 && targetY < this.height) {
          this.cells[targetY][targetX] = pattern[y][x];
        }
      }
    }
  }
}

/**
 * Vordefinierte Patterns für Conway's Game of Life
 */
export const PATTERNS = {
  // Glider - bewegt sich diagonal
  glider: [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],

  // Blinker - oszilliert zwischen horizontal und vertikal
  blinker: [
    [true, true, true]
  ],

  // Toad - oszilliert
  toad: [
    [false, true, true, true],
    [true, true, true, false]
  ],

  // Beacon - oszilliert
  beacon: [
    [true, true, false, false],
    [true, true, false, false],
    [false, false, true, true],
    [false, false, true, true]
  ]
};
