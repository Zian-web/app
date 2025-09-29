import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '../hooks/use-toast';

const BankAccountDetailsDialog = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bankAccountNumber: '',
    ifscCode: '',
    accountType: '',
    bankName: '',
    panTaxId: '',
    governmentId: '',
    photoVerification: null,
    permanentAddress: '',
    correspondenceAddress: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photoVerification: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['bankAccountNumber', 'ifscCode', 'accountType', 'bankName', 'panTaxId', 'governmentId', 'permanentAddress'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.photoVerification) {
      toast({
        title: "Photo Verification Required",
        description: "Please upload a photo for verification.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Bank account details submitted:', formData);
    
    toast({
      title: "Success",
      description: "Bank account details updated successfully. Your account will be reviewed within 24-48 hours.",
      variant: "default"
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      bankAccountNumber: '',
      ifscCode: '',
      accountType: '',
      bankName: '',
      panTaxId: '',
      governmentId: '',
      photoVerification: null,
      permanentAddress: '',
      correspondenceAddress: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upgrade to Online Payment</DialogTitle>
          <DialogDescription>
            Please provide your bank account and verification details to enable online payment collection
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] w-full">
          <form onSubmit={handleSubmit} className="space-y-6 p-1">
            {/* Bank Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber" className="text-sm font-medium">
                    Bank Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bankAccountNumber"
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                    placeholder="Enter bank account number"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="text-sm font-medium">
                    IFSC Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ifscCode"
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    placeholder="Enter IFSC code"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType" className="text-sm font-medium">
                    Account Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="business">Business Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="text-sm font-medium">
                    Bank Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Enter bank name"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Identity Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panTaxId" className="text-sm font-medium">
                    PAN/Tax ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="panTaxId"
                    type="text"
                    value={formData.panTaxId}
                    onChange={(e) => handleInputChange('panTaxId', e.target.value)}
                    placeholder="Enter PAN/Tax ID"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="governmentId" className="text-sm font-medium">
                    Government ID (Aadhaar/Passport) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="governmentId"
                    type="text"
                    value={formData.governmentId}
                    onChange={(e) => handleInputChange('governmentId', e.target.value)}
                    placeholder="Enter government ID"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoVerification" className="text-sm font-medium">
                  Photo Verification <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="photoVerification"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Upload a clear photo of yourself for verification</p>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="permanentAddress" className="text-sm font-medium">
                  Permanent Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  placeholder="Enter your permanent address"
                  className="w-full min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="correspondenceAddress" className="text-sm font-medium">
                  Correspondence Address
                </Label>
                <Textarea
                  id="correspondenceAddress"
                  value={formData.correspondenceAddress}
                  onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
                  placeholder="Enter correspondence address (if different from permanent address)"
                  className="w-full min-h-[80px]"
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankAccountDetailsDialog;
