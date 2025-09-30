import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
}

interface StudentsSectionProps {
  students: Student[];
  studentForm: { name: string };
  setStudentForm: (form: { name: string }) => void;
  editingStudent: { id: number; name: string } | null;
  setEditingStudent: (student: { id: number; name: string } | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  formErrors: { [key: string]: string };
  setFormErrors: (errors: { [key: string]: string }) => void;
  handleAddStudent: () => void;
  handleEditStudent: (student: Student) => void;
  handleDeleteStudent: (id: number) => void;
}

const StudentsSection = ({
  students,
  studentForm,
  setStudentForm,
  editingStudent,
  setEditingStudent,
  dialogOpen,
  setDialogOpen,
  formErrors,
  setFormErrors,
  handleAddStudent,
  handleEditStudent,
  handleDeleteStudent
}: StudentsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Ученики класса</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
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
};

export default StudentsSection;