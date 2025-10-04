import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, FileText, Eye, Trash2, Search, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import AddMaterialDialog from '../forms/AddMaterialDialog';
import PdfViewerDialog from '../common/PdfViewerDialog';
import { useToast } from '../../hooks/use-toast';
import { deleteMaterial } from '../../lib/api';
import { format } from 'date-fns';

const TeacherMaterials = ({
  materials = [],
  batches = [],
  selectedBatchId = null,
  onMaterialsChange = () => {},
  isLoading = false,
  materialSearch = '',
  onSearchChange = () => {},
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(null);
  const { toast } = useToast();

  const getBatchName = (batchId) => {
    const batch = batches.find((b) => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const filteredMaterials = materials.filter(
    (material) =>
      (!selectedBatchId || material.batch_id === selectedBatchId) &&
      (material.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
        getBatchName(material.batch_id).toLowerCase().includes(materialSearch.toLowerCase()))
  );

  const handleUploadClick = () => {
    if (batches.length === 0) {
      toast({
        title: 'Cannot Upload',
        description: 'You must create a batch before uploading materials.',
        variant: 'destructive',
      });
      return;
    }
    setIsAddDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!materialToDelete) return;

    try {
      await deleteMaterial(materialToDelete.id);
      toast({
        title: 'Success',
        description: 'Material deleted successfully',
      });
      onMaterialsChange();
      setIsDeleteDialogOpen(false);
      setMaterialToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete material',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">All Study Materials</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={materialSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          <Button onClick={handleUploadClick} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Upload Material</span>
          </Button>
        </div>
      </div>

      {batches.length > 0 && (
        <AddMaterialDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          batchId={selectedBatchId || (batches[0] && batches[0].id)}
          onMaterialUploaded={() => onMaterialsChange()}
          batches={batches}
        />
      )}

      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={viewingPdf?.pdfUrl}
        title={viewingPdf?.title}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this study material.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-semibold">No Materials Found</h3>
            <p className="text-sm text-muted-foreground">
              {materialSearch
                ? 'No materials match your search criteria'
                : 'Start by adding study materials for your batch'}
            </p>
          </div>
        ) : (
          filteredMaterials.map((material) => {
            const fullUrl = material.file_url?.startsWith('http')
              ? material.file_url
              : `http://localhost:8000${material.file_url}`;

            return (
              <Card key={material.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="flex-1 text-base font-semibold line-clamp-1">
                    {material.title}
                  </CardTitle>
                  <div className="flex items-start gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setViewingPdf({ pdfUrl: fullUrl, title: material.title })
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setMaterialToDelete(material);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Batch: {getBatchName(material.batch_id)}</p>
                    <p className="text-muted-foreground">
                      Uploaded:{' '}
                      {material.upload_date
                        ? format(new Date(material.upload_date), 'PPP')
                        : 'Unknown date'}
                    </p>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{material.file_type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeacherMaterials;
