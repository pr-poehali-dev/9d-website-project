import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MainSection from '@/components/sections/MainSection';
import NewsSection from '@/components/sections/NewsSection';
import TeacherSection from '@/components/sections/TeacherSection';
import StudentsSection from '@/components/sections/StudentsSection';
import HomeworkSection from '@/components/sections/HomeworkSection';
import MaterialsSection from '@/components/sections/MaterialsSection';
import PasswordDialog from '@/components/PasswordDialog';

const Index = () => {
  const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const [activeSection, setActiveSection] = useState('main');
  const [classPhoto, setClassPhoto] = useState<string | null>(() => loadFromLocalStorage('classPhoto', null));
  
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

  const [homeworkItems, setHomeworkItems] = useState<Array<{id: number; subject: string; task: string; due: string; status: string}>>(() => 
    loadFromLocalStorage('homeworkItems', [])
  );
  const [materialItems, setMaterialItems] = useState<Array<{id: number; title: string; type: string; size: string}>>(() => 
    loadFromLocalStorage('materialItems', [])
  );
  const [newsItems, setNewsItems] = useState<Array<{id: number; title: string; date: string; content: string}>>(() => 
    loadFromLocalStorage('newsItems', [])
  );
  const [students, setStudents] = useState<Array<{id: number; name: string}>>(() => 
    loadFromLocalStorage('students', [])
  );
  
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

  useEffect(() => {
    localStorage.setItem('classPhoto', JSON.stringify(classPhoto));
  }, [classPhoto]);

  useEffect(() => {
    localStorage.setItem('newsItems', JSON.stringify(newsItems));
  }, [newsItems]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('homeworkItems', JSON.stringify(homeworkItems));
  }, [homeworkItems]);

  useEffect(() => {
    localStorage.setItem('materialItems', JSON.stringify(materialItems));
  }, [materialItems]);
  
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

  const renderContent = () => {
    switch (activeSection) {
      case 'news': 
        return (
          <NewsSection 
            newsItems={newsItems}
            newsForm={newsForm}
            setNewsForm={setNewsForm}
            editingNews={editingNews}
            setEditingNews={setEditingNews}
            dialogOpen={dialogOpen.news}
            setDialogOpen={(open) => setDialogOpen({...dialogOpen, news: open})}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            handleAddNews={handleAddNews}
            handleEditNews={handleEditNews}
            handleDeleteNews={handleDeleteNews}
          />
        );
      case 'teacher': 
        return <TeacherSection />;
      case 'students': 
        return (
          <StudentsSection 
            students={students}
            studentForm={studentForm}
            setStudentForm={setStudentForm}
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent}
            dialogOpen={dialogOpen.student}
            setDialogOpen={(open) => setDialogOpen({...dialogOpen, student: open})}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            handleAddStudent={handleAddStudent}
            handleEditStudent={handleEditStudent}
            handleDeleteStudent={handleDeleteStudent}
          />
        );
      case 'homework': 
        return (
          <HomeworkSection 
            homeworkItems={homeworkItems}
            homeworkForm={homeworkForm}
            setHomeworkForm={setHomeworkForm}
            editingHomework={editingHomework}
            setEditingHomework={setEditingHomework}
            dialogOpen={dialogOpen.homework}
            setDialogOpen={(open) => setDialogOpen({...dialogOpen, homework: open})}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            handleAddHomework={handleAddHomework}
            handleEditHomework={handleEditHomework}
            handleDeleteHomework={handleDeleteHomework}
          />
        );
      case 'materials': 
        return (
          <MaterialsSection 
            materialItems={materialItems}
            materialForm={materialForm}
            setMaterialForm={setMaterialForm}
            editingMaterial={editingMaterial}
            setEditingMaterial={setEditingMaterial}
            dialogOpen={dialogOpen.material}
            setDialogOpen={(open) => setDialogOpen({...dialogOpen, material: open})}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            handleAddMaterial={handleAddMaterial}
            handleEditMaterial={handleEditMaterial}
            handleDeleteMaterial={handleDeleteMaterial}
          />
        );
      default: 
        return (
          <MainSection 
            students={students}
            classPhoto={classPhoto}
            handlePhotoUpload={handlePhotoUpload}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      
      <PasswordDialog 
        open={passwordDialog}
        setOpen={setPasswordDialog}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        confirmPassword={confirmPassword}
        setPendingAction={setPendingAction}
      />
    </div>
  );
};

export default Index;