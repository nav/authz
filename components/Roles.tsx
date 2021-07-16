import {
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import type { IRole } from "../types/roles";
import type { IPermission } from "../types/permissions";
import { Permission } from "./Permissions";

type RoleProps = {
  role: IRole;
};

function Role({ role }: RoleProps) {
  const _perms = role.permissions.map((perm: IPermission) => (
    <WrapItem key={perm.id}>
      <Permission permission={perm} />
    </WrapItem>
  ));
  return (
    <Tr>
      <Td>{role.name}</Td>
      <Td>
        <Wrap>{_perms}</Wrap>
      </Td>
    </Tr>
  );
}

type RolesProps = {
  roles: IRole[];
};

function Roles({ roles }: RolesProps) {
  const _roles = roles.map((role: IRole) => <Role key={role.id} role={role} />);

  return (
    <Table variant="simple" size="md">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Permissions</Th>
        </Tr>
      </Thead>
      <Tbody>{_roles}</Tbody>
    </Table>
  );
}

export { Roles };
