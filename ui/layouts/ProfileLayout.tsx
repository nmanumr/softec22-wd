import TabbedLayout from './TabbedLayout';

export default function SettingsLayout({ children }: React.PropsWithChildren<{}>) {
  const navigation = [
    { name: 'General', href: '/profile/general' },
    { name: 'Change Password', href: '/profile/password' },
  ];

  return (
    <TabbedLayout title={t('title')} navigation={navigation}>
      {children}
    </TabbedLayout>
  );
}
