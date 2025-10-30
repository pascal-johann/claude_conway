/**
 * Renderer-Klasse für das Zeichnen des Grids auf einem Canvas-Element
 * Verantwortlich für die visuelle Darstellung des Spielzustands
 */

import { Grid } from './grid.js';
import { ColorScheme } from './config.js';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private colorScheme: ColorScheme;
  private showGrid: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    cellSize: number,
    colorScheme: ColorScheme,
    showGrid: boolean = true
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    this.cellSize = cellSize;
    this.colorScheme = colorScheme;
    this.showGrid = showGrid;
  }

  /**
   * Passt die Canvas-Größe an die Grid-Dimensionen an
   */
  resizeCanvas(width: number, height: number): void {
    this.canvas.width = width * this.cellSize;
    this.canvas.height = height * this.cellSize;
  }

  /**
   * Zeichnet das gesamte Grid auf dem Canvas
   */
  render(grid: Grid): void {
    const width = grid.getWidth();
    const height = grid.getHeight();

    // Canvas leeren (mit toter Zellen-Farbe füllen)
    this.ctx.fillStyle = this.colorScheme.deadColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Lebende Zellen zeichnen
    this.ctx.fillStyle = this.colorScheme.aliveColor;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid.getCell(x, y)) {
          this.ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
      }
    }

    // Grid-Linien zeichnen (optional)
    if (this.showGrid) {
      this.drawGrid(width, height);
    }
  }

  /**
   * Zeichnet die Grid-Linien
   */
  private drawGrid(width: number, height: number): void {
    this.ctx.strokeStyle = this.colorScheme.gridColor;
    this.ctx.lineWidth = 1;

    // Vertikale Linien
    for (let x = 0; x <= width; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, height * this.cellSize);
      this.ctx.stroke();
    }

    // Horizontale Linien
    for (let y = 0; y <= height; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(width * this.cellSize, y * this.cellSize);
      this.ctx.stroke();
    }
  }

  /**
   * Ändert das Farbschema
   */
  setColorScheme(colorScheme: ColorScheme): void {
    this.colorScheme = colorScheme;
  }

  /**
   * Ändert die Sichtbarkeit der Grid-Linien
   */
  setShowGrid(showGrid: boolean): void {
    this.showGrid = showGrid;
  }

  /**
   * Ändert die Zellgröße
   */
  setCellSize(cellSize: number): void {
    this.cellSize = cellSize;
  }

  /**
   * Konvertiert Canvas-Koordinaten in Grid-Koordinaten
   */
  canvasToGrid(canvasX: number, canvasY: number): { x: number; y: number } {
    return {
      x: Math.floor(canvasX / this.cellSize),
      y: Math.floor(canvasY / this.cellSize)
    };
  }

  /**
   * Hilfsmethode zum Zeichnen eines einzelnen Pixels/Hervorhebung
   * (kann für interaktive Features genutzt werden)
   */
  highlightCell(x: number, y: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.cellSize + 1,
      y * this.cellSize + 1,
      this.cellSize - 2,
      this.cellSize - 2
    );
  }
}
