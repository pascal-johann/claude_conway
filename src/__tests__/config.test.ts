import { describe, it, expect } from 'vitest';
import { COLOR_SCHEMES, GRID_SIZES, DEFAULT_CONFIG, ColorScheme, GridSize } from '../config';

describe('Config', () => {
  describe('COLOR_SCHEMES', () => {
    it('should have exactly 4 color schemes', () => {
      expect(COLOR_SCHEMES).toHaveLength(4);
    });

    it('should have Classic color scheme', () => {
      const classic = COLOR_SCHEMES.find(scheme => scheme.name === 'Classic');
      expect(classic).toBeDefined();
      expect(classic?.aliveColor).toBe('#000000');
      expect(classic?.deadColor).toBe('#FFFFFF');
      expect(classic?.gridColor).toBe('#CCCCCC');
    });

    it('should have Dark Mode color scheme', () => {
      const darkMode = COLOR_SCHEMES.find(scheme => scheme.name === 'Dark Mode');
      expect(darkMode).toBeDefined();
      expect(darkMode?.aliveColor).toBe('#00FF00');
      expect(darkMode?.deadColor).toBe('#1a1a1a');
      expect(darkMode?.gridColor).toBe('#333333');
    });

    it('should have Ocean color scheme', () => {
      const ocean = COLOR_SCHEMES.find(scheme => scheme.name === 'Ocean');
      expect(ocean).toBeDefined();
      expect(ocean?.aliveColor).toBe('#00CED1');
      expect(ocean?.deadColor).toBe('#001F3F');
      expect(ocean?.gridColor).toBe('#0074D9');
    });

    it('should have Sunset color scheme', () => {
      const sunset = COLOR_SCHEMES.find(scheme => scheme.name === 'Sunset');
      expect(sunset).toBeDefined();
      expect(sunset?.aliveColor).toBe('#FF6347');
      expect(sunset?.deadColor).toBe('#FFB6C1');
      expect(sunset?.gridColor).toBe('#8B0000');
    });

    it('should have all required properties for each scheme', () => {
      COLOR_SCHEMES.forEach(scheme => {
        expect(scheme).toHaveProperty('name');
        expect(scheme).toHaveProperty('aliveColor');
        expect(scheme).toHaveProperty('deadColor');
        expect(scheme).toHaveProperty('gridColor');
        expect(typeof scheme.name).toBe('string');
        expect(typeof scheme.aliveColor).toBe('string');
        expect(typeof scheme.deadColor).toBe('string');
        expect(typeof scheme.gridColor).toBe('string');
      });
    });

    it('should have valid hex color codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      COLOR_SCHEMES.forEach(scheme => {
        expect(scheme.aliveColor).toMatch(hexColorRegex);
        expect(scheme.deadColor).toMatch(hexColorRegex);
        expect(scheme.gridColor).toMatch(hexColorRegex);
      });
    });

    it('should have unique names', () => {
      const names = COLOR_SCHEMES.map(scheme => scheme.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(COLOR_SCHEMES.length);
    });
  });

  describe('GRID_SIZES', () => {
    it('should have exactly 4 grid sizes', () => {
      expect(GRID_SIZES).toHaveLength(4);
    });

    it('should have 25x25 size', () => {
      const size25 = GRID_SIZES.find(size => size.label === '25x25');
      expect(size25).toBeDefined();
      expect(size25?.width).toBe(25);
      expect(size25?.height).toBe(25);
    });

    it('should have 50x50 size', () => {
      const size50 = GRID_SIZES.find(size => size.label === '50x50');
      expect(size50).toBeDefined();
      expect(size50?.width).toBe(50);
      expect(size50?.height).toBe(50);
    });

    it('should have 75x75 size', () => {
      const size75 = GRID_SIZES.find(size => size.label === '75x75');
      expect(size75).toBeDefined();
      expect(size75?.width).toBe(75);
      expect(size75?.height).toBe(75);
    });

    it('should have 100x100 size', () => {
      const size100 = GRID_SIZES.find(size => size.label === '100x100');
      expect(size100).toBeDefined();
      expect(size100?.width).toBe(100);
      expect(size100?.height).toBe(100);
    });

    it('should have all required properties for each size', () => {
      GRID_SIZES.forEach(size => {
        expect(size).toHaveProperty('width');
        expect(size).toHaveProperty('height');
        expect(size).toHaveProperty('label');
        expect(typeof size.width).toBe('number');
        expect(typeof size.height).toBe('number');
        expect(typeof size.label).toBe('string');
      });
    });

    it('should have positive dimensions', () => {
      GRID_SIZES.forEach(size => {
        expect(size.width).toBeGreaterThan(0);
        expect(size.height).toBeGreaterThan(0);
      });
    });

    it('should have square dimensions', () => {
      GRID_SIZES.forEach(size => {
        expect(size.width).toBe(size.height);
      });
    });

    it('should be sorted in ascending order', () => {
      for (let i = 1; i < GRID_SIZES.length; i++) {
        expect(GRID_SIZES[i].width).toBeGreaterThan(GRID_SIZES[i - 1].width);
      }
    });

    it('should have matching label format', () => {
      GRID_SIZES.forEach(size => {
        expect(size.label).toBe(`${size.width}x${size.height}`);
      });
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have gridSize property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('gridSize');
      expect(DEFAULT_CONFIG.gridSize).toBeDefined();
    });

    it('should have default grid size of 50x50', () => {
      expect(DEFAULT_CONFIG.gridSize.width).toBe(50);
      expect(DEFAULT_CONFIG.gridSize.height).toBe(50);
      expect(DEFAULT_CONFIG.gridSize.label).toBe('50x50');
    });

    it('should have colorScheme property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('colorScheme');
      expect(DEFAULT_CONFIG.colorScheme).toBeDefined();
    });

    it('should have default color scheme of Classic', () => {
      expect(DEFAULT_CONFIG.colorScheme.name).toBe('Classic');
    });

    it('should have speed property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('speed');
      expect(typeof DEFAULT_CONFIG.speed).toBe('number');
    });

    it('should have default speed of 500ms', () => {
      expect(DEFAULT_CONFIG.speed).toBe(500);
    });

    it('should have minSpeed property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('minSpeed');
      expect(typeof DEFAULT_CONFIG.minSpeed).toBe('number');
    });

    it('should have minSpeed of 100ms', () => {
      expect(DEFAULT_CONFIG.minSpeed).toBe(100);
    });

    it('should have maxSpeed property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('maxSpeed');
      expect(typeof DEFAULT_CONFIG.maxSpeed).toBe('number');
    });

    it('should have maxSpeed of 1000ms', () => {
      expect(DEFAULT_CONFIG.maxSpeed).toBe(1000);
    });

    it('should have speed within min and max range', () => {
      expect(DEFAULT_CONFIG.speed).toBeGreaterThanOrEqual(DEFAULT_CONFIG.minSpeed);
      expect(DEFAULT_CONFIG.speed).toBeLessThanOrEqual(DEFAULT_CONFIG.maxSpeed);
    });

    it('should have cellSize property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('cellSize');
      expect(typeof DEFAULT_CONFIG.cellSize).toBe('number');
    });

    it('should have default cell size of 10 pixels', () => {
      expect(DEFAULT_CONFIG.cellSize).toBe(10);
    });

    it('should have showGrid property', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('showGrid');
      expect(typeof DEFAULT_CONFIG.showGrid).toBe('boolean');
    });

    it('should show grid by default', () => {
      expect(DEFAULT_CONFIG.showGrid).toBe(true);
    });

    it('should have valid references to arrays', () => {
      // GridSize should be one of GRID_SIZES
      expect(GRID_SIZES).toContainEqual(DEFAULT_CONFIG.gridSize);

      // ColorScheme should be one of COLOR_SCHEMES
      expect(COLOR_SCHEMES).toContainEqual(DEFAULT_CONFIG.colorScheme);
    });
  });

  describe('Type Definitions', () => {
    it('should allow creating ColorScheme objects', () => {
      const customScheme: ColorScheme = {
        name: 'Custom',
        aliveColor: '#FF0000',
        deadColor: '#0000FF',
        gridColor: '#00FF00'
      };

      expect(customScheme.name).toBe('Custom');
      expect(customScheme.aliveColor).toBe('#FF0000');
    });

    it('should allow creating GridSize objects', () => {
      const customSize: GridSize = {
        width: 30,
        height: 30,
        label: '30x30'
      };

      expect(customSize.width).toBe(30);
      expect(customSize.height).toBe(30);
      expect(customSize.label).toBe('30x30');
    });
  });

  describe('Configuration Integrity', () => {
    it('should have consistent configuration', () => {
      // Speed should be reasonable
      expect(DEFAULT_CONFIG.speed).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.speed).toBeLessThan(10000);

      // Cell size should be reasonable
      expect(DEFAULT_CONFIG.cellSize).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.cellSize).toBeLessThan(100);
    });

    it('should have all color schemes accessible', () => {
      COLOR_SCHEMES.forEach(scheme => {
        expect(scheme.name).toBeTruthy();
        expect(scheme.aliveColor).toBeTruthy();
        expect(scheme.deadColor).toBeTruthy();
        expect(scheme.gridColor).toBeTruthy();
      });
    });

    it('should have all grid sizes accessible', () => {
      GRID_SIZES.forEach(size => {
        expect(size.width).toBeGreaterThan(0);
        expect(size.height).toBeGreaterThan(0);
        expect(size.label).toBeTruthy();
      });
    });
  });
});
