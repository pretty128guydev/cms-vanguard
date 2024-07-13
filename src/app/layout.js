import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/auth-provider";
import { GoogleMapsProvider } from "@/components/shared/map/GoogleMapsProvider";

const APP_NAME = "Vanguard Landmark";
const APP_DEFAULT_TITLE = "VNG Landmark";
const APP_TITLE_TEMPLATE = "%s - Landmark App TEMPLATE";
const APP_DESCRIPTION = "Landmark Claims Inspection";

export const metadata = {
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: [
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        url: "/icons/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icons/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icons/favicon-16x16.png",
      },
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
      { rel: "shortcut icon", url: "/icons/favicon.ico" },
    ],
  },
  msapplication: {
    TileColor: "#ffffff",
    config: "/icons/browserconfig.xml",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <AuthProvider>
          <GoogleMapsProvider>{children}</GoogleMapsProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
