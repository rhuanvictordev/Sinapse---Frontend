import "./globals.css";
import Providers from "@/providers/providers";

export const metadata = {
  title: {default: "Sinapse", template: "Sinapse - %s",}, description: "Sinapse Group",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-br" className="bg-cover bg-center bg-no-repeat">
      <body className="text-xs md:text-lg bg-no-repeat bg-cover bg-center">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}