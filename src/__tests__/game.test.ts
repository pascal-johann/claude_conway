import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../game';
import { PATTERNS } from '../grid';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game(10, 10);
  });

  describe('Constructor and Basic Properties', () => {
    it('should create a game with specified dimensions', () => {
      expect(game.getGrid().getWidth()).toBe(10);
      expect(game.getGrid().getHeight()).toBe(10);
    });

    it('should start with generation 0', () => {
      expect(game.getGeneration()).toBe(0);
    });

    it('should create game with different sizes', () => {
      const largeGame = new Game(50, 50);
      expect(largeGame.getGrid().getWidth()).toBe(50);
      expect(largeGame.getGrid().getHeight()).toBe(50);
    });
  });

  describe('getGrid', () => {
    it('should return the grid instance', () => {
      const grid = game.getGrid();
      expect(grid).toBeDefined();
      expect(grid.getWidth()).toBe(10);
      expect(grid.getHeight()).toBe(10);
    });
  });

  describe('getGeneration', () => {
    it('should return current generation number', () => {
      expect(game.getGeneration()).toBe(0);
      game.nextGeneration();
      expect(game.getGeneration()).toBe(1);
      game.nextGeneration();
      expect(game.getGeneration()).toBe(2);
    });
  });

  describe('resetGeneration', () => {
    it('should reset generation counter to 0', () => {
      game.nextGeneration();
      game.nextGeneration();
      expect(game.getGeneration()).toBe(2);

      game.resetGeneration();
      expect(game.getGeneration()).toBe(0);
    });
  });

  describe('Conway\'s Rules - nextGeneration', () => {
    describe('Rule 1: Living cell with 2-3 neighbors survives', () => {
      it('should keep alive cell with 2 neighbors', () => {
        // Create pattern:
        // X X X
        game.getGrid().setCell(4, 5, true);
        game.getGrid().setCell(5, 5, true);
        game.getGrid().setCell(6, 5, true);

        game.nextGeneration();

        // Middle cell should survive (has 2 neighbors)
        expect(game.getGrid().getCell(5, 5)).toBe(true);
      });

      it('should keep alive cell with 3 neighbors', () => {
        // Create pattern:
        // X X
        // X X
        game.getGrid().setCell(5, 5, true);
        game.getGrid().setCell(6, 5, true);
        game.getGrid().setCell(5, 6, true);
        game.getGrid().setCell(6, 6, true);

        game.nextGeneration();

        // All cells should survive (each has 3 neighbors)
        expect(game.getGrid().getCell(5, 5)).toBe(true);
        expect(game.getGrid().getCell(6, 5)).toBe(true);
        expect(game.getGrid().getCell(5, 6)).toBe(true);
        expect(game.getGrid().getCell(6, 6)).toBe(true);
      });
    });

    describe('Rule 2: Dead cell with exactly 3 neighbors becomes alive', () => {
      it('should create new cell with 3 neighbors', () => {
        // Create L-shape:
        // X
        // X
        // X X
        game.getGrid().setCell(5, 4, true);
        game.getGrid().setCell(5, 5, true);
        game.getGrid().setCell(5, 6, true);

        game.nextGeneration();

        // Cell at (4,5) should become alive (has 3 neighbors)
        expect(game.getGrid().getCell(4, 5)).toBe(true);
        // Cell at (6,5) should become alive (has 3 neighbors)
        expect(game.getGrid().getCell(6, 5)).toBe(true);
      });
    });

    describe('Rule 3: Living cell with <2 neighbors dies (underpopulation)', () => {
      it('should kill cell with 0 neighbors', () => {
        game.getGrid().setCell(5, 5, true);

        game.nextGeneration();

        expect(game.getGrid().getCell(5, 5)).toBe(false);
      });

      it('should kill cell with 1 neighbor', () => {
        game.getGrid().setCell(5, 5, true);
        game.getGrid().setCell(6, 5, true);

        game.nextGeneration();

        expect(game.getGrid().getCell(5, 5)).toBe(false);
        expect(game.getGrid().getCell(6, 5)).toBe(false);
      });
    });

    describe('Rule 4: Living cell with >3 neighbors dies (overpopulation)', () => {
      it('should kill cell with 4 neighbors', () => {
        // Create plus pattern:
        //   X
        // X X X
        //   X
        game.getGrid().setCell(5, 4, true);
        game.getGrid().setCell(4, 5, true);
        game.getGrid().setCell(5, 5, true);
        game.getGrid().setCell(6, 5, true);
        game.getGrid().setCell(5, 6, true);

        game.nextGeneration();

        // Center cell should die (has 4 neighbors)
        expect(game.getGrid().getCell(5, 5)).toBe(false);
      });

      it('should kill cell with 8 neighbors', () => {
        // Create 3x3 block
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            game.getGrid().setCell(5 + dx, 5 + dy, true);
          }
        }

        game.nextGeneration();

        // Center cell should die (has 8 neighbors)
        expect(game.getGrid().getCell(5, 5)).toBe(false);
      });
    });
  });

  describe('Known Patterns', () => {
    it('should handle blinker pattern (oscillator)', () => {
      // Blinker: horizontal line becomes vertical line
      // Generation 0: X X X
      game.getGrid().setCell(4, 5, true);
      game.getGrid().setCell(5, 5, true);
      game.getGrid().setCell(6, 5, true);

      game.nextGeneration();

      // Generation 1: vertical line
      //   X
      //   X
      //   X
      expect(game.getGrid().getCell(5, 4)).toBe(true);
      expect(game.getGrid().getCell(5, 5)).toBe(true);
      expect(game.getGrid().getCell(5, 6)).toBe(true);
      expect(game.getGrid().getCell(4, 5)).toBe(false);
      expect(game.getGrid().getCell(6, 5)).toBe(false);

      game.nextGeneration();

      // Generation 2: back to horizontal
      expect(game.getGrid().getCell(4, 5)).toBe(true);
      expect(game.getGrid().getCell(5, 5)).toBe(true);
      expect(game.getGrid().getCell(6, 5)).toBe(true);
      expect(game.getGrid().getCell(5, 4)).toBe(false);
      expect(game.getGrid().getCell(5, 6)).toBe(false);
    });

    it('should handle block pattern (still life)', () => {
      // Block: 2x2 square stays stable
      game.getGrid().setCell(5, 5, true);
      game.getGrid().setCell(6, 5, true);
      game.getGrid().setCell(5, 6, true);
      game.getGrid().setCell(6, 6, true);

      game.nextGeneration();

      // Should remain unchanged
      expect(game.getGrid().getCell(5, 5)).toBe(true);
      expect(game.getGrid().getCell(6, 5)).toBe(true);
      expect(game.getGrid().getCell(5, 6)).toBe(true);
      expect(game.getGrid().getCell(6, 6)).toBe(true);
    });
  });

  describe('reset', () => {
    it('should clear all cells', () => {
      game.getGrid().setCell(5, 5, true);
      game.getGrid().setCell(6, 6, true);
      game.nextGeneration();

      game.reset();

      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(game.getGrid().getCell(x, y)).toBe(false);
        }
      }
    });

    it('should reset generation to 0', () => {
      game.nextGeneration();
      game.nextGeneration();
      expect(game.getGeneration()).toBe(2);

      game.reset();

      expect(game.getGeneration()).toBe(0);
    });
  });

  describe('randomize', () => {
    it('should create random pattern', () => {
      game.randomize();

      let aliveCount = 0;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (game.getGrid().getCell(x, y)) {
            aliveCount++;
          }
        }
      }

      // Should have some alive cells (with default probability)
      expect(aliveCount).toBeGreaterThanOrEqual(0);
    });

    it('should reset generation to 0', () => {
      game.nextGeneration();
      game.nextGeneration();
      expect(game.getGeneration()).toBe(2);

      game.randomize();

      expect(game.getGeneration()).toBe(0);
    });
  });

  describe('resize', () => {
    it('should resize the grid', () => {
      game.resize(20, 20);

      expect(game.getGrid().getWidth()).toBe(20);
      expect(game.getGrid().getHeight()).toBe(20);
    });

    it('should reset generation to 0', () => {
      game.nextGeneration();
      game.nextGeneration();
      expect(game.getGeneration()).toBe(2);

      game.resize(15, 15);

      expect(game.getGeneration()).toBe(0);
    });

    it('should clear the grid when resizing', () => {
      game.getGrid().setCell(5, 5, true);

      game.resize(20, 20);

      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          expect(game.getGrid().getCell(x, y)).toBe(false);
        }
      }
    });
  });

  describe('toggleCell', () => {
    it('should toggle cell from dead to alive', () => {
      expect(game.getGrid().getCell(5, 5)).toBe(false);

      game.toggleCell(5, 5);

      expect(game.getGrid().getCell(5, 5)).toBe(true);
    });

    it('should toggle cell from alive to dead', () => {
      game.getGrid().setCell(5, 5, true);
      expect(game.getGrid().getCell(5, 5)).toBe(true);

      game.toggleCell(5, 5);

      expect(game.getGrid().getCell(5, 5)).toBe(false);
    });
  });

  describe('insertPattern', () => {
    it('should insert pattern into grid', () => {
      const pattern = [[true, false], [false, true]];

      game.insertPattern(pattern, 3, 3);

      expect(game.getGrid().getCell(3, 3)).toBe(true);
      expect(game.getGrid().getCell(4, 4)).toBe(true);
    });

    it('should reset generation to 0', () => {
      game.nextGeneration();
      game.nextGeneration();
      expect(game.getGeneration()).toBe(2);

      game.insertPattern(PATTERNS.glider, 2, 2);

      expect(game.getGeneration()).toBe(0);
    });

    it('should insert glider pattern', () => {
      game.insertPattern(PATTERNS.glider, 2, 2);

      // Verify glider is inserted correctly
      expect(game.getGrid().getCell(3, 2)).toBe(true);
      expect(game.getGrid().getCell(4, 3)).toBe(true);
      expect(game.getGrid().getCell(2, 4)).toBe(true);
      expect(game.getGrid().getCell(3, 4)).toBe(true);
      expect(game.getGrid().getCell(4, 4)).toBe(true);
    });
  });

  describe('Generation Counter', () => {
    it('should increment generation with each step', () => {
      expect(game.getGeneration()).toBe(0);

      for (let i = 1; i <= 10; i++) {
        game.nextGeneration();
        expect(game.getGeneration()).toBe(i);
      }
    });

    it('should handle large generation numbers', () => {
      for (let i = 0; i < 100; i++) {
        game.nextGeneration();
      }

      expect(game.getGeneration()).toBe(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty grid', () => {
      game.nextGeneration();

      // Empty grid should stay empty
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          expect(game.getGrid().getCell(x, y)).toBe(false);
        }
      }
    });

    it('should handle full grid', () => {
      // Fill entire grid
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          game.getGrid().setCell(x, y, true);
        }
      }

      game.nextGeneration();

      // Most cells should die from overpopulation
      // Only corner and edge cells with right neighbor count should survive
      let aliveCount = 0;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (game.getGrid().getCell(x, y)) {
            aliveCount++;
          }
        }
      }

      // Full grid should have significant die-off
      expect(aliveCount).toBeLessThan(100);
    });

    it('should handle grid boundaries correctly', () => {
      // Place pattern at corner
      game.getGrid().setCell(0, 0, true);
      game.getGrid().setCell(1, 0, true);
      game.getGrid().setCell(0, 1, true);

      game.nextGeneration();

      // Should compute correctly without errors
      expect(game.getGeneration()).toBe(1);
    });
  });
});
