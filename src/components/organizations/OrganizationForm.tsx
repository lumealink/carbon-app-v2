import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader } from 'lucide-react';
import { Organization, ORGANIZATION_TYPES, BOUNDARY_APPROACHES } from '../../types/organization';
import CountrySelector from '../common/CountrySelector';

const organizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['site', 'subsidiary', 'supplier']),
  boundaryApproach: z.enum(['financial_control', 'operational_control', 'equity_share']),
  parentOrganizationId: z.string().optional(),
  ownership: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  country: z.string().min(2, 'Country is required'),
  industry: z.string().min(2, 'Industry is required'),
  esgContactName: z.string().min(2, 'ESG contact name is required'),
  esgContactPhone: z.string().min(5, 'Valid phone number is required'),
  esgContactEmail: z.string().email('Valid email is required'),
  reportingYear: z.number().int().min(2000).max(2100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  initialData?: Partial<Organization>;
  parentOrganizations?: Organization[];
  isLoading?: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onSubmit,
  initialData,
  parentOrganizations = [],
  isLoading
}) => {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      type: 'site',
      boundaryApproach: 'operational_control',
      reportingYear: new Date().getFullYear(),
      ...initialData
    }
  });

  const selectedType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organization Name
          </label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organization Type
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {ORGANIZATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
          )}
        </div>

        {/* Parent Organization and Ownership */}
        {selectedType !== 'site' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Parent Organization
              </label>
              <select
                {...register('parentOrganizationId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select parent organization</option>
                {parentOrganizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {errors.parentOrganizationId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.parentOrganizationId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ownership Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('ownership', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.ownership && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ownership.message}</p>
              )}
            </div>
          </>
        )}

        {/* Location Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            {...register('address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Country
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountrySelector
                value={field.value}
                onChange={field.onChange}
                error={errors.country?.message}
              />
            )}
          />
        </div>

        {/* Industry and Reporting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Industry
          </label>
          <input
            type="text"
            {...register('industry')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reporting Year
          </label>
          <input
            type="number"
            {...register('reportingYear', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.reportingYear && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reportingYear.message}</p>
          )}
        </div>

        {/* ESG Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ESG Contact Name
          </label>
          <input
            type="text"
            {...register('esgContactName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.esgContactName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.esgContactName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ESG Contact Phone
          </label>
          <input
            type="tel"
            {...register('esgContactPhone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.esgContactPhone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.esgContactPhone.message}</p>
          )}
        </div>

        {/* Account Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email (for login)
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Boundary Approach */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            GHG Boundary Approach
          </label>
          <select
            {...register('boundaryApproach')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {BOUNDARY_APPROACHES.map(approach => (
              <option key={approach.value} value={approach.value}>
                {approach.label} - {approach.description}
              </option>
            ))}
          </select>
          {errors.boundaryApproach && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.boundaryApproach.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
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
            'Save Organization'
          )}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;