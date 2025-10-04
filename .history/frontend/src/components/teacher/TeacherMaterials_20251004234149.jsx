import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, FileText, Eye, Trash2, Search, Loader2, AlertTriangle } from "lucide-react";
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
import AddMaterialDialog from "../forms/AddMaterialDialog";
import PdfViewerDialog from "../common/PdfViewerDialog";
import { useToast } from "../../hooks/use-toast";
import { deleteMaterial } from "../../lib/api";
import { format } from "date-fns";

const TeacherMaterials = ({
  materials = [],
  batches = [],
  selectedBatchId = null,
  onMaterialsChange = () => {},
  isLoading = false,
  materialSearch = "",
  onSearchChange = () => {},
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter materials by search
  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(materialSearch.toLowerCase())
  );

  const handleUploadClick = () => {
    if (batches.length === 0) {
      toast({
        title: "Cannot Upload",
        description: "You must create a batch before uploading materials.",
        variant: "destructive",
      });
      return;
    }
    setIsAddDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!materialToDelete) return;
    try {
      await deleteMaterial(materialToDelete.id);
      toast({ title: "Deleted", description: "Material deleted successfully" });
      onMaterialsChange();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete material",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setMaterialToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <span>Upload</span>
          </Button>
        </div>
      </div>

      {/* Add Material Dialog */}
      {batches.length > 0 && (
        <AddMaterialDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          batchId={selectedBatchId || (batches[0] && batches[0].id)}
          onMaterialUploaded={onMaterialsChange}
          batches={batches}
        />
      )}

      {/* PDF Viewer */}
      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={viewingPdf?.access_url}
        title={viewingPdf?.title}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Material
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{materialToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Materials List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-semibold">No Materials Found</h3>
            <p className="text-sm text-muted-foreground">
              {materialSearch ? "No materials match your search." : "Upload study materials for your batch."}
            </p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{material.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">PDF</Badge>
                    <span className="text-sm text-slate-600">
                      {material.upload_date
                        ? format(new Date(material.upload_date), "PPP")
                        : "Unknown date"}
                    </span>
                  </div>
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
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherMaterials;
