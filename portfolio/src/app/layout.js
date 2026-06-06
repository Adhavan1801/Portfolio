import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  title: 'Durai Singam | AI & Data Science Portfolio',
  description:
    'AI and Data Science undergraduate at Thoothukudi clg of engineering specialising in end-to-end ML pipeline engineering — from model architecture and training to edge deployment. Computer vision, NLP, Gen AI, embedded AI, and agentic AI workflows.',
  keywords: [
    'Durai Singam',
    'AI',
    'Data Science',
    'Machine Learning',
    'Computer Vision',
    'Portfolio',
    'Thoothukudi clg of engineering',
    'PyTorch',
    'Deep Learning',
    'Edge AI',
    'NLP',
  ],
  authors: [{ name: 'Durai Singam' }],
  creator: 'Durai Singam',
  openGraph: {
    title: 'Durai Singam | AI & Data Science Portfolio',
    description:
      'AI & DS undergraduate building intelligent systems from architecture to edge deployment.',
    url: 'https://duraisingam-portfolio.vercel.app',
    siteName: 'Durai Singam Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Durai Singam | AI & Data Science Portfolio',
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
      <body style={{ cursor: 'none' }}>
        <CustomCursor />
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

