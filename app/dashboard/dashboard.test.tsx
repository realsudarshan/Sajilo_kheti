import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LeaserDashboardPage from "./page";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/queryandmutation", () => ({
  useGetMe: vi.fn(),
  useGetMyApplications: vi.fn(),
  useGetMyEscrows: vi.fn(),
}));

// The page renders EnablePushNotifications which depends on a tRPC provider.
// In tests we stub it out to avoid the context requirement.
vi.mock("@/components/ui/enable-push-notifications", () => ({
  EnablePushNotifications: () => null,
}));

import { useGetMe, useGetMyApplications, useGetMyEscrows } from "@/queryandmutation";

describe("LeaserDashboardPage", () => {
  beforeEach(() => {
    vi.mocked(useGetMe).mockReturnValue({
      data: { name: "Sam Tester" },
    } as ReturnType<typeof useGetMe>);
  });

  it("shows skeleton stats while applications load", () => {
    vi.mocked(useGetMyApplications).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useGetMyApplications>);
    vi.mocked(useGetMyEscrows).mockReturnValue({
      data: { escrows: [] },
      isLoading: false,
    } as ReturnType<typeof useGetMyEscrows>);

    render(<LeaserDashboardPage />);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders Active Leases and Pending Apps from data", async () => {
    vi.mocked(useGetMyApplications).mockReturnValue({
      data: {
        applications: [
          {
            id: "a1",
            status: "PENDING",
            proposedMonthlyRent: 1000,
            land: { title: "Farm", location: "X", heroImageUrl: null },
          },
          {
            id: "a2",
            status: "ACCEPTED",
            proposedMonthlyRent: 2000,
            land: { title: "Field", location: "Y", heroImageUrl: null },
          },
        ],
      },
      isLoading: false,
    } as ReturnType<typeof useGetMyApplications>);
    vi.mocked(useGetMyEscrows).mockReturnValue({
      data: { escrows: [] },
      isLoading: false,
    } as ReturnType<typeof useGetMyEscrows>);

    render(<LeaserDashboardPage />);
    expect(screen.getByText(/Welcome back,\s*Sam/i)).toBeInTheDocument();
    expect(screen.getByText("Active Leases")).toBeInTheDocument();
    expect(screen.getByText("Pending Apps")).toBeInTheDocument();
  });
});
