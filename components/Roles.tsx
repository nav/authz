import type { IRole } from "../types/roles";
import type { IPermission } from "../types/permissions";
import { Permission } from "./Permissions";

type RoleProps = {
  role: IRole;
};

function Role({ role }: RoleProps) {
  return <div>{role.name}</div>;
}

function RoleRow({ role }: RoleProps) {
  const _perms = role.permissions.map((perm: IPermission) => (
    <div className="inline-block mr-2 mb-2" key={perm.id}>
      <Permission permission={perm} />
    </div>
  ));
  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{role.name}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-7">
        {_perms}
      </dd>
    </div>
  );
}

type RolesProps = {
  roles: IRole[];
};

function Roles({ roles }: RolesProps) {
  const _roles = roles.map((role: IRole) => (
    <RoleRow key={role.id} role={role} />
  ));

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">{_roles}</dl>
      </div>
    </div>
  );
}

export { Role, Roles };
