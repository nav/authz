import {
  Badge,
  Box,
  Tooltip,
  ListItem,
  UnorderedList,
  Text,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import type { IPermission, IPermissionDict } from "../types/permissions";

type PermissionProps = {
  permission: IPermission;
};

function Permission({ permission }: PermissionProps) {
  const [action, model] = permission.codename.split("_");
  return (
    <Tooltip label={permission.description} aria-label="A tooltip">
      <Badge
        style={{
          cursor: "default",
        }}
      >
        {action} {model}
      </Badge>
    </Tooltip>
  );
}

type PermissionsProps = {
  permissions: IPermissionDict;
};

function renderTree(node: any) {
  const buffer = [];
  for (const [key, value] of Object.entries<any>(node)) {
    if (typeof value === "object" && value !== null) {
      if (value.hasOwnProperty("id")) {
        buffer.push(
          <Box my={1} key={value.id}>
            <Permission permission={value} />
          </Box>
        );
      } else {
        buffer.push(
          <UnorderedList key={`item_${key}`}>
            <ListItem>
              <Text>{value.hasOwnProperty("id") ? "" : key}</Text>
              {renderTree(value)}
            </ListItem>
          </UnorderedList>
        );
      }
    }
  }
  return buffer;
}

function Permissions({ permissions }: PermissionsProps) {
  return <Grid autoFlow="column">{renderTree(permissions)}</Grid>;
}

export { Permission, Permissions };
