import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface NewsSectionProps {
  newsItems: NewsItem[];
  newsForm: { title: string; content: string };
  setNewsForm: (form: { title: string; content: string }) => void;
  editingNews: { id: number; title: string; content: string } | null;
  setEditingNews: (news: { id: number; title: string; content: string } | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  formErrors: { [key: string]: string };
  setFormErrors: (errors: { [key: string]: string }) => void;
  handleAddNews: () => void;
  handleEditNews: (news: NewsItem) => void;
  handleDeleteNews: (id: number) => void;
}

const NewsSection = ({
  newsItems,
  newsForm,
  setNewsForm,
  editingNews,
  setEditingNews,
  dialogOpen,
  setDialogOpen,
  formErrors,
  setFormErrors,
  handleAddNews,
  handleEditNews,
  handleDeleteNews
}: NewsSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return newsItems;
    
    const query = searchQuery.toLowerCase();
    return newsItems.filter(news => 
      news.title.toLowerCase().includes(query) ||
      news.date.toLowerCase().includes(query) ||
      news.content.toLowerCase().includes(query)
    );
  }, [newsItems, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Новости класса</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setNewsForm({ title: '', content: '' });
            setEditingNews(null);
            setFormErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Icon name="Plus" size={18} />
              <span>Добавить новость</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Редактировать новость' : 'Добавить новость'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="news-title">Заголовок</Label>
                <Input
                  id="news-title"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  placeholder="Введите заголовок новости"
                  className={formErrors.newsTitle ? 'border-red-500' : ''}
                />
                {formErrors.newsTitle && <p className="text-red-500 text-sm mt-1">{formErrors.newsTitle}</p>}
              </div>
              <div>
                <Label htmlFor="news-content">Содержание</Label>
                <Textarea
                  id="news-content"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                  placeholder="Введите содержание новости"
                  rows={4}
                  className={formErrors.newsContent ? 'border-red-500' : ''}
                />
                {formErrors.newsContent && <p className="text-red-500 text-sm mt-1">{formErrors.newsContent}</p>}
              </div>
              <Button onClick={handleAddNews} className="w-full">
                {editingNews ? 'Сохранить изменения' : 'Добавить новость'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Поиск по новостям, дате..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((news) => (
            <Card key={news.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{news.date}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditNews(news)}>
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteNews(news.id)}>
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{news.content}</p>
              </CardContent>
            </Card>
          ))
        ) : searchQuery ? (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-12 text-center text-gray-500">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Ничего не найдено</p>
              <p>Попробуйте изменить поисковый запрос</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-12 text-center text-gray-500">
              <Icon name="Newspaper" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Новостей пока нет</p>
              <p>Нажмите кнопку "Добавить новость" чтобы создать первую запись</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewsSection;