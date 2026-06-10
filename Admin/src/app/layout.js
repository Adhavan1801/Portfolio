import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import ProtectedLayout from '@/components/ProtectedLayout';

export const metadata = {
  title: 'Portfolio Admin — Durai Singam',
  description: 'Admin controller for managing Portfolio content',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProfileProvider>
            <ProtectedLayout>
              {children}
            </ProtectedLayout>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
