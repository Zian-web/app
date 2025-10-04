import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";
import PdfViewerDialog from "../common/PdfViewerDialog";
import { getStudentBatches, getBatchMaterials } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [displayedMaterials, setDisplayedMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { toast } = useToast();

  const itemsPerPage = 10;

  // Fetch all study materials for the student
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        // 1. Get the batches the student is enrolled in
        const studentBatches = await getStudentBatches();

        // 2. For each batch, get the materials (each already has presigned access_url)
        const materialsPromises = studentBatches.map(async (batch) => {
          const batchMaterials = await getBatchMaterials(batch.id);
          return batchMaterials.map((material) => ({
            ...material,
            batchName: batch.name,
          }));
        });

        // 3. Flatten materials
        const allMaterialsNested = await Promise.all(materialsPromises);
        const allMaterials = allMaterialsNested.flat();

        // 4. Sort by created date (newest first)
        allMaterials.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setMaterials(allMaterials);
      } catch (err) {
        console.error("Failed to load materials", err);
        toast({
          title: "Error",
          description: "Failed to load study materials.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [toast]);

  // Handle pagination
  useEffect(() => {
    const validMaterials = Array.isArray(materials) ? materials : [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newMaterials = validMaterials.slice(startIndex, endIndex);

    if (currentPage === 1) {
      setDisplayedMaterials(newMaterials);
    } else {
      setDisplayedMaterials((prev) => [...prev, ...newMaterials]);
    }
  }, [currentPage, materials]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop < clientHeight + 100 &&
      !isLoading &&
      displayedMaterials.length < (materials?.length || 0)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // ✅ Open PDF directly from presigned URL returned by backend
  const handleView = (material) => {
    setSelectedPdf(material);
    setOpenPdf(true);
    setPdfUrl(material.access_url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Study Materials</h2>
      <div
        className="h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto pr-2"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {displayedMaterials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      {material.teacherName} | {material.batchName}
                    </p>
                    <h3 className="font-medium">{material.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">PDF</Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(material.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(material)}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">View</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {isLoading && currentPage === 1 && (
            <div className="text-center py-4">Loading materials...</div>
          )}
          {displayedMaterials.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <p className="text-gray-500">No study materials found.</p>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Dialog */}
      {selectedPdf && (
        <PdfViewerDialog
          open={openPdf}
          onOpenChange={setOpenPdf}
          pdfUrl={pdfUrl}
          title={selectedPdf.title}
        />
      )}
    </div>
  );
};

export default StudentMaterials;
