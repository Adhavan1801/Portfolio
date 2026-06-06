import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Portfolio Manager — Durai Singam',
  description: 'Admin controller for managing portfolio content',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          <Sidebar />
          <main className="admin-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
