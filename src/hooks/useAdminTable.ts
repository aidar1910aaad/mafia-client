import { useState, useCallback, useEffect } from 'react';

export interface AdminTableState {
  page: number;
  limit: number;
  search: string;
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminTableConfig {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialFilters?: Record<string, any>;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
}

export function useAdminTable(config: AdminTableConfig = {}) {
  const {
    initialPage = 1,
    initialLimit = 20, // Increased default limit for better UX
    initialSearch = '',
    initialFilters = {},
    initialSortBy,
    initialSortOrder = 'desc'
  } = config;

  const [state, setState] = useState<AdminTableState>({
    page: initialPage,
    limit: initialLimit,
    search: initialSearch,
    filters: initialFilters,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  });

  const updatePage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const updateLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  const updateSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, search, page: 1 })); // Reset to first page when searching
  }, []);

  const updateFilters = useCallback((filters: Record<string, any>) => {
    setState(prev => ({ ...prev, filters, page: 1 })); // Reset to first page when filtering
  }, []);

  const updateSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {},
      search: '',
      page: 1
    }));
  }, []);

  const resetToFirstPage = useCallback(() => {
    setState(prev => ({ ...prev, page: 1 }));
  }, []);

  // Reset to first page when search or filters change
  useEffect(() => {
    setState(prev => ({ ...prev, page: 1 }));
  }, [state.search, state.filters]);

  return {
    state,
    updatePage,
    updateLimit,
    updateSearch,
    updateFilters,
    updateSort,
    resetFilters,
    resetToFirstPage
  };
}