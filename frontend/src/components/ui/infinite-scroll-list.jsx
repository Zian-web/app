import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';

const InfiniteScrollList = ({
  items = [],
  renderItem,
  itemsPerPage = 10,
  className,
  containerClassName,
  loadingComponent,
  endMessage,
  threshold = 100,
  ...props
}) => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Load items for current page
  const loadItems = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = items.slice(startIndex, endIndex);
      
      setDisplayedItems(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setHasMore(currentPage < totalPages);
      setIsLoading(false);
    }, 300);
  }, [currentPage, items, itemsPerPage, totalPages, isLoading, hasMore]);

  // Initialize displayed items
  useEffect(() => {
    if (items.length > 0 && displayedItems.length === 0) {
      loadItems();
    }
  }, [items, displayedItems.length, loadItems]);

  // Reset when items change
  useEffect(() => {
    setDisplayedItems([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [items]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadItems();
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    observerRef.current = observer;
    const sentinel = containerRef.current.querySelector('[data-sentinel]');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadItems, threshold]);

  return (
    <div className={cn("w-full h-full flex flex-col", containerClassName)} {...props}>
      <div className={cn("flex-1 overflow-y-auto", className)}>
        <div className="space-y-4">
          {displayedItems.map((item, index) => renderItem(item, index))}
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            {loadingComponent || (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading more items...</span>
              </div>
            )}
          </div>
        )}
        
        {/* End message */}
        {!hasMore && displayedItems.length > 0 && (
          <div className="flex justify-center items-center py-4">
            {endMessage || (
              <span className="text-sm text-muted-foreground">No more items to load</span>
            )}
          </div>
        )}
        
        {/* Sentinel element for intersection observer */}
        <div data-sentinel className="h-1" />
      </div>
    </div>
  );
};

export default InfiniteScrollList;
