import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  passwordInput: string;
  setPasswordInput: (password: string) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;
  confirmPassword: () => void;
  setPendingAction: (action: (() => void) | null) => void;
}

const PasswordDialog = ({
  open,
  setOpen,
  passwordInput,
  setPasswordInput,
  passwordError,
  setPasswordError,
  confirmPassword,
  setPendingAction
}: PasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                setOpen(false);
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
  );
};

export default PasswordDialog;