import { rolePolicyMap } from "../config/rolePolicyMap.js";
import { POLICIES } from "../utils/constants/policies.js";

export async function checkPolicy({ user, policy, resourceId = null }) {
  const userPolicies = rolePolicyMap[user.role] || [];

  // Không có policy
  if (!userPolicies.includes(policy)) {
    return false;
  }

  // Policy có ngữ cảnh
  if (policy === POLICIES.USER_VIEW_SELF) {
    return user.id === Number(resourceId);
  }

  return true;
}
