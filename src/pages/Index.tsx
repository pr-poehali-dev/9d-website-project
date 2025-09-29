import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [classPhoto, setClassPhoto] = useState<string | null>(null);

  const navigationItems = [
    { id: 'main', label: 'Главная', icon: 'Home' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
    { id: 'teacher', label: 'Классный руководитель', icon: 'UserCheck' },
    { id: 'students', label: 'Ученики', icon: 'Users' },
    { id: 'homework', label: 'Домашние задания', icon: 'BookOpen' },
    { id: 'materials', label: 'Учебные материалы', icon: 'FileText' }
  ];

  const homeworkItems: Array<{subject: string; task: string; due: string; status: string}> = [];

  const materialItems: Array<{title: string; type: string; size: string}> = [];

  const newsItems: Array<{title: string; date: string; content: string}> = [];

  const students: string[] = [];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setClassPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMainSection = () => (
    <div className="space-y-8">
      {/* Заголовок класса */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900 tracking-tight">9Д</h1>
        <p className="text-xl text-gray-600">Класс активных и творческих учеников</p>
      </div>

      {/* Рамка для фото */}
      <div className="flex justify-center">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="photo-upload"
          />
          {classPhoto ? (
            <div className="relative group">
              <img 
                src={classPhoto} 
                alt="Фото класса 9Д" 
                className="w-96 h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-center">
                  <Icon name="Camera" size={32} className="mx-auto mb-2" />
                  <p>Изменить фото</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-96 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:border-primary hover:bg-blue-50 transition-colors duration-300 cursor-pointer">
              <div className="text-center text-gray-500">
                <Icon name="Camera" size={48} className="mx-auto mb-2" />
                <p className="text-lg">Добавить фото класса</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <div className="text-gray-600">Учеников в классе</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-semibold text-primary mb-2">Кристина Робертовна</div>
            <div className="text-gray-600">Классный руководитель</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNewsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Новости класса</h2>
        <Button className="flex items-center space-x-2">
          <Icon name="Plus" size={18} />
          <span>Добавить новость</span>
        </Button>
      </div>
      <div className="space-y-4">
        {newsItems.length > 0 ? (
          newsItems.map((news, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                  <Badge variant="outline">{news.date}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{news.content}</p>
              </CardContent>
            </Card>
          ))
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

  const renderTeacherSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Классный руководитель</h2>
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">Кристина Робертовна</h3>
              <p className="text-gray-600">Учитель физкультуры</p>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">kristina@school.edu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">+7 (999) 123-45-67</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Ученики класса</h2>
        <Button className="flex items-center space-x-2">
          <Icon name="Plus" size={18} />
          <span>Добавить ученика</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length > 0 ? (
          students.map((student, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{student}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-12 text-center text-gray-500">
                <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Список учеников пуст</p>
                <p>Нажмите кнопку "Добавить ученика" чтобы начать формирование списка класса</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderHomeworkSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Домашние задания</h2>
        <Button className="flex items-center space-x-2">
          <Icon name="Plus" size={18} />
          <span>Добавить задание</span>
        </Button>
      </div>
      <div className="space-y-4">
        {homeworkItems.length > 0 ? (
          homeworkItems.map((homework, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{homework.subject}</h3>
                  <Badge 
                    variant={homework.status === 'overdue' ? 'destructive' : homework.status === 'upcoming' ? 'secondary' : 'default'}
                  >
                    {homework.status === 'overdue' ? 'Просрочено' : 
                     homework.status === 'upcoming' ? 'Скоро' : 'Активно'}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{homework.task}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Срок сдачи: {homework.due}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-12 text-center text-gray-500">
              <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Домашних заданий пока нет</p>
              <p>Нажмите кнопку "Добавить задание" чтобы создать новое домашнее задание</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderMaterialsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Учебные материалы</h2>
        <Button className="flex items-center space-x-2">
          <Icon name="Plus" size={18} />
          <span>Добавить материал</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materialItems.length > 0 ? (
          materialItems.map((material, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{material.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <span>{material.type}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                    </div>
                  </div>
                  <Icon name="Download" size={20} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-12 text-center text-gray-500">
                <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Учебных материалов пока нет</p>
                <p>Нажмите кнопку "Добавить материал" чтобы загрузить первый файл</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'news': return renderNewsSection();
      case 'teacher': return renderTeacherSection();
      case 'students': return renderStudentsSection();
      case 'homework': return renderHomeworkSection();
      case 'materials': return renderMaterialsSection();
      default: return renderMainSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-1 py-4">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => setActiveSection(item.id)}
                className="flex items-center space-x-2 px-4 py-2"
              >
                <Icon name={item.icon as any} size={18} />
                <span className="hidden md:block">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;