
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

      // Finally, delete the user account from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) {
        console.error('Error deleting user:', authError);
        toast.error('Failed to delete account. Please contact support.');
        setIsDeleting(false);
        return;
      }

      // Sign out and redirect
      await supabase.auth.signOut();
      toast.success('Account deleted successfully');
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
            Delete Account Permanently
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action cannot be undone. This will permanently delete your account 
              and remove all your data from our servers.
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
        </AlertDialog Header>
        
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
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
