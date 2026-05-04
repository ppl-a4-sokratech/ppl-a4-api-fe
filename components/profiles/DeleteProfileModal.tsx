'use client';

import DeleteModal from '@/components/ui/DeleteModal';

type DeleteProfileModalProps = Readonly<{
  profileName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}>;

export default function DeleteProfileModal({ profileName, onConfirm, onCancel }: DeleteProfileModalProps) {
  return (
    <DeleteModal
      title="Delete Profile?"
      description={<>Are you sure you want to delete <strong className="text-slate-900">{profileName}</strong>?</>}
      confirmLabel="Delete Profile"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
