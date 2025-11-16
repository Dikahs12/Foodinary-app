import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@foodinary_recipes';

// Predefined categories
const CATEGORIES = [
  "Nasional", "Internasional", "Cepat", "Sehat", "Tradisional", 
  "Modern", "Pedas", "Manis", "Vegetarian", "Daging", 
  "Seafood", "Ayam", "Sapi", "Ikan", "Sarapan",
  "Makan Siang", "Makan Malam", "Cemilan", "Penutup", "Minuman"
];

// Default recipes
const defaultRecipes = [
  {
    id: 1,
    title: "Nasi Goreng Spesial",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    cookingTime: "30 menit",
    servings: 2,
    calories: 450,
    featured: true,
    categories: ["Nasional", "Cepat"],
    ingredients: [
      { amount: "2", unit: "piring", name: "nasi putih" },
      { amount: "2", unit: "butir", name: "telur" },
      { amount: "100", unit: "gram", name: "ayam suwir" },
      { amount: "3", unit: "siung", name: "bawang putih" },
      { amount: "2", unit: "sdm", name: "kecap manis" },
      { amount: "1", unit: "sdt", name: "garam" }
    ],
    instructions: [
      "Tumis bawang putih hingga harum",
      "Masukkan telur, orak-arik hingga matang",
      "Tambahkan ayam suwir, aduk rata",
      "Masukkan nasi putih dan kecap manis",
      "Aduk hingga semua bahan tercampur rata",
      "Tambahkan garam dan bumbu lainnya sesuai selera",
      "Masak hingga nasi goreng matang sempurna"
    ],
    createdAt: new Date('2024-01-01').getTime()
  },
  {
    id: 2,
    title: "Rendang Daging",
    image: "https://images.unsplash.com/photo-1559314809-2ddb6d4d7c2a?w=400",
    cookingTime: "3 jam",
    servings: 6,
    calories: 380,
    featured: true,
    categories: ["Nasional", "Tradisional", "Daging"],
    ingredients: [
      { amount: "1", unit: "kg", name: "daging sapi" },
      { amount: "5", unit: "buah", name: "kelapa parut" },
      { amount: "10", unit: "siung", name: "bawang merah" },
      { amount: "5", unit: "siung", name: "bawang putih" },
      { amount: "5", unit: "buah", name: "cabai merah" },
      { amount: "2", unit: "batang", name: "serai" }
    ],
    instructions: [
      "Haluskan semua bumbu kecuali serai",
      "Tumis bumbu halus hingga harum",
      "Masukkan daging sapi, aduk hingga berubah warna",
      "Tambahkan santan dan serai",
      "Masak dengan api kecil hingga bumbu meresap",
      "Aduk sesekali hingga kuah mengental dan berminyak",
      "Masak hingga daging empuk dan bumbu meresap sempurna"
    ],
    createdAt: new Date('2024-01-02').getTime()
  }
];

let recipes = [];
let listeners = [];

// Initialize recipes
export const initializeRecipes = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      recipes = JSON.parse(stored);
    } else {
      recipes = [...defaultRecipes];
      await saveRecipes();
    }
    notifyListeners();
    return recipes;
  } catch (error) {
    console.error('Error initializing recipes:', error);
    recipes = [...defaultRecipes];
    return recipes;
  }
};

// Save recipes to storage
const saveRecipes = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
    throw error;
  }
};

// Notify all listeners
const notifyListeners = () => {
  console.log('Notifying', listeners.length, 'listeners');
  listeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('Error in listener:', error);
    }
  });
};

// CRUD Operations
export const getRecipes = () => [...recipes];

export const addRecipe = async (recipeData) => {
  try {
    console.log('Adding recipe:', recipeData);
    const newId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
    const newRecipe = {
      ...recipeData,
      id: newId,
      featured: true,
      createdAt: new Date().getTime()
    };
    
    recipes.unshift(newRecipe);
    await saveRecipes();
    notifyListeners();
    console.log('Recipe added successfully:', newRecipe);
    return newRecipe;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    console.log('Updating recipe:', id, recipeData);
    const index = recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      const originalRecipe = recipes[index];
      recipes[index] = { 
        ...recipeData, 
        id, 
        createdAt: originalRecipe.createdAt,
        featured: originalRecipe.featured
      };
      await saveRecipes();
      notifyListeners();
      console.log('Recipe updated successfully:', recipes[index]);
      return recipes[index];
    }
    throw new Error('Resep tidak ditemukan');
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    console.log('Deleting recipe:', id);
    const index = recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      const deletedRecipe = recipes.splice(index, 1)[0];
      await saveRecipes();
      notifyListeners();
      console.log('Recipe deleted successfully:', deletedRecipe);
      return deletedRecipe;
    }
    throw new Error('Resep tidak ditemukan');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const getRecipeById = (id) => {
  return recipes.find(recipe => recipe.id === id);
};

// Get featured recipes (newest 6 recipes)
export const getFeaturedRecipes = () => {
  return [...recipes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);
};

// Subscribe to changes
export const subscribe = (callback) => {
  console.log('Adding subscriber');
  listeners.push(callback);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      console.log('Removed subscriber');
    }
  };
};

// Initialize on import
initializeRecipes();

// Export CATEGORIES hanya sekali di akhir file
export { CATEGORIES };