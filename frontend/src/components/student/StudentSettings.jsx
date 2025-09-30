import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

const StudentSettings = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: user.name || '',
    email: user.email || '',
    phoneNumber: user.phone || '',
    whatsappNumber: user.whatsapp || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    fullAddress: user.address || '',
    pinCode: user.pinCode || '',
    class: user.class || '',
    year: user.year || '',
    institutionName: user.institution || '',
    parentsName: user.parentsName || '',
    parentsPhone: user.parentsPhone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real application, this would be an API call to update the user's profile
      // For now, we'll just update the context state
      const updatedUser = {
        ...user,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        whatsapp: formData.whatsappNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.fullAddress,
        pinCode: formData.pinCode,
        class: formData.class,
        year: formData.year,
        institution: formData.institutionName,
        parentsName: formData.parentsName,
        parentsPhone: formData.parentsPhone
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <Input
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinCode">Pin Code *</Label>
                <Input
                  id="pinCode"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select name="class" value={formData.class} onValueChange={(value) => handleSelectChange('class', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        Class {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name *</Label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  placeholder="School/College name"
                  value={formData.institutionName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentsName">Parent's Name *</Label>
                <Input
                  id="parentsName"
                  name="parentsName"
                  value={formData.parentsName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentsPhone">Parent's Phone *</Label>
                <Input
                  id="parentsPhone"
                  name="parentsPhone"
                  value={formData.parentsPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSettings;
