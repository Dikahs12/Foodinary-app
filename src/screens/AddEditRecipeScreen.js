import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { addRecipe, CATEGORIES, updateRecipe } from '../data/recipes';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';
import { formatIngredients, formatInstructions } from '../utils/helpers';

const AddEditRecipeScreen = ({ navigation, route }) => {
  const recipe = route.params?.recipe;
  const isEdit = !!recipe;

  const [form, setForm] = useState({
    title: '',
    image: '',
    cookingTime: '',
    servings: '',
    calories: '',
    ingredients: '',
    instructions: ''
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (recipe) {
      setForm({
        title: recipe.title || '',
        image: recipe.image || '',
        cookingTime: recipe.cookingTime || '',
        servings: recipe.servings?.toString() || '2',
        calories: recipe.calories?.toString() || '',
        ingredients: recipe.ingredients?.map(i => `${i.amount} ${i.unit} ${i.name}`).join('\n') || '',
        instructions: recipe.instructions?.join('\n') || ''
      });
      setSelectedCategories(recipe.categories || []);
    }
  }, [recipe]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Nama resep harus diisi');
      return false;
    }
    if (!form.cookingTime.trim()) {
      Alert.alert('Error', 'Waktu masak harus diisi');
      return false;
    }
    if (!form.servings || isNaN(form.servings) || parseInt(form.servings) <= 0) {
      Alert.alert('Error', 'Porsi harus angka yang valid (minimal 1)');
      return false;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Pilih minimal satu kategori');
      return false;
    }
    if (!form.ingredients.trim()) {
      Alert.alert('Error', 'Bahan-bahan harus diisi');
      return false;
    }
    if (!form.instructions.trim()) {
      Alert.alert('Error', 'Cara membuat harus diisi');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (loading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Parse ingredients
      const ingredientsArray = formatIngredients(form.ingredients);
      
      const recipeData = {
        title: form.title.trim(),
        image: form.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        cookingTime: form.cookingTime.trim(),
        servings: parseInt(form.servings),
        calories: parseInt(form.calories) || 0,
        categories: selectedCategories,
        ingredients: ingredientsArray,
        instructions: formatInstructions(form.instructions)
      };

      console.log('Saving recipe data:', recipeData);

      if (isEdit) {
        await updateRecipe(recipe.id, recipeData);
        Alert.alert('Sukses!', 'Resep berhasil diperbarui', [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('ManageRecipes') 
          }
        ]);
      } else {
        await addRecipe(recipeData);
        Alert.alert('Sukses!', 'Resep berhasil ditambahkan', [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('ManageRecipes') 
          }
        ]);
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Terjadi kesalahan saat menyimpan resep');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollContainer}
      >
        <Text style={globalStyles.title}>
          {isEdit ? 'Edit Resep' : 'Tambah Resep Baru'}
        </Text>

        {/* Basic Information */}
        <Text style={globalStyles.subtitle}>Informasi Dasar</Text>
        <View style={globalStyles.card}>
          <Text style={styles.label}>Nama Resep *</Text>
          <TextInput
            style={[
              globalStyles.input,
              focusedField === 'title' && globalStyles.inputFocus
            ]}
            placeholder="Nasi Goreng Spesial"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            onFocus={() => handleFocus('title')}
            onBlur={handleBlur}
          />

          <Text style={styles.label}>Gambar (URL)</Text>
          <TextInput
            style={[
              globalStyles.input,
              focusedField === 'image' && globalStyles.inputFocus
            ]}
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChangeText={(value) => updateField('image', value)}
            onFocus={() => handleFocus('image')}
            onBlur={handleBlur}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Waktu Masak *</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  focusedField === 'cookingTime' && globalStyles.inputFocus
                ]}
                placeholder="30 menit"
                value={form.cookingTime}
                onChangeText={(value) => updateField('cookingTime', value)}
                onFocus={() => handleFocus('cookingTime')}
                onBlur={handleBlur}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Porsi *</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  focusedField === 'servings' && globalStyles.inputFocus
                ]}
                placeholder="2"
                value={form.servings}
                onChangeText={(value) => updateField('servings', value)}
                onFocus={() => handleFocus('servings')}
                onBlur={handleBlur}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Kalori</Text>
          <TextInput
            style={[
              globalStyles.input,
              focusedField === 'calories' && globalStyles.inputFocus
            ]}
            placeholder="450"
            value={form.calories}
            onChangeText={(value) => updateField('calories', value)}
            onFocus={() => handleFocus('calories')}
            onBlur={handleBlur}
            keyboardType="numeric"
          />
        </View>

        {/* Categories */}
        <Text style={globalStyles.subtitle}>Kategori *</Text>
        <View style={globalStyles.card}>
          <Text style={styles.helpText}>
            Pilih minimal satu kategori
          </Text>
          <View style={globalStyles.categoryList}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  globalStyles.categoryChip,
                  selectedCategories.includes(category) && globalStyles.categoryChipActive
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  globalStyles.categoryChipText,
                  selectedCategories.includes(category) && globalStyles.categoryChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedCategories.length > 0 && (
            <Text style={[styles.helpText, { marginTop: 12, color: '#ef4444' }]}>
              Terpilih: {selectedCategories.join(', ')}
            </Text>
          )}
        </View>

        {/* Ingredients */}
        <Text style={globalStyles.subtitle}>Bahan-bahan *</Text>
        <View style={globalStyles.card}>
          <Text style={styles.helpText}>
            Satu bahan per baris. Format: jumlah satuan nama{"\n"}
            Contoh:{"\n"}2 butir telur{"\n"}3 siung bawang putih{"\n"}2 sdm kecap manis
          </Text>
          <TextInput
            style={[
              globalStyles.input, 
              { height: isWebPlatform ? 140 : 120, textAlignVertical: 'top' },
              focusedField === 'ingredients' && globalStyles.inputFocus
            ]}
            multiline
            placeholder="2 butir telur&#10;3 siung bawang putih&#10;2 sdm kecap manis"
            value={form.ingredients}
            onChangeText={(value) => updateField('ingredients', value)}
            onFocus={() => handleFocus('ingredients')}
            onBlur={handleBlur}
          />
        </View>

        {/* Instructions */}
        <Text style={globalStyles.subtitle}>Cara Membuat *</Text>
        <View style={globalStyles.card}>
          <Text style={styles.helpText}>
            Satu langkah per baris
          </Text>
          <TextInput
            style={[
              globalStyles.input, 
              { height: isWebPlatform ? 160 : 140, textAlignVertical: 'top' },
              focusedField === 'instructions' && globalStyles.inputFocus
            ]}
            multiline
            placeholder="Panaskan minyak&#10;Tumis bawang putih hingga harum&#10;Masukkan bahan lainnya"
            value={form.instructions}
            onChangeText={(value) => updateField('instructions', value)}
            onFocus={() => handleFocus('instructions')}
            onBlur={handleBlur}
          />
        </View>

        {/* Action Buttons */}
        <Button 
          title={isEdit ? 'Perbarui Resep' : 'Simpan Resep'}
          loading={loading}
          onPress={handleSave}
          style={{ marginVertical: 24 }}
        />

        <Button 
          title="Batal"
          variant="secondary"
          onPress={() => navigation.goBack()}
          disabled={loading}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="ManageRecipes" />
    </View>
  );
};

const styles = {
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
    fontSize: isWebPlatform ? 16 : 14,
  },
  helpText: {
    color: '#6b7280',
    fontSize: isWebPlatform ? 14 : 12,
    marginBottom: 12,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  half: {
    flex: 1,
  },
};

export default AddEditRecipeScreen;