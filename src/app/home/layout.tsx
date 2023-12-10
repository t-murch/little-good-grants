import "@/app/globals.css";
import { inter } from "@/app/ui/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
  // Original Demo layout
  // return (
  //   <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
  //     <div className="w-full flex-none md:w-64"></div>
  //     <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
  //   </div>
  // );
}
