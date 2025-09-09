/**
 * Dynamic table column width synchronization
 * Tracks block widths in the first data row and applies them to the header
 */

class TableColumnSync {
  constructor() {
    this.headerCells = document.querySelectorAll('.data-header .header-cell');
    this.firstRowCells = document.querySelector('.data-row')?.children;
    this.resizeObserver = null;
    this.isDesktop = window.innerWidth >= 768;
    
    this.init();
  }

  init() {
    if (!this.headerCells.length || !this.firstRowCells) {
      console.warn('TableColumnSync: Table elements not found');
      return;
    }

    if (!this.firstRowCells.length) {
      console.warn('TableColumnSync: First row contains no child elements');
      return;
    }

    this.syncColumnWidths();
    this.setupResizeObserver();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  syncColumnWidths() {
    if (!this.isDesktop) return;

    requestAnimationFrame(() => {
      const rowWidths = Array.from(this.firstRowCells).map(cell => {
        const rect = cell.getBoundingClientRect();
        return rect.width;
      });

      this.headerCells.forEach((headerCell, index) => {
        if (rowWidths[index] !== undefined && rowWidths[index] > 0) {
          headerCell.style.width = `${rowWidths[index]}px`;
          headerCell.style.minWidth = `${rowWidths[index]}px`;
          headerCell.style.maxWidth = `${rowWidths[index]}px`;
          headerCell.style.flex = 'none';
        }
      });

    });
  }

  setupResizeObserver() {
    if (!window.ResizeObserver) return;

    this.resizeObserver = new ResizeObserver(entries => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.syncColumnWidths();
      }, 100);
    });
    if (this.firstRowCells) {
      Array.from(this.firstRowCells).forEach(cell => {
        this.resizeObserver.observe(cell);
      });
    }
  }

  handleResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 768;

    if (wasDesktop !== this.isDesktop) {
      if (this.isDesktop) {
        setTimeout(() => this.syncColumnWidths(), 100);
      } else {
        this.resetHeaderStyles();
      }
    }
  }

  resetHeaderStyles() {
    this.headerCells.forEach(headerCell => {
      headerCell.style.width = '';
      headerCell.style.minWidth = '';
      headerCell.style.maxWidth = '';
      headerCell.style.flex = '';
    });
  }

  update() {
    this.syncColumnWidths();
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.handleResize);
    clearTimeout(this.resizeTimeout);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.tableColumnSync = new TableColumnSync();
  }, 100);
});

window.TableColumnSync = TableColumnSync;