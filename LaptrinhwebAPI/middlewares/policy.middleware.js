import { checkPolicy } from "../services/policy.service.js";

export function authorizePolicy(policy) {
  return async (req, res, next) => {
    const resourceId = req.params.id;

    const allowed = await checkPolicy({
      user: req.user,
      policy,
      resourceId
    });

    if (!allowed) {
      return res.status(403).json({
        message: "Forbidden - Policy denied"
      });
    }

    next();
  };
}
