import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface MaterialItem {
  id: number;
  title: string;
  type: string;
  size: string;
  fileUrl?: string;
}

interface MaterialsSectionProps {
  materialItems: MaterialItem[];
  materialForm: { title: string; file: File | null };
  setMaterialForm: (form: { title: string; file: File | null }) => void;
  editingMaterial: { id: number; title: string } | null;
  setEditingMaterial: (material: { id: number; title: string } | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  formErrors: { [key: string]: string };
  setFormErrors: (errors: { [key: string]: string }) => void;
  handleAddMaterial: () => void;
  handleEditMaterial: (material: { id: number; title: string }) => void;
  handleDeleteMaterial: (id: number) => void;
}

const MaterialsSection = ({
  materialItems,
  materialForm,
  setMaterialForm,
  editingMaterial,
  setEditingMaterial,
  dialogOpen,
  setDialogOpen,
  formErrors,
  setFormErrors,
  handleAddMaterial,
  handleEditMaterial,
  handleDeleteMaterial
}: MaterialsSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);

  const handleOpenFile = (material: MaterialItem) => {
    if (material.fileUrl) {
      setPreviewMaterial(material);
      setPreviewDialog(true);
    }
  };

  const handleDownload = (material: MaterialItem) => {
    if (material.fileUrl) {
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return materialItems;
    
    const query = searchQuery.toLowerCase();
    return materialItems.filter(material => 
      material.title.toLowerCase().includes(query) ||
      material.type.toLowerCase().includes(query)
    );
  }, [materialItems, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Учебные материалы</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
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
      
      <div className="relative">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Поиск по названию, типу файла..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
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
                    <Button variant="ghost" size="sm" onClick={() => handleOpenFile(material)} title="Открыть файл">
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(material)} title="Скачать">
                      <Icon name="Download" size={16} />
                    </Button>
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
        ) : searchQuery ? (
          <div className="col-span-full">
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-12 text-center text-gray-500">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Ничего не найдено</p>
                <p>Попробуйте изменить поисковый запрос</p>
              </CardContent>
            </Card>
          </div>
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

      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewMaterial?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewMaterial && previewMaterial.fileUrl && (
              <div className="w-full h-full min-h-[500px]">
                {previewMaterial.type.toLowerCase().includes('pdf') ? (
                  <iframe
                    src={previewMaterial.fileUrl}
                    className="w-full h-full min-h-[500px] border-0"
                    title={previewMaterial.title}
                  />
                ) : previewMaterial.type.toLowerCase().match(/png|jpg|jpeg|gif|webp/) ? (
                  <img
                    src={previewMaterial.fileUrl}
                    alt={previewMaterial.title}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Icon name="FileText" size={64} className="text-gray-300" />
                    <p className="text-gray-500">Предпросмотр недоступен для этого типа файла</p>
                    <Button onClick={() => handleDownload(previewMaterial)} className="flex items-center space-x-2">
                      <Icon name="Download" size={18} />
                      <span>Скачать файл</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialsSection;