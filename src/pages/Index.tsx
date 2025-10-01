import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MainSection from '@/components/sections/MainSection';
import NewsSection from '@/components/sections/NewsSection';
import TeacherSection from '@/components/sections/TeacherSection';
import StudentsSection from '@/components/sections/StudentsSection';
import HomeworkSection from '@/components/sections/HomeworkSection';
import MaterialsSection from '@/components/sections/MaterialsSection';
import PasswordDialog from '@/components/PasswordDialog';
import { useClassData } from '@/hooks/useClassData';
import { usePasswordAuth } from '@/hooks/usePasswordAuth';
import { createNewsHandlers } from '@/handlers/newsHandlers';
import { createStudentHandlers } from '@/handlers/studentHandlers';
import { createHomeworkHandlers } from '@/handlers/homeworkHandlers';
import { createMaterialHandlers } from '@/handlers/materialHandlers';
import { createPhotoHandler } from '@/handlers/photoHandlers';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');
  
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

  const {
    classPhoto,
    setClassPhoto,
    newsItems,
    setNewsItems,
    students,
    setStudents,
    homeworkItems,
    setHomeworkItems,
    materialItems,
    setMaterialItems,
    isLoading
  } = useClassData();

  const {
    passwordDialog,
    setPasswordDialog,
    passwordInput,
    setPasswordInput,
    passwordError,
    setPasswordError,
    checkPassword,
    confirmPassword,
    setPendingAction
  } = usePasswordAuth();
  
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

  const { handlePhotoUpload } = createPhotoHandler(setClassPhoto);

  const {
    handleAddNews,
    handleEditNews,
    handleDeleteNews
  } = createNewsHandlers(
    newsForm,
    setNewsForm,
    newsItems,
    setNewsItems,
    editingNews,
    setEditingNews,
    dialogOpen,
    setDialogOpen,
    setFormErrors,
    checkPassword
  );

  const {
    handleAddStudent,
    handleEditStudent,
    handleDeleteStudent
  } = createStudentHandlers(
    studentForm,
    setStudentForm,
    students,
    setStudents,
    editingStudent,
    setEditingStudent,
    dialogOpen,
    setDialogOpen,
    setFormErrors,
    checkPassword
  );

  const {
    handleAddHomework,
    handleEditHomework,
    handleDeleteHomework
  } = createHomeworkHandlers(
    homeworkForm,
    setHomeworkForm,
    homeworkItems,
    setHomeworkItems,
    editingHomework,
    setEditingHomework,
    dialogOpen,
    setDialogOpen,
    setFormErrors,
    checkPassword
  );

  const {
    handleAddMaterial,
    handleEditMaterial,
    handleDeleteMaterial
  } = createMaterialHandlers(
    materialForm,
    setMaterialForm,
    materialItems,
    setMaterialItems,
    editingMaterial,
    setEditingMaterial,
    dialogOpen,
    setDialogOpen,
    setFormErrors,
    checkPassword
  );

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
