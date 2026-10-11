// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "SaansSchool · Air quality for school communities",
//   description: "Understand air quality and make thoughtful plans for a safer school day.",
// };

// export default function RootLayout({ children }: LayoutProps<"/">) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }





import type { Metadata } from "next";
import AppShell from "./app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaansSchool · Air quality for school communities",
  description: "Understand air quality and make thoughtful plans for a safer school day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
