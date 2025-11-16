import { createStackNavigator } from '@react-navigation/stack';
import AddEditRecipeScreen from '../screens/AddEditRecipeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ManageRecipesScreen from '../screens/ManageRecipesScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ef4444',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitle: 'Kembali',
        cardStyle: {
          backgroundColor: '#f8fafc',
        },
        // Smooth transitions
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          headerShown: false // Sembunyikan header default di home
        }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: 'Cari Resep' }}
      />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.category })}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={{ title: 'Detail Resep' }}
      />
      <Stack.Screen 
        name="ManageRecipes" 
        component={ManageRecipesScreen}
        options={{ title: 'Kelola Resep' }}
      />
      <Stack.Screen 
        name="AddEditRecipe" 
        component={AddEditRecipeScreen}
        options={({ route }) => ({ 
          title: route.params?.recipe ? 'Edit Resep' : 'Tambah Resep' 
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;