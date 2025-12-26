import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const KYCUploadForm = ({ onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [formData, setFormData] = useState({
    pan_document: null,
    aadhaar_document: null,
    cancelled_cheque: null
  });
  const { toast } = useToast();

  const handleFileChange = (field, file) => {
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, JPG, PNG, or other supported formats",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.pan_document) {
      toast({
        title: "Required Field Missing",
        description: "PAN document is required",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const uploadFormData = new FormData();
      
      // Add files to form data
      if (formData.pan_document) {
        uploadFormData.append('pan_document', formData.pan_document);
      }
      
      if (formData.aadhaar_document) {
        uploadFormData.append('aadhaar_document', formData.aadhaar_document);
      }
      
      if (formData.cancelled_cheque) {
        uploadFormData.append('cancelled_cheque', formData.cancelled_cheque);
      }

      const response = await api.post(ENDPOINTS.KYC.UPLOAD, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response) {
        setUploadStatus('success');
        toast({
          title: "Success",
          description: "KYC documents uploaded successfully",
        });
        
        // Reset form
        setFormData({
          pan_document: null,
          aadhaar_document: null,
          cancelled_cheque: null
        });
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      
      // Handle specific error cases
      if (error.message && error.message.includes('File too large')) {
        toast({
          title: "Upload Failed",
          description: "File size must be less than 10MB",
          variant: "destructive"
        });
      } else if (error.message && error.message.includes('Invalid file type')) {
        toast({
          title: "Upload Failed",
          description: "Please upload PDF, JPG, PNG, or other supported formats",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload documents. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const getFileSize = (file) => {
    if (!file) return '';
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  };

  return (
    <Card className="border-blue-500 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload KYC Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Upload clear, high-quality images or PDFs. 
            Documents will be used for account verification with Razorpay.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PAN Document */}
          <div className="space-y-2">
            <Label htmlFor="pan_document" className="text-sm font-medium">
              PAN Card Document *
            </Label>
            <Input
              id="pan_document"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
              onChange={(e) => handleFileChange('pan_document', e.target.files[0])}
              className="mt-1"
            />
            {formData.pan_document && (
              <div className="flex items-center justify-between bg-green-50 p-2 rounded border">
                <span className="text-sm text-green-700">
                  {formData.pan_document.name} ({getFileSize(formData.pan_document)})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('pan_document')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Upload a clear image or PDF of your PAN card
            </p>
          </div>

          {/* Aadhaar Document */}
          <div className="space-y-2">
            <Label htmlFor="aadhaar_document" className="text-sm font-medium">
              Aadhaar Card Document (Optional)
            </Label>
            <Input
              id="aadhaar_document"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
              onChange={(e) => handleFileChange('aadhaar_document', e.target.files[0])}
              className="mt-1"
            />
            {formData.aadhaar_document && (
              <div className="flex items-center justify-between bg-green-50 p-2 rounded border">
                <span className="text-sm text-green-700">
                  {formData.aadhaar_document.name} ({getFileSize(formData.aadhaar_document)})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('aadhaar_document')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Upload a clear image or PDF of your Aadhaar card
            </p>
          </div>

          {/* Cancelled Cheque */}
          <div className="space-y-2">
            <Label htmlFor="cancelled_cheque" className="text-sm font-medium">
              Cancelled Cheque (Optional)
            </Label>
            <Input
              id="cancelled_cheque"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
              onChange={(e) => handleFileChange('cancelled_cheque', e.target.files[0])}
              className="mt-1"
            />
            {formData.cancelled_cheque && (
              <div className="flex items-center justify-between bg-green-50 p-2 rounded border">
                <span className="text-sm text-green-700">
                  {formData.cancelled_cheque.name} ({getFileSize(formData.cancelled_cheque)})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('cancelled_cheque')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Upload a clear image or PDF of your cancelled cheque
            </p>
          </div>

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Documents uploaded successfully!</strong> Your KYC verification is now pending review.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Upload failed.</strong> Please check your files and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={uploading || !formData.pan_document}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default KYCUploadForm;
