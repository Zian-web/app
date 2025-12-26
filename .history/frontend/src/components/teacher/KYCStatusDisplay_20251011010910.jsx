import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const KYCStatusDisplay = ({ kycStatus, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.KYC.STATUS);
      if (onRefresh) {
        onRefresh(response);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch KYC status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Review';
      default: return 'Not Submitted';
    }
  };

  const getRazorpayStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'pending_verification': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      case 'created': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (!kycStatus) {
    return (
      <Card className="border-gray-300 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-gray-600">Loading KYC status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-300 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            KYC Verification Status
          </CardTitle>
          <button
            onClick={fetchKYCStatus}
            disabled={loading}
            className="p-1 hover:bg-blue-100 rounded"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="text-center">
          <Badge className={`${getStatusColor(kycStatus.kyc_status)} text-lg px-4 py-2`}>
            <div className="flex items-center">
              {getStatusIcon(kycStatus.kyc_status)}
              <span className="ml-2">{getStatusText(kycStatus.kyc_status)}</span>
            </div>
          </Badge>
          
          {kycStatus.kyc_verification_date && (
            <p className="text-sm text-gray-600 mt-2">
              Last updated: {new Date(kycStatus.kyc_verification_date).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Document Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Uploaded Documents</h4>
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-3 rounded border ${
              kycStatus.pan_document_uploaded ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <span className="font-medium">PAN Card</span>
              <span className={`text-sm ${kycStatus.pan_document_uploaded ? 'text-green-700' : 'text-red-700'}`}>
                {kycStatus.pan_document_uploaded ? '✅ Uploaded' : '❌ Not uploaded'}
              </span>
            </div>
            
            <div className={`flex items-center justify-between p-3 rounded border ${
              kycStatus.aadhaar_document_uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className="font-medium">Aadhaar Card</span>
              <span className={`text-sm ${kycStatus.aadhaar_document_uploaded ? 'text-green-700' : 'text-gray-700'}`}>
                {kycStatus.aadhaar_document_uploaded ? '✅ Uploaded' : '❌ Not uploaded'}
              </span>
            </div>
            
            <div className={`flex items-center justify-between p-3 rounded border ${
              kycStatus.cancelled_cheque_uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className="font-medium">Cancelled Cheque</span>
              <span className={`text-sm ${kycStatus.cancelled_cheque_uploaded ? 'text-green-700' : 'text-gray-700'}`}>
                {kycStatus.cancelled_cheque_uploaded ? '✅ Uploaded' : '❌ Not uploaded'}
              </span>
            </div>
          </div>
        </div>

        {/* Razorpay Account Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Razorpay Account Status</h4>
          <div className="bg-gray-50 p-3 rounded border">
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Account ID:</span> {kycStatus.razorpay_account_id || 'Not available'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 ${getRazorpayStatusColor(kycStatus.razorpay_account_status)}`}>
                  {kycStatus.razorpay_account_status || 'Unknown'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {kycStatus.kyc_status === 'verified' && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>🎉 KYC Verification Complete!</strong> Your account has been verified and is ready to receive payments.
            </AlertDescription>
          </Alert>
        )}

        {kycStatus.kyc_status === 'rejected' && (
          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>KYC Verification Rejected.</strong> Please check your documents and upload again, or contact support for assistance.
            </AlertDescription>
          </Alert>
        )}

        {kycStatus.kyc_status === 'pending' && (
          <Alert className="border-yellow-500 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong>KYC Verification Pending.</strong> Your documents are under review. You will be notified once the verification is complete.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default KYCStatusDisplay;
