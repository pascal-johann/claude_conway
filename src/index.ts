/**
 * Entry Point für Conway's Game of Life
 * Verbindet Game-Logik, Rendering und UI-Controls
 */

import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { COLOR_SCHEMES, GRID_SIZES, DEFAULT_CONFIG, ColorScheme, GridSize } from './config.js';

class GameOfLife {
  private game: Game;
  private renderer: Renderer;
  private isRunning: boolean = false;
  private intervalId: number | null = null;
  private speed: number = DEFAULT_CONFIG.speed;

  // UI-Elemente
  private canvas: HTMLCanvasElement;
  private startButton: HTMLButtonElement;
  private pauseButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private randomButton: HTMLButtonElement;
  private speedSlider: HTMLInputElement;
  private speedValue: HTMLSpanElement;
  private gridSizeSelect: HTMLSelectElement;
  private colorSchemeSelect: HTMLSelectElement;
  private generationDisplay: HTMLSpanElement;

  constructor() {
    // Canvas initialisieren
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }

    // UI-Elemente holen
    this.startButton = document.getElementById('startBtn') as HTMLButtonElement;
    this.pauseButton = document.getElementById('pauseBtn') as HTMLButtonElement;
    this.resetButton = document.getElementById('resetBtn') as HTMLButtonElement;
    this.randomButton = document.getElementById('randomBtn') as HTMLButtonElement;
    this.speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
    this.speedValue = document.getElementById('speedValue') as HTMLSpanElement;
    this.gridSizeSelect = document.getElementById('gridSize') as HTMLSelectElement;
    this.colorSchemeSelect = document.getElementById('colorScheme') as HTMLSelectElement;
    this.generationDisplay = document.getElementById('generation') as HTMLSpanElement;

    // Game und Renderer initialisieren
    this.game = new Game(
      DEFAULT_CONFIG.gridSize.width,
      DEFAULT_CONFIG.gridSize.height
    );
    this.renderer = new Renderer(
      this.canvas,
      DEFAULT_CONFIG.cellSize,
      DEFAULT_CONFIG.colorScheme,
      DEFAULT_CONFIG.showGrid
    );

    this.renderer.resizeCanvas(
      DEFAULT_CONFIG.gridSize.width,
      DEFAULT_CONFIG.gridSize.height
    );

    // UI initialisieren
    this.initializeUI();
    this.setupEventListeners();

    // Initiales Rendering
    this.render();
  }

  /**
   * Initialisiert die UI-Komponenten
   */
  private initializeUI(): void {
    // Grid-Größen-Dropdown füllen
    GRID_SIZES.forEach((size, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = size.label;
      if (size.label === DEFAULT_CONFIG.gridSize.label) {
        option.selected = true;
      }
      this.gridSizeSelect.appendChild(option);
    });

    // Farbschema-Dropdown füllen
    COLOR_SCHEMES.forEach((scheme, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = scheme.name;
      if (scheme.name === DEFAULT_CONFIG.colorScheme.name) {
        option.selected = true;
      }
      this.colorSchemeSelect.appendChild(option);
    });

    // Speed-Slider initialisieren
    this.speedSlider.min = DEFAULT_CONFIG.minSpeed.toString();
    this.speedSlider.max = DEFAULT_CONFIG.maxSpeed.toString();
    this.speedSlider.value = DEFAULT_CONFIG.speed.toString();
    this.updateSpeedDisplay();

    // Initial-Button-Zustand
    this.updateButtonStates();
  }

  /**
   * Richtet Event-Listener ein
   */
  private setupEventListeners(): void {
    // Button-Events
    this.startButton.addEventListener('click', () => this.start());
    this.pauseButton.addEventListener('click', () => this.pause());
    this.resetButton.addEventListener('click', () => this.reset());
    this.randomButton.addEventListener('click', () => this.randomize());

    // Speed-Slider
    this.speedSlider.addEventListener('input', () => {
      this.speed = parseInt(this.speedSlider.value);
      this.updateSpeedDisplay();
      if (this.isRunning) {
        this.pause();
        this.start();
      }
    });

    // Grid-Größe
    this.gridSizeSelect.addEventListener('change', () => {
      const index = parseInt(this.gridSizeSelect.value);
      this.changeGridSize(GRID_SIZES[index]);
    });

    // Farbschema
    this.colorSchemeSelect.addEventListener('change', () => {
      const index = parseInt(this.colorSchemeSelect.value);
      this.changeColorScheme(COLOR_SCHEMES[index]);
    });

    // Canvas-Klick zum Togglen von Zellen
    this.canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
    });
  }

  /**
   * Startet die Simulation
   */
  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.game.nextGeneration();
      this.render();
    }, this.speed);

    this.updateButtonStates();
  }

  /**
   * Pausiert die Simulation
   */
  private pause(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.updateButtonStates();
  }

  /**
   * Setzt das Spiel zurück
   */
  private reset(): void {
    this.pause();
    this.game.reset();
    this.render();
  }

  /**
   * Füllt das Grid mit zufälligen Zellen
   */
  private randomize(): void {
    this.pause();
    this.game.randomize();
    this.render();
  }

  /**
   * Ändert die Grid-Größe
   */
  private changeGridSize(size: GridSize): void {
    this.pause();
    this.game.resize(size.width, size.height);
    this.renderer.resizeCanvas(size.width, size.height);
    this.render();
  }

  /**
   * Ändert das Farbschema
   */
  private changeColorScheme(scheme: ColorScheme): void {
    this.renderer.setColorScheme(scheme);
    this.render();
  }

  /**
   * Verarbeitet Klicks auf das Canvas
   */
  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const gridPos = this.renderer.canvasToGrid(canvasX, canvasY);
    this.game.toggleCell(gridPos.x, gridPos.y);
    this.render();
  }

  /**
   * Rendert den aktuellen Spielzustand
   */
  private render(): void {
    this.renderer.render(this.game.getGrid());
    this.generationDisplay.textContent = this.game.getGeneration().toString();
  }

  /**
   * Aktualisiert die Speed-Anzeige
   */
  private updateSpeedDisplay(): void {
    this.speedValue.textContent = `${this.speed}ms`;
  }

  /**
   * Aktualisiert den Zustand der Buttons (enabled/disabled)
   */
  private updateButtonStates(): void {
    this.startButton.disabled = this.isRunning;
    this.pauseButton.disabled = !this.isRunning;
  }
}

// Initialisierung nach DOM-Load
document.addEventListener('DOMContentLoaded', () => {
  new GameOfLife();
});
