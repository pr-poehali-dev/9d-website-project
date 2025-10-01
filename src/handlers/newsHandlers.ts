import { api } from '@/utils/api';

export const validateNewsForm = (
  newsForm: { title: string; content: string },
  setFormErrors: (errors: {[key: string]: string}) => void
) => {
  const errors: {[key: string]: string} = {};
  if (!newsForm.title.trim()) errors.newsTitle = 'Заголовок обязателен';
  if (newsForm.title.length < 3) errors.newsTitle = 'Заголовок должен содержать минимум 3 символа';
  if (!newsForm.content.trim()) errors.newsContent = 'Содержание обязательно';
  if (newsForm.content.length < 10) errors.newsContent = 'Содержание должно содержать минимум 10 символов';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

export const createNewsHandlers = (
  newsForm: { title: string; content: string },
  setNewsForm: (form: { title: string; content: string }) => void,
  newsItems: Array<{id: number; title: string; date: string; content: string}>,
  setNewsItems: (items: Array<{id: number; title: string; date: string; content: string}>) => void,
  editingNews: {id: number; title: string; content: string} | null,
  setEditingNews: (news: {id: number; title: string; content: string} | null) => void,
  dialogOpen: {[key: string]: boolean},
  setDialogOpen: (open: {[key: string]: boolean}) => void,
  setFormErrors: (errors: {[key: string]: string}) => void,
  checkPassword: (action: () => void) => void
) => {
  const handleAddNews = () => {
    if (!validateNewsForm(newsForm, setFormErrors)) return;
    
    const executeAction = async () => {
      try {
        if (editingNews) {
          await api.updateNews(editingNews.id, newsForm.title, newsForm.content);
          setNewsItems(newsItems.map(item => 
            item.id === editingNews.id 
              ? { ...item, title: newsForm.title, content: newsForm.content }
              : item
          ));
          setEditingNews(null);
        } else {
          const date = new Date().toLocaleDateString('ru-RU');
          const response = await api.addNews(newsForm.title, newsForm.content, date);
          const newNews = {
            id: response.id,
            title: newsForm.title,
            content: newsForm.content,
            date: date
          };
          setNewsItems([newNews, ...newsItems]);
        }
        setNewsForm({ title: '', content: '' });
        setDialogOpen({...dialogOpen, news: false});
        setFormErrors({});
      } catch (error) {
        console.error('Error saving news:', error);
      }
    };
    
    checkPassword(executeAction);
  };
  
  const handleEditNews = (news: {id: number; title: string; date: string; content: string}) => {
    checkPassword(() => {
      setEditingNews(news);
      setNewsForm({ title: news.title, content: news.content });
      setDialogOpen({...dialogOpen, news: true});
    });
  };
  
  const handleDeleteNews = (id: number) => {
    checkPassword(async () => {
      try {
        await api.deleteNews(id);
        setNewsItems(newsItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    });
  };

  return {
    handleAddNews,
    handleEditNews,
    handleDeleteNews
  };
};
