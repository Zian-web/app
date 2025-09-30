import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import TermsAndConditionsDialog from '../forms/TermsAndConditionsDialog';

const TeacherRegister = () => {
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
    district: '',
    state: '',
    pinCode: '',
    subjects: '',
    classes: '',
    board: '',
    university: '',
    socialLinks: '',
    requiresOnlinePayment: false,
    bankAccountNumber: '',
    ifscCode: '',
    accountType: '',
    bankName: '',
    governmentId: '',
    selfie: '',
    permanentAddress: '',
    correspondenceAddress: '',
    taxId: ''
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
    
    // Define required fields (excluding payment-related fields when toggle is off)
    const requiredFields = [
      'fullName', 'email', 'phoneNumber', 'whatsappNumber', 'dateOfBirth', 
      'gender', 'fullAddress', 'district', 'state', 'pinCode', 
      'subjects', 'classes', 'board', 'university'
    ];

    // Add payment-related fields only if payment service is enabled
    if (formData.requiresOnlinePayment) {
      requiredFields.push(
        'bankAccountNumber', 'ifscCode', 'accountType', 'bankName', 
        'taxId', 'governmentId', 'selfie', 'permanentAddress'
      );
    }

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
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
      // Add API call here to register teacher
      toast({
        title: "Success",
        description: "Registration successful! Please wait for admin approval.",
      });
      navigate('/login', { replace: true });
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Registration</h1>
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
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
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
                  <Label htmlFor="subjects">Subjects *</Label>
                  <Input
                    id="subjects"
                    name="subjects"
                    placeholder="e.g., Mathematics, Physics"
                    value={formData.subjects}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classes">Classes *</Label>
                  <Input
                    id="classes"
                    name="classes"
                    placeholder="e.g., Class 10, 11, 12"
                    value={formData.classes}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board">Board *</Label>
                  <Select name="board" onValueChange={(value) => handleSelectChange('board', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cbse">CBSE</SelectItem>
                      <SelectItem value="icse">ICSE</SelectItem>
                      <SelectItem value="state">State Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Input
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="socialLinks">Social Links</Label>
                  <Textarea
                    id="socialLinks"
                    name="socialLinks"
                    placeholder="Enter your social media links"
                    value={formData.socialLinks}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresOnlinePayment"
                      checked={formData.requiresOnlinePayment}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, requiresOnlinePayment: checked }))
                      }
                    />
                    <Label htmlFor="requiresOnlinePayment">Enable Online Payment Service</Label>
                  </div>
                </div>

                {formData.requiresOnlinePayment && (
                  <>
                    {/* Bank Account Details */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                      <Input
                        id="bankAccountNumber"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code *</Label>
                      <Input
                        id="ifscCode"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type *</Label>
                      <Select name="accountType" onValueChange={(value) => handleSelectChange('accountType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    {/* Identity Verification */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Identity Verification</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">PAN/Tax ID *</Label>
                      <Input
                        id="taxId"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="governmentId">Government ID (Aadhaar/Passport) *</Label>
                      <Input
                        id="governmentId"
                        name="governmentId"
                        value={formData.governmentId}
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="selfie">Photo Verification *</Label>
                      <Input
                        id="selfie"
                        name="selfie"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    {/* Address Details */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Address Details</h3>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="permanentAddress">Permanent Address *</Label>
                      <Textarea
                        id="permanentAddress"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        required={formData.requiresOnlinePayment}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="correspondenceAddress">Correspondence Address</Label>
                      <Textarea
                        id="correspondenceAddress"
                        name="correspondenceAddress"
                        value={formData.correspondenceAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
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
                      district: '',
                      state: '',
                      pinCode: '',
                      subjects: '',
                      classes: '',
                      board: '',
                      university: '',
                      socialLinks: '',
                      requiresOnlinePayment: false,
                      bankAccountNumber: '',
                      ifscCode: '',
                      accountType: '',
                      bankName: '',
                      governmentId: '',
                      selfie: '',
                      permanentAddress: '',
                      correspondenceAddress: '',
                      taxId: ''
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

export default TeacherRegister;
