import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Trash2, AlertTriangle } from "lucide-react";
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

const TeacherMaterials = ({ apiToken }) => {
  const [materials, setMaterials] = useState([]);
  const [groupedMaterials, setGroupedMaterials] = useState({});
  const [viewingPdf, setViewingPdf] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/api/teacher/materials", {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      // res.data should be an array of materials with batch info
      setMaterials(res.data);

      // Group by batch name
      const grouped = res.data.reduce((acc, material) => {
        const batchName = material.batch?.name || "Unknown Batch";
        if (!acc[batchName]) acc[batchName] = [];
        acc[batchName].push(material);
        return acc;
      }, {});
      setGroupedMaterials(grouped);
    } catch (err) {
      console.error("Error fetching materials", err);
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      await axios.delete(`/api/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      fetchMaterials(); // Refresh grouping
    } catch (err) {
      console.error("Error deleting material", err);
    }
  };

  return (
    <div className="space-y-6">
      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={viewingPdf?.access_url}
        title={viewingPdf?.title}
      />

      {Object.keys(groupedMaterials).map((batchName) => (
        <div key={batchName}>
          <h2 className="font-bold text-lg mb-2">{batchName}</h2>
          <div className="grid gap-4">
            {groupedMaterials[batchName].map((material) => (
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
                      onClick={() => setViewingPdf(material)}
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
                  deleteMaterial(materialToDelete.id);
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
