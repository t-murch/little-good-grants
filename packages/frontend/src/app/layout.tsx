import '@/app/globals.css';
import { Providers } from '@/app/providers';
import AmplifyConfig from '@/app/ui/AmplifyConfig';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AmplifyConfig />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
