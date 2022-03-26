import c from 'classnames';

import LinkTo from '../components/LinkTo';
import DashboardLayout from './DashboardLayout';
import PageHeader from '../components/PageHeader';

interface Props {
  title: string;
  navigation?: {
    href: string;
    name: string;
  }[];
  actions?: React.ReactNode;
}

export default function SettingsLayout({
  title, navigation, children, actions,
}: React.PropsWithChildren<Props>) {
  return (
    <DashboardLayout>
      <PageHeader title={title}>
        {actions}
      </PageHeader>

      <div className="pb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-6 md:space-x-8">
            {navigation && navigation.map((item) => (
              <LinkTo key={item.href} href={item.href}>
                {(active: boolean) => (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <a
                    className={c(
                      active ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    )}
                  >
                    {item.name}
                  </a>
                )}
              </LinkTo>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}
