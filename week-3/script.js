class CocktailApp {
  constructor() {
    this.apiBase = "https://www.thecocktaildb.com/api/json/v1/1/";
    this.cocktailList = document.getElementById("cocktailList");
    this.loadMoreBtn = document.getElementById("loadMoreBtn");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.detailModal = document.getElementById("detailModal");
    this.closeModalBtn = document.getElementById("closeModal");
    this.favoriteBtn = document.getElementById("favoriteBtn");
    this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    this.initEvents();
    this.loadCocktails(); // load initial cocktails
  }

  initEvents() {
    this.loadMoreBtn.addEventListener("click", () => this.loadCocktails());
    this.refreshBtn.addEventListener("click", () => this.refreshCocktails());
    this.closeModalBtn.addEventListener("click", () => this.closeModal());
    window.addEventListener("click", (e) => {
      if (e.target === this.detailModal) this.closeModal();
    });
  }

  async loadCocktails(count = 6) {
    for (let i = 0; i < count; i++) {
      const data = await this.fetchCocktail("random.php");
      if (data && data.drinks) {
        this.renderCocktailCard(data.drinks[0]);
      }
    }
  }

  async refreshCocktails() {
    this.cocktailList.innerHTML = "";
    await this.loadCocktails();
  }

  async fetchCocktail(endpoint) {
    try {
      const res = await fetch(this.apiBase + endpoint);
      return await res.json();
    } catch (err) {
      console.error("Error fetching cocktails:", err);
      return null;
    }
  }

  renderCocktailCard(drink) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" loading="lazy">
      <h3>${drink.strDrink}</h3>
    `;
    card.addEventListener("click", () => this.openModal(drink.idDrink));
    this.cocktailList.appendChild(card);
  }

  async openModal(id) {
    const data = await this.fetchCocktail(`lookup.php?i=${id}`);
    if (!data || !data.drinks) return;

    const drink = data.drinks[0];
    document.getElementById("drinkName").textContent = drink.strDrink;
    document.getElementById("drinkImage").src = drink.strDrinkThumb;
    document.getElementById("instructions").textContent = drink.strInstructions;
    document.getElementById("glassType").textContent = drink.strGlass;

    // Ingredients parsing
    const ingredientsDiv = document.getElementById("ingredients");
    ingredientsDiv.innerHTML = "";
    for (let i = 1; i <= 15; i++) {
      const ing = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ing) {
        const p = document.createElement("p");
        p.textContent = `${measure || ""} ${ing}`;
        ingredientsDiv.appendChild(p);
      }
    }

    // Favorite toggle
    const isFav = this.favorites.includes(drink.idDrink);
    this.favoriteBtn.textContent = isFav ? "Remove from Favorites" : "Add to Favorites";
    this.favoriteBtn.onclick = () => this.toggleFavorite(drink.idDrink);

    this.detailModal.classList.remove("hidden");
  }

  closeModal() {
    this.detailModal.classList.add("hidden");
  }

  toggleFavorite(id) {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(fav => fav !== id);
    } else {
      this.favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
    this.closeModal();
  }
}

document.addEventListener("DOMContentLoaded", () => new CocktailApp());
