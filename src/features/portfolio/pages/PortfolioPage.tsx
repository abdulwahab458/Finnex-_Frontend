import { PageShell } from '@/components/common/PageShell'
import { PortfolioCard } from '../components/PortfolioCards';
import type { ConfirmAction, Portfolio } from '../types/portfolio.types';
import type { CreatePortfolioPayload } from '../types/portfolio.types';
import { usePortfolios, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio} from '../hooks/usePortfolio';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal } from '@/components/modal/Modal';
import { FormRiskSlider, FormInput } from '@/components/form';
import { ConfirmModal } from '@/components/modal/Confirmmodal';
import { Check, FolderPlus } from 'lucide-react';

export function PortfolioPage() {
  const { portfolioData, isLoading } = usePortfolios();
  const { createPortfolio, isCreatePending } = useCreatePortfolio();
  const { updatePortfolio, isUpdatePending } = useUpdatePortfolio();
  const { deletePortfolio, isDeletePending } = useDeletePortfolio();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const isEditMode = selectedPortfolio !== null;

  const methods = useForm<CreatePortfolioPayload>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      riskLevel: 'LOW',
    },
  });

  const onSubmit = methods.handleSubmit(() => {
    setConfirmAction(isEditMode ? "update" : "create");
    setOpen(false);
    setConfirmOpen(true);
  });

  const handleConfirmSubmit = async () => {
    const values = methods.getValues();

    switch (confirmAction) {
      case "create":
        await createPortfolio(values);
        break;

      case "update":
        await updatePortfolio({portfolioId: selectedPortfolio!.id, payload: values });
        break;

      case "delete":
        await deletePortfolio(selectedPortfolio!.id);
        break;
    }

    methods.reset();
    setSelectedPortfolio(null);
    setConfirmAction(null);
    setOpen(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <PageShell title="My Portfolio" showBackButton
        subtitle='Manage your investment portfolios'
        exportAction={{
          label: 'Export Report',
          onClick: () => console.log('Exporting report...'),
        }}
        createAction={{
          label: 'Create Portfolio',
          onClick: () => {
            methods.reset({ name: '', riskLevel: 'LOW' });
            setOpen(true);
          },
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!isLoading && (portfolioData ?? []).length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline/30 bg-surface py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
                <FolderPlus size={22} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">No portfolios yet</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Create your first portfolio to start tracking your investments.
                </p>
              </div>
            </div>
          )}

          {portfolioData?.map((portfolio: Portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              onClick={(p) => navigate(`/user/portfolio/${p.id}`)}
                onEdit={(p) => {
                setSelectedPortfolio(p);
                methods.reset({ name: p.name, riskLevel: p.riskLevel });
                setOpen(true);
              }}
              onDelete={(p) => {
                setSelectedPortfolio(p);
                setConfirmAction("delete");
                setConfirmOpen(true);
              }}
            />
          ))}
        </div>
      </PageShell>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Portfolio"
        description="Set up a new investment portfolio"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border shadow-sm border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-portfolio-form"
              className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Check size={16} />
              Create Portfolio
            </button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form
            id="create-portfolio-form"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            <FormInput
              name="name"
              label="Portfolio Name"
              placeholder="e.g. Retirement Fund"
              rules={{ required: 'Portfolio name is required' }}
            />

            <FormRiskSlider
              name="riskLevel"
              label="Risk Tolerance"
            />
          </form>
        </FormProvider>
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        variant="info"
        title="Create this portfolio?"
        description="Are you sure you want to create this portfolio?"
        confirmLabel="Create Portfolio"
        onConfirm={handleConfirmSubmit}
        loading={isCreatePending}
      />
    </>
  )
}
