import "./globals.css";
import Providers from "@/providers/providers";

export const metadata = {
  title: {default: "Sinapse", template: "Sinapse - %s",}, description: "Sinapse Group",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-br">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}