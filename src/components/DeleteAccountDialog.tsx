
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const DeleteAccountDialog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [open, setOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || confirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    
    try {
      // First, delete user's recipes
      const { error: recipesError } = await supabase
        .from('recipes')
        .delete()
        .eq('user_id', user.id);

      if (recipesError) {
        console.error('Error deleting recipes:', recipesError);
        toast.error('Failed to delete account data. Please try again.');
        setIsDeleting(false);
        return;
      }

      // Then delete the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast.error('Failed to delete account data. Please try again.');
        setIsDeleting(false);
        return;
      }

      // Finally, sign out the user - this effectively "deletes" their session
      // Note: We cannot delete the auth user from client side for security reasons
      // The user account will remain in auth.users but will be inaccessible
      await supabase.auth.signOut();
      
      toast.success('Account data deleted successfully. You have been signed out.');
      navigate('/');
      
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
      setOpen(false);
      setConfirmText('');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Delete Account Data
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action will permanently delete your account data and sign you out.
            </p>
            <p className="font-medium">
              All of the following will be permanently deleted:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Your profile information</li>
              <li>All saved recipes</li>
              <li>Your account preferences</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="mt-1"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => {
              setConfirmText('');
              setOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={confirmText !== 'DELETE' || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account Data'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
