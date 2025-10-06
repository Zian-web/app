import React, { useState, useEffect } from "react";
import {
    getMyBatches,
    deleteMaterial,
    uploadMaterial,
    getMaterialPresignedUrl,
    api
} from "../../lib/api";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Trash2, UploadCloud, AlertTriangle } from "lucide-react";
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
import PdfViewerDialog from "../common/PdfViewerDialog";
import { useToast } from "../../hooks/use-toast";


const TeacherMaterials = () => {
  const [groupedMaterials, setGroupedMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchGroupedMaterials = async () => {
    try {
      const res = await api.get("/api/teacher/materials/grouped");
      setGroupedMaterials(res);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      toast({ title: "Error", description: "Failed to fetch materials.", variant: "destructive" });
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await getMyBatches();
      setBatches(res);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      toast({ title: "Error", description: "Failed to fetch your batches.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchGroupedMaterials();
    fetchBatches();
  }, []);

  const handleDeleteMaterial = async (id) => {
    try {
      await deleteMaterial(id);
      toast({ title: "Success", description: "Material deleted successfully." });
      fetchGroupedMaterials(); // Refresh list
    } catch (err) {
      console.error("Failed to delete material:", err);
      toast({ title: "Error", description: "Failed to delete material.", variant: "destructive" });
    }
  };

  const handleViewMaterial = async (material) => {
    try {
        const response = await getMaterialPresignedUrl(material.id);
        setViewingPdf({ ...material, access_url: response.access_url });
    } catch (error) {
        console.error("Error getting presigned URL", error);
        toast({
            title: "Error",
            description: "Could not load PDF for viewing.",
            variant: "destructive",
        });
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile || selectedBatchIds.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all fields and select at least one batch.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      formData.append("file", uploadFile);

      // Upload to all selected batches
      await Promise.all(
        selectedBatchIds.map(batchId => uploadMaterial(batchId, formData))
      );

      toast({ title: "Success", description: "Material uploaded successfully." });

      // Reset
      setUploadTitle("");
      setUploadFile(null);
      setSelectedBatchIds([]);
      document.getElementById('material-upload-file-input').value = ''; // Clear file input
      fetchGroupedMaterials();
    } catch (err) {
      console.error("Failed to upload material:", err);
      toast({ title: "Error", description: `Upload failed: ${err.message}`, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  // Filter grouped materials by search
  const filteredGroupedMaterials = groupedMaterials
    .map((group) => ({
      ...group,
      materials: group.materials.filter(
        (mat) =>
          mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.batch_title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.materials.length > 0);

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by batch or material..."
        className="border p-2 w-full rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Upload Form */}
      <form
        onSubmit={handleUploadMaterial}
        className="border p-4 rounded space-y-4"
      >
        <h3 className="font-bold text-lg flex items-center gap-2">
          <UploadCloud className="w-5 h-5" /> Upload Material
        </h3>
        <input
          type="text"
          placeholder="Material Title"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          id="material-upload-file-input"
          type="file"
          accept="application/pdf"
          onChange={(e) => setUploadFile(e.target.files[0])}
          required
        />
        <div className="flex flex-wrap gap-2">
          {batches.map((batch) => (
            <label
              key={batch.id}
              className="flex items-center gap-1 border p-1 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                value={batch.id}
                checked={selectedBatchIds.includes(batch.id)}
                onChange={() => {
                  const id = batch.id;
                  setSelectedBatchIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id]
                  );
                }}
              />
              {batch.name}
            </label>
          ))}
        </div>
        <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {/* PDF Viewer */}
      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={viewingPdf?.access_url}
        title={viewingPdf?.title}
      />

      {/* Materials */}
      {filteredGroupedMaterials.map((group) => (
        <div key={group.batch_id}>
          <h2 className="font-bold text-lg mb-2">{group.batch_title}</h2>
          <div className="grid gap-4">
            {group.materials.map((material) => (
              <Card key={material.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{material.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">PDF</Badge>
                      <span className="text-sm text-slate-600">
                        {new Date(material.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewMaterial(material)}
                    >
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
      ))}

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Material
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{materialToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (materialToDelete) {
                  handleDeleteMaterial(materialToDelete.id);
                  setIsDeleteDialogOpen(false);
                  setMaterialToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeacherMaterials;