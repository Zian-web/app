import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Trash2, AlertTriangle, UploadCloud, Search } from "lucide-react";
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
import axios from "axios";

const TeacherMaterials = ({ userRole }) => {
  const [groupedMaterials, setGroupedMaterials] = useState([]);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);

  useEffect(() => {
    fetchMaterials();
    if (userRole === "teacher") fetchTeacherBatches();
  }, []);

  // ---------------- FETCH MATERIALS ----------------
  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/api/teacher/materials/grouped");
      setGroupedMaterials(res.data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    }
  };

  // ---------------- FETCH BATCHES ----------------
  const fetchTeacherBatches = async () => {
    try {
      const res = await axios.get("/api/batches");
      setBatches(res.data);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  // ---------------- DELETE MATERIAL ----------------
  const handleDeleteMaterial = async (id) => {
    try {
      await axios.delete(`/api/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error("Failed to delete material:", err);
    }
  };

  // ---------------- UPLOAD MATERIAL ----------------
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle || selectedBatchIds.length === 0) {
      alert("Please fill all fields and select at least one batch.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      formData.append("file", uploadFile);

      // Upload to all selected batches
      for (const batchId of selectedBatchIds) {
        await axios.post(`/api/batches/${batchId}/materials/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Reset form
      setUploadTitle("");
      setUploadFile(null);
      setSelectedBatchIds([]);
      fetchMaterials();
    } catch (err) {
      console.error("Failed to upload material:", err);
    }
  };

  // ---------------- FILTERED MATERIALS ----------------
  const filteredGroupedMaterials = groupedMaterials
    .map((group) => ({
      ...group,
      materials: group.materials.filter(
        (material) =>
          material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.batch_title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.materials.length > 0);

  return (
    <div className="space-y-6">

      {/* ---------------- SEARCH ---------------- */}
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5" />
        <input
          type="text"
          placeholder="Search by batch or material..."
          className="border p-2 w-full rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ---------------- UPLOAD FORM ---------------- */}
      {userRole === "teacher" && (
        <form onSubmit={handleUploadMaterial} className="border p-4 rounded space-y-4">
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
                    setSelectedBatchIds((prev) =>
                      prev.includes(batch.id)
                        ? prev.filter((i) => i !== batch.id)
                        : [...prev, batch.id]
                    );
                  }}
                />
                {batch.name}
              </label>
            ))}
          </div>
          <Button type="submit">Upload Material</Button>
        </form>
      )}

      {/* ---------------- PDF VIEWER ---------------- */}
      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={viewingPdf?.file_url?.startsWith("http") ? viewingPdf.file_url : `/api/${viewingPdf?.file_url}`}
        title={viewingPdf?.title}
      />

      {/* ---------------- MATERIALS DISPLAY ---------------- */}
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
                    {/* VIEW BUTTON */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingPdf(material)}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="ml-2 hidden sm:inline">View</span>
                    </Button>

                    {/* DELETE BUTTON */}
                    {userRole === "teacher" && (
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
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* ---------------- DELETE CONFIRMATION ---------------- */}
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
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>Cancel</AlertDialogCancel>
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
