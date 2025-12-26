import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, CheckCircle, AlertTriangle, ExternalLink, ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import KYCUploadForm from './KYCUploadForm';
import KYCStatusDisplay from './KYCStatusDisplay';
import AccountStatusDisplay from './AccountStatusDisplay';
import StorageDetails from './StorageDetails';

const KYCPage = ({ onBack }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllStatus();
  }, []);

  const fetchAllStatus = async () => {
    try {
      setLoading(true);
      
      // Fetch both KYC and account status in parallel
      const [kycResponse, accountResponse] = await Promise.all([
        fetch('/api/teacher/kyc-status', {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : null).catch(() => null),
        
        fetch('/api/teacher/account-status', {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : null).catch(() => null)
      ]);
      
      setKycStatus(kycResponse);
      setAccountStatus(accountResponse);
    } catch (error) {
      console.error('Error fetching status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch account status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (response) => {
    setShowUploadForm(false);
    fetchAllStatus(); // Refresh all status
    toast({
      title: "Success",
      description: "Documents uploaded successfully. KYC verification is now pending.",
    });
  };

  const handleRefresh = () => {
    fetchAllStatus();
  };

  if (loading) {
    return (
      <Card className="border-gray-300 bg-gray-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Loading account and KYC status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account & KYC Verification</h1>
            <p className="text-gray-600">Manage your account status and KYC documents</p>
          </div>
        </div>
      </div>

      {/* Account Status Dashboard */}
      <AccountStatusDisplay 
        accountStatus={accountStatus} 
        onRefresh={handleRefresh}
      />

      {/* KYC Status */}
      <KYCStatusDisplay 
        kycStatus={kycStatus} 
        onRefresh={handleRefresh}
      />

      {/* Upload Section */}
      {kycStatus?.kyc_status !== 'verified' && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showUploadForm ? (
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  {kycStatus?.kyc_status === 'pending' 
                    ? 'Update your KYC documents or upload additional documents.'
                    : 'Upload your KYC documents to complete account verification.'
                  }
                </p>
                <Button 
                  onClick={() => setShowUploadForm(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {kycStatus?.kyc_status === 'pending' ? 'Update Documents' : 'Upload Documents'}
                </Button>
              </div>
            ) : (
              <KYCUploadForm onSuccess={handleUploadSuccess} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {kycStatus?.kyc_status === 'verified' && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>🎉 KYC Verification Complete!</strong> Your account has been verified and is ready to receive payments.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {accountStatus?.account_status === 'not_created' && (
          <Button 
            onClick={() => window.location.href = '/teacher/razorpay-account'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Create Razorpay Account
          </Button>
        )}
        
        {accountStatus?.account_status === 'rejected' && (
          <Button 
            onClick={() => window.location.href = '/teacher/support'}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        )}

        {accountStatus?.account_status === 'active' && (
          <Button 
            onClick={() => window.location.href = '/teacher/batches'}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Go to Batches
          </Button>
        )}

        <Button 
          onClick={fetchAllStatus}
          variant="outline"
          className="border-gray-300"
        >
          Refresh Status
        </Button>
      </div>

      {/* Help Section */}
      <Card className="border-gray-300 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Document Requirements</h4>
                <p className="text-sm text-gray-600">
                  Upload clear, high-quality images or PDFs of your PAN card, Aadhaar card, and cancelled cheque.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Verification Process</h4>
                <p className="text-sm text-gray-600">
                  Documents are reviewed by our team and Razorpay. This process typically takes 1-3 business days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Support</h4>
                <p className="text-sm text-gray-600">
                  If you have questions or need assistance, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCPage;
