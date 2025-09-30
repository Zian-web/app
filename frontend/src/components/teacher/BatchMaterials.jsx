import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, Download, Trash2 } from 'lucide-react';

const BatchMaterials = ({ materials, userRole, onDeleteMaterial }) => {
  return (
    <div className="grid gap-4">
      {materials.map(material => (
        <Card key={material.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{material.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{material.type}</Badge>
                  <span className="text-sm text-slate-600">{material.uploadDate}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">View</span>
                </Button>
                {userRole === 'student' && (
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Download</span>
                  </Button>
                )}
                {userRole === 'teacher' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteMaterial(material.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Delete</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BatchMaterials;
