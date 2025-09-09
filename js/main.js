document.addEventListener('DOMContentLoaded', function() {
    initializePagination();
    initializeSorting();
    addKeyboardNavigation();
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header__nav');
    
    if (mobileMenuToggle && headerNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            headerNav.classList.toggle('active');
        });
    }

    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Layout toggle functionality
    const filterLinks = document.querySelectorAll('.filter__link');
    const dataContainer = document.querySelector('.data-container');
    
    if (filterLinks && dataContainer) {
        filterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                    filterLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                if (this.querySelector('.grid__icon')) {
                    dataContainer.classList.add('grid-layout');
                } else if (this.querySelector('.table__icon')) {
                    dataContainer.classList.remove('grid-layout');
                }
            });
        });
    }

    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('btn-action--delete')) {
                if (confirm('Ви впевнені, що хочете видалити цей елемент?')) {
                    const row = this.closest('.table-row');
                    if (row) {
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(-100%)';
                        setTimeout(() => {
                            row.remove();
                        }, 300);
                    }
                }
            } else if (this.classList.contains('btn-action--edit')) {
                alert('Функція редагування буде додана пізніше');
            }
        });
    });

    const addButton = document.querySelector('.btn--primary');
    if (addButton) {
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tableBody = document.querySelector('.data-body');
            if (tableBody) {
                const newId = String(Date.now()).slice(-3);
                const newRow = document.createElement('tr');
                newRow.className = 'table-row';
                newRow.style.opacity = '0';
                newRow.style.transform = 'translateY(-20px)';
                
                
                tableBody.appendChild(newRow);
                
                setTimeout(() => {
                    newRow.style.opacity = '1';
                    newRow.style.transform = 'translateY(0)';
                }, 100);

                const newActionButtons = newRow.querySelectorAll('.btn-action');
                newActionButtons.forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        if (this.classList.contains('btn-action--delete')) {
                            if (confirm('Ви впевнені, що хочете видалити цей елемент?')) {
                                const row = this.closest('.table-row');
                                if (row) {
                                    row.style.opacity = '0';
                                    row.style.transform = 'translateX(-100%)';
                                    setTimeout(() => {
                                        row.remove();
                                    }, 300);
                                }
                            }
                        } else if (this.classList.contains('btn-action--edit')) {
                            alert('Функція редагування буде додана пізніше');
                        }
                    });
                });
            }
        });
    }

    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            
            if (!isMobile && headerNav && headerNav.classList.contains('active')) {
                headerNav.classList.remove('active');
                mobileMenuToggle && mobileMenuToggle.classList.remove('active');
            }
        }, 100);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});

function addKeyboardNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    sidebarLinks.forEach((link, index) => {
        link.setAttribute('tabindex', '0');
        
        link.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = index === 0 ? sidebarLinks.length - 1 : index - 1;
                    sidebarLinks[prevIndex].focus();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = index === sidebarLinks.length - 1 ? 0 : index + 1;
                    sidebarLinks[nextIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
                case 'Home':
                    e.preventDefault();
                    sidebarLinks[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    sidebarLinks[sidebarLinks.length - 1].focus();
                    break;
            }
        });
    });
    
    const filterLinks = document.querySelectorAll('.filter__link');
    filterLinks.forEach(link => {
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    const quizButtons = document.querySelectorAll('.btn-moderation, .quiz-link, .comments-link');
    quizButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (!window.paginationManager) return;
        
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.paginationManager.previousPage();
                }
                break;
            case 'ArrowRight':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.paginationManager.nextPage();
                }
                break;
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const popup = document.getElementById('mobilePopup');
            if (popup && popup.style.display === 'flex') {
                closeMobileMenu();
            }
        }
    });
    
    const mobileMenuToggle = document.querySelector('[onclick="toggleMobileMenu(event)"]');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu(e);
            }
        });
    }
}

class PaginationManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 5; // Default value
        this.totalItems = 0;
        this.totalPages = 0;
        
        this.dataRows = [];
        this.itemsSelect = null;
        this.paginationContainer = null;
        this.announcementsDiv = null;
        
        this.init();
    }
    
    init() {
        this.dataRows = Array.from(document.querySelectorAll('.data-row'));
        this.itemsSelect = document.querySelector('.items-select');
        this.paginationContainer = document.querySelector('.pagination');
        this.announcementsDiv = document.getElementById('announcements');
        
        this.totalItems = this.dataRows.length;
        
        if (this.itemsSelect) {
            this.itemsPerPage = parseInt(this.itemsSelect.value);
            this.itemsSelect.addEventListener('change', (e) => {
                this.changeItemsPerPage(parseInt(e.target.value));
            });
        }
        
        this.calculatePagination();
        
        this.renderPagination();
        this.showCurrentPage();
        
        this.addPaginationEvents();
    }
    
    calculatePagination() {
        this.updateDataRows();
        
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
        }
    }
    
    changeItemsPerPage(newItemsPerPage) {
        this.itemsPerPage = newItemsPerPage;
        this.currentPage = 1;
        this.calculatePagination();
        this.renderPagination();
        this.showCurrentPage();
        
        this.announceToScreenReader(`Items per page changed to ${newItemsPerPage}. Showing page 1 of ${this.totalPages}`);
    }
    
    updateDataRows() {
        this.dataRows = Array.from(document.querySelectorAll('.data-row'));
        this.totalItems = this.dataRows.length;
    }
    
    showCurrentPage() {
        this.updateDataRows();
        
        this.dataRows.forEach(row => {
            row.style.display = 'none';
        });
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        
        for (let i = startIndex; i < endIndex && i < this.totalItems; i++) {
            if (this.dataRows[i]) {
                this.dataRows[i].style.display = 'flex';
            }
        }
    }
    
    goToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) return;
        
        this.currentPage = pageNumber;
        this.renderPagination();
        this.showCurrentPage();
        
        this.announceToScreenReader(`Page ${this.currentPage} of ${this.totalPages}`);
        
        document.querySelector('.content')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }
    
    firstPage() {
        this.goToPage(1);
    }
    
    lastPage() {
        this.goToPage(this.totalPages);
    }
    
    renderPagination() {
        if (!this.paginationContainer) return;
        
        const firstBtn = this.paginationContainer.querySelector('.pagination-btn--first');
        const prevBtn = this.paginationContainer.querySelector('.pagination-btn--prev');
        const nextBtn = this.paginationContainer.querySelector('.pagination-btn--next');
        const lastBtn = this.paginationContainer.querySelector('.pagination-btn--last');
        
        if (this.currentPage === 1) {
            firstBtn?.classList.add('pagination-btn--inactive');
            prevBtn?.classList.add('pagination-btn--inactive');
        } else {
            firstBtn?.classList.remove('pagination-btn--inactive');
            prevBtn?.classList.remove('pagination-btn--inactive');
        }
        
        if (this.currentPage === this.totalPages) {
            nextBtn?.classList.add('pagination-btn--inactive');
            lastBtn?.classList.add('pagination-btn--inactive');
        } else {
            nextBtn?.classList.remove('pagination-btn--inactive');
            lastBtn?.classList.remove('pagination-btn--inactive');
        }
        
        this.renderPageNumbers();
    }
    
    renderPageNumbers() {
        const numbersContainer = this.paginationContainer.querySelector('.pagination-numbers');
        if (!numbersContainer) return;
        
        numbersContainer.innerHTML = '';
        
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            this.createPageNumber(1, numbersContainer);
            if (startPage > 2) {
                this.createDots(numbersContainer);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            this.createPageNumber(i, numbersContainer);
        }
        
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                this.createDots(numbersContainer);
            }
            this.createPageNumber(this.totalPages, numbersContainer);
        }
    }
    
    createPageNumber(pageNum, container) {
        const pageSpan = document.createElement('span');
        pageSpan.className = `pagination-number${pageNum === this.currentPage ? ' pagination-number--current' : ''}`;
        pageSpan.textContent = pageNum;
        pageSpan.setAttribute('role', 'button');
        pageSpan.setAttribute('tabindex', '0');
        pageSpan.setAttribute('aria-label', `Go to page ${pageNum}`);
        
        if (pageNum === this.currentPage) {
            pageSpan.setAttribute('aria-current', 'page');
        }
        
        pageSpan.addEventListener('click', () => {
            if (pageNum !== this.currentPage) {
                this.goToPage(pageNum);
            }
        });
        
        pageSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (pageNum !== this.currentPage) {
                    this.goToPage(pageNum);
                }
            }
        });
        
        container.appendChild(pageSpan);
    }
    
    createDots(container) {
        const dots = document.createElement('span');
        dots.className = 'pagination-dots';
        dots.textContent = '...';
        dots.setAttribute('aria-hidden', 'true');
        container.appendChild(dots);
    }
    
    addPaginationEvents() {
        const buttons = [
            { selector: '.pagination-btn--first', action: () => this.firstPage(), name: 'first' },
            { selector: '.pagination-btn--prev', action: () => this.previousPage(), name: 'previous' },
            { selector: '.pagination-btn--next', action: () => this.nextPage(), name: 'next' },
            { selector: '.pagination-btn--last', action: () => this.lastPage(), name: 'last' }
        ];
        
        buttons.forEach(({ selector, action, name }) => {
            const button = this.paginationContainer.querySelector(selector);
            if (button) {
                button.addEventListener('click', () => {
                    if (!button.classList.contains('pagination-btn--inactive')) {
                        action();
                    }
                });
                
                button.addEventListener('keydown', (e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && 
                        !button.classList.contains('pagination-btn--inactive')) {
                        e.preventDefault();
                        action();
                    }
                });
            }
        });
    }
    
    announceToScreenReader(message) {
        if (this.announcementsDiv) {
            this.announcementsDiv.textContent = message;
            
                setTimeout(() => {
                this.announcementsDiv.textContent = '';
            }, 1000);
        }
    }
}

function initializePagination() {
    window.paginationManager = new PaginationManager();
}

class TableSorter {
    constructor() {
        this.currentSort = null;
        this.currentDirection = 'none'; // 'none', 'asc', 'desc'
        this.sortButtons = document.querySelectorAll('.sort-btn');
        this.dataRows = Array.from(document.querySelectorAll('.data-row'));
        this.announcementsDiv = document.getElementById('announcements');
        
        this.init();
    }
    
    init() {
        this.sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const sortType = button.getAttribute('data-sort');
                this.handleSort(sortType, button);
            });
            
                button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const sortType = button.getAttribute('data-sort');
                    this.handleSort(sortType, button);
                }
            });
        });
    }
    
    handleSort(sortType, button) {
        let newDirection = 'asc';
        if (this.currentSort === sortType) {
            if (this.currentDirection === 'asc') {
                newDirection = 'desc';
            } else if (this.currentDirection === 'desc') {
                newDirection = 'none';
            } else {
                newDirection = 'asc';
            }
        }
        
        this.currentSort = newDirection === 'none' ? null : sortType;
        this.currentDirection = newDirection;
        
        this.updateSortButtons(sortType, newDirection);
        
        if (newDirection === 'none') {
            this.resetSort();
        } else {
            this.sortData(sortType, newDirection);
        }
        
        this.announceSort(sortType, newDirection);
        
        if (window.paginationManager) {
            window.paginationManager.currentPage = 1;
            window.paginationManager.showCurrentPage();
            window.paginationManager.renderPagination();
        }
    }
    
    updateSortButtons(activeSort, direction) {
        this.sortButtons.forEach(button => {
            const sortType = button.getAttribute('data-sort');
            
            button.classList.remove('sort-active', 'sort-asc', 'sort-desc');
            
            if (sortType === activeSort && direction !== 'none') {
                button.classList.add('sort-active');
                button.classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
                
                button.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
            } else {
                button.setAttribute('aria-sort', 'none');
            }
        });
    }
    
    sortData(sortType, direction) {
        const sortedRows = [...this.dataRows].sort((a, b) => {
            let valueA = this.extractSortValue(a, sortType);
            let valueB = this.extractSortValue(b, sortType);
            
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            let comparison = 0;
            if (valueA < valueB) comparison = -1;
            if (valueA > valueB) comparison = 1;
            
            return direction === 'asc' ? comparison : -comparison;
        });
        
        const dataBody = document.querySelector('.data-body');
        sortedRows.forEach(row => {
            dataBody.appendChild(row);
        });
        
        this.dataRows = sortedRows;
    }
    
    extractSortValue(row, sortType) {
        switch (sortType) {
            case 'quiz-name':
                return row.querySelector('.quiz-title')?.textContent?.trim() || '';
                
            case 'results':
                const participants = row.querySelector('.quiz-participants');
                if (participants) {
                    const match = participants.textContent.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                }
                return 0;
                
            case 'category':
                return row.querySelector('.mobile-category')?.textContent?.trim() || '';
                
            case 'status':
                const statusEl = row.querySelector('.status');
                if (statusEl) {
                    if (statusEl.classList.contains('status--moderate')) return 'moderate';
                    if (statusEl.classList.contains('status--not-moderated')) return 'not-moderated';
                }
                return 'unknown';
                
            case 'moderator':
                return row.querySelector('.moderator-name')?.textContent?.trim() || '';
                
            default:
                return '';
        }
    }
    
    resetSort() {
        this.updateSortButtons(null, 'none');
    }
    
    announceSort(sortType, direction) {
        if (!this.announcementsDiv) return;
        
        let message = '';
        const columnNames = {
            'quiz-name': 'Quiz name',
            'results': 'Results and rating',
            'category': 'Category',
            'status': 'Moderation status',
            'moderator': 'Last moderation by'
        };
        
        const columnName = columnNames[sortType] || sortType;
        
        if (direction === 'none') {
            message = `Sorting cleared for ${columnName}`;
        } else {
            const directionText = direction === 'asc' ? 'ascending' : 'descending';
            message = `Table sorted by ${columnName} in ${directionText} order`;
        }
        
        this.announcementsDiv.textContent = message;
        
        setTimeout(() => {
            this.announcementsDiv.textContent = '';
        }, 1000);
    }
}

function initializeSorting() {
    window.tableSorter = new TableSorter();
}

function minimizeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.add('sidebar--collapsed');
    }
}

function maximizeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('sidebar--collapsed');
    }
}

function toggleMobileMenu(event) {
    event.preventDefault();
    if (window.innerWidth < 768) {
        const popup = document.getElementById('mobilePopup');
        const overlay = document.getElementById('mobileOverlay');
        const body = document.body;
        
        if (popup && overlay) {
            if (popup.style.display === 'flex') {
                popup.classList.remove('show');
                overlay.classList.remove('show');
                body.classList.remove('body-no-scroll');
                
                setTimeout(() => {
                    popup.style.display = 'none';
                    overlay.style.display = 'none';
                }, 300);
            } else {
                popup.style.display = 'flex';
                overlay.style.display = 'block';
                body.classList.add('body-no-scroll');
                
                setTimeout(() => {
                    popup.classList.add('show');
                    overlay.classList.add('show');
                }, 10);
            }
        }
    }
}

function closeMobileMenu() {
    const popup = document.getElementById('mobilePopup');
    const overlay = document.getElementById('mobileOverlay');
    const body = document.body;
    
    if (popup && overlay) {
        popup.classList.remove('show');
        overlay.classList.remove('show');
        body.classList.remove('body-no-scroll');
        
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }
}