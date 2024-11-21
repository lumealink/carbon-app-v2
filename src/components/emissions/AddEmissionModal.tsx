import React from 'react';
import { X } from 'lucide-react';
import EmissionForm from './EmissionForm';
import { EmissionData } from '../../types/emissions';

interface AddEmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmissionData) => Promise<void>;
  isLoading?: boolean;
}

const AddEmissionModal: React.FC<AddEmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Add New Emission Data
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-2">
            <EmissionForm onSubmit={onSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmissionModal;