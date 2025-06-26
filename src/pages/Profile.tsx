import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';

const Profile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: user?.email || '',
    age: profile?.age?.toString() || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    health_goals: profile?.health_goals || '',
    cuisine_type: profile?.cuisine_type || '',
    skill_level: profile?.skill_level || ''
  });

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await updateProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height,
        weight: formData.weight,
        health_goals: formData.health_goals,
        cuisine_type: formData.cuisine_type,
        skill_level: formData.skill_level
      });

      if (error) {
        toast.error('Failed to update profile. Please try again.');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
    toast.success('Signed out successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <User className="w-8 h-8 text-green-600" />
            <span>Profile</span>
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile information and dietary preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min="13"
                    max="120"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="text"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="5'8&quot;"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    type="text"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="160 lbs"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="health_goals">Health Goals</Label>
                <Select 
                  value={formData.health_goals}
                  onValueChange={(value) => handleInputChange('health_goals', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary health goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="weight-gain">Weight Gain</SelectItem>
                    <SelectItem value="muscle-building">Muscle Building</SelectItem>
                    <SelectItem value="general-health">General Health</SelectItem>
                    <SelectItem value="energy-boost">Energy Boost</SelectItem>
                    <SelectItem value="heart-health">Heart Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine_type">Preferred Cuisine</Label>
                  <Select 
                    value={formData.cuisine_type}
                    onValueChange={(value) => handleInputChange('cuisine_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skill_level">Cooking Skill Level</Label>
                  <Select 
                    value={formData.skill_level}
                    onValueChange={(value) => handleInputChange('skill_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h3 className="font-medium text-red-800">Delete Account</h3>
                <p className="text-sm text-red-600 mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <DeleteAccountDialog />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
