import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationCard } from "./ApplicationCard";

vi.mock("@/queryandmutation", () => ({
  useGetMe: () => ({ data: { id: "owner1", role: "OWNER" } }),
}));

const getStatusConfig = (status: string) =>
  status === "PENDING" ? "bg-amber-100" : "bg-emerald-100";

describe("ApplicationCard", () => {
  const app = {
    id: "app-1",
    status: "PENDING",
    leaseDurationInMonths: 12,
    proposedMonthlyRent: 5000,
    plans: "Organic farming",
    land: { id: "l1", title: "Field A" },
    leaser: { name: "Tenant", image: "" },
  };

  it("calls onAction ACCEPT when Accept is clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <ApplicationCard
        app={app}
        escrow={null}
        onAction={onAction}
        isAccepting={false}
        isRejecting={false}
        getStatusConfig={getStatusConfig}
      />
    );
    await user.click(screen.getByRole("button", { name: /Accept Proposal/i }));
    expect(onAction).toHaveBeenCalledWith("app-1", "ACCEPT");
  });

  it("shows loaders when accepting", () => {
    render(
      <ApplicationCard
        app={app}
        escrow={null}
        onAction={vi.fn()}
        isAccepting
        isRejecting={false}
        getStatusConfig={getStatusConfig}
      />
    );
    const acceptBtn = screen.getAllByRole("button")[0];
    expect(acceptBtn).toBeDisabled();
    expect(acceptBtn.querySelector(".animate-spin")).toBeTruthy();
  });

  it("enables Chat when escrow has chatChannelId", async () => {
    const user = userEvent.setup();
    const onChatOpen = vi.fn();
    render(
      <ApplicationCard
        app={{ ...app, status: "ACCEPTED" }}
        escrow={{ id: "e1", amount: 1000, commission: 50, status: "HOLDING", chatChannelId: "ch-99" }}
        onAction={vi.fn()}
        isAccepting={false}
        isRejecting={false}
        getStatusConfig={getStatusConfig}
        onChatOpen={onChatOpen}
      />
    );
    const chatBtn = screen.getByRole("button", { name: /^Chat$/i });
    expect(chatBtn).not.toBeDisabled();
    await user.click(chatBtn);
    expect(onChatOpen).toHaveBeenCalledWith("ch-99");
  });

  it("disables Chat when no channel id", () => {
    render(
      <ApplicationCard
        app={{ ...app, status: "ACCEPTED" }}
        escrow={{ id: "e1", amount: 1000, commission: 50, status: "HOLDING", chatChannelId: null }}
        onAction={vi.fn()}
        isAccepting={false}
        isRejecting={false}
        getStatusConfig={getStatusConfig}
      />
    );
    expect(screen.getByRole("button", { name: /Chat/i })).toBeDisabled();
  });
});
