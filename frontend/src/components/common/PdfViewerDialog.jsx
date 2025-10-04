import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

const PdfViewerDialog = ({ open, onOpenChange, pdfUrl, title }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pages, setPages] = useState([]);
    const containerRef = React.useRef(null);

    useEffect(() => {
        if (!open || !pdfUrl) {
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setPages([]);

        const loadPdf = async () => {
            try {
                // Set worker path to local worker file
                pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

                // Fetch the PDF document
                const loadingTask = pdfjs.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                
                // Get all pages
                const pagePromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(pdf.getPage(i));
                }
                
                const loadedPages = await Promise.all(pagePromises);
                setPages(loadedPages);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        loadPdf();
    }, [open, pdfUrl]);

    useEffect(() => {
        if (!containerRef.current || pages.length === 0) return;

        const renderPages = async () => {
            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            
            // Clear previous content
            container.innerHTML = '';

            for (const page of pages) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const viewport = page.getViewport({ scale: 1 });
                
                // Calculate scale to fit width
                const scale = containerWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                canvas.style.marginBottom = '20px';

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport,
                };

                await page.render(renderContext).promise;
                container.appendChild(canvas);
            }
        };

        renderPages();
    }, [pages]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-full">
                <DialogHeader>
                    <DialogTitle>{title || "View PDF"}</DialogTitle>
                    <DialogDescription>
                        You can read the material below.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative border rounded overflow-y-auto h-[80vh]">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Loading PDF...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-50 p-4">
                            <Badge variant="destructive">Error loading PDF</Badge>
                            <p className="text-sm text-red-500 mt-2">{error}</p>
                        </div>
                    )}

                    <div ref={containerRef} className="p-4">
                        {/* PDF pages will be rendered here */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PdfViewerDialog;
