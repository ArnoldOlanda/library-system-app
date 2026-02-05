import { AbilityContext } from "@/rbac/AbilityContext";
import { createContextualCan } from "@casl/react";

export const Can = createContextualCan(AbilityContext.Consumer);