import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Loader2 } from "lucide-react";
import PdfViewerDialog from "../common/PdfViewerDialog";
import { getStudentBatches, getBatchMaterials } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const batches = await getStudentBatches();
        const allMaterialsNested = await Promise.all(
          batches.map(async (batch) => {
            const batchMaterials = await getBatchMaterials(batch.id);
            return batchMaterials.map((m) => ({ ...m, batchName: batch.name }));
          })
        );
        const allMaterials = allMaterialsNested.flat();
        setMaterials(allMaterials);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load materials", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [toast]);

  // Group by batch name & sort
  const groupedMaterials = materials.reduce((acc, material) => {
    const batchName = material.batchName || "Unknown Batch";
    if (!acc[batchName]) acc[batchName] = [];
    acc[batchName].push(material);
    return acc;
  }, {});
  const sortedBatchNames = Object.keys(groupedMaterials).sort();

  const handleView = async (material) => {
    setViewingPdf(material);
    setPdfUrl(null);
    try {
      // Use access_url directly from the material object (same as TeacherMaterials)
      if (material.access_url) {
        setPdfUrl(material.access_url);
      } else {
        throw new Error("Access URL not found for this material.");
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not load PDF", variant: "destructive" });
      setViewingPdf(null);
    }
  };

  return (
    <div className="space-y-6">
      <PdfViewerDialog
        open={!!viewingPdf}
        onOpenChange={() => setViewingPdf(null)}
        pdfUrl={pdfUrl}
        title={viewingPdf?.title}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : sortedBatchNames.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No study materials found.</div>
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
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">PDF</Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(material.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleView(material)}>
                      <Eye className="w-4 h-4" />
                      <span className="ml-2 hidden sm:inline">View</span>
                    </Button>
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

export default StudentMaterials;
