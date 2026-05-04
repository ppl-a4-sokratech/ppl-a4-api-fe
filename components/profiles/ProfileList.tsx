'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit3, Eye, Search, ShieldCheck, Trash2, X } from 'lucide-react';
import type { WorkflowProfileRecord } from '@/lib/types/api';
import DeleteProfileModal from './DeleteProfileModal';

type ProfileListProps = Readonly<{
  workflowId: string;
  profiles: WorkflowProfileRecord[];
  onDeleted: () => void;
  onDelete: (profileId: string) => Promise<void>;
}>;

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

function activeRecipeCount(profile: WorkflowProfileRecord) {
  return [
    profile.recipes.behavioral.enabled,
    profile.recipes.fingerprint.enabled,
    profile.recipes.detection.enabled,
  ].filter(Boolean).length;
}

export default function ProfileList({ workflowId, profiles, onDeleted, onDelete }: ProfileListProps) {
  const [deletingProfile, setDeletingProfile] = useState<WorkflowProfileRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return profiles;
    return profiles.filter((profile) => profile.name.toLowerCase().includes(term));
  }, [profiles, searchTerm]);

  return (
    <>
      <div className="border-b border-slate-100 bg-white px-8 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
            {filteredProfiles.length} of {profiles.length} profiles
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Recipes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Updated</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <ShieldCheck size={40} />
                        <div>
                          <p className="text-sm font-medium text-slate-600">No profiles found</p>
                          <p className="mt-1 text-xs">
                            {searchTerm ? 'Try a different search term' : 'Create a profile for this workflow'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/customer/workflows/${workflowId}/profiles/${profile.id}`}
                          className="block max-w-[220px] break-words text-sm font-medium text-slate-900 hover:text-[#0a2540] hover:underline"
                        >
                          {profile.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                          {activeRecipeCount(profile)} active groups
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(profile.updatedAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            href={`/customer/workflows/${workflowId}/profiles/${profile.id}`}
                            className="flex items-center gap-1.5 rounded-md border border-orange-300 px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-50"
                          >
                            <Eye size={14} />
                            See Details
                          </Link>
                          <Link
                            href={`/customer/workflows/${workflowId}/profiles/${profile.id}/edit`}
                            className="rounded-md border border-slate-300 p-1.5 text-slate-600 transition hover:bg-slate-50"
                            aria-label={`Edit ${profile.name}`}
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() => setDeletingProfile(profile)}
                            className="rounded-md border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50"
                            aria-label={`Delete ${profile.name}`}
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
        </div>
      </div>

      {deletingProfile && (
        <DeleteProfileModal
          profileName={deletingProfile.name}
          onConfirm={async () => {
            await onDelete(deletingProfile.id);
            setDeletingProfile(null);
            onDeleted();
          }}
          onCancel={() => setDeletingProfile(null)}
        />
      )}
    </>
  );
}
