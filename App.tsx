
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import NewsFeed from './views/NewsFeed';
import PostEditor from './views/PostEditor';
import AuthorProfile from './views/AuthorProfile';
import { Article, ViewState, Comment } from './types';
import { dbService } from './services/db';

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-600',
    'from-emerald-400 to-teal-600',
    'from-orange-400 to-rose-600',
    'from-cyan-400 to-blue-600',
  ];
  const index = name.length % gradients.length;
  return gradients[index];
};

// Article Modal with Video and Comments
const ArticleModal: React.FC<{ 
  article: Article; 
  onClose: () => void; 
  onLike: (id: string) => void;
  onAddComment: (id: string, text: string, author: string) => void;
  onAuthorClick: (author: string) => void;
}> = ({ article, onClose, onLike, onAddComment, onAuthorClick }) => {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const commentEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [article.comments]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && commentAuthor.trim()) {
      onAddComment(article.id, commentText, commentAuthor);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 animate-in fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-5xl h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col sm:rounded-[2.5rem] rounded-t-[2.5rem] ring-1 ring-white/20" 
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <button 
            onClick={() => {
              onClose();
              onAuthorClick(article.author);
            }}
            className="flex items-center gap-3 group/author hover:bg-slate-50 p-2 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs group-hover/author:bg-school-100 group-hover/author:text-school-600 transition-colors">
              {article.author.charAt(0)}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider group-hover/author:text-school-600 transition-colors">{article.author}</span>
              <span className="text-[10px] text-slate-500">{new Date(article.date).toLocaleDateString()}</span>
            </div>
          </button>
          <button 
            onClick={onClose}
            className="group p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-10 max-w-4xl mx-auto">
             {/* Media Section - Immersive */}
             <div className="mb-10 rounded-3xl overflow-hidden shadow-xl ring-4 ring-slate-50 bg-slate-900">
               {article.videoUrl ? (
                 <div className="relative w-full pt-[56.25%] bg-black">
                   <iframe
                     src={getEmbedUrl(article.videoUrl) || article.videoUrl}
                     title="Video content"
                     className="absolute top-0 left-0 w-full h-full"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                   />
                 </div>
               ) : (
                 <div className="aspect-video w-full">
                   <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                 </div>
               )}
             </div>
            
            <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {article.title}
            </h2>
            
            <div className="prose prose-lg prose-slate max-w-none mb-12">
              {article.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-6 text-slate-700 text-lg leading-relaxed font-sans font-light">{paragraph}</p> : <br key={idx} />
              ))}
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between py-8 border-t border-slate-100">
               <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Reactions</span>
               </div>
               <button 
                 onClick={() => onLike(article.id)}
                 className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-slate-50 hover:bg-rose-50 transition-all duration-300 hover:scale-105 active:scale-95"
               >
                  <div className={`absolute inset-0 bg-rose-200 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`} />
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-rose-500 transition-colors" fill={article.likes > 0 ? "#f43f5e" : "none"} stroke={article.likes > 0 ? "#f43f5e" : "currentColor"} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-bold text-slate-700 group-hover:text-rose-600">{article.likes}</span>
               </button>
            </div>

            {/* Modern Discussion Section */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 mt-4">
               <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                 <span>Discussion</span>
                 <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-lg">{article.comments?.length || 0}</span>
               </h3>

               <div className="space-y-6 mb-10">
                 {article.comments && article.comments.length > 0 ? (
                   article.comments.map((comment) => (
                     <div key={comment.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 fade-in duration-500">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarGradient(comment.author)} flex items-center justify-center text-white font-bold shadow-md`}>
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between mb-1">
                             <span className="font-bold text-slate-800 text-sm">{comment.author}</span>
                             <span className="text-[10px] text-slate-400 font-medium uppercase">{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-slate-600 text-sm leading-relaxed border border-slate-100/50">
                            {comment.text}
                          </div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                     <p className="text-slate-400 font-medium">No voices yet. Be the first to speak up.</p>
                   </div>
                 )}
                 <div ref={commentEndRef} />
               </div>

               {/* Input Area */}
               <form onSubmit={handleCommentSubmit} className="relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 -m-1" />
                 <div className="relative bg-white rounded-2xl shadow-lg p-2 border border-slate-100 flex flex-col sm:flex-row gap-2">
                   <input
                     type="text"
                     placeholder="Your Name"
                     value={commentAuthor}
                     onChange={(e) => setCommentAuthor(e.target.value)}
                     className="sm:w-1/4 px-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 border-none outline-none text-sm font-bold text-slate-700 placeholder:font-normal"
                     required
                   />
                   <input 
                     type="text"
                     placeholder="Add to the debate..."
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     className="flex-1 px-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 border-none outline-none text-sm text-slate-700"
                     required
                   />
                   <button 
                     type="submit"
                     className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors text-sm shadow-lg shadow-slate-900/20"
                   >
                     Post
                   </button>
                 </div>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [articles, setArticles] = useState<Article[]>([]);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  // Initialize DB Subscription
  useEffect(() => {
    const unsubscribe = dbService.subscribe((newArticles) => {
      setArticles(newArticles);
      
      // Update reading article if open to show live comments/likes
      setReadingArticle((prev) => {
        if (!prev) return null;
        const updated = newArticles.find(a => a.id === prev.id);
        return updated || prev;
      });
    });
    
    return () => unsubscribe();
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleAddArticle = async (newArticleData: Omit<Article, 'id' | 'likes' | 'date' | 'comments'>) => {
    await dbService.addArticle(newArticleData);
    setCurrentView('NEWS');
  };

  const handleLike = async (articleId: string) => {
    await dbService.addLike(articleId);
  };

  const handleAddComment = async (articleId: string, text: string, author: string) => {
    await dbService.addComment(articleId, text, author);
  };

  const handleAuthorClick = (authorName: string) => {
    setSelectedAuthor(authorName);
    setCurrentView('AUTHOR');
    // If article modal is open, close it to show the author page under it (or transition to it)
    setReadingArticle(null); 
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <Home 
            articles={articles} 
            onNavigateNews={() => setCurrentView('NEWS')}
            onArticleClick={setReadingArticle}
            onLike={handleLike}
            onAuthorClick={handleAuthorClick}
          />
        );
      case 'NEWS':
        return (
          <NewsFeed 
            articles={articles}
            onArticleClick={setReadingArticle}
            onLike={handleLike}
            onAuthorClick={handleAuthorClick}
          />
        );
      case 'POST':
        return (
          <PostEditor 
            onSubmit={handleAddArticle}
            onCancel={() => setCurrentView('HOME')}
          />
        );
      case 'AUTHOR':
        return selectedAuthor ? (
          <AuthorProfile 
            authorName={selectedAuthor}
            allArticles={articles}
            onArticleClick={setReadingArticle}
            onBack={() => setCurrentView('NEWS')}
            onLike={handleLike}
            onAuthorClick={handleAuthorClick}
          />
        ) : <div>Author not found</div>;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
    >
      {renderView()}
      
      {readingArticle && (
        <ArticleModal 
          article={readingArticle} 
          onClose={() => setReadingArticle(null)} 
          onLike={handleLike}
          onAddComment={handleAddComment}
          onAuthorClick={handleAuthorClick}
        />
      )}
    </Layout>
  );
};

export default App;
