import { PageShell } from '@/components/common/PageShell'
import { PortfolioCard } from '../components/PortfolioCards';
import type { Portfolio } from '../types/portfolio.types';
import { usePortfolios } from '../hooks/usePortfolio';
import { useNavigate } from 'react-router';

export function PortfolioPage() {
  const { portfolioData, isLoading, isError, error } = usePortfolios();
  
  const navigate = useNavigate();
  return (
    <PageShell title="My Portfolio"
     subtitle='Manage your investment portfolios'
     exportAction={{
                    label: 'Export Report',
                    onClick: () => console.log('Exporting report...'),
                }}
                createAction={{
                    label: 'Create Holding',
                    onClick: () => {
                       console.log('Creating new portfolio...');
                    }
                }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioData?.map((portfolio: Portfolio) => (
          <PortfolioCard
            key={portfolio.id}
            portfolio={portfolio}
            onClick={(p) => navigate(`/user/portfolio/${p.id}`)}
          />
        ))}
      </div>
    </PageShell>
  )
}

