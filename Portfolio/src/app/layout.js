import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: "Adhav's Portfolio",
  description:
    'AI and Data Science undergraduate specialising in end-to-end ML pipeline engineering — from model architecture and training to edge deployment. Computer vision, NLP, Gen AI, embedded AI, and agentic AI workflows.',
  keywords: [
    'Adhav',
    'AI',
    'Data Science',
    'Machine Learning',
    'Computer Vision',
    'Portfolio',
    'PyTorch',
    'Deep Learning',
    'Edge AI',
    'NLP',
  ],
  authors: [{ name: 'Adhav' }],
  creator: 'Adhav',
  openGraph: {
    title: "Adhav's Portfolio",
    description:
      'AI & DS undergraduate building intelligent systems from architecture to edge deployment.',
    url: 'https://adhav.manager.vercel.app',
    siteName: "Adhav's Portfolio",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Adhav's Portfolio",
    description:
      'AI & DS undergraduate building intelligent systems from architecture to edge deployment.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Navbar />
          <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}

