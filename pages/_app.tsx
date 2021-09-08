import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Sidebar } from "../components/Sidebar";

function AuthzApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Sidebar></Sidebar>
      <Box maxW="4xl" my={20} mx="auto">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
export default AuthzApp;
