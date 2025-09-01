// Cocktail Mixer App - Refactored for more natural style

class MixerApp {
    constructor() {
        this.tab = "browse"
        this.favorites = this._loadFavs()
        this.apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/"
        this._searchTimer = null

        // seed cocktails (local sample set)
        this.data = this._seedCocktails()
        this.activeList = [...this.data]

        this._init()
    }

    _init() {
        this._bindUI()
        this._renderBrowse()
        this._refreshFavs()
    }

    // ---------------------- UI & Navigation ---------------------- //
    _bindUI() {
        // nav
        document.querySelectorAll("[data-tab]").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                this._switchTab(e.currentTarget.dataset.tab)
            })
        })

        // filters
        document.getElementById("category-filter")
            .addEventListener("change", () => this._applyFilters())

        document.getElementById("type-filter")
            .addEventListener("change", () => this._applyFilters())

        // search inputs
        const nameBox = document.getElementById("search-name")
        const ingBox = document.getElementById("search-ingredient")

        if (nameBox) {
            nameBox.addEventListener("input", e => {
                if (e.target.value.trim()) ingBox.value = ""
                this._debounce(() => this._searchName(e.target.value), 400)
            })
        }

        if (ingBox) {
            ingBox.addEventListener("input", e => {
                if (e.target.value.trim()) nameBox.value = ""
                this._debounce(() => this._searchIngredient(e.target.value), 400)
            })
        }

        document.getElementById("clear-search")
            .addEventListener("click", () => this._clearSearch())

        // random
        document.getElementById("get-random")
            .addEventListener("click", () => this._randomCocktail())

        // modal handling
        const modal = document.getElementById("cocktail-modal")
        modal.querySelector(".modal__close")
            .addEventListener("click", () => this._closeModal())
        modal.querySelector(".modal__backdrop")
            .addEventListener("click", () => this._closeModal())
        modal.querySelector(".modal__content")
            .addEventListener("click", e => e.stopPropagation())

        // fav button inside modal
        document.getElementById("favorite-btn")
            .addEventListener("click", () => this._toggleModalFav())
    }

    _switchTab(tab) {
        this.tab = tab

        document.querySelectorAll(".nav__item")
            .forEach(n => n.classList.remove("nav__item--active"))

        const nav = document.querySelector(`[data-tab="${tab}"]`)
        if (nav) nav.classList.add("nav__item--active")

        document.querySelectorAll(".tab-content")
            .forEach(c => c.classList.remove("tab-content--active"))

        const section = document.getElementById(`${tab}-tab`)
        if (section) section.classList.add("tab-content--active")

        if (tab === "favorites") this._refreshFavs()
        if (tab === "search") this._clearSearch()
        if (tab === "random") document.getElementById("random-result").innerHTML = ""
    }

    // ---------------------- Browse ---------------------- //
    _applyFilters() {
        const cat = document.getElementById("category-filter").value
        const type = document.getElementById("type-filter").value

        this.activeList = this.data.filter(c => {
            return (cat === "All" || c.category === cat) &&
                   (type === "All" || c.type === type)
        })
        this._renderBrowse()
    }

    _renderBrowse() {
        const grid = document.getElementById("cocktails-grid")
        if (!grid) return

        grid.innerHTML = ""
        this.activeList.forEach(c => grid.appendChild(this._card(c)))
    }

    _card(cocktail) {
        const isFav = this.favorites.some(f => f.id === cocktail.id)

        const div = document.createElement("div")
        div.className = "cocktail-card"
        div.innerHTML = `
            <div class="cocktail-card__image">
                <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
            </div>
            <div class="cocktail-card__content">
                <h3>${cocktail.name}</h3>
                <div class="cocktail-card__meta">
                    <span class="status">${cocktail.category}</span>
                    <span class="status">${cocktail.type}</span>
                </div>
                <div class="cocktail-card__actions">
                    <button class="btn btn--primary btn--sm view-recipe-btn">View</button>
                    <button class="favorite-toggle ${isFav ? "favorite-toggle--active" : ""}" data-id="${cocktail.id}">
                        ${isFav ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        `

        div.querySelector(".view-recipe-btn").addEventListener("click", e => {
            e.stopPropagation()
            this._openModal(cocktail)
        })

        div.querySelector(".favorite-toggle").addEventListener("click", e => {
            e.stopPropagation()
            this._toggleFav(cocktail)
        })

        div.addEventListener("click", e => {
            if (!e.target.closest("button")) this._openModal(cocktail)
        })

        return div
    }

    // ---------------------- Modal ---------------------- //
    _openModal(cocktail) {
        const m = document.getElementById("cocktail-modal")
        m.classList.remove("hidden")
        document.body.style.overflow = "hidden"

        document.getElementById("modal-image").src = cocktail.image
        document.getElementById("modal-name").textContent = cocktail.name
        document.getElementById("modal-category").textContent = cocktail.category
        document.getElementById("modal-type").textContent = cocktail.type
        document.getElementById("modal-glass").textContent = cocktail.glass
        document.getElementById("modal-instructions").textContent = cocktail.instructions

        const ul = document.getElementById("modal-ingredients")
        ul.innerHTML = ""
        cocktail.ingredients.forEach(i => {
            const li = document.createElement("li")
            li.innerHTML = `<span>${i.name}</span> <span>${i.amount}</span>`
            ul.appendChild(li)
        })

        this._current = cocktail
        this._updateModalFavBtn()
    }

    _closeModal() {
        document.getElementById("cocktail-modal").classList.add("hidden")
        document.body.style.overflow = ""
        this._current = null
    }

    // ---------------------- Favorites ---------------------- //
    _toggleFav(c) {
        const idx = this.favorites.findIndex(f => f.id === c.id)
        if (idx > -1) {
            this.favorites.splice(idx, 1)
            this._toast(`${c.name} removed`, "info")
        } else {
            this.favorites.push(c)
            this._toast(`${c.name} added`, "success")
        }
        this._saveFavs()
        this._refreshFavs()
        this._updateFavBtns(c.id)
    }

    _toggleModalFav() {
        if (this._current) this._toggleFav(this._current)
        this._updateModalFavBtn()
    }

    _updateModalFavBtn() {
        const btn = document.getElementById("favorite-btn")
        const isFav = this.favorites.some(f => f.id === this._current.id)
        btn.innerHTML = `${isFav ? "♥ Remove" : "♡ Add"}`
    }

    _updateFavBtns(id) {
        document.querySelectorAll(`[data-id="${id}"]`).forEach(b => {
            const isFav = this.favorites.some(f => f.id === id)
            b.textContent = isFav ? "♥" : "♡"
            b.classList.toggle("favorite-toggle--active", isFav)
        })
    }

    _refreshFavs() {
        const grid = document.getElementById("favorites-grid")
        const empty = document.getElementById("favorites-empty")
        if (!grid) return

        grid.innerHTML = ""
        if (!this.favorites.length) {
            empty.style.display = "block"
        } else {
            empty.style.display = "none"
            this.favorites.forEach(c => grid.appendChild(this._card(c)))
        }
    }

    // ---------------------- Search & Random ---------------------- //
    _debounce(fn, ms) {
        clearTimeout(this._searchTimer)
        this._searchTimer = setTimeout(fn, ms)
    }

    async _searchName(name) {
        if (!name.trim()) return this._clearSearch()
        this._showLoading("search")

        try {
            const res = await fetch(`${this.apiUrl}search.php?s=${encodeURIComponent(name)}`)
            const data = await res.json()
            const list = data.drinks ? data.drinks.map(d => this._mapDrink(d)) : []
            this._showResults(list)
        } catch {
            this._showError("search")
        } finally {
            this._hideLoading("search")
        }
    }

    async _searchIngredient(ing) {
        if (!ing.trim()) return this._clearSearch()
        this._showLoading("search")

        try {
            const res = await fetch(`${this.apiUrl}filter.php?i=${encodeURIComponent(ing)}`)
            const data = await res.json()
            if (!data.drinks) return this._showError("search")

            const details = await Promise.all(
                data.drinks.slice(0, 12).map(async d => {
                    const det = await fetch(`${this.apiUrl}lookup.php?i=${d.idDrink}`)
                    const more = await det.json()
                    return this._mapDrink(more.drinks[0])
                })
            )
            this._showResults(details)
        } catch {
            this._showError("search")
        } finally {
            this._hideLoading("search")
        }
    }

    async _randomCocktail() {
        const load = document.getElementById("random-loading")
        load.classList.remove("hidden")
        const container = document.getElementById("random-result")
        container.innerHTML = ""

        try {
            const res = await fetch(`${this.apiUrl}random.php`)
            const data = await res.json()
            if (data.drinks) {
                const c = this._mapDrink(data.drinks[0])
                container.appendChild(this._card(c))
            }
        } catch {
            this._toast("Error fetching random cocktail", "error")
        } finally {
            load.classList.add("hidden")
        }
    }

    // -- Utils -- //
    _mapDrink(d) {
        const ings = []
        for (let i = 1; i <= 15; i++) {
            const ing = d[`strIngredient${i}`]
            const amt = d[`strMeasure${i}`]
            if (ing) ings.push({ name: ing, amount: amt || "" })
        }
        return {
            id: parseInt(d.idDrink),
            name: d.strDrink,
            category: d.strCategory || "Other",
            glass: d.strGlass || "",
            type: d.strAlcoholic || "Alcoholic",
            ingredients: ings,
            instructions: d.strInstructions || "",
            image: d.strDrinkThumb
        }
    }

    _toast(msg, type = "info") {
        const box = document.getElementById("toast-container")
        const div = document.createElement("div")
        div.className = `toast toast--${type}`
        div.textContent = msg
        box.appendChild(div)
        setTimeout(() => div.remove(), 2500)
    }

    _loadFavs() {
        try {
            return JSON.parse(localStorage.getItem("cocktailFavs") || "[]")
        } catch { return [] }
    }

    _saveFavs() {
        localStorage.setItem("cocktailFavs", JSON.stringify(this.favorites))
    }

    _clearSearch() {
        document.getElementById("search-results").innerHTML = ""
    }

    _showResults(list) {
        const grid = document.getElementById("search-results")
        grid.innerHTML = ""
        list.forEach(c => grid.appendChild(this._card(c)))
    }

    _showLoading(type) {
        document.getElementById(`${type}-loading`).classList.remove("hidden")
    }
    _hideLoading(type) {
        document.getElementById(`${type}-loading`).classList.add("hidden")
    }
    _showError(type) {
        document.getElementById(`${type}-error`).classList.remove("hidden")
    }

    // seed sample
    _seedCocktails() {
        return [
            { id: 1, name: "Margarita", category: "Tequila", glass: "Margarita Glass", type: "Sour", alcoholic: "Yes",
              ingredients: [{name:"Tequila",amount:"2oz"}], instructions: "Shake w/ice", image: "https://..." },
            { id: 2, name: "Mojito", category: "Rum", glass: "Highball Glass", type: "Long", alcoholic: "Yes",
              ingredients: [{name:"Rum",amount:"2oz"}], instructions: "Muddle mint", image: "https://..." }
            // ... (shortened for readability)
        ]
    }
}

// kick off
document.addEventListener("DOMContentLoaded", () => new MixerApp())
