import { Platform } from 'react-native';

export const formatIngredients = (ingredientsText) => {
  try {
    return ingredientsText
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.trim().split(' ');
        if (parts.length < 3) {
          throw new Error(`Format bahan salah: "${line}". Contoh: 2 butir telur`);
        }
        return {
          amount: parts[0],
          unit: parts[1],
          name: parts.slice(2).join(' ')
        };
      });
  } catch (error) {
    throw new Error('Format bahan tidak valid. Pastikan setiap bahan dalam format: jumlah satuan nama');
  }
};

export const formatInstructions = (instructionsText) => {
  return instructionsText
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.trim());
};

export const formatCategories = (categoriesText) => {
  return categoriesText
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat);
};

// Platform detection
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Responsive value helper
export const responsiveValue = (webValue, mobileValue) => {
  return isWeb ? webValue : mobileValue;
};

// Validation helpers
export const validateRecipe = (recipeData) => {
  const errors = [];

  if (!recipeData.title?.trim()) {
    errors.push('Nama resep harus diisi');
  }
  if (!recipeData.cookingTime?.trim()) {
    errors.push('Waktu masak harus diisi');
  }
  if (!recipeData.servings || recipeData.servings < 1) {
    errors.push('Porsi harus minimal 1');
  }
  if (!recipeData.categories?.length) {
    errors.push('Pilih minimal satu kategori');
  }
  if (!recipeData.ingredients?.length) {
    errors.push('Bahan-bahan harus diisi');
  }
  if (!recipeData.instructions?.length) {
    errors.push('Cara membuat harus diisi');
  }

  return errors;
};