import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle, Clock, CreditCard, User, BarChart3, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const AccountStatusDisplay = ({ accountStatus, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAccountStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.KYC.ACCOUNT_STATUS);
      if (onRefresh) {
        onRefresh(response);
      }
    } catch (error) {
      console.error('Error fetching account status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch account status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccountStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'not_created': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'offline_only': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccountStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      case 'not_created': return <User className="w-4 h-4" />;
      case 'offline_only': return <CreditCard className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAccountStatusText = (status) => {
    switch (status) {
      case 'active': return 'Account Active';
      case 'pending': return 'Pending Verification';
      case 'rejected': return 'Account Rejected';
      case 'not_created': return 'Create Account';
      case 'offline_only': return 'Offline Payments Only';
      default: return 'Unknown Status';
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

  if (!accountStatus) {
    return (
      <Card className="border-gray-300 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-gray-600">Loading account status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-300 bg-green-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Account Status Dashboard
          </CardTitle>
          <button
            onClick={fetchAccountStatus}
            disabled={loading}
            className="p-1 hover:bg-green-100 rounded"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="text-center space-y-3">
          <Badge className={`${getAccountStatusColor(accountStatus.account_status)} text-lg px-4 py-2`}>
            <div className="flex items-center">
              {getAccountStatusIcon(accountStatus.account_status)}
              <span className="ml-2">{getAccountStatusText(accountStatus.account_status)}</span>
            </div>
          </Badge>
          
          <p className="text-gray-700">{accountStatus.status_message}</p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            accountStatus.can_receive_online_payments 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <CreditCard className="w-4 h-4 mr-2" />
            {accountStatus.can_receive_online_payments ? 'Online Payments Enabled' : 'Online Payments Disabled'}
          </div>
        </div>

        {/* Requirements */}
        {accountStatus.requirements && accountStatus.requirements.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-3">Next Steps Required:</h4>
            <ul className="space-y-2">
              {accountStatus.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center text-yellow-700">
                  <span className="mr-2">📋</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Teacher Info */}
        {accountStatus.teacher_info && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Teacher Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="font-medium">{accountStatus.teacher_info.full_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{accountStatus.teacher_info.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Online Payment Required:</span>
                <p className="font-medium">{accountStatus.teacher_info.requires_online_payment ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Razorpay Account Details */}
        {accountStatus.razorpay_account && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-3">Razorpay Account</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Account Exists:</span>
                <span className="font-medium">{accountStatus.razorpay_account.exists ? 'Yes' : 'No'}</span>
              </div>
              {accountStatus.razorpay_account.exists && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Account ID:</span>
                    <span className="font-medium text-xs">{accountStatus.razorpay_account.account_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Status:</span>
                    <span className={`font-medium ${getRazorpayStatusColor(accountStatus.razorpay_account.status)}`}>
                      {accountStatus.razorpay_account.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Created:</span>
                    <span className="font-medium text-xs">
                      {new Date(accountStatus.razorpay_account.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* KYC Status */}
        {accountStatus.kyc_status && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-3">KYC Verification</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Status:</span>
                <span className={`font-medium ${
                  accountStatus.kyc_status.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {accountStatus.kyc_status.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center">
                  <p className="text-sm text-purple-700">📄 PAN</p>
                  <span className={`text-lg ${accountStatus.kyc_status.pan_uploaded ? 'text-green-600' : 'text-red-600'}`}>
                    {accountStatus.kyc_status.pan_uploaded ? '✅' : '❌'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-purple-700">🆔 Aadhaar</p>
                  <span className={`text-lg ${accountStatus.kyc_status.aadhaar_uploaded ? 'text-green-600' : 'text-red-600'}`}>
                    {accountStatus.kyc_status.aadhaar_uploaded ? '✅' : '❌'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-purple-700">🏦 Cheque</p>
                  <span className={`text-lg ${accountStatus.kyc_status.cheque_uploaded ? 'text-green-600' : 'text-red-600'}`}>
                    {accountStatus.kyc_status.cheque_uploaded ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Statistics */}
        {accountStatus.account_stats && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Account Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-gray-800">
                  {accountStatus.account_stats.total_batches}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Total Batches</div>
              </div>
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-gray-800">
                  {accountStatus.account_stats.active_subscriptions}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Active Subscriptions</div>
              </div>
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-sm font-bold text-gray-800">
                  {new Date(accountStatus.account_stats.account_created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Account Created</div>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {accountStatus.account_status === 'active' && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>🎉 Account Fully Active!</strong> You can now create batches and receive online payments from students.
            </AlertDescription>
          </Alert>
        )}

        {accountStatus.account_status === 'rejected' && (
          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Account Rejected.</strong> Please contact support for assistance with your account verification.
            </AlertDescription>
          </Alert>
        )}

        {accountStatus.account_status === 'pending' && (
          <Alert className="border-yellow-500 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong>Account Pending Verification.</strong> Your account is under review. You will be notified once verification is complete.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountStatusDisplay;
