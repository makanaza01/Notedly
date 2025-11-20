import React from 'react';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';

interface HomeProps {
  articles: Article[];
  onNavigateNews: () => void;
  onArticleClick: (article: Article) => void;
  onLike: (id: string) => void;
  onAuthorClick: (author: string) => void;
}

const Home: React.FC<HomeProps> = ({ articles, onNavigateNews, onArticleClick, onLike, onAuthorClick }) => {
  const featured = articles[0];
  const recent = articles.slice(1, 4);

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Modern Hero Section */}
      <section className="relative bg-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-4 ring-white text-white isolate min-h-[500px] flex items-end">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <img 
            src={featured?.imageUrl || 'https://picsum.photos/1600/900'} 
            alt="Featured Background" 
            className="w-full h-full object-cover opacity-60 transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        <div className="relative px-6 py-12 md:px-16 md:py-20 w-full max-w-5xl">
          {featured && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-700">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-accent-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-accent-500/30 backdrop-blur-md">
                  Featured
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-widest">{new Date(featured.date).toLocaleDateString()}</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-serif font-black mb-4 md:mb-8 leading-[0.95] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 drop-shadow-lg">
                {featured.title}
              </h1>
              
              <p className="text-lg md:text-2xl text-slate-200 mb-8 md:mb-10 line-clamp-3 md:line-clamp-2 font-light max-w-3xl leading-relaxed opacity-90">
                {featured.summary}
              </p>
              
              <button 
                onClick={() => onArticleClick(featured)}
                className="group w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-accent-400 hover:text-white transition-all duration-300 hover:scale-105 shadow-xl shadow-white/10"
              >
                Read Full Story
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            </div>
          )}
          
          {!featured && (
             <div className="text-center py-10">
               <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Welcome to Notedly</h1>
               <p className="text-xl text-gray-300">Post the first article to see it here!</p>
             </div>
          )}
        </div>
      </section>

      {/* Recent News Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 px-2 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">Latest Drops</h2>
            <p className="text-base md:text-lg text-slate-500 mt-2 font-light">Fresh perspectives from around campus.</p>
          </div>
          <button 
            onClick={onNavigateNews}
            className="group hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-school-400 text-slate-600 hover:text-school-600 font-bold transition-all shadow-sm hover:shadow-md"
          >
            View All
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recent.map((article) => (
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
        
        <div className="mt-8 text-center md:hidden">
          <button 
            onClick={onNavigateNews}
            className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
          >
            Browse All News
          </button>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-school-600 text-white shadow-2xl mb-12">
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 md:w-96 h-64 md:h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 md:w-96 h-64 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
         
         <div className="relative p-8 md:p-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-black mb-4 md:mb-6 leading-tight">Have a voice? <br/>Make it heard.</h2>
              <p className="text-school-100 text-lg md:text-xl font-light leading-relaxed">
                Join the debate. Write guest articles, comment on campus issues, and shape the narrative on Notedly.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
               <button 
                 onClick={() => onNavigateNews()} // Direct to news/post ideally
                 className="w-full md:w-auto px-10 py-5 bg-white text-school-900 font-black text-lg rounded-2xl md:rounded-full shadow-2xl hover:scale-105 hover:shadow-white/20 transition-all duration-300"
               >
                 Start Writing
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;