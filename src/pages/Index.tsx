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
import { api } from '@/utils/api';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [classPhoto, setClassPhoto] = useState<string | null>(null);
  
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
  const [isLoading, setIsLoading] = useState(true);
  
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
    const loadData = async () => {
      try {
        const data = await api.fetchAllData();
        setClassPhoto(data.classPhoto);
        setNewsItems(data.newsItems);
        setStudents(data.students);
        setHomeworkItems(data.homeworkItems);
        setMaterialItems(data.materialItems);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target?.result as string;
        try {
          await api.updatePhoto(photoUrl);
          setClassPhoto(photoUrl);
        } catch (error) {
          console.error('Error updating photo:', error);
        }
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

  const validateStudentForm = () => {
    const errors: {[key: string]: string} = {};
    if (!studentForm.name.trim()) errors.studentName = 'Имя обязательно';
    if (studentForm.name.length < 2) errors.studentName = 'Имя должно содержать минимум 2 символа';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStudent = () => {
    if (!validateStudentForm()) return;
    
    const executeAction = async () => {
      try {
        if (editingStudent) {
          await api.updateStudent(editingStudent.id, studentForm.name);
          setStudents(students.map(item => 
            item.id === editingStudent.id 
              ? { ...item, name: studentForm.name }
              : item
          ));
          setEditingStudent(null);
        } else {
          const response = await api.addStudent(studentForm.name);
          const newStudent = {
            id: response.id,
            name: studentForm.name
          };
          setStudents([...students, newStudent]);
        }
        setStudentForm({ name: '' });
        setDialogOpen({...dialogOpen, student: false});
        setFormErrors({});
      } catch (error) {
        console.error('Error saving student:', error);
      }
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
    checkPassword(async () => {
      try {
        await api.deleteStudent(id);
        setStudents(students.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
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
    
    const executeAction = async () => {
      try {
        if (editingHomework) {
          await api.updateHomework(editingHomework.id, homeworkForm.subject, homeworkForm.task, homeworkForm.due, 'active');
          setHomeworkItems(homeworkItems.map(item => 
            item.id === editingHomework.id 
              ? { ...item, subject: homeworkForm.subject, task: homeworkForm.task, due: homeworkForm.due }
              : item
          ));
          setEditingHomework(null);
        } else {
          const response = await api.addHomework(homeworkForm.subject, homeworkForm.task, homeworkForm.due, 'active');
          const newHomework = {
            id: response.id,
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
      } catch (error) {
        console.error('Error saving homework:', error);
      }
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
    checkPassword(async () => {
      try {
        await api.deleteHomework(id);
        setHomeworkItems(homeworkItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting homework:', error);
      }
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
    
    const executeAction = async () => {
      try {
        if (editingMaterial) {
          await api.updateMaterial(editingMaterial.id, materialForm.title);
          setMaterialItems(materialItems.map(item => 
            item.id === editingMaterial.id 
              ? { ...item, title: materialForm.title }
              : item
          ));
          setEditingMaterial(null);
        } else if (materialForm.file) {
          const type = materialForm.file.name.split('.').pop()?.toUpperCase() || 'FILE';
          const size = `${Math.round(materialForm.file.size / 1024)} КБ`;
          const response = await api.addMaterial(materialForm.title, type, size);
          const newMaterial = {
            id: response.id,
            title: materialForm.title,
            type: type,
            size: size
          };
          setMaterialItems([newMaterial, ...materialItems]);
        }
        setMaterialForm({ title: '', file: null });
        setDialogOpen({...dialogOpen, material: false});
        setFormErrors({});
      } catch (error) {
        console.error('Error saving material:', error);
      }
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
    checkPassword(async () => {
      try {
        await api.deleteMaterial(id);
        setMaterialItems(materialItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting material:', error);
      }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

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