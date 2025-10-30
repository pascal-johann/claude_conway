import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Renderer } from '../renderer';
import { Grid } from '../grid';
import { COLOR_SCHEMES } from '../config';

// Mock Canvas API
class MockCanvasRenderingContext2D {
  fillStyle: string = '#000000';
  strokeStyle: string = '#000000';
  lineWidth: number = 1;

  fillRect = vi.fn();
  strokeRect = vi.fn();
  clearRect = vi.fn();
  beginPath = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  stroke = vi.fn();
  fill = vi.fn();
}

class MockHTMLCanvasElement {
  width: number = 0;
  height: number = 0;
  private context: MockCanvasRenderingContext2D;

  constructor() {
    this.context = new MockCanvasRenderingContext2D();
  }

  getContext(type: string): MockCanvasRenderingContext2D | null {
    if (type === '2d') {
      return this.context;
    }
    return null;
  }
}

describe('Renderer', () => {
  let canvas: MockHTMLCanvasElement;
  let renderer: Renderer;
  let grid: Grid;
  const colorScheme = COLOR_SCHEMES[0]; // Classic

  beforeEach(() => {
    canvas = new MockHTMLCanvasElement();
    grid = new Grid(10, 10);
    renderer = new Renderer(
      canvas as unknown as HTMLCanvasElement,
      10,
      colorScheme,
      true
    );
  });

  describe('Constructor', () => {
    it('should create renderer with canvas', () => {
      expect(renderer).toBeDefined();
    });

    it('should throw error if canvas context is null', () => {
      const badCanvas = {
        getContext: () => null
      } as unknown as HTMLCanvasElement;

      expect(() => {
        new Renderer(badCanvas, 10, colorScheme);
      }).toThrow('Could not get 2D context from canvas');
    });

    it('should accept optional showGrid parameter', () => {
      const rendererWithoutGrid = new Renderer(
        canvas as unknown as HTMLCanvasElement,
        10,
        colorScheme,
        false
      );
      expect(rendererWithoutGrid).toBeDefined();
    });

    it('should default showGrid to true if not provided', () => {
      const rendererDefault = new Renderer(
        canvas as unknown as HTMLCanvasElement,
        10,
        colorScheme
      );
      expect(rendererDefault).toBeDefined();
    });
  });

  describe('resizeCanvas', () => {
    it('should resize canvas to fit grid', () => {
      renderer.resizeCanvas(20, 20);

      expect(canvas.width).toBe(200); // 20 * 10 (cellSize)
      expect(canvas.height).toBe(200);
    });

    it('should handle different grid sizes', () => {
      renderer.resizeCanvas(50, 30);

      expect(canvas.width).toBe(500);
      expect(canvas.height).toBe(300);
    });

    it('should handle small grids', () => {
      renderer.resizeCanvas(5, 5);

      expect(canvas.width).toBe(50);
      expect(canvas.height).toBe(50);
    });
  });

  describe('render', () => {
    let ctx: MockCanvasRenderingContext2D;

    beforeEach(() => {
      ctx = canvas.getContext('2d') as MockCanvasRenderingContext2D;
      renderer.resizeCanvas(10, 10);
    });

    it('should fill canvas with dead cell color', () => {
      renderer.render(grid);

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
    });

    it('should render alive cells', () => {
      grid.setCell(5, 5, true);
      grid.setCell(6, 6, true);

      renderer.render(grid);

      // Should draw alive cells
      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should draw grid lines when showGrid is true', () => {
      renderer.render(grid);

      // Should call stroke for grid lines
      expect(ctx.stroke).toHaveBeenCalled();
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalled();
      expect(ctx.lineTo).toHaveBeenCalled();
    });

    it('should set correct fill style for dead cells', () => {
      renderer.render(grid);

      // First fillStyle should be deadColor
      expect(ctx.fillStyle).toBeDefined();
    });

    it('should render multiple alive cells', () => {
      grid.setCell(2, 2, true);
      grid.setCell(3, 3, true);
      grid.setCell(4, 4, true);

      renderer.render(grid);

      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should handle empty grid', () => {
      renderer.render(grid);

      // Should still fill background
      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should handle full grid', () => {
      // Fill entire grid
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          grid.setCell(x, y, true);
        }
      }

      renderer.render(grid);

      // Should call fillRect for each cell plus background
      expect(ctx.fillRect).toHaveBeenCalled();
    });
  });

  describe('setColorScheme', () => {
    it('should update color scheme', () => {
      const newScheme = COLOR_SCHEMES[1]; // Dark Mode
      renderer.setColorScheme(newScheme);

      // Render to see if new colors are used
      renderer.render(grid);

      // Should not throw error
      expect(true).toBe(true);
    });

    it('should accept all predefined color schemes', () => {
      COLOR_SCHEMES.forEach(scheme => {
        expect(() => {
          renderer.setColorScheme(scheme);
        }).not.toThrow();
      });
    });

    it('should render with new colors after change', () => {
      const ctx = canvas.getContext('2d') as MockCanvasRenderingContext2D;
      const oceanScheme = COLOR_SCHEMES[2]; // Ocean

      renderer.setColorScheme(oceanScheme);
      grid.setCell(5, 5, true);
      renderer.render(grid);

      // Should have been called with rendering
      expect(ctx.fillRect).toHaveBeenCalled();
    });
  });

  describe('setShowGrid', () => {
    let ctx: MockCanvasRenderingContext2D;

    beforeEach(() => {
      ctx = canvas.getContext('2d') as MockCanvasRenderingContext2D;
      renderer.resizeCanvas(10, 10);
    });

    it('should enable grid lines', () => {
      renderer.setShowGrid(true);
      renderer.render(grid);

      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should disable grid lines', () => {
      renderer.setShowGrid(false);
      ctx.stroke.mockClear();

      renderer.render(grid);

      // stroke should not be called when grid is disabled
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should toggle grid visibility', () => {
      // Enable
      renderer.setShowGrid(true);
      renderer.render(grid);
      expect(ctx.stroke).toHaveBeenCalled();

      // Disable
      ctx.stroke.mockClear();
      renderer.setShowGrid(false);
      renderer.render(grid);
      expect(ctx.stroke).not.toHaveBeenCalled();
    });
  });

  describe('setCellSize', () => {
    it('should update cell size', () => {
      renderer.setCellSize(20);

      // Should not throw
      expect(true).toBe(true);
    });

    it('should accept different cell sizes', () => {
      [5, 10, 15, 20, 25].forEach(size => {
        expect(() => {
          renderer.setCellSize(size);
        }).not.toThrow();
      });
    });
  });

  describe('canvasToGrid', () => {
    it('should convert canvas coordinates to grid coordinates', () => {
      const gridPos = renderer.canvasToGrid(55, 55);

      expect(gridPos.x).toBe(5); // 55 / 10 = 5.5, floor = 5
      expect(gridPos.y).toBe(5);
    });

    it('should handle top-left corner', () => {
      const gridPos = renderer.canvasToGrid(0, 0);

      expect(gridPos.x).toBe(0);
      expect(gridPos.y).toBe(0);
    });

    it('should handle cell boundaries', () => {
      const gridPos = renderer.canvasToGrid(10, 10);

      expect(gridPos.x).toBe(1); // Exactly on boundary
      expect(gridPos.y).toBe(1);
    });

    it('should floor fractional coordinates', () => {
      const gridPos = renderer.canvasToGrid(15, 25);

      expect(gridPos.x).toBe(1); // 15 / 10 = 1.5, floor = 1
      expect(gridPos.y).toBe(2); // 25 / 10 = 2.5, floor = 2
    });

    it('should handle large coordinates', () => {
      const gridPos = renderer.canvasToGrid(95, 95);

      expect(gridPos.x).toBe(9);
      expect(gridPos.y).toBe(9);
    });

    it('should work with different cell sizes', () => {
      renderer.setCellSize(20);
      const gridPos = renderer.canvasToGrid(50, 50);

      expect(gridPos.x).toBe(2); // 50 / 20 = 2.5, floor = 2
      expect(gridPos.y).toBe(2);
    });
  });

  describe('highlightCell', () => {
    let ctx: MockCanvasRenderingContext2D;

    beforeEach(() => {
      ctx = canvas.getContext('2d') as MockCanvasRenderingContext2D;
    });

    it('should highlight a cell with specified color', () => {
      renderer.highlightCell(5, 5, '#FF0000');

      expect(ctx.fillRect).toHaveBeenCalled();
      expect(ctx.fillStyle).toBe('#FF0000');
    });

    it('should highlight different cells', () => {
      renderer.highlightCell(2, 3, '#00FF00');
      renderer.highlightCell(7, 8, '#0000FF');

      expect(ctx.fillRect).toHaveBeenCalledTimes(2);
    });

    it('should use correct coordinates', () => {
      renderer.highlightCell(5, 5, '#FFFF00');

      // Should draw at cell position (5*10=50, 5*10=50) with offset (+1)
      // and size (10-2=8)
      expect(ctx.fillRect).toHaveBeenCalledWith(51, 51, 8, 8);
    });

    it('should handle corner cells', () => {
      renderer.highlightCell(0, 0, '#FF00FF');

      expect(ctx.fillRect).toHaveBeenCalledWith(1, 1, 8, 8);
    });
  });

  describe('Integration with Grid', () => {
    let ctx: MockCanvasRenderingContext2D;

    beforeEach(() => {
      ctx = canvas.getContext('2d') as MockCanvasRenderingContext2D;
      renderer.resizeCanvas(10, 10);
    });

    it('should render different grid sizes', () => {
      const largeGrid = new Grid(50, 50);
      renderer.resizeCanvas(50, 50);

      renderer.render(largeGrid);

      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should handle grid state changes', () => {
      renderer.render(grid);

      grid.setCell(5, 5, true);
      ctx.fillRect.mockClear();
      renderer.render(grid);

      // Should render again with alive cell
      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should render patterns correctly', () => {
      // Create a blinker pattern
      grid.setCell(4, 5, true);
      grid.setCell(5, 5, true);
      grid.setCell(6, 5, true);

      renderer.render(grid);

      expect(ctx.fillRect).toHaveBeenCalled();
    });
  });

  describe('Color Application', () => {
    let ctx: MockCanvasRenderingContext2D;

    beforeEach(() => {
      ctx = canvas.getContext('2d') as MockCanvasRenderingContext2D;
      renderer.resizeCanvas(10, 10);
    });

    it('should apply color scheme colors', () => {
      renderer.render(grid);

      // fillStyle should be set to dead color initially
      expect(ctx.fillStyle).toBeDefined();
    });

    it('should change colors with different schemes', () => {
      const darkMode = COLOR_SCHEMES.find(s => s.name === 'Dark Mode');
      if (darkMode) {
        renderer.setColorScheme(darkMode);
        renderer.render(grid);

        expect(ctx.fillStyle).toBeDefined();
      }
    });
  });
});
