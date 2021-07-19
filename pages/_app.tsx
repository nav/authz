import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";

function AuthzApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Box maxW="4xl" my={20} mx="auto" rounded={{ md: "lg" }} shadow="base">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
export default AuthzApp;
