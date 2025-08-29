// Cocktail Mixer App JavaScript

class CocktailMixer {
    constructor() {
        this.currentTab = 'browse';
        this.favorites = this.loadFavoritesFromStorage();
        this.searchTimeout = null;
        this.apiBaseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';
        
        // Sample cocktail data
        this.sampleCocktails = [
            {
                id: 1,
                name: "Margarita",
                category: "Tequila",
                glass: "Margarita Glass",
                type: "Sour",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "Tequila", amount: "2 oz"},
                    {name: "Triple Sec", amount: "1 oz"},
                    {name: "Lime Juice", amount: "1 oz"},
                    {name: "Salt", amount: "For rim"}
                ],
                instructions: "Rub the rim of the glass with lime and dip in salt. Shake all ingredients with ice and strain into the glass. Garnish with lime wheel.",
                image: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg"
            },
            {
                id: 2,
                name: "Mojito",
                category: "Rum",
                glass: "Highball Glass",
                type: "Long Drink",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "White Rum", amount: "2 oz"},
                    {name: "Fresh Lime Juice", amount: "1 oz"},
                    {name: "Simple Syrup", amount: "0.5 oz"},
                    {name: "Fresh Mint Leaves", amount: "8-10 leaves"},
                    {name: "Club Soda", amount: "2 oz"}
                ],
                instructions: "Muddle mint leaves with lime juice and simple syrup in the bottom of the glass. Add rum and ice, top with club soda. Garnish with mint sprig.",
                image: "https://www.thecocktaildb.com/images/media/drink/3z6xdi1589574603.jpg"
            },
            {
                id: 3,
                name: "Old Fashioned",
                category: "Whiskey",
                glass: "Old Fashioned Glass",
                type: "Spirit Forward",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "Bourbon Whiskey", amount: "2 oz"},
                    {name: "Simple Syrup", amount: "0.25 oz"},
                    {name: "Angostura Bitters", amount: "2-3 dashes"},
                    {name: "Orange Peel", amount: "1 piece"}
                ],
                instructions: "Stir whiskey, simple syrup, and bitters with ice. Strain over a large ice cube in an old fashioned glass. Express orange peel oils and drop in glass.",
                image: "https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg"
            },
            {
                id: 4,
                name: "Martini",
                category: "Gin",
                glass: "Martini Glass",
                type: "Spirit Forward",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "Gin", amount: "2.5 oz"},
                    {name: "Dry Vermouth", amount: "0.5 oz"},
                    {name: "Lemon Twist or Olive", amount: "For garnish"}
                ],
                instructions: "Stir gin and vermouth with ice. Strain into a chilled martini glass. Garnish with lemon twist or olive.",
                image: "https://www.thecocktaildb.com/images/media/drink/6ck9yi1589574317.jpg"
            },
            {
                id: 5,
                name: "Cosmopolitan",
                category: "Vodka",
                glass: "Martini Glass",
                type: "Sour",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "Vodka", amount: "1.5 oz"},
                    {name: "Triple Sec", amount: "0.5 oz"},
                    {name: "Cranberry Juice", amount: "1 oz"},
                    {name: "Fresh Lime Juice", amount: "0.5 oz"}
                ],
                instructions: "Shake all ingredients with ice and strain into a chilled martini glass. Garnish with lime wheel.",
                image: "https://www.thecocktaildb.com/images/media/drink/kpsajh1504368362.jpg"
            },
            {
                id: 6,
                name: "Negroni",
                category: "Gin",
                glass: "Old Fashioned Glass",
                type: "Spirit Forward",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "Gin", amount: "1 oz"},
                    {name: "Campari", amount: "1 oz"},
                    {name: "Sweet Vermouth", amount: "1 oz"}
                ],
                instructions: "Stir all ingredients with ice and strain over ice in an old fashioned glass. Garnish with orange peel.",
                image: "https://www.thecocktaildb.com/images/media/drink/qgdu971561574065.jpg"
            },
            {
                id: 7,
                name: "Whiskey Sour",
                category: "Whiskey",
                glass: "Rocks Glass",
                type: "Sour",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "Bourbon Whiskey", amount: "2 oz"},
                    {name: "Fresh Lemon Juice", amount: "1 oz"},
                    {name: "Simple Syrup", amount: "0.75 oz"},
                    {name: "Egg White", amount: "1 (optional)"}
                ],
                instructions: "Shake all ingredients vigorously with ice. Strain into a rocks glass over ice. Garnish with cherry and orange slice.",
                image: "https://www.thecocktaildb.com/images/media/drink/hbkfsh1589574990.jpg"
            },
            {
                id: 8,
                name: "Pina Colada",
                category: "Rum",
                glass: "Hurricane Glass",
                type: "Long Drink",
                alcoholic: "Alcoholic",
                ingredients: [
                    {name: "White Rum", amount: "2 oz"},
                    {name: "Coconut Cream", amount: "1 oz"},
                    {name: "Pineapple Juice", amount: "3 oz"},
                    {name: "Crushed Ice", amount: "1 cup"}
                ],
                instructions: "Blend all ingredients with ice until smooth. Pour into hurricane glass. Garnish with pineapple wedge and cherry.",
                image: "https://www.thecocktaildb.com/images/media/drink/cpf4j51504371346.jpg"
            }
        ];

        this.currentCocktails = [...this.sampleCocktails];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderBrowseCocktails();
        this.updateFavoritesDisplay();
    }

    bindEvents() {
        // Navigation - Fixed event handling
        document.querySelectorAll('[data-tab]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchTab(tab);
                }
            });
        });

        // Filters
        document.getElementById('category-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('type-filter').addEventListener('change', () => this.applyFilters());

        const searchNameInput = document.getElementById('search-name');
        const searchIngredientInput = document.getElementById('search-ingredient');
        
        if (searchNameInput) {
            searchNameInput.addEventListener('input', (e) => {
              
                if (e.target.value.trim()) {
                    searchIngredientInput.value = '';
                }
                this.debounceSearch(() => this.searchByName(e.target.value), 500);
            });
        }

        if (searchIngredientInput) {
            searchIngredientInput.addEventListener('input', (e) => {
                // Clear name search when searching by ingredient
                if (e.target.value.trim()) {
                    searchNameInput.value = '';
                }
                this.debounceSearch(() => this.searchByIngredient(e.target.value), 500);
            });
        }

        document.getElementById('clear-search').addEventListener('click', () => this.clearSearch());

        // Random cocktail
        document.getElementById('get-random').addEventListener('click', () => this.getRandomCocktail());

 g
        const modal = document.getElementById('cocktail-modal');
        const modalClose = modal.querySelector('.modal__close');
        const modalBackdrop = modal.querySelector('.modal__backdrop');
        
        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeModal();
        });
        
        modalBackdrop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeModal();
        });

        // Prevent modal content clicks from closing modal
        modal.querySelector('.modal__content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Favorite button in modal
        document.getElementById('favorite-btn').addEventListener('click', () => this.toggleModalFavorite());
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName); // Debug log
        
        // Update navigation
        document.querySelectorAll('.nav__item').forEach(item => {
            item.classList.remove('nav__item--active');
        });
        
        const activeNavItem = document.querySelector(`.nav__item[data-tab="${tabName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('nav__item--active');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('tab-content--active');
        });
        
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('tab-content--active');
        }

        this.currentTab = tabName;

        
        if (tabName === 'favorites') {
            this.updateFavoritesDisplay();
        } else if (tabName === 'search') {
       
            this.clearSearch();
        } else if (tabName === 'random') {
          
            document.getElementById('random-result').innerHTML = '';
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter').value;
        const typeFilter = document.getElementById('type-filter').value;

        let filtered = [...this.sampleCocktails];

        if (categoryFilter !== 'All') {
            filtered = filtered.filter(cocktail => cocktail.category === categoryFilter);
        }

        if (typeFilter !== 'All') {
            filtered = filtered.filter(cocktail => cocktail.type === typeFilter);
        }

        this.currentCocktails = filtered;
        this.renderBrowseCocktails();
    }

    renderBrowseCocktails() {
        const grid = document.getElementById('cocktails-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        this.currentCocktails.forEach(cocktail => {
            const card = this.createCocktailCard(cocktail);
            grid.appendChild(card);
        });
    }

    createCocktailCard(cocktail) {
        const isFavorite = this.favorites.some(fav => fav.id === cocktail.id);
        
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        card.innerHTML = `
            <div class="cocktail-card__image">
                <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
            </div>
            <div class="cocktail-card__content">
                <h3 class="cocktail-card__name">${cocktail.name}</h3>
                <div class="cocktail-card__meta">
                    <span class="status status--${cocktail.category.toLowerCase()}">${cocktail.category}</span>
                    <span class="status status--${cocktail.type.toLowerCase().replace(' ', '-')}">${cocktail.type}</span>
                </div>
                <div class="cocktail-card__actions">
                    <button class="btn btn--primary btn--sm view-recipe-btn">View Recipe</button>
                    <button class="favorite-toggle ${isFavorite ? 'favorite-toggle--active' : ''}" data-cocktail-id="${cocktail.id}">
                        ${isFavorite ? '♥' : '♡'}
                    </button>
                </div>
            </div>
        `;

        // to prevent event bubbling issues
        const viewRecipeBtn = card.querySelector('.view-recipe-btn');
        const favoriteBtn = card.querySelector('.favorite-toggle');
        
        viewRecipeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showCocktailModal(cocktail);
        });

        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFavorite(cocktail);
        });

        card.addEventListener('click', (e) => {
           
            if (!e.target.closest('button')) {
                this.showCocktailModal(cocktail);
            }
        });

        return card;
    }

    showCocktailModal(cocktail) {
        const modal = document.getElementById('cocktail-modal');
        if (!modal) return;
        
        // Populate modal content
        const modalImage = document.getElementById('modal-image');
        const modalName = document.getElementById('modal-name');
        const modalCategory = document.getElementById('modal-category');
        const modalType = document.getElementById('modal-type');
        const modalGlass = document.getElementById('modal-glass');
        const modalIngredients = document.getElementById('modal-ingredients');
        const modalInstructions = document.getElementById('modal-instructions');

        if (modalImage) {
            modalImage.src = cocktail.image;
            modalImage.alt = cocktail.name;
        }
        
        if (modalName) {
            modalName.textContent = cocktail.name;
        }
        
        // Meta information
        if (modalCategory) {
            modalCategory.textContent = cocktail.category;
            modalCategory.className = `status status--${cocktail.category.toLowerCase()}`;
        }
        
        if (modalType) {
            modalType.textContent = cocktail.type;
            modalType.className = `status status--${cocktail.type.toLowerCase().replace(' ', '-')}`;
        }
        
        if (modalGlass) {
            modalGlass.textContent = cocktail.glass;
            modalGlass.className = 'status status--info';
        }

        // Ingredients
        if (modalIngredients) {
            modalIngredients.innerHTML = '';
            cocktail.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="ingredient-name">${ingredient.name}</span>
                    <span class="ingredient-amount">${ingredient.amount}</span>
                `;
                modalIngredients.appendChild(li);
            });
        }

        // Instructions
        if (modalInstructions) {
            modalInstructions.textContent = cocktail.instructions;
        }

        // Favorite button
        const favoriteBtn = document.getElementById('favorite-btn');
        if (favoriteBtn) {
            const isFavorite = this.favorites.some(fav => fav.id === cocktail.id);
            favoriteBtn.innerHTML = `
                <span class="favorite-icon">${isFavorite ? '♥' : '♡'}</span>
                ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            `;
            favoriteBtn.dataset.cocktailId = cocktail.id;
        }

        // Store current cock
        this.currentModalCocktail = cocktail;

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('cocktail-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';
        this.currentModalCocktail = null;
    }

    toggleFavorite(cocktail) {
        const existingIndex = this.favorites.findIndex(fav => fav.id === cocktail.id);
        
        if (existingIndex > -1) {
            this.favorites.splice(existingIndex, 1);
            this.showToast(`${cocktail.name} removed from favorites`, 'success');
        } else {
            this.favorites.push(cocktail);
            this.showToast(`${cocktail.name} added to favorites!`, 'success');
        }

        this.saveFavoritesToStorage();
        this.updateFavoriteButtons(cocktail.id);
        this.updateFavoritesDisplay();
    }

    toggleModalFavorite() {
        if (this.currentModalCocktail) {
            this.toggleFavorite(this.currentModalCocktail);
            
            // Update modautton
            const favoriteBtn = document.getElementById('favorite-btn');
            if (favoriteBtn) {
                const isFavorite = this.favorites.some(fav => fav.id === this.currentModalCocktail.id);
                favoriteBtn.innerHTML = `
                    <span class="favorite-icon">${isFavorite ? '♥' : '♡'}</span>
                    ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                `;
            }
        }
    }

    updateFavoriteButtons(cocktailId) {
        const buttons = document.querySelectorAll(`[data-cocktail-id="${cocktailId}"]`);
        const isFavorite = this.favorites.some(fav => fav.id === cocktailId);
        
        buttons.forEach(button => {
            if (button.classList.contains('favorite-toggle')) {
                button.textContent = isFavorite ? '♥' : '♡';
                button.classList.toggle('favorite-toggle--active', isFavorite);
            }
        });
    }

    updateFavoritesDisplay() {
        const grid = document.getElementById('favorites-grid');
        const emptyState = document.getElementById('favorites-empty');
        
        if (!grid || !emptyState) return;

        if (this.favorites.length === 0) {
            grid.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            grid.innerHTML = '';
            
            this.favorites.forEach(cocktail => {
                const card = this.createCocktailCard(cocktail);
                grid.appendChild(card);
            });
        }
    }

    debounceSearch(func, delay) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(func, delay);
    }

    async searchByName(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        this.showSearchLoading();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.drinks) {
                const cocktails = data.drinks.map(drink => this.transformApiCocktail(drink));
                this.displaySearchResults(cocktails);
            } else {
                this.showSearchError();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        } finally {
            this.hideSearchLoading();
        }
    }

    async searchByIngredient(ingredient) {
        if (!ingredient.trim()) {
            this.clearSearchResults();
            return;
        }

        this.showSearchLoading();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}filter.php?i=${encodeURIComponent(ingredient)}`);
            const data = await response.json();
            
            if (data.drinks) {
                // Get detailed info for each
                const detailedCocktails = await Promise.all(
                    data.drinks.slice(0, 12).map(async (drink) => {
                        try {
                            const detailResponse = await fetch(`${this.apiBaseUrl}lookup.php?i=${drink.idDrink}`);
                            const detailData = await detailResponse.json();
                            return this.transformApiCocktail(detailData.drinks[0]);
                        } catch (error) {
                            console.error('Error fetching cocktail detail:', error);
                            return null;
                        }
                    })
                );
                
                const validCocktails = detailedCocktails.filter(cocktail => cocktail !== null);
                this.displaySearchResults(validCocktails);
            } else {
                this.showSearchError();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        } finally {
            this.hideSearchLoading();
        }
    }

    async getRandomCocktail() {
        const loadingEl = document.getElementById('random-loading');
        const resultEl = document.getElementById('random-result');
        
        if (loadingEl) loadingEl.classList.remove('hidden');
        if (resultEl) resultEl.innerHTML = '';
        
        try {
            const response = await fetch(`${this.apiBaseUrl}random.php`);
            const data = await response.json();
            
            if (data.drinks && data.drinks[0]) {
                const cocktail = this.transformApiCocktail(data.drinks[0]);
                this.displayRandomResult(cocktail);
            }
        } catch (error) {
            console.error('Random cocktail error:', error);
            this.showToast('Failed to get random cocktail. Please try again.', 'error');
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    transformApiCocktail(apiCocktail) {
        const ingredients = [];
        
        // Extract ingredients and measurements
        for (let i = 1; i <= 15; i++) {
            const ingredient = apiCocktail[`strIngredient${i}`];
            const measure = apiCocktail[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    name: ingredient.trim(),
                    amount: measure ? measure.trim() : ''
                });
            }
        }

        return {
            id: parseInt(apiCocktail.idDrink),
            name: apiCocktail.strDrink,
            category: this.mapCategory(apiCocktail.strCategory),
            glass: apiCocktail.strGlass,
            type: this.mapType(apiCocktail.strCategory),
            alcoholic: apiCocktail.strAlcoholic,
            ingredients: ingredients,
            instructions: apiCocktail.strInstructions,
            image: apiCocktail.strDrinkThumb
        };
    }

    mapCategory(apiCategory) {
        const categoryMap = {
            'Ordinary Drink': 'Gin',
            'Cocktail': 'Vodka',
            'Shot': 'Vodka',
            'Other/Unknown': 'Rum',
            'Cocoa': 'Rum',
            'Beer': 'Beer',
            'Wine': 'Wine'
        };
        return categoryMap[apiCategory] || 'Gin';
    }

    mapType(apiCategory) {
        const typeMap = {
            'Ordinary Drink': 'Long Drink',
            'Cocktail': 'Spirit Forward',
            'Shot': 'Sour',
            'Other/Unknown': 'Long Drink'
        };
        return typeMap[apiCategory] || 'Long Drink';
    }

    displaySearchResults(cocktails) {
        const resultsGrid = document.getElementById('search-results');
        if (!resultsGrid) return;
        
        resultsGrid.innerHTML = '';
        
        cocktails.forEach(cocktail => {
            const card = this.createCocktailCard(cocktail);
            resultsGrid.appendChild(card);
        });
        
        this.hideSearchError();
    }

    displayRandomResult(cocktail) {
        const resultDiv = document.getElementById('random-result');
        if (!resultDiv) return;
        
        const card = this.createCocktailCard(cocktail);
        card.style.maxWidth = '400px';
        card.style.margin = '0 auto';
        
        resultDiv.innerHTML = '';
        resultDiv.appendChild(card);
        
        // Add "Get Another" button
        const getAnotherBtn = document.createElement('button');
        getAnotherBtn.className = 'btn btn--secondary btn--lg';
        getAnotherBtn.textContent = 'Get Another Random Cocktail';
        getAnotherBtn.style.marginTop = '24px';
        getAnotherBtn.addEventListener('click', () => this.getRandomCocktail());
        
        resultDiv.appendChild(getAnotherBtn);
    }

    clearSearch() {
        const searchName = document.getElementById('search-name');
        const searchIngredient = document.getElementById('search-ingredient');
        
        if (searchName) searchName.value = '';
        if (searchIngredient) searchIngredient.value = '';
        
        this.clearSearchResults();
    }

    clearSearchResults() {
        const resultsGrid = document.getElementById('search-results');
        if (resultsGrid) resultsGrid.innerHTML = '';
        
        this.hideSearchLoading();
        this.hideSearchError();
    }

    showSearchLoading() {
        const loadingEl = document.getElementById('search-loading');
        const errorEl = document.getElementById('search-error');
        
        if (loadingEl) loadingEl.classList.remove('hidden');
        if (errorEl) errorEl.classList.add('hidden');
    }

    hideSearchLoading() {
        const loadingEl = document.getElementById('search-loading');
        if (loadingEl) loadingEl.classList.add('hidden');
    }

    showSearchError() {
        const errorEl = document.getElementById('search-error');
        const resultsGrid = document.getElementById('search-results');
        
        if (errorEl) errorEl.classList.remove('hidden');
        if (resultsGrid) resultsGrid.innerHTML = '';
    }

    hideSearchError() {
        const errorEl = document.getElementById('search-error');
        if (errorEl) errorEl.classList.add('hidden');
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Auto remove 
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }

    loadFavoritesFromStorage() {
        try {
           
            return [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavoritesToStorage() {
        try {
          
            console.log('Favorites saved:', this.favorites.length);
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CocktailMixer();
});