import React from 'react';
import { useFoldersStore, Folder } from '../../store/foldersStore';

export default function FolderDetails({ folder }: { folder: Folder | null }) {
  const { updateFolder, deleteFolder } = useFoldersStore();
  const [name, setName] = React.useState(folder?.name || '');
  React.useEffect(() => { setName(folder?.name || ''); }, [folder]);

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
        Select a folder to view details
      </div>
    );
  }

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={async e => {
        e.preventDefault();
        await updateFolder(folder.id, { name });
      }}
    >
      <input
        className="mb-2 p-2 rounded border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-lg font-semibold"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div className="flex-1 p-2 text-gray-500 dark:text-gray-400">
        Folder ID: {folder.id}
      </div>
      <div className="flex gap-2 mt-2">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={async () => { if (window.confirm('Delete this folder?')) await deleteFolder(folder.id); }}
        >
          Delete
        </button>
      </div>
    </form>
  );
}
