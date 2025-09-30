import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';

const TeacherSettings = () => {
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
    district: user.district || '',
    state: user.state || '',
    pinCode: user.pinCode || '',
    subjects: user.subjects || '',
    classes: user.classes || '',
    board: user.board || '',
    university: user.university || '',
    socialLinks: user.socialLinks || '',
    requiresOnlinePayment: user.requiresOnlinePayment || false,
    bankAccountNumber: user.bankAccountNumber || '',
    ifscCode: user.ifscCode || '',
    accountType: user.accountType || '',
    bankName: user.bankName || '',
    governmentId: user.governmentId || '',
    selfie: user.selfie || '',
    permanentAddress: user.permanentAddress || '',
    correspondenceAddress: user.correspondenceAddress || '',
    taxId: user.taxId || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, requiresOnlinePayment: checked }));
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
        district: formData.district,
        state: formData.state,
        pinCode: formData.pinCode,
        subjects: formData.subjects,
        classes: formData.classes,
        board: formData.board,
        university: formData.university,
        socialLinks: formData.socialLinks,
        requiresOnlinePayment: formData.requiresOnlinePayment,
        bankAccountNumber: formData.bankAccountNumber,
        ifscCode: formData.ifscCode,
        accountType: formData.accountType,
        bankName: formData.bankName,
        governmentId: formData.governmentId,
        selfie: formData.selfie,
        permanentAddress: formData.permanentAddress,
        correspondenceAddress: formData.correspondenceAddress,
        taxId: formData.taxId
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
                <Select name="board" value={formData.board} onValueChange={(value) => handleSelectChange('board', value)}>
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
                    onCheckedChange={handleSwitchChange}
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
                    <Select name="accountType" value={formData.accountType} onValueChange={(value) => handleSelectChange('accountType', value)}>
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

export default TeacherSettings;
