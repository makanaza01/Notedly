import React from 'react';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';

interface AuthorProfileProps {
  authorName: string;
  allArticles: Article[];
  onArticleClick: (article: Article) => void;
  onBack: () => void;
  onLike: (id: string) => void;
  onAuthorClick: (author: string) => void;
}

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-600',
    'from-emerald-400 to-teal-600',
    'from-orange-400 to-rose-600',
    'from-cyan-400 to-blue-600',
    'from-fuchsia-400 to-purple-600',
    'from-sky-400 to-blue-600'
  ];
  const index = name.length % gradients.length;
  return gradients[index];
};

const AuthorProfile: React.FC<AuthorProfileProps> = ({ 
  authorName, 
  allArticles, 
  onArticleClick, 
  onBack, 
  onLike,
  onAuthorClick
}) => {
  const authorArticles = allArticles.filter(article => article.author === authorName);
  const totalLikes = authorArticles.reduce((sum, article) => sum + article.likes, 0);
  const totalArticles = authorArticles.length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-school-600 font-medium transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to News
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
         <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-r ${getAvatarGradient(authorName)} opacity-20`} />
         
         <div className="relative flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Avatar */}
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br ${getAvatarGradient(authorName)} shadow-xl ring-4 ring-white flex items-center justify-center`}>
               <span className="text-5xl md:text-6xl font-serif font-black text-white/90">
                 {authorName.charAt(0).toUpperCase()}
               </span>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
               <div>
                 <span className="inline-block px-3 py-1 bg-school-100 text-school-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                    Notedly Contributor
                 </span>
                 <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 leading-none mb-2">
                   {authorName}
                 </h1>
                 <p className="text-slate-500 text-lg">
                    Sharing perspectives and stories with the student body.
                 </p>
               </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
               <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">{totalArticles}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Articles</div>
               </div>
               <div className="w-px bg-slate-200" />
               <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">{totalLikes}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Likes</div>
               </div>
            </div>
         </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center">
           Published Articles
           <span className="ml-3 text-sm font-sans font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{totalArticles}</span>
        </h2>

        {authorArticles.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {authorArticles.map((article) => (
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
           <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">No articles published yet.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
