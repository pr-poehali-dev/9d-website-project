import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [classPhoto, setClassPhoto] = useState<string | null>(null);
  
  // Form states
  const [newsForm, setNewsForm] = useState({ title: '', content: '' });
  const [studentForm, setStudentForm] = useState({ name: '' });
  const [homeworkForm, setHomeworkForm] = useState({ subject: '', task: '', due: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', file: null as File | null });

  const navigationItems = [
    { id: 'main', label: 'Главная', icon: 'Home' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
    { id: 'teacher', label: 'Классный руководитель', icon: 'UserCheck' },
    { id: 'students', label: 'Ученики', icon: 'Users' },
    { id: 'homework', label: 'Домашние задания', icon: 'BookOpen' },
    { id: 'materials', label: 'Учебные материалы', icon: 'FileText' }
  ];

  const [homeworkItems, setHomeworkItems] = useState<Array<{id: number; subject: string; task: string; due: string; status: string}>>([]);

  const [materialItems, setMaterialItems] = useState<Array<{id: number; title: string; type: string; size: string}>>([]);

  const [newsItems, setNewsItems] = useState<Array<{id: number; title: string; date: string; content: string}>>([]);

  const [students, setStudents] = useState<Array<{id: number; name: string}>>([]);
  
  const [editingNews, setEditingNews] = useState<{id: number; title: string; content: string} | null>(null);
  const [editingStudent, setEditingStudent] = useState<{id: number; name: string} | null>(null);
  const [editingHomework, setEditingHomework] = useState<{id: number; subject: string; task: string; due: string} | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<{id: number; title: string} | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState({
    news: false,
    student: false,
    homework: false,
    material: false
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  const ADMIN_PASSWORD = '6745Q-';
  
  const checkPassword = (action: () => void) => {
    setPendingAction(() => action);
    setPasswordDialog(true);
    setPasswordInput('');
    setPasswordError('');
  };
  
  const confirmPassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      if (pendingAction) pendingAction();
      setPasswordDialog(false);
      setPasswordInput('');
      setPasswordError('');
      setPendingAction(null);
    } else {
      setPasswordError('Неверный пароль');
    }
  };

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

  // Form handlers
  const validateNewsForm = () => {
    const errors: {[key: string]: string} = {};
    if (!newsForm.title.trim()) errors.newsTitle = 'Заголовок обязателен';
    if (newsForm.title.length < 3) errors.newsTitle = 'Заголовок должен содержать минимум 3 символа';
    if (!newsForm.content.trim()) errors.newsContent = 'Содержание обязательно';
    if (newsForm.content.length < 10) errors.newsContent = 'Содержание должно содержать минимум 10 символов';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddNews = () => {
    if (!validateNewsForm()) return;
    
    const executeAction = () => {
      if (editingNews) {
        setNewsItems(newsItems.map(item => 
          item.id === editingNews.id 
            ? { ...item, title: newsForm.title, content: newsForm.content }
            : item
        ));
        setEditingNews(null);
      } else {
        const newNews = {
          id: Date.now(),
          title: newsForm.title,
          content: newsForm.content,
          date: new Date().toLocaleDateString('ru-RU')
        };
        setNewsItems([newNews, ...newsItems]);
      }
      setNewsForm({ title: '', content: '' });
      setDialogOpen({...dialogOpen, news: false});
      setFormErrors({});
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
    checkPassword(() => {
      setNewsItems(newsItems.filter(item => item.id !== id));
    });
  };

  const validateStudentForm = () => {
    const errors: {[key: string]: string} = {};
    if (!studentForm.name.trim()) errors.studentName = 'Имя обязательно';
    if (studentForm.name.length < 2) errors.studentName = 'Имя должно содержать минимум 2 символа';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStudent = () => {
    if (!validateStudentForm()) return;
    
    const executeAction = () => {
      if (editingStudent) {
        setStudents(students.map(item => 
          item.id === editingStudent.id 
            ? { ...item, name: studentForm.name }
            : item
        ));
        setEditingStudent(null);
      } else {
        const newStudent = {
          id: Date.now(),
          name: studentForm.name
        };
        setStudents([...students, newStudent]);
      }
      setStudentForm({ name: '' });
      setDialogOpen({...dialogOpen, student: false});
      setFormErrors({});
    };
    
    checkPassword(executeAction);
  };
  
  const handleEditStudent = (student: {id: number; name: string}) => {
    checkPassword(() => {
      setEditingStudent(student);
      setStudentForm({ name: student.name });
      setDialogOpen({...dialogOpen, student: true});
    });
  };
  
  const handleDeleteStudent = (id: number) => {
    checkPassword(() => {
      setStudents(students.filter(item => item.id !== id));
    });
  };

  const validateHomeworkForm = () => {
    const errors: {[key: string]: string} = {};
    if (!homeworkForm.subject.trim()) errors.homeworkSubject = 'Предмет обязателен';
    if (!homeworkForm.task.trim()) errors.homeworkTask = 'Задание обязательно';
    if (homeworkForm.task.length < 5) errors.homeworkTask = 'Задание должно содержать минимум 5 символов';
    if (!homeworkForm.due) errors.homeworkDue = 'Дата сдачи обязательна';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddHomework = () => {
    if (!validateHomeworkForm()) return;
    
    const executeAction = () => {
      if (editingHomework) {
        setHomeworkItems(homeworkItems.map(item => 
          item.id === editingHomework.id 
            ? { ...item, subject: homeworkForm.subject, task: homeworkForm.task, due: homeworkForm.due }
            : item
        ));
        setEditingHomework(null);
      } else {
        const newHomework = {
          id: Date.now(),
          subject: homeworkForm.subject,
          task: homeworkForm.task,
          due: homeworkForm.due,
          status: 'active'
        };
        setHomeworkItems([newHomework, ...homeworkItems]);
      }
      setHomeworkForm({ subject: '', task: '', due: '' });
      setDialogOpen({...dialogOpen, homework: false});
      setFormErrors({});
    };
    
    checkPassword(executeAction);
  };
  
  const handleEditHomework = (homework: {id: number; subject: string; task: string; due: string}) => {
    checkPassword(() => {
      setEditingHomework(homework);
      setHomeworkForm({ subject: homework.subject, task: homework.task, due: homework.due });
      setDialogOpen({...dialogOpen, homework: true});
    });
  };
  
  const handleDeleteHomework = (id: number) => {
    checkPassword(() => {
      setHomeworkItems(homeworkItems.filter(item => item.id !== id));
    });
  };

  const validateMaterialForm = () => {
    const errors: {[key: string]: string} = {};
    if (!materialForm.title.trim()) errors.materialTitle = 'Название обязательно';
    if (!editingMaterial && !materialForm.file) errors.materialFile = 'Файл обязателен';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMaterial = () => {
    if (!validateMaterialForm()) return;
    
    const executeAction = () => {
      if (editingMaterial) {
        setMaterialItems(materialItems.map(item => 
          item.id === editingMaterial.id 
            ? { ...item, title: materialForm.title }
            : item
        ));
        setEditingMaterial(null);
      } else if (materialForm.file) {
        const newMaterial = {
          id: Date.now(),
          title: materialForm.title,
          type: materialForm.file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: `${Math.round(materialForm.file.size / 1024)} КБ`
        };
        setMaterialItems([newMaterial, ...materialItems]);
      }
      setMaterialForm({ title: '', file: null });
      setDialogOpen({...dialogOpen, material: false});
      setFormErrors({});
    };
    
    checkPassword(executeAction);
  };
  
  const handleEditMaterial = (material: {id: number; title: string}) => {
    checkPassword(() => {
      setEditingMaterial(material);
      setMaterialForm({ title: material.title, file: null });
      setDialogOpen({...dialogOpen, material: true});
    });
  };
  
  const handleDeleteMaterial = (id: number) => {
    checkPassword(() => {
      setMaterialItems(materialItems.filter(item => item.id !== id));
    });
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
            <div className="text-3xl font-bold text-primary mb-2">{students.length}</div>
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
        <Dialog open={dialogOpen.news} onOpenChange={(open) => {
          setDialogOpen({...dialogOpen, news: open});
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
      <div className="space-y-4">
        {newsItems.length > 0 ? (
          newsItems.map((news, index) => (
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
        <Dialog open={dialogOpen.student} onOpenChange={(open) => {
          setDialogOpen({...dialogOpen, student: open});
          if (!open) {
            setStudentForm({ name: '' });
            setEditingStudent(null);
            setFormErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Icon name="Plus" size={18} />
              <span>Добавить ученика</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Редактировать ученика' : 'Добавить ученика'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student-name">Имя и фамилия</Label>
                <Input
                  id="student-name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                  placeholder="Введите имя и фамилию ученика"
                  className={formErrors.studentName ? 'border-red-500' : ''}
                />
                {formErrors.studentName && <p className="text-red-500 text-sm mt-1">{formErrors.studentName}</p>}
              </div>
              <Button onClick={handleAddStudent} className="w-full">
                {editingStudent ? 'Сохранить изменения' : 'Добавить ученика'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length > 0 ? (
          students.map((student, index) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{student.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)}>
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </Button>
                  </div>
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
        <Dialog open={dialogOpen.homework} onOpenChange={(open) => {
          setDialogOpen({...dialogOpen, homework: open});
          if (!open) {
            setHomeworkForm({ subject: '', task: '', due: '' });
            setEditingHomework(null);
            setFormErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Icon name="Plus" size={18} />
              <span>Добавить задание</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHomework ? 'Редактировать задание' : 'Добавить домашнее задание'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="homework-subject">Предмет</Label>
                <Input
                  id="homework-subject"
                  value={homeworkForm.subject}
                  onChange={(e) => setHomeworkForm({...homeworkForm, subject: e.target.value})}
                  placeholder="Введите название предмета"
                  className={formErrors.homeworkSubject ? 'border-red-500' : ''}
                />
                {formErrors.homeworkSubject && <p className="text-red-500 text-sm mt-1">{formErrors.homeworkSubject}</p>}
              </div>
              <div>
                <Label htmlFor="homework-task">Задание</Label>
                <Textarea
                  id="homework-task"
                  value={homeworkForm.task}
                  onChange={(e) => setHomeworkForm({...homeworkForm, task: e.target.value})}
                  placeholder="Описание домашнего задания"
                  rows={3}
                  className={formErrors.homeworkTask ? 'border-red-500' : ''}
                />
                {formErrors.homeworkTask && <p className="text-red-500 text-sm mt-1">{formErrors.homeworkTask}</p>}
              </div>
              <div>
                <Label htmlFor="homework-due">Срок сдачи</Label>
                <Input
                  id="homework-due"
                  type="date"
                  value={homeworkForm.due}
                  onChange={(e) => setHomeworkForm({...homeworkForm, due: e.target.value})}
                  className={formErrors.homeworkDue ? 'border-red-500' : ''}
                />
                {formErrors.homeworkDue && <p className="text-red-500 text-sm mt-1">{formErrors.homeworkDue}</p>}
              </div>
              <Button onClick={handleAddHomework} className="w-full">
                {editingHomework ? 'Сохранить изменения' : 'Добавить задание'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {homeworkItems.length > 0 ? (
          homeworkItems.map((homework) => (
            <Card key={homework.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{homework.subject}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={homework.status === 'overdue' ? 'destructive' : homework.status === 'upcoming' ? 'secondary' : 'default'}
                    >
                      {homework.status === 'overdue' ? 'Просрочено' : 
                       homework.status === 'upcoming' ? 'Скоро' : 'Активно'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditHomework(homework)}>
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteHomework(homework.id)}>
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </Button>
                  </div>
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
        <Dialog open={dialogOpen.material} onOpenChange={(open) => {
          setDialogOpen({...dialogOpen, material: open});
          if (!open) {
            setMaterialForm({ title: '', file: null });
            setEditingMaterial(null);
            setFormErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Icon name="Plus" size={18} />
              <span>Добавить материал</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMaterial ? 'Редактировать материал' : 'Добавить учебный материал'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="material-title">Название материала</Label>
                <Input
                  id="material-title"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                  placeholder="Введите название материала"
                  className={formErrors.materialTitle ? 'border-red-500' : ''}
                />
                {formErrors.materialTitle && <p className="text-red-500 text-sm mt-1">{formErrors.materialTitle}</p>}
              </div>
              {!editingMaterial && (
                <div>
                  <Label htmlFor="material-file">Файл</Label>
                  <Input
                    id="material-file"
                    type="file"
                    onChange={(e) => setMaterialForm({...materialForm, file: e.target.files?.[0] || null})}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                    className={formErrors.materialFile ? 'border-red-500' : ''}
                  />
                  {formErrors.materialFile && <p className="text-red-500 text-sm mt-1">{formErrors.materialFile}</p>}
                </div>
              )}
              <Button onClick={handleAddMaterial} className="w-full">
                {editingMaterial ? 'Сохранить изменения' : 'Добавить материал'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materialItems.length > 0 ? (
          materialItems.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow duration-300">
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
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditMaterial(material)}>
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMaterial(material.id)}>
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </Button>
                  </div>
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
      
      {/* Диалог ввода пароля */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введите пароль администратора</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmPassword()}
                placeholder="Введите пароль"
                className={passwordError ? 'border-red-500' : ''}
                autoFocus
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="flex space-x-2">
              <Button onClick={confirmPassword} className="flex-1">
                Подтвердить
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setPasswordDialog(false);
                  setPasswordInput('');
                  setPasswordError('');
                  setPendingAction(null);
                }} 
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;