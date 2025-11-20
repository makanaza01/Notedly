import React, { useState } from 'react';
import { Article, Category } from '../types';
import { draftArticleWithAI, polishContentWithAI } from '../services/geminiService';

interface PostEditorProps {
  onSubmit: (article: Omit<Article, 'id' | 'likes' | 'date' | 'comments'>) => void;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ onSubmit, onCancel }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Article State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<Category>(Category.DEBATE);
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`);
  const [videoUrl, setVideoUrl] = useState('');
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<'none' | 'draft' | 'polish'>('none');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'debate2025') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect access code. Please ask the club president.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      summary,
      author: author || 'Notedly Contributor',
      category,
      imageUrl,
      videoUrl: videoUrl || undefined
    });
  };

  const handleAIDraft = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const result = await draftArticleWithAI(aiPrompt);
    setIsGenerating(false);
    
    if (result) {
      setTitle(result.title);
      setContent(result.content);
      setSummary(result.summary);
      setAiMode('none');
      setAiPrompt('');
    }
  };

  const handleAIPolish = async () => {
    if (!content) return;
    setIsGenerating(true);
    const polished = await polishContentWithAI(content);
    setIsGenerating(false);
    if (polished) {
      setContent(polished);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-slate-200 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-school-100 text-school-600 mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Contributor Access</h2>
        <p className="text-slate-500 mb-6">This area is restricted to Notedly editors and contributors.</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter access code"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-school-500 focus:border-transparent transition-all text-center tracking-widest"
            />
            {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-school-900 text-white font-bold rounded-lg hover:bg-school-800 transition-colors"
          >
            Unlock Editor
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Post Article</h1>
          <p className="text-slate-500 mt-1">Share debate topics, news, or club videos.</p>
        </div>
        
        {/* AI Toolbar Toggle */}
        <div className="flex space-x-2">
           <button 
            type="button"
            onClick={() => setAiMode(aiMode === 'draft' ? 'none' : 'draft')}
            className={`flex items-center px-4 py-2 rounded-lg border font-medium transition-colors ${
              aiMode === 'draft' 
              ? 'bg-purple-100 border-purple-300 text-purple-700' 
              : 'bg-white border-slate-300 text-slate-600 hover:bg-purple-50 hover:text-purple-600'
            }`}
           >
             <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             AI Assistant
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          
          {/* AI Draft Panel */}
          {aiMode === 'draft' && (
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100 animate-fade-in">
              <label className="block text-sm font-bold text-purple-800 mb-2">
                ✨ AI Writer
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., 'Write a debate opening about school uniforms...'"
                  className="flex-grow rounded-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                />
                <button 
                  type="button"
                  onClick={handleAIDraft}
                  disabled={isGenerating || !aiPrompt}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  {isGenerating ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Generate'}
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500"
              placeholder="Enter an engaging title"
            />
          </div>

          {/* Author & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Member Name</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Short Summary</label>
             <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500 text-sm"
                placeholder="A brief overview..."
             />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Article Body</label>
              <button 
                type="button" 
                onClick={handleAIPolish}
                disabled={!content || isGenerating}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center disabled:opacity-50"
              >
                 {isGenerating ? 'Polishing...' : '✨ AI Polish Grammar'}
              </button>
            </div>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500 font-serif leading-relaxed"
              placeholder="Write your story here..."
            />
          </div>

          {/* Media Links */}
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500 text-sm text-slate-500"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Video URL (YouTube)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border-slate-300 focus:border-school-500 focus:ring-school-500 text-sm text-slate-500"
                />
                <p className="text-xs text-slate-400 mt-1">Optional: Add a YouTube link to embed a video.</p>
             </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 rounded-lg bg-school-600 text-white hover:bg-school-700 font-bold shadow-md transition-all transform active:scale-95"
            >
              Publish Post
            </button>
          </div>
        </form>

        {/* Preview Panel */}
        <div className="hidden lg:block space-y-4">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Preview</h3>
           <div className="pointer-events-none transform scale-95 origin-top">
             <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
                <div className="h-40 bg-gray-200 relative">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                   <span className="absolute top-3 left-3 px-2 py-1 bg-school-600 text-white text-[10px] font-bold uppercase rounded-full">
                    {category}
                  </span>
                </div>
                <div className="p-4">
                   <div className="flex items-center text-xs text-slate-500 mb-2">
                    <span>{new Date().toLocaleDateString()}</span>
                    <span className="mx-1">•</span>
                    <span>{author || 'Author'}</span>
                   </div>
                   <h4 className="font-serif font-bold text-slate-900 mb-2 leading-snug">
                     {title || 'Your Title Here'}
                   </h4>
                   <p className="text-xs text-slate-600 line-clamp-3">
                     {summary || 'Summary text will appear here...'}
                   </p>
                   {videoUrl && (
                     <div className="mt-2 text-xs text-blue-500 font-semibold flex items-center">
                       <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                       Video Attached
                     </div>
                   )}
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PostEditor;