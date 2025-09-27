import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const TeacherMaterials = ({ materials, getBatchName, materialSearch, onSearchChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Study Materials</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search materials..."
            value={materialSearch}
            onChange={onSearchChange}
            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Upload Material</span>
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map(material => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>{getBatchName(material.batchId)}</TableCell>
                    <TableCell><Badge variant="outline">{material.type}</Badge></TableCell>
                    <TableCell>{material.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherMaterials;