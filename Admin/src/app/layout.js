import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
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
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
