import type { IPermission, IPermissionDict } from "../types/permissions";

type PermissionProps = {
  permission: IPermission;
};

function Permission({ permission }: PermissionProps) {
  const [action, model] = permission.codename.split("_");
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 cursor-default"
      title={permission.description}
    >
      {action} {model}
    </span>
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
          <div key={value.id} className="mb-2">
            <Permission permission={value} />
          </div>
        );
      } else {
        buffer.push(
          <ul key={`item_${key}`} className="list-disc m-4">
            <li>
              <span>{value.hasOwnProperty("id") ? "" : key}</span>
              {renderTree(value)}
            </li>
          </ul>
        );
      }
    }
  }
  return buffer;
}

function Permissions({ permissions }: PermissionsProps) {
  return (
    <div className="grid grid-flow-col auto-cols-max gap-10">
      {renderTree(permissions)}
    </div>
  );
}

export { Permission, Permissions };
