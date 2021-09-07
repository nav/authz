import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

export default function Index() {
  return (
    <NextLink href={`/settings/iam`} passHref>
      <Link>Go to IAM Settings</Link>
    </NextLink>
  );
}
