import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import TermsAndConditionsDialog from '../TermsAndConditionsDialog';

const StudentRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: '',
    fullAddress: '',
    pinCode: '',
    class: '',
    year: '',
    institutionName: '',
    parentsName: '',
    parentsPhone: ''
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
    
    // Add validation here
    if (!Object.values(formData).every(value => value)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Show terms dialog instead of directly registering
    setShowTermsDialog(true);
  };

  const handleTermsAccept = async () => {
    setShowTermsDialog(false);
    
    try {
      // Add API call here to register student
      toast({
        title: "Success",
        description: "Registration successful! Please wait for admin approval.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTermsDecline = () => {
    setShowTermsDialog(false);
    toast({
      title: "Terms Required",
      description: "You must accept the terms and conditions to complete registration.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
          <p className="text-gray-600 mt-2">Please fill in your details to create an account</p>
        </div>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
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
                  <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)}>
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
                  <Select name="class" onValueChange={(value) => handleSelectChange('class', value)}>
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

              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        whatsappNumber: '',
                        dateOfBirth: '',
                        gender: '',
                        fullAddress: '',
                        pinCode: '',
                        class: '',
                        year: '',
                        institutionName: '',
                        parentsName: '',
                        parentsPhone: ''
                    });
                    navigate('/login');
                  }}
                >
                  Back to Login
                </Button>
                <Button type="submit">
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <TermsAndConditionsDialog
        isOpen={showTermsDialog}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    </div>
  );
};

export default StudentRegister;
