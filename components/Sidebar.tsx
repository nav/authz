import NextLink from "next/link";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Heading,
} from "@chakra-ui/react";

interface MenuItemProps {
  label: string;
  link: string;
}

const MenuItem = ({ label, link }: MenuItemProps) => {
  return (
    <NextLink href={link} passHref>
      <Button
        flex="1"
        w="100%"
        borderRadius="0"
        bg="#d6d6d6"
        _hover={{
          background: "#cdcdcd",
        }}
        paddingInlineStart={4}
        paddingInlineEnd={4}
        fontWeight="normal"
        justifyContent="left"
      >
        {label}
      </Button>
    </NextLink>
  );
};

const Menu = () => {
  return (
    <>
      <MenuItem label="Home" link="/" />

      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Settings
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel paddingInlineEnd="0" paddingInlineStart="0">
            <Heading size="xs" bg="#dcdcdc" py={1} px={4}>
              <Box flex="1" textAlign="left">
                IAM
              </Box>
            </Heading>
            <MenuItem label="Users" link="/settings/iam/users" />
            <MenuItem label="Roles" link="/settings/iam/roles" />
            <MenuItem label="Permissions" link="/settings/iam/permissions" />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

const Sidebar = () => {
  return (
    <Box
      position="fixed"
      left={0}
      py={5}
      w="200px"
      top={0}
      h="100vh"
      bg="#dfdfdf"
    >
      <Menu />
    </Box>
  );
};

export { Sidebar };
