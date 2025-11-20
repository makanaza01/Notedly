import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick?: (article: Article) => void;
  onLike?: (id: string) => void;
  onAuthorClick?: (author: string) => void;
  variant?: 'compact' | 'full';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, onLike, onAuthorClick, variant = 'full' }) => {
  return (
    <div 
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-100/50 h-full"
      onClick={() => onClick && onClick(article)}
    >
      {/* Image Container */}
      <div className={`relative ${variant === 'compact' ? 'aspect-[4/3]' : 'aspect-[16/9]'} w-full overflow-hidden`}>
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-school-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/50">
            {article.category}
          </span>
        </div>

        {/* Video Indicator */}
        {article.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300 backdrop-blur-[2px]">
             <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M8 5v14l11-7z" />
                </svg>
             </div>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col bg-white relative z-20">
        <div className="flex items-center text-xs font-bold text-slate-400 mb-3 tracking-wide uppercase">
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick?.(article.author);
            }}
            className="text-school-600 hover:text-accent-500 hover:underline transition-colors"
          >
            {article.author}
          </button>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-3 leading-tight group-hover:text-school-600 transition-colors duration-300">
          {article.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow font-medium">
          {article.summary}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               if (onLike) onLike(article.id);
             }}
             className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors group/like"
           >
              <div className="p-2 rounded-full bg-slate-50 group-hover/like:bg-rose-50 transition-colors">
                <svg className="w-5 h-5 group-hover/like:scale-110 transition-transform" fill={article.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm font-bold">{article.likes}</span>
           </button>

           <div className="flex items-center gap-4">
             <div className="flex items-center text-slate-400 text-xs font-bold">
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {article.comments?.length || 0}
             </div>
             
             <span className="text-xs font-bold text-school-600 group-hover:translate-x-1 transition-transform duration-300">
               Read Post &rarr;
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;