import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const permissions = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(permissions);

const userRole = ac.newRole({
  ...userAc.statements,
});

const adminRole = ac.newRole({
  ...adminAc.statements,
});

const roles = {
  user: userRole,
  admin: adminRole,
};

export { ac, adminRole, permissions, roles, userRole };
