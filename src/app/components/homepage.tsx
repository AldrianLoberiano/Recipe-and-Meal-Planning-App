import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { defaultRecipes, CATEGORIES } from '../data';
import { motion } from 'motion/react';
import {
  ChefHat, Calendar, ShoppingCart, Heart, Star, Clock, Users,
  ArrowRight, Sparkles, Check, Upload, Utensils, BookOpen, Zap
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ThemeToggle } from './theme-toggle';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1714989085932-775b00d516e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFsJTIwcGxhbm5pbmclMjBraXRjaGVuJTIwdGFibGUlMjBmb29kfGVufDF8fHx8MTc3MzUyNjU1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const FEATURE_IMAGE_1 = 'https://images.unsplash.com/photo-1758874960007-736f0dca5ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjb29raW5nJTIwdG9nZXRoZXIlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NzM1MjY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const FEATURE_IMAGE_2 = 'https://images.unsplash.com/photo-1568041327767-d6a7883f5f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGhlYWx0aHklMjBmb29kJTIwYm93bHMlMjBvdmVyaGVhZHxlbnwxfHx8fDE3NzM1MjY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const features = [
  {
    icon: BookOpen,
    title: 'Recipe Collection',
    description: 'Store and organize all your recipes in one place with detailed ingredients, step-by-step instructions, and nutritional information.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Calendar,
    title: 'Weekly Meal Planner',
    description: 'Drag-and-drop meals into a visual weekly calendar. Plan breakfast, lunch, dinner, and snacks for every day.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: ShoppingCart,
    title: 'Smart Grocery Lists',
    description: 'Automatically generate grocery lists from your meal plan. Ingredients are combined and organized for efficient shopping.',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    icon: Upload,
    title: 'Recipe Import',
    description: 'Paste any recipe text and our smart parser will automatically extract ingredients, instructions, and details.',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    icon: Heart,
    title: 'Favorites & Ratings',
    description: 'Save your favorite recipes for quick access and rate them to keep track of what you love most.',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    icon: Zap,
    title: 'Nutritional Tracking',
    description: 'View calories, protein, carbs, fat, and fiber for every recipe. Make informed decisions about what you eat.',
    color: 'bg-amber-500/10 text-amber-600',
  },
];

const stats = [
  { value: `${defaultRecipes.length}`, label: 'Recipes' },
  { value: '28', label: 'Meal Slots/Week' },
  { value: '100%', label: 'Free & Offline' },
  { value: '5', label: 'Nutrition Metrics' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    text: "MealCraft has completely changed how I plan meals for my family. The grocery list feature alone saves me 30 minutes every week!",
    rating: 5,
  },
  {
    name: 'James K.',
    text: "The drag-and-drop meal planner is so intuitive. I can reorganize my entire week in seconds. Love the recipe import too!",
    rating: 5,
  },
  {
    name: 'Emily R.',
    text: "Finally an app that tracks nutrition without being overwhelming. The beautiful interface makes meal planning actually enjoyable.",
    rating: 4,
  },
];

export function HomePage() {
  const { isAuthenticated } = useAppStore();
  const navigate = useNavigate();
  const previewRecipes = defaultRecipes.slice(0, 4);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  const handleLogin = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-foreground">MealCraft</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[0.8rem] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Your all-in-one meal planning companion
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] text-foreground mb-5 !leading-[1.15]">
                Plan meals.
                <br />
                <span className="text-primary">Cook smarter.</span>
                <br />
                Eat better.
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                Organize recipes, plan your weekly meals with drag-and-drop, automatically generate grocery lists, and track nutrition — all in one beautiful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGetStarted}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:opacity-90 transition inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Planning Free'}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 rounded-xl border border-border hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2"
                >
                  See Features
                </button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-primary-foreground text-[0.6rem]"
                    >
                      {['SM', 'JK', 'ER', 'AL'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[0.8rem] text-foreground ml-1">4.9</span>
                  </div>
                  <p className="text-muted-foreground text-[0.75rem]">Loved by home cooks</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={HERO_IMAGE}
                  alt="Meal planning with fresh ingredients"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -left-6 top-8 bg-card rounded-xl border border-border shadow-lg p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[0.8rem] text-foreground">Grocery List</p>
                  <p className="text-[0.7rem] text-muted-foreground">Auto-generated</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -right-4 bottom-12 bg-card rounded-xl border border-border shadow-lg p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[0.8rem] text-foreground">28 meals planned</p>
                  <p className="text-[0.7rem] text-muted-foreground">This week</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl text-primary">{stat.value}</p>
                <p className="text-muted-foreground text-[0.85rem]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl text-foreground mb-3">Everything you need to meal plan like a pro</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From recipe management to automated shopping lists, MealCraft handles it all so you can focus on what matters — cooking and enjoying great food.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-[0.9rem]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl text-foreground mb-3">How MealCraft works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to organized, stress-free meal planning.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Add Your Recipes',
                description: 'Create recipes manually, import from text, or start with our curated collection of delicious meals.',
                image: FEATURE_IMAGE_1,
              },
              {
                step: '02',
                title: 'Plan Your Week',
                description: 'Drag and drop recipes into your weekly calendar. Organize breakfast, lunch, dinner, and snacks.',
                image: FEATURE_IMAGE_2,
              },
              {
                step: '03',
                title: 'Shop & Cook',
                description: 'Generate your grocery list automatically, check off items as you shop, and start cooking!',
                image: HERO_IMAGE,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[16/10]">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[0.85rem]">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-[0.9rem]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Walkthrough */}
      <section className="py-16 sm:py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl text-foreground mb-3">Quick Start Walkthrough</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              New to MealCraft? Follow this quick path to build your first meal plan in a few minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: '1. Sign In',
                description: 'Create your account or log in to access your personal recipe workspace.',
              },
              {
                title: '2. Add or Import Recipes',
                description: 'Create recipes manually or paste recipe text and let the parser fill details.',
              },
              {
                title: '3. Plan Your Week',
                description: 'Drag and drop recipes into breakfast, lunch, dinner, and snack slots.',
              },
              {
                title: '4. Review Nutrition Summary',
                description: 'Check weekly calories, protein, carbs, fat, and fiber with daily averages.',
              },
              {
                title: '5. Generate Grocery List',
                description: 'Create your shopping list automatically and track purchased items.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <h3 className="text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-[0.9rem]">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleLogin}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:opacity-90 transition inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Recipe Preview */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl text-foreground mb-3">Explore recipes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Your saved recipes will appear here as soon as you start adding them.</p>
          </motion.div>

          {previewRecipes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {previewRecipes.map((recipe, i) => {
              const category = CATEGORIES.find(c => c.value === recipe.category);
              return (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={handleGetStarted}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[0.75rem]">
                        {category?.emoji} {category?.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 line-clamp-1 group-hover:text-primary transition-colors">{recipe.title}</h4>
                    <p className="text-muted-foreground text-[0.8rem] line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.prepTime + recipe.cookTime}m</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{recipe.servings}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-foreground">{recipe.rating}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">No recipes yet. Create your first one to start planning meals.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={handleGetStarted}
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Open recipe planner <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl text-foreground mb-3">What home cooks are saying</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <p className="text-[0.9rem] text-foreground mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[0.75rem]">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-muted-foreground text-[0.85rem]">{t.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4">Ready to transform your meal planning?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of home cooks who save time, reduce food waste, and eat better with MealCraft. It's completely free.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-xl hover:opacity-90 transition inline-flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-[0.85rem] text-foreground">MealCraft</span>
            </div>
            <p className="text-muted-foreground text-[0.8rem]">
              &copy; 2026 MealCraft. Made with love for home cooks everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}