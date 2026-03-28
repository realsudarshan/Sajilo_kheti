import { describe, expect, it } from "vitest";
import { loginSchema } from "@/app/(auth)/login/page";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "secret" });
    expect(r.success).toBe(true);
  });

  it("rejects empty email", () => {
    const r = loginSchema.safeParse({ email: "", password: "x" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.message).toMatch(/Email/i);
  });

  it("rejects invalid email format", () => {
    const r = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(r.success).toBe(false);
  });

  it("rejects empty password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(r.success).toBe(false);
  });
});
