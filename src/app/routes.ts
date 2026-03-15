import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout';
import { HomePage } from './components/homepage';
import { LoginPage, RegisterPage } from './components/auth-pages';
import { Dashboard } from './components/dashboard';
import { RecipesPage } from './components/recipes-page';
import { RecipeDetail } from './components/recipe-detail';
import { RecipeForm } from './components/recipe-form';
import { RecipeImport } from './components/recipe-import';
import { MealPlanner } from './components/meal-planner';
import { GroceryListPage } from './components/grocery-list';
import { FavoritesPage } from './components/favorites-page';
import { DashboardLoadingPage } from './components/dashboard-loading';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/dashboard-loading', Component: DashboardLoadingPage },
  {
    Component: Layout,
    children: [
      { path: '/dashboard', Component: Dashboard },
      { path: '/recipes', Component: RecipesPage },
      { path: '/recipes/new', Component: RecipeForm },
      { path: '/recipes/import', Component: RecipeImport },
      { path: '/recipes/:id', Component: RecipeDetail },
      { path: '/recipes/:id/edit', Component: RecipeForm },
      { path: '/meal-planner', Component: MealPlanner },
      { path: '/grocery-list', Component: GroceryListPage },
      { path: '/favorites', Component: FavoritesPage },
    ],
  },
]);
