import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Trash2, UploadCloud, AlertTriangle, Loader2 } from "lucide-react";
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
import AddMaterialDialog from "../forms/AddMaterialDialog";
import { useToast } from "../../hooks/use-toast";
import { getTeacherAllMaterials, getMyBatches, deleteMaterial } from "../../lib/api";

const TeacherMaterials = () => {
    const [allMaterials, setAllMaterials] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    
    const [viewingPdf, setViewingPdf] = useState(null);
    const [materialToDelete, setMaterialToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch both materials and batches in parallel
            const [materialsData, batchesData] = await Promise.all([
                getTeacherAllMaterials(),
                getMyBatches(),
            ]);
            setAllMaterials(materialsData || []);
            setBatches(batchesData || []);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to fetch data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (materialId) => {
        try {
            await deleteMaterial(materialId);
            toast({ title: "Success", description: "Material deleted successfully." });
            // Refetch materials to update the list
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: error.message || "Failed to delete material.", variant: "destructive" });
        } finally {
            setIsDeleteDialogOpen(false);
            setMaterialToDelete(null);
        }
    };

    // Group materials by batch and filter them based on search query
    const groupedAndFilteredMaterials = useMemo(() => {
        const batchMap = new Map(batches.map(b => [b.id, b.name]));
        
        const grouped = allMaterials.reduce((acc, material) => {
            const batchId = material.batch_id;
            if (!acc[batchId]) {
                acc[batchId] = {
                    batch_id: batchId,
                    batch_title: batchMap.get(batchId) || `Batch #${batchId}`,
                    materials: [],
                };
            }
            acc[batchId].materials.push(material);
            return acc;
        }, {});

        let result = Object.values(grouped);

        if (searchQuery) {
            result = result
                .map(group => ({
                    ...group,
                    materials: group.materials.filter(mat =>
                        mat.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                }))
                .filter(group => group.materials.length > 0);
        }

        return result;
    }, [allMaterials, batches, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">All Study Materials</h2>
                <div className="flex w-full sm:w-auto items-center space-x-4">
                    <Input
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64"
                    />
                    <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload</span>
                    </Button>
                </div>
            </div>

            {/* Dialogs */}
            <AddMaterialDialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
                batches={batches}
                onMaterialUploaded={fetchData} // Refetch data after upload
            />
            <PdfViewerDialog
                open={!!viewingPdf}
                onOpenChange={() => setViewingPdf(null)}
                pdfUrl={viewingPdf?.access_url}
                title={viewingPdf?.title}
            />
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
                            onClick={() => handleDelete(materialToDelete.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Materials List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedAndFilteredMaterials.length > 0 ? (
                        groupedAndFilteredMaterials.map((group) => (
                            <div key={group.batch_id}>
                                <h3 className="font-bold text-xl mb-3">{group.batch_title}</h3>
                                <div className="grid gap-4">
                                    {group.materials.map((material) => (
                                        <Card key={material.id}>
                                            <CardContent className="p-4 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">{material.title}</h4>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge variant="secondary">PDF</Badge>
                                                        <span className="text-sm text-slate-600">
                                                            {new Date(material.created_at).toLocaleDateString()}
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
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">No Materials Found</h3>
                            <p className="text-sm text-gray-500">Upload a material to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeacherMaterials;
