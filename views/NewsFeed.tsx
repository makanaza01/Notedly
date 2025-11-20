import React, { useState, useMemo } from 'react';
import { Article, Category } from '../types';
import ArticleCard from '../components/ArticleCard';

interface NewsFeedProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  onLike: (id: string) => void;
  onAuthorClick: (author: string) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, onArticleClick, onLike, onAuthorClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Object.values(Category)];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter mb-2">The Feed</h1>
          <p className="text-base md:text-lg text-slate-500 font-light">Explore the latest stories, debates, and club updates.</p>
        </div>
        
        {/* Modern Search Bar */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-0 bg-gradient-to-r from-school-200 to-accent-200 rounded-full blur opacity-25 group-focus-within:opacity-50 transition-opacity duration-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full pl-12 pr-6 py-3.5 bg-white rounded-2xl md:rounded-full border-none shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-school-400 text-slate-700 placeholder:text-slate-400 transition-all"
          />
          <svg className="w-5 h-5 text-school-500 absolute left-4 top-3.5 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Floating Categories - Horizontal Scroll on Mobile */}
      <div className="sticky top-16 md:top-20 z-30 py-4 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar bg-gradient-to-b from-slate-50 via-slate-50/95 to-transparent mask-linear-gradient">
        <div className="flex gap-3 min-w-max pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | 'All')}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30 scale-105' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 shadow-sm border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
          {filteredArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              variant="compact" 
              onClick={onArticleClick}
              onLike={onLike}
              onAuthorClick={onAuthorClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200 mx-4 md:mx-0">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No articles found</h3>
          <p className="text-slate-500 mt-1 text-center px-4">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;