import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata = {
  title: "Miller Nexus",
  description: "Strategic advisory at the intersection of wellness, tourism, resource mobilization, and design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-gold/20 py-10">
          <div className="container-max text-sm text-mutedInk">
            © {new Date().getFullYear()} Miller Nexus. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
