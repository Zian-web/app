import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, Download } from 'lucide-react';

const StudentMaterials = ({ materials }) => {
  const [displayedMaterials, setDisplayedMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newMaterials = materials.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedMaterials(newMaterials);
    } else {
      setDisplayedMaterials(prev => [...prev, ...newMaterials]);
    }
    setIsLoading(false);
  }, [currentPage, materials]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedMaterials.length < materials.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Study Materials</h2>
      <div 
        className="h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {displayedMaterials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{material.title}</h3>
                     <div className="flex items-center space-x-2 mt-1">
                       <Badge variant="secondary">{material.type}</Badge>
                       <span className="text-sm text-gray-500">{material.uploadDate}</span>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">View</span>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {isLoading && (
            <div className="text-center py-4">
              Loading more materials...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMaterials;
