import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

const channelMock = vi.fn(() => ({
  create: vi.fn().mockResolvedValue(undefined),
  sendMessage: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("stream-chat", () => ({
  StreamChat: {
    getInstance: vi.fn(() => ({
      upsertUsers: vi.fn().mockResolvedValue(undefined),
      channel: channelMock,
    })),
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() =>
    Promise.resolve({
      userId: "user_leaser",
      getToken: () => Promise.resolve("jwt-test"),
    })
  ),
}));

describe("POST /api/esewa/verify (GetStream channel + escrow)", () => {
  const applicationId = "11111111-2222-3333-4444-555555555555";
  const origEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    channelMock.mockClear();
    process.env = {
      ...origEnv,
      NODE_ENV: "development",
      NEXT_PUBLIC_STREAM_API_KEY: "pk_test",
      STREAM_API_SECRET: "sec_test",
      BACKEND_URL: "http://localhost:8000",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const u = typeof url === "string" ? url : url.toString();
        if (u.includes(`/api/lease/application/${applicationId}`)) {
          return {
            ok: true,
            json: () =>
              Promise.resolve({
                land: { ownerId: "owner_clerk" },
              }),
          };
        }
        if (u.includes("/api/lease/pay-escrow")) {
          return {
            ok: true,
            json: () =>
              Promise.resolve({
                escrow: { id: "esc1", ownerId: "owner_clerk" },
              }),
          };
        }
        if (u.includes("/api/escrow/save-chat-channel")) {
          return { ok: true, json: () => Promise.resolve({ ok: true }) };
        }
        return { ok: false, json: () => Promise.resolve({}) };
      }) as typeof fetch
    );
  });

  afterEach(() => {
    process.env = origEnv;
    vi.unstubAllGlobals();
  });

  it("returns chatChannelId and calls GetStream channel create", async () => {
    const { POST } = await import("@/app/api/esewa/verify/route");
    const encoded = Buffer.from(
      JSON.stringify({
        status: "COMPLETE",
        total_amount: "1000",
        transaction_code: "TX123",
        transaction_uuid: `${applicationId}-extra`,
      }),
      "utf-8"
    ).toString("base64");

    const req = new Request("http://localhost/api/esewa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encodedData: encoded,
        applicationId,
        mock: true,
      }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.chatChannelId).toBe(`lease-${applicationId}`);
    expect(channelMock).toHaveBeenCalled();
  });
});
