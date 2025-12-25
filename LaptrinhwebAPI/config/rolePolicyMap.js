import { POLICIES } from "../utils/constants/policies.js";

export const rolePolicyMap = {
  Admin: [POLICIES.USER_VIEW_ALL, POLICIES.USER_DELETE],
  User: [POLICIES.USER_VIEW_SELF],
};
