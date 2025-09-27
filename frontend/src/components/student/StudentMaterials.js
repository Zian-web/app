import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, Download } from 'lucide-react';

const StudentMaterials = ({ materials }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Study Materials</h2>
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
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Download</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentMaterials;