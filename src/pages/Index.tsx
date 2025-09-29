import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');

  const navigationItems = [
    { id: 'main', label: 'Главная', icon: 'Home' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
    { id: 'teacher', label: 'Классный руководитель', icon: 'UserCheck' },
    { id: 'students', label: 'Ученики', icon: 'Users' },
    { id: 'homework', label: 'Домашние задания', icon: 'BookOpen' },
    { id: 'materials', label: 'Учебные материалы', icon: 'FileText' }
  ];

  const homeworkItems = [
    { subject: 'Математика', task: 'Решить уравнения №45-50', due: '2024-10-01', status: 'active' },
    { subject: 'Русский язык', task: 'Написать сочинение по произведению', due: '2024-10-03', status: 'active' },
    { subject: 'История', task: 'Изучить параграф 12', due: '2024-09-30', status: 'overdue' },
    { subject: 'Физика', task: 'Лабораторная работа №3', due: '2024-10-05', status: 'upcoming' }
  ];

  const materialItems = [
    { title: 'Расписание занятий', type: 'PDF', size: '156 КБ' },
    { title: 'Учебный план', type: 'DOC', size: '245 КБ' },
    { title: 'Презентация по биологии', type: 'PPT', size: '2.1 МБ' },
    { title: 'Карта для географии', type: 'PNG', size: '890 КБ' }
  ];

  const newsItems = [
    { title: 'Экскурсия в музей', date: '2024-09-25', content: 'Планируется посещение исторического музея 15 октября' },
    { title: 'Родительское собрание', date: '2024-09-20', content: 'Состоится 5 октября в 18:00 в актовом зале' },
    { title: 'Школьная олимпиада', date: '2024-09-15', content: 'Регистрация на олимпиаду по математике открыта до 30 сентября' }
  ];

  const students = [
    'Алексеев Дмитрий', 'Белова Анна', 'Васильев Игорь', 'Григорьева Мария',
    'Данилов Артем', 'Егорова Елена', 'Жуков Максим', 'Захарова София',
    'Иванов Александр', 'Козлова Виктория', 'Лебедев Никита', 'Михайлова Дарья',
    'Новиков Владислав', 'Орлова Полина', 'Петров Егор', 'Романова Ксения',
    'Смирнов Андрей', 'Титова Анастасия', 'Федоров Денис', 'Чернова Алиса',
    'Абрамов Артур', 'Боброва Елизавета', 'Волков Матвей', 'Герасимова Ульяна',
    'Дорофеев Кирилл', 'Ермолаева Варвара', 'Зайцев Роман', 'Калинина Милана',
    'Лапин Тимофей', 'Назарова Злата'
  ];

  const renderMainSection = () => (
    <div className="space-y-8">
      {/* Заголовок класса */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900 tracking-tight">9Д</h1>
        <p className="text-xl text-gray-600">Класс активных и творческих учеников</p>
      </div>

      {/* Фото класса */}
      <div className="flex justify-center">
        <div className="relative group">
          <img 
            src="/img/b048508a-8eeb-4976-a88c-7ab7fadcffef.jpg" 
            alt="Фото класса 9Д" 
            className="w-96 h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">30</div>
            <div className="text-gray-600">Учеников в классе</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.2</div>
            <div className="text-gray-600">Средний балл</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNewsSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Новости класса</h2>
      <div className="space-y-4">
        {newsItems.map((news, index) => (
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
        ))}
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
              <h3 className="text-2xl font-semibold text-gray-900">Иванова Елена Сергеевна</h3>
              <p className="text-gray-600">Учитель математики и физики</p>
              <p className="text-gray-600">Стаж работы: 15 лет</p>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">ivanova@school.edu</span>
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
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Ученики класса</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student, index) => (
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
        ))}
      </div>
    </div>
  );

  const renderHomeworkSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Домашние задания</h2>
      <div className="space-y-4">
        {homeworkItems.map((homework, index) => (
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
        ))}
      </div>
    </div>
  );

  const renderMaterialsSection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Учебные материалы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materialItems.map((material, index) => (
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
        ))}
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