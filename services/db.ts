
import { Article, Comment } from '../types';
import { INITIAL_ARTICLES } from '../constants';

class DatabaseService {
  private listeners: ((articles: Article[]) => void)[] = [];
  private articles: Article[] = [];

  constructor() {
    this.loadLocal();
  }

  // Subscribe components to data changes
  public subscribe(callback: (articles: Article[]) => void) {
    this.listeners.push(callback);
    callback(this.articles); // Immediate update
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.articles));
  }

  private loadLocal() {
    try {
      const saved = localStorage.getItem('notedly_articles');
      this.articles = saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch (e) {
      this.articles = INITIAL_ARTICLES;
    }
    this.notifyListeners();
  }

  private saveLocal() {
    localStorage.setItem('notedly_articles', JSON.stringify(this.articles));
    this.notifyListeners();
  }

  public async addArticle(article: Omit<Article, 'id' | 'likes' | 'date' | 'comments'>) {
    const newArticle = {
      ...article,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    this.articles = [newArticle, ...this.articles];
    this.saveLocal();
  }

  public async addLike(articleId: string) {
    this.articles = this.articles.map(art => 
      art.id === articleId ? { ...art, likes: art.likes + 1 } : art
    );
    this.saveLocal();
  }

  public async addComment(articleId: string, text: string, author: string) {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author,
      date: new Date().toISOString()
    };
    this.articles = this.articles.map(art => 
      art.id === articleId ? { ...art, comments: [...art.comments, newComment] } : art
    );
    this.saveLocal();
  }
}

export const dbService = new DatabaseService();
