import { api } from '@/utils/api';

export const validateStudentForm = (
  studentForm: { name: string },
  setFormErrors: (errors: {[key: string]: string}) => void
) => {
  const errors: {[key: string]: string} = {};
  if (!studentForm.name.trim()) errors.studentName = 'Имя обязательно';
  if (studentForm.name.length < 2) errors.studentName = 'Имя должно содержать минимум 2 символа';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

export const createStudentHandlers = (
  studentForm: { name: string },
  setStudentForm: (form: { name: string }) => void,
  students: Array<{id: number; name: string}>,
  setStudents: (items: Array<{id: number; name: string}>) => void,
  editingStudent: {id: number; name: string} | null,
  setEditingStudent: (student: {id: number; name: string} | null) => void,
  dialogOpen: {[key: string]: boolean},
  setDialogOpen: (open: {[key: string]: boolean}) => void,
  setFormErrors: (errors: {[key: string]: string}) => void,
  checkPassword: (action: () => void) => void
) => {
  const handleAddStudent = () => {
    if (!validateStudentForm(studentForm, setFormErrors)) return;
    
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

  return {
    handleAddStudent,
    handleEditStudent,
    handleDeleteStudent
  };
};
