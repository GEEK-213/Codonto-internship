// script.js

const cocktailList = document.getElementById("cocktailList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const ingredientFilter = document.getElementById("ingredientFilter");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const refreshBtn = document.getElementById("refreshBtn");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");

let currentCocktails = [];
let displayedCount = 0;
const cocktailsPerPage = 6; // number of cocktails to show at once

const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

// Fetch categories and ingredients
async function loadFilters() {
  const catRes = await fetch(`${API_BASE}list.php?c=list`);
  const catData = await catRes.json();
  catData.drinks.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.strCategory;
    option.textContent = cat.strCategory;
    categoryFilter.appendChild(option);
  });

  const ingRes = await fetch(`${API_BASE}list.php?i=list`);
  const ingData = await ingRes.json();
  ingData.drinks.slice(0, 50).forEach(ing => { // limit for performance
    const option = document.createElement("option");
    option.value = ing.strIngredient1;
    option.textContent = ing.strIngredient1;
    ingredientFilter.appendChild(option);
  });
}

// Fetch cocktails by search/category/ingredient
async function fetchCocktails(query = "") {
  let url = "";

  if (query) {
    url = `${API_BASE}search.php?s=${query}`;
  } else if (categoryFilter.value) {
    url = `${API_BASE}filter.php?c=${categoryFilter.value}`;
  } else if (ingredientFilter.value) {
    url = `${API_BASE}filter.php?i=${ingredientFilter.value}`;
  } else {
    url = `${API_BASE}search.php?s=a`; // default fetch (random selection by 'a')
  }

  const res = await fetch(url);
  const data = await res.json();
  currentCocktails = data.drinks || [];
  displayedCount = 0;
  renderCocktails();
}

// Render cocktails
function renderCocktails() {
  if (displayedCount === 0) cocktailList.innerHTML = "";

  const toDisplay = currentCocktails.slice(displayedCount, displayedCount + cocktailsPerPage);

  toDisplay.forEach(cocktail => {
    const card = document.createElement("div");
    card.className = "cocktail-card";
    card.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <h3>${cocktail.strDrink}</h3>
    `;

    card.addEventListener("click", () => openModal(cocktail.idDrink));
    cocktailList.appendChild(card);
  });

  displayedCount += toDisplay.length;

  loadMoreBtn.style.display = displayedCount < currentCocktails.length ? "block" : "none";
}


async function openModal(id) {
  const res = await fetch(`${API_BASE}lookup.php?i=${id}`);
  const data = await res.json();
  const drink = data.drinks[0];

  modalTitle.textContent = drink.strDrink;
  modalImg.src = drink.strDrinkThumb;
  modalIngredients.innerHTML = "";

  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient) {
      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure || ""}`;
      modalIngredients.appendChild(li);
    }
  }

  modalInstructions.textContent = drink.strInstructions;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

searchBtn.addEventListener("click", () => fetchCocktails(searchInput.value));
categoryFilter.addEventListener("change", () => fetchCocktails());
ingredientFilter.addEventListener("change", () => fetchCocktails());
loadMoreBtn.addEventListener("click", renderCocktails);
refreshBtn.addEventListener("click", () => fetchCocktails());


loadFilters();
fetchCocktails();
