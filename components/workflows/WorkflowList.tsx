'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit3,
  Eye,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type { WorkflowRecord } from '@/lib/types/api';
import DeleteWorkflowModal from './DeleteWorkflowModal';

interface WorkflowListProps {
  workflows: WorkflowRecord[];
  onDeleted: (id: string) => void;
  onDelete: (workflowId: string) => Promise<void>;
}

type SortKey = 'name' | 'createdAt' | 'profilesCount';

const columns: { key: SortKey | 'action'; label: string; sortable: boolean; align?: 'right' }[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'profilesCount', label: 'Profiles', sortable: true },
  { key: 'action', label: 'Action', sortable: false, align: 'right' },
];

function formatDate(value: string) {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WorkflowList({ workflows, onDeleted, onDelete }: WorkflowListProps) {
  const [deletingWorkflow, setDeletingWorkflow] = useState<WorkflowRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredWorkflows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const result = workflows.filter((workflow) =>
      !term || workflow.name.toLowerCase().includes(term)
    );

    result.sort((a, b) => {
      const aValue = sortConfig.key === 'profilesCount' ? a.profilesCount ?? 0 : a[sortConfig.key];
      const bValue = sortConfig.key === 'profilesCount' ? b.profilesCount ?? 0 : b[sortConfig.key];

      if (String(aValue) < String(bValue)) return sortConfig.direction === 'asc' ? -1 : 1;
      if (String(aValue) > String(bValue)) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [workflows, searchTerm, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredWorkflows.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedWorkflows = filteredWorkflows.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  function handleSort(key: SortKey | 'action') {
    if (key === 'action') return;
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  return (
    <>
      <div className="border-b border-slate-100 bg-white px-8 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-slate-300 py-2 pr-9 pl-9 text-sm outline-none transition focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="ml-auto text-xs text-slate-500">
            {filteredWorkflows.length} of {workflows.length} workflows
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-sm font-semibold text-slate-700 ${
                        column.align === 'right' ? 'text-right' : 'text-left'
                      } ${column.sortable ? 'cursor-pointer select-none transition hover:bg-slate-100' : ''}`}
                      onClick={() => handleSort(column.key)}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          column.align === 'right' ? 'justify-end' : ''
                        }`}
                      >
                        {column.label}
                        {column.sortable &&
                          (sortConfig.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <ArrowUpDown size={14} className="text-slate-400" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedWorkflows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Search size={40} />
                        <div>
                          <p className="text-sm font-medium text-slate-600">No workflows found</p>
                          <p className="mt-1 text-xs">
                            {searchTerm
                              ? 'Try adjusting your search'
                              : 'Create your first workflow to get started'}
                          </p>
                        </div>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-xs font-medium text-[#0a2540] hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedWorkflows.map((workflow) => (
                    <tr
                      key={workflow.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/customer/workflows/${workflow.id}`}
                          className="block max-w-[220px] break-words text-sm font-medium text-slate-900 hover:text-[#0a2540] hover:underline"
                        >
                          {workflow.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(workflow.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                          {workflow.profilesCount ?? 0} profile
                          {(workflow.profilesCount ?? 0) === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            href={`/customer/workflows/${workflow.id}`}
                            className="flex items-center gap-1.5 rounded-md border border-orange-300 px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-50"
                          >
                            <Eye size={14} />
                            See Details
                          </Link>
                          <Link
                            href={`/customer/workflows/${workflow.id}/edit`}
                            className="rounded-md border border-slate-300 p-1.5 text-slate-600 transition hover:bg-slate-50"
                            aria-label={`Edit ${workflow.name}`}
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() => setDeletingWorkflow(workflow)}
                            className="rounded-md border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50"
                            aria-label={`Delete ${workflow.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredWorkflows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <div className="text-xs text-slate-500">
                Showing {(safeCurrentPage - 1) * pageSize + 1}-
                {Math.min(safeCurrentPage * pageSize, filteredWorkflows.length)} of{' '}
                {filteredWorkflows.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                  className="rounded border border-slate-300 p-1.5 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="rounded border border-orange-400 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  {safeCurrentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded border border-slate-300 p-1.5 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label="Items per page"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {deletingWorkflow && (
        <DeleteWorkflowModal
          workflowName={deletingWorkflow.name}
          onConfirm={async () => {
            await onDelete(deletingWorkflow.id);
            onDeleted(deletingWorkflow.id);
            setDeletingWorkflow(null);
          }}
          onCancel={() => setDeletingWorkflow(null)}
        />
      )}
    </>
  );
}
