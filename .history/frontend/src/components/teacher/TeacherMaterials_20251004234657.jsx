import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Eye, Trash2, Loader2 } from "lucide-react";
import PdfViewerDialog from "../common/PdfViewerDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useToast } from "../../hooks/use-toast";

const TeacherMaterials = ({ materials = [], onDeleteMaterial, isLoading }) => {
  const [viewingPdf, setViewingPdf] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Group materials by batch name
  const groupedMaterials = materials.reduce((acc, material) => {
    const batchName = material.batch?.name || "Unknown Batch";
    if (!acc[batchName]) acc[batchName] = [];
    acc[batchName].push(material);
    return acc;
  }, {});

  // Sort batch names alphabetically
  const sortedBatchNames = Object.keys(groupedMaterials).sort();

  const handleDelete = async () => {
    if (!materialToDelete) return;
    try {
      await onDeleteMaterial(materialToDelete.id);
      toast({ title: "Success", description: "Material deleted successfully" });
      setIsDeleteDialogOpen(false);
      setMaterialToDelete(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete material", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={viewingPdf?.file_url}
        title={viewingPdf?.title}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{materialToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : sortedBatchNames.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No materials found.</p>
        </div>
      ) : (
        sortedBatchNames.map((batchName) => (
          <div key={batchName} className="space-y-4">
            <h3 className="text-xl font-semibold">{batchName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMaterials[batchName].map((material) => (
                <Card key={material.id}>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{material.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(material.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setViewingPdf(material)}>
                        <Eye className="w-4 h-4" />
                        <span className="ml-2 hidden sm:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => {
                          setMaterialToDelete(material);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="ml-2 hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherMaterials;
