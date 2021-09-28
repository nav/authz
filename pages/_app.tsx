import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Sidebar } from "../components/Sidebar";

function AuthzApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Sidebar></Sidebar>
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-10xl mx-auto px-4 sm:px-6 md:px-8">
            <Component {...pageProps} />
          </div>
        </div>
      </main>
    </div>
  );
}
export default AuthzApp;
