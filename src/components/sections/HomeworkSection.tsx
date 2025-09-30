import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface HomeworkItem {
  id: number;
  subject: string;
  task: string;
  due: string;
  status: string;
}

interface HomeworkSectionProps {
  homeworkItems: HomeworkItem[];
  homeworkForm: { subject: string; task: string; due: string };
  setHomeworkForm: (form: { subject: string; task: string; due: string }) => void;
  editingHomework: { id: number; subject: string; task: string; due: string } | null;
  setEditingHomework: (homework: { id: number; subject: string; task: string; due: string } | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  formErrors: { [key: string]: string };
  setFormErrors: (errors: { [key: string]: string }) => void;
  handleAddHomework: () => void;
  handleEditHomework: (homework: { id: number; subject: string; task: string; due: string }) => void;
  handleDeleteHomework: (id: number) => void;
}

const HomeworkSection = ({
  homeworkItems,
  homeworkForm,
  setHomeworkForm,
  editingHomework,
  setEditingHomework,
  dialogOpen,
  setDialogOpen,
  formErrors,
  setFormErrors,
  handleAddHomework,
  handleEditHomework,
  handleDeleteHomework
}: HomeworkSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Домашние задания</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
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
};

export default HomeworkSection;