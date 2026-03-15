import React, { useState } from 'react';
import { Recipe, CATEGORIES } from '../data';
import {
  X, Copy, Check, Printer, FileText, Share2,
  Link2, Mail, Download, Twitter, Facebook
} from 'lucide-react';
import { toast } from 'sonner';

// Social media SVG icons (lucide doesn't have Pinterest or branded icons)
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
    </svg>
  );
}

interface RecipeShareModalProps {
  recipe: Recipe;
  onClose: () => void;
}

function formatRecipeAsText(recipe: Recipe): string {
  const category = CATEGORIES.find(c => c.value === recipe.category);
  const totalTime = recipe.prepTime + recipe.cookTime;

  let text = `${recipe.title}\n`;
  text += `${'='.repeat(recipe.title.length)}\n\n`;
  text += `${recipe.description}\n\n`;
  text += `Category: ${category?.label || recipe.category}\n`;
  text += `Prep Time: ${recipe.prepTime} min | Cook Time: ${recipe.cookTime} min | Total: ${totalTime} min\n`;
  text += `Servings: ${recipe.servings}\n\n`;

  text += `NUTRITION (per serving)\n`;
  text += `Calories: ${recipe.nutrition.calories} kcal | Protein: ${recipe.nutrition.protein}g | Carbs: ${recipe.nutrition.carbs}g | Fat: ${recipe.nutrition.fat}g | Fiber: ${recipe.nutrition.fiber}g\n\n`;

  text += `INGREDIENTS\n`;
  text += `${'-'.repeat(20)}\n`;
  recipe.ingredients.forEach(ing => {
    text += `- ${ing.amount} ${ing.unit} ${ing.name}\n`;
  });

  text += `\nINSTRUCTIONS\n`;
  text += `${'-'.repeat(20)}\n`;
  recipe.instructions.forEach((step, i) => {
    text += `${i + 1}. ${step}\n`;
  });

  text += `\n---\nShared from MealCraft`;
  return text;
}

function generatePrintHTML(recipe: Recipe): string {
  const category = CATEGORIES.find(c => c.value === recipe.category);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${recipe.title} - MealCraft</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 20px; color: #1a1a2e; }
    h1 { font-size: 28px; margin-bottom: 8px; color: #e07a5f; }
    h2 { font-size: 18px; margin-top: 28px; margin-bottom: 12px; border-bottom: 2px solid #e07a5f; padding-bottom: 4px; }
    .description { color: #6b7280; margin-bottom: 20px; font-size: 14px; }
    .meta { display: flex; gap: 24px; margin-bottom: 24px; font-size: 13px; color: #6b7280; }
    .meta span { background: #f2efea; padding: 6px 12px; border-radius: 8px; }
    .nutrition { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 8px; }
    .nutrition-item { text-align: center; padding: 8px; background: #f2efea; border-radius: 8px; }
    .nutrition-item .value { font-size: 20px; font-weight: 600; color: #e07a5f; }
    .nutrition-item .label { font-size: 11px; color: #6b7280; }
    .ingredients li { padding: 6px 0; border-bottom: 1px solid #f0ede8; font-size: 14px; list-style: none; }
    .ingredients li:before { content: "\\2022"; color: #e07a5f; font-weight: bold; display: inline-block; width: 16px; }
    .instructions li { padding: 8px 0; font-size: 14px; margin-left: 20px; }
    .instructions li::marker { color: #e07a5f; font-weight: 600; }
    .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f0ede8; padding-top: 16px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${recipe.title}</h1>
  <p class="description">${recipe.description}</p>
  <div class="meta">
    <span>${category?.emoji} ${category?.label}</span>
    <span>Prep: ${recipe.prepTime} min</span>
    <span>Cook: ${recipe.cookTime} min</span>
    <span>Total: ${totalTime} min</span>
    <span>Serves ${recipe.servings}</span>
  </div>
  <h2>Nutrition per Serving</h2>
  <div class="nutrition">
    <div class="nutrition-item"><div class="value">${recipe.nutrition.calories}</div><div class="label">Calories</div></div>
    <div class="nutrition-item"><div class="value">${recipe.nutrition.protein}g</div><div class="label">Protein</div></div>
    <div class="nutrition-item"><div class="value">${recipe.nutrition.carbs}g</div><div class="label">Carbs</div></div>
    <div class="nutrition-item"><div class="value">${recipe.nutrition.fat}g</div><div class="label">Fat</div></div>
    <div class="nutrition-item"><div class="value">${recipe.nutrition.fiber}g</div><div class="label">Fiber</div></div>
  </div>
  <h2>Ingredients</h2>
  <ul class="ingredients">
    ${recipe.ingredients.map(ing => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`).join('')}
  </ul>
  <h2>Instructions</h2>
  <ol class="instructions">
    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
  </ol>
  <div class="footer">Shared from MealCraft</div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
}

export function RecipeShareModal({ recipe, onClose }: RecipeShareModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/recipes/${recipe.id}`;
    await navigator.clipboard.writeText(url);
    setCopied('link');
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyRecipe = async () => {
    const text = formatRecipeAsText(recipe);
    await navigator.clipboard.writeText(text);
    setCopied('recipe');
    toast.success('Recipe copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintHTML(recipe));
      printWindow.document.close();
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title} - ${recipe.description}`,
          url: `${window.location.origin}/recipes/${recipe.id}`,
        });
        toast.success('Recipe shared!');
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Recipe: ${recipe.title} - MealCraft`);
    const body = encodeURIComponent(formatRecipeAsText(recipe));
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const handleDownloadText = () => {
    const text = formatRecipeAsText(recipe);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Recipe downloaded!');
  };

  const recipeUrl = `${window.location.origin}/recipes/${recipe.id}`;
  const shareText = `Check out this recipe: ${recipe.title} - ${recipe.description}`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(recipeUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handlePinterestShare = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(recipeUrl)}&media=${encodeURIComponent(recipe.image)}&description=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareActions = [
    {
      icon: Link2,
      label: 'Copy Link',
      description: 'Copy recipe URL to clipboard',
      onClick: handleCopyLink,
      copiedKey: 'link',
    },
    {
      icon: FileText,
      label: 'Copy Recipe',
      description: 'Copy full recipe as text',
      onClick: handleCopyRecipe,
      copiedKey: 'recipe',
    },
    {
      icon: Printer,
      label: 'Print Recipe',
      description: 'Open print-friendly version',
      onClick: handlePrint,
      copiedKey: null,
    },
    {
      icon: Download,
      label: 'Download',
      description: 'Save as text file',
      onClick: handleDownloadText,
      copiedKey: null,
    },
    {
      icon: Mail,
      label: 'Email',
      description: 'Share via email',
      onClick: handleEmailShare,
      copiedKey: null,
    },
    {
      icon: Share2,
      label: 'Share',
      description: 'Use device sharing',
      onClick: handleWebShare,
      copiedKey: null,
    },
  ];

  const socialActions = [
    {
      icon: TwitterIcon,
      label: 'X / Twitter',
      onClick: handleTwitterShare,
      bgColor: 'bg-black/10 text-foreground group-hover:bg-black/20',
    },
    {
      icon: FacebookIcon,
      label: 'Facebook',
      onClick: handleFacebookShare,
      bgColor: 'bg-[#1877F2]/10 text-[#1877F2] group-hover:bg-[#1877F2]/20',
    },
    {
      icon: PinterestIcon,
      label: 'Pinterest',
      onClick: handlePinterestShare,
      bgColor: 'bg-[#E60023]/10 text-[#E60023] group-hover:bg-[#E60023]/20',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <h2 className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share Recipe
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-muted-foreground text-[0.85rem]">{recipe.title}</p>
        </div>

        {/* Preview Card */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[0.9rem] truncate">{recipe.title}</p>
              <p className="text-muted-foreground text-[0.75rem] line-clamp-2">{recipe.description}</p>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="p-5 pb-2 grid grid-cols-3 gap-2">
          {shareActions.map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary transition-colors group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                copied === action.copiedKey
                  ? 'bg-green-100 text-green-600'
                  : 'bg-primary/10 text-primary group-hover:bg-primary/20'
              }`}>
                {copied === action.copiedKey ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <action.icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-[0.75rem] text-muted-foreground">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Social Media */}
        <div className="px-5 pb-5">
          <div className="border-t border-border pt-4">
            <p className="text-[0.75rem] text-muted-foreground mb-3 uppercase tracking-wide">Share on Social Media</p>
            <div className="flex items-center gap-2">
              {socialActions.map(action => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-secondary transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${action.bgColor}`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[0.75rem] text-muted-foreground hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}