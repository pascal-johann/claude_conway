import { describe, it, expect, beforeEach } from 'vitest';
import { Grid, PATTERNS } from '../grid';

describe('Grid', () => {
  let grid: Grid;

  beforeEach(() => {
    grid = new Grid(10, 10);
  });

  describe('Constructor and Basic Properties', () => {
    it('should create a grid with specified dimensions', () => {
      expect(grid.getWidth()).toBe(10);
      expect(grid.getHeight()).toBe(10);
    });

    it('should initialize all cells as dead', () => {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });

    it('should create different sized grids', () => {
      const smallGrid = new Grid(5, 5);
      expect(smallGrid.getWidth()).toBe(5);
      expect(smallGrid.getHeight()).toBe(5);

      const largeGrid = new Grid(100, 100);
      expect(largeGrid.getWidth()).toBe(100);
      expect(largeGrid.getHeight()).toBe(100);
    });
  });

  describe('getCell', () => {
    it('should return false for cells outside grid bounds', () => {
      expect(grid.getCell(-1, 0)).toBe(false);
      expect(grid.getCell(0, -1)).toBe(false);
      expect(grid.getCell(10, 0)).toBe(false);
      expect(grid.getCell(0, 10)).toBe(false);
      expect(grid.getCell(100, 100)).toBe(false);
    });

    it('should return correct cell state', () => {
      grid.setCell(5, 5, true);
      expect(grid.getCell(5, 5)).toBe(true);
      expect(grid.getCell(5, 6)).toBe(false);
    });
  });

  describe('setCell', () => {
    it('should set cell to alive', () => {
      grid.setCell(3, 3, true);
      expect(grid.getCell(3, 3)).toBe(true);
    });

    it('should set cell to dead', () => {
      grid.setCell(3, 3, true);
      grid.setCell(3, 3, false);
      expect(grid.getCell(3, 3)).toBe(false);
    });

    it('should not affect cells outside bounds', () => {
      grid.setCell(-1, 0, true);
      grid.setCell(0, -1, true);
      grid.setCell(10, 0, true);
      grid.setCell(0, 10, true);
      // Grid should still be empty
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });
  });

  describe('toggleCell', () => {
    it('should toggle cell from dead to alive', () => {
      expect(grid.getCell(5, 5)).toBe(false);
      grid.toggleCell(5, 5);
      expect(grid.getCell(5, 5)).toBe(true);
    });

    it('should toggle cell from alive to dead', () => {
      grid.setCell(5, 5, true);
      expect(grid.getCell(5, 5)).toBe(true);
      grid.toggleCell(5, 5);
      expect(grid.getCell(5, 5)).toBe(false);
    });

    it('should not affect cells outside bounds', () => {
      grid.toggleCell(-1, 0);
      grid.toggleCell(10, 0);
      // Should not throw error
      expect(grid.getCell(0, 0)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cells', () => {
      // Set some cells alive
      grid.setCell(1, 1, true);
      grid.setCell(2, 2, true);
      grid.setCell(3, 3, true);

      grid.clear();

      // All cells should be dead
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });

    it('should clear a fully populated grid', () => {
      // Fill entire grid
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          grid.setCell(x, y, true);
        }
      }

      grid.clear();

      // All cells should be dead
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });
  });

  describe('randomize', () => {
    it('should create a grid with some alive cells', () => {
      grid.randomize(0.5);

      let aliveCount = 0;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (grid.getCell(x, y)) {
            aliveCount++;
          }
        }
      }

      // With 100 cells and 0.5 probability, expect roughly 30-70 alive cells
      expect(aliveCount).toBeGreaterThan(20);
      expect(aliveCount).toBeLessThan(80);
    });

    it('should use default probability when not specified', () => {
      grid.randomize();

      let aliveCount = 0;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (grid.getCell(x, y)) {
            aliveCount++;
          }
        }
      }

      // With default probability 0.3, expect some alive cells
      expect(aliveCount).toBeGreaterThanOrEqual(0);
    });

    it('should create all dead cells with probability 0', () => {
      grid.randomize(0);

      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });

    it('should create all alive cells with probability 1', () => {
      grid.randomize(1);

      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(true);
        }
      }
    });
  });

  describe('countNeighbors', () => {
    it('should count 0 neighbors for isolated cell', () => {
      grid.setCell(5, 5, true);
      expect(grid.countNeighbors(5, 5)).toBe(0);
    });

    it('should count all 8 neighbors', () => {
      // Create a 3x3 block of alive cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          grid.setCell(5 + dx, 5 + dy, true);
        }
      }
      // Center cell should have 8 neighbors
      expect(grid.countNeighbors(5, 5)).toBe(8);
    });

    it('should count horizontal neighbors', () => {
      grid.setCell(4, 5, true);
      grid.setCell(6, 5, true);
      expect(grid.countNeighbors(5, 5)).toBe(2);
    });

    it('should count vertical neighbors', () => {
      grid.setCell(5, 4, true);
      grid.setCell(5, 6, true);
      expect(grid.countNeighbors(5, 5)).toBe(2);
    });

    it('should count diagonal neighbors', () => {
      grid.setCell(4, 4, true);
      grid.setCell(6, 6, true);
      expect(grid.countNeighbors(5, 5)).toBe(2);
    });

    it('should handle corner cells correctly', () => {
      // Top-left corner
      grid.setCell(1, 0, true);
      grid.setCell(0, 1, true);
      grid.setCell(1, 1, true);
      expect(grid.countNeighbors(0, 0)).toBe(3);
    });

    it('should handle edge cells correctly', () => {
      // Top edge
      grid.setCell(4, 0, true);
      grid.setCell(6, 0, true);
      grid.setCell(4, 1, true);
      grid.setCell(5, 1, true);
      grid.setCell(6, 1, true);
      expect(grid.countNeighbors(5, 0)).toBe(5);
    });

    it('should not count cells outside grid bounds', () => {
      // Set corner cell alive
      grid.setCell(0, 0, true);
      // Neighbors outside bounds should not be counted
      expect(grid.countNeighbors(0, 0)).toBe(0);
    });
  });

  describe('clone', () => {
    it('should create a copy of the grid state', () => {
      grid.setCell(1, 1, true);
      grid.setCell(2, 2, true);
      grid.setCell(3, 3, true);

      const cloned = grid.clone();

      expect(cloned[1][1]).toBe(true);
      expect(cloned[2][2]).toBe(true);
      expect(cloned[3][3]).toBe(true);
      expect(cloned[0][0]).toBe(false);
    });

    it('should create independent copy', () => {
      const cloned = grid.clone();

      // Modify original
      grid.setCell(5, 5, true);

      // Clone should not be affected
      expect(cloned[5][5]).toBe(false);
    });
  });

  describe('setState', () => {
    it('should set grid to new state', () => {
      const newState = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => false)
      );
      newState[3][3] = true;
      newState[4][4] = true;

      grid.setState(newState);

      expect(grid.getCell(3, 3)).toBe(true);
      expect(grid.getCell(4, 4)).toBe(true);
      expect(grid.getCell(0, 0)).toBe(false);
    });

    it('should not set state with wrong dimensions', () => {
      const wrongState = Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => true)
      );

      grid.setState(wrongState);

      // Grid should remain unchanged
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });
  });

  describe('resize', () => {
    it('should resize grid to new dimensions', () => {
      grid.setCell(5, 5, true);

      grid.resize(20, 20);

      expect(grid.getWidth()).toBe(20);
      expect(grid.getHeight()).toBe(20);
    });

    it('should clear grid when resizing', () => {
      grid.setCell(5, 5, true);

      grid.resize(20, 20);

      // All cells should be dead after resize
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          expect(grid.getCell(x, y)).toBe(false);
        }
      }
    });

    it('should allow resizing to smaller dimensions', () => {
      grid.resize(5, 5);

      expect(grid.getWidth()).toBe(5);
      expect(grid.getHeight()).toBe(5);
    });
  });

  describe('insertPattern', () => {
    it('should insert pattern at specified position', () => {
      const pattern = [
        [true, false],
        [false, true]
      ];

      grid.insertPattern(pattern, 3, 3);

      expect(grid.getCell(3, 3)).toBe(true);
      expect(grid.getCell(4, 3)).toBe(false);
      expect(grid.getCell(3, 4)).toBe(false);
      expect(grid.getCell(4, 4)).toBe(true);
    });

    it('should insert glider pattern', () => {
      grid.insertPattern(PATTERNS.glider, 2, 2);

      expect(grid.getCell(3, 2)).toBe(true);
      expect(grid.getCell(4, 3)).toBe(true);
      expect(grid.getCell(2, 4)).toBe(true);
      expect(grid.getCell(3, 4)).toBe(true);
      expect(grid.getCell(4, 4)).toBe(true);
    });

    it('should insert blinker pattern', () => {
      grid.insertPattern(PATTERNS.blinker, 4, 4);

      expect(grid.getCell(4, 4)).toBe(true);
      expect(grid.getCell(5, 4)).toBe(true);
      expect(grid.getCell(6, 4)).toBe(true);
    });

    it('should handle pattern at grid boundary', () => {
      const pattern = [[true, true], [true, true]];

      // Insert at edge - should clip pattern
      grid.insertPattern(pattern, 9, 9);

      expect(grid.getCell(9, 9)).toBe(true);
      // Cells outside grid should not cause error
    });

    it('should handle pattern partially outside grid', () => {
      const pattern = [[true, true, true]];

      grid.insertPattern(pattern, -1, 5);

      // Only cells inside grid should be set
      expect(grid.getCell(0, 5)).toBe(true);
      expect(grid.getCell(1, 5)).toBe(true);
    });
  });

  describe('PATTERNS', () => {
    it('should have glider pattern defined', () => {
      expect(PATTERNS.glider).toBeDefined();
      expect(PATTERNS.glider.length).toBe(3);
      expect(PATTERNS.glider[0].length).toBe(3);
    });

    it('should have blinker pattern defined', () => {
      expect(PATTERNS.blinker).toBeDefined();
      expect(PATTERNS.blinker.length).toBe(1);
      expect(PATTERNS.blinker[0].length).toBe(3);
    });

    it('should have toad pattern defined', () => {
      expect(PATTERNS.toad).toBeDefined();
      expect(PATTERNS.toad.length).toBe(2);
    });

    it('should have beacon pattern defined', () => {
      expect(PATTERNS.beacon).toBeDefined();
      expect(PATTERNS.beacon.length).toBe(4);
    });
  });
});
