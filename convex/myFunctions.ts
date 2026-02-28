import { query } from "./_generated/server";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return {
      subject: identity?.subject ?? null,
      name: identity?.name ?? null,
      email: identity?.email ?? null,
    };
  },
});
