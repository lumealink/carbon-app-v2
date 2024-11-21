import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader } from 'lucide-react';
import { EmissionData, EMISSION_CATEGORIES, EMISSION_UNITS, EMISSION_FACTOR_SOURCES } from '../../types/emissions';
import { EMISSION_FACTORS } from '../../data/emissionFactors';

// Define emission form schema
const emissionSchema = z.object({
  scope: z.enum(['scope1', 'scope2', 'scope3']),
  category: z.string().min(1, 'Category is required'),
  source: z.string().min(1, 'Source is required'),
  activity: z.string().min(1, 'Activity description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  emissionFactor: z.number().positive('Emission factor must be positive'),
  emissionFactorUnit: z.string().min(1, 'Emission factor unit is required'),
  emissionFactorSource: z.string().min(1, 'Emission factor source is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.string().min(1, 'Location is required'),
  facility: z.string().min(1, 'Facility is required'),
  notes: z.string().optional(),
  verificationStatus: z.enum(['unverified', 'verified', 'pending']).default('unverified')
});

type EmissionFormData = z.infer<typeof emissionSchema>;

interface EmissionFormProps {
  onSubmit: (data: EmissionFormData) => Promise<void>;
  initialData?: Partial<EmissionData>;
  isLoading?: boolean;
}

const EmissionForm: React.FC<EmissionFormProps> = ({
  onSubmit,
  initialData,
  isLoading
}) => {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<EmissionFormData>({
    resolver: zodResolver(emissionSchema),
    defaultValues: {
      scope: 'scope1',
      verificationStatus: 'unverified',
      ...initialData
    }
  });

  const scope = watch('scope');
  const category = watch('category');
  const source = watch('source');
  const emissionFactorSource = watch('emissionFactorSource');

  // Auto-populate emission factor when source and factor source change
  useEffect(() => {
    if (source && emissionFactorSource && emissionFactorSource !== 'Custom') {
      const categoryFactors = EMISSION_FACTORS[category as keyof typeof EMISSION_FACTORS];
      if (categoryFactors) {
        const sourceFactors = categoryFactors[source as keyof typeof categoryFactors];
        if (sourceFactors) {
          const factor = sourceFactors[emissionFactorSource as keyof typeof sourceFactors];
          if (factor) {
            setValue('emissionFactor', factor.factor);
            setValue('emissionFactorUnit', factor.unit);
          }
        }
      }
    }
  }, [source, emissionFactorSource, category, setValue]);

  const scopeCategories = EMISSION_CATEGORIES.filter(cat => cat.scope === scope);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Scope Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Scope
          </label>
          <select
            {...register('scope')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="scope1">Scope 1 (Direct)</option>
            <option value="scope2">Scope 2 (Indirect)</option>
            <option value="scope3">Scope 3 (Value Chain)</option>
          </select>
          {errors.scope && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.scope.message}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select category</option>
            {scopeCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
          )}
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Source
          </label>
          <input
            type="text"
            {...register('source')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.source && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.source.message}</p>
          )}
        </div>

        {/* Activity Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Activity Description
          </label>
          <input
            type="text"
            {...register('activity')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.activity && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.activity.message}</p>
          )}
        </div>

        {/* Quantity and Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              step="0.01"
              {...register('quantity', { valueAsNumber: true })}
              className="flex-1 min-w-0 block rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              {...register('unit')}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {EMISSION_UNITS.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.value}
                </option>
              ))}
            </select>
          </div>
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity.message}</p>
          )}
        </div>

        {/* Emission Factor Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Emission Factor Source
          </label>
          <select
            {...register('emissionFactorSource')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {EMISSION_FACTOR_SOURCES.map(source => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
          {errors.emissionFactorSource && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emissionFactorSource.message}</p>
          )}
        </div>

        {/* Emission Factor and Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Emission Factor
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              step="0.000001"
              {...register('emissionFactor', { valueAsNumber: true })}
              className="flex-1 min-w-0 block rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              {...register('emissionFactorUnit')}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Unit"
            />
          </div>
          {errors.emissionFactor && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emissionFactor.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            {...register('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            {...register('endDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate.message}</p>
          )}
        </div>

        {/* Location and Facility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Facility
          </label>
          <input
            type="text"
            {...register('facility')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.facility && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.facility.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Emission Data'
          )}
        </button>
      </div>
    </form>
  );
};

export default EmissionForm;