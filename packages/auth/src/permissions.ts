import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc as systemAdminAc,
  defaultStatements as systemDefaultStatements,
  userAc as systemUserAc,
} from "better-auth/plugins/admin/access";
import {
  adminAc as orgAdminAc,
  defaultStatements as orgDefaultStatements,
  memberAc as orgMemberAc,
  ownerAc as orgOwnerAc,
} from "better-auth/plugins/organization/access";

// System-level (better-auth admin plugin) permissions.
const systemPermissions = {
  ...systemDefaultStatements,
} as const;

const systemAc = createAccessControl(systemPermissions);

const systemUserRole = systemAc.newRole({
  ...systemUserAc.statements,
});

const systemAdminRole = systemAc.newRole({
  ...systemAdminAc.statements,
});

const systemRoles = {
  user: systemUserRole,
  admin: systemAdminRole,
};

// Organization-level permissions: standard org statements + apiKey scopes.
const orgPermissions = {
  ...orgDefaultStatements,
  apiKey: ["create", "read", "update", "delete"],
} as const;

const orgAc = createAccessControl(orgPermissions);

const orgMemberRole = orgAc.newRole({
  ...orgMemberAc.statements,
  apiKey: ["read"],
});

const orgAdminRole = orgAc.newRole({
  ...orgAdminAc.statements,
  apiKey: ["create", "read", "update", "delete"],
});

const orgOwnerRole = orgAc.newRole({
  ...orgOwnerAc.statements,
  apiKey: ["create", "read", "update", "delete"],
});

const orgRoles = {
  member: orgMemberRole,
  admin: orgAdminRole,
  owner: orgOwnerRole,
};

export {
  orgAc,
  orgAdminRole,
  orgMemberRole,
  orgOwnerRole,
  orgRoles,
  systemAc,
  systemAdminRole,
  systemRoles,
  systemUserRole,
};
