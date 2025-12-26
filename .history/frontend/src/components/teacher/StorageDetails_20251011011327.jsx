import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  HardDrive, 
  FileText, 
  Folder, 
  Download, 
  Eye, 
  RefreshCw, 
  ExternalLink,
  BarChart3,
  Database,
  Image,
  File
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const StorageDetails = () => {
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchStorageDetails();
  }, []);

  const fetchStorageDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.STORAGE.DETAILS);
      setStorageData(response);
    } catch (error) {
      console.error('Error fetching storage details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch storage details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'tiff':
      case 'webp':
        return <Image className="w-4 h-4 text-blue-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'kyc_files':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'document_files':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'material_files':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'profile_files':
        return <Image className="w-4 h-4 text-orange-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'kyc_files':
        return 'KYC Documents';
      case 'document_files':
        return 'General Documents';
      case 'material_files':
        return 'Study Materials';
      case 'profile_files':
        return 'Profile Files';
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'kyc_files':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'document_files':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'material_files':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'profile_files':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="border-gray-300 bg-gray-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Loading storage details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!storageData) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardContent className="p-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-700">Failed to load storage details</p>
            <Button onClick={fetchStorageDetails} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Storage Details</h2>
          <p className="text-gray-600">Your S3 storage organization and usage</p>
        </div>
        <Button onClick={fetchStorageDetails} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Teacher Info */}
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Teacher Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Teacher ID:</span>
              <p className="font-medium">{storageData.teacher_id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Name:</span>
              <p className="font-medium">{storageData.teacher_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* S3 Structure */}
      <Card className="border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Folder className="w-5 h-5 mr-2" />
            S3 Folder Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border">
              <span className="text-sm text-gray-600">Base Folder:</span>
              <p className="font-mono text-sm">{storageData.s3_structure.base_folder}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <span className="text-sm text-gray-600">KYC Folder:</span>
                <p className="font-mono text-sm">{storageData.s3_structure.kyc_folder}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="text-sm text-gray-600">Documents Folder:</span>
                <p className="font-mono text-sm">{storageData.s3_structure.documents_folder}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="text-sm text-gray-600">Materials Folder:</span>
                <p className="font-mono text-sm">{storageData.s3_structure.materials_folder}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="text-sm text-gray-600">Profile Folder:</span>
                <p className="font-mono text-sm">{storageData.s3_structure.profile_folder}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Statistics */}
      <Card className="border-purple-300 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Storage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-white p-4 rounded border">
              <div className="text-2xl font-bold text-purple-600">
                {storageData.storage_stats.total_files}
              </div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="text-center bg-white p-4 rounded border">
              <div className="text-2xl font-bold text-purple-600">
                {storageData.storage_stats.total_size_mb} MB
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
            <div className="text-center bg-white p-4 rounded border">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(storageData.storage_stats.categories).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Files by Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(storageData.storage_stats.categories).map(([category, count]) => (
                <div key={category} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getCategoryIcon(category)}
                      <span className="ml-2 font-medium">{getCategoryName(category)}</span>
                    </div>
                    <Badge className={getCategoryColor(category)}>
                      {count} files
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files by Category */}
      <Card className="border-gray-300 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            Files by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(storageData.files_by_category).map(([category, files]) => (
              <div key={category} className="border rounded-lg">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {getCategoryIcon(category)}
                    <span className="ml-2 font-medium">{getCategoryName(category)}</span>
                    <Badge className={`ml-3 ${getCategoryColor(category)}`}>
                      {files.length} files
                    </Badge>
                  </div>
                  <span className="text-gray-500">
                    {expandedCategories[category] ? '▼' : '▶'}
                  </span>
                </button>
                
                {expandedCategories[category] && (
                  <div className="border-t bg-white">
                    {files.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No files in this category
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center">
                              {getFileIcon(file.name || file.file_name)}
                              <span className="ml-2 text-sm font-medium">
                                {file.name || file.file_name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {file.size && (
                                <span className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </span>
                              )}
                              {file.url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(file.url, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KYC Documents */}
      {storageData.kyc_documents && (
        <Card className="border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              KYC Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(storageData.kyc_documents).map(([docType, url]) => (
                <div key={docType} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-green-500 mr-2" />
                      <span className="font-medium capitalize">
                        {docType.replace('_', ' ')} Document
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = docType;
                          link.click();
                        }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Tips */}
      <Alert className="border-blue-500 bg-blue-50">
        <HardDrive className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <strong>Storage Tips:</strong> Your files are organized in S3 buckets by category. 
          KYC documents are stored securely and are only accessible to you and our verification team.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StorageDetails;
