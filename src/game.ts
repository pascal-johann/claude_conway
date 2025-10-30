/**
 * Game-Klasse implementiert die Logik von Conway's Game of Life
 * Verantwortlich für die Anwendung der Spielregeln und Generationswechsel
 */

import { Grid } from './grid.js';

export class Game {
  private grid: Grid;
  private generation: number;

  constructor(width: number, height: number) {
    this.grid = new Grid(width, height);
    this.generation = 0;
  }

  /**
   * Gibt das aktuelle Grid zurück
   */
  getGrid(): Grid {
    return this.grid;
  }

  /**
   * Gibt die aktuelle Generation zurück
   */
  getGeneration(): number {
    return this.generation;
  }

  /**
   * Setzt die Generation zurück
   */
  resetGeneration(): void {
    this.generation = 0;
  }

  /**
   * Berechnet die nächste Generation nach Conway's Regeln:
   *
   * 1. Eine lebende Zelle mit 2-3 lebenden Nachbarn überlebt
   * 2. Eine tote Zelle mit genau 3 lebenden Nachbarn wird lebendig
   * 3. Alle anderen lebenden Zellen sterben
   * 4. Alle anderen toten Zellen bleiben tot
   */
  nextGeneration(): void {
    const width = this.grid.getWidth();
    const height = this.grid.getHeight();

    // Erstelle eine Kopie des aktuellen Zustands
    const currentState = this.grid.clone();

    // Berechne den neuen Zustand für jede Zelle
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const neighbors = this.grid.countNeighbors(x, y);
        const isAlive = currentState[y][x];

        let newState = false;

        if (isAlive) {
          // Regel für lebende Zellen: Überleben mit 2-3 Nachbarn
          newState = neighbors === 2 || neighbors === 3;
        } else {
          // Regel für tote Zellen: Werden lebendig mit genau 3 Nachbarn
          newState = neighbors === 3;
        }

        this.grid.setCell(x, y, newState);
      }
    }

    this.generation++;
  }

  /**
   * Setzt das Spiel zurück (Grid leeren und Generation auf 0)
   */
  reset(): void {
    this.grid.clear();
    this.generation = 0;
  }

  /**
   * Initialisiert das Grid mit zufälligen Werten
   */
  randomize(): void {
    this.grid.randomize(0.3);
    this.generation = 0;
  }

  /**
   * Ändert die Grid-Größe
   */
  resize(width: number, height: number): void {
    this.grid.resize(width, height);
    this.generation = 0;
  }

  /**
   * Wechselt den Zustand einer bestimmten Zelle
   */
  toggleCell(x: number, y: number): void {
    this.grid.toggleCell(x, y);
  }

  /**
   * Fügt ein vordefiniertes Pattern in das Grid ein
   */
  insertPattern(pattern: boolean[][], startX: number, startY: number): void {
    this.grid.insertPattern(pattern, startX, startY);
    this.generation = 0;
  }
}
