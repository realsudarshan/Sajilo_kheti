import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RoleGate } from "./RoleGate";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: vi.fn(),
}));

vi.mock("@/queryandmutation/index", () => ({
  useGetMe: vi.fn(),
}));

import { usePathname } from "next/navigation";
import { useGetMe } from "@/queryandmutation/index";

describe("RoleGate", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    mockReplace.mockClear();
  });

  it("shows loading state while useGetMe is loading", () => {
    vi.mocked(useGetMe).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetMe>);

    render(
      <RoleGate>
        <div data-testid="child">Secret</div>
      </RoleGate>
    );
    expect(screen.getByText(/Verifying access/i)).toBeInTheDocument();
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("renders children when LEASER is on /dashboard", async () => {
    vi.mocked(useGetMe).mockReturnValue({
      data: { role: "LEASER", id: "u1", name: "L" },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetMe>);

    render(
      <RoleGate>
        <div data-testid="child">OK</div>
      </RoleGate>
    );

    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects OWNER away from /dashboard", async () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    vi.mocked(useGetMe).mockReturnValue({
      data: { role: "OWNER", id: "o1", name: "O" },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetMe>);

    render(
      <RoleGate>
        <div data-testid="child">OK</div>
      </RoleGate>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/landowner-dashboard/dashboard");
    });
  });

  it("redirects unauthenticated user to login", async () => {
    vi.mocked(useGetMe).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetMe>);

    render(
      <RoleGate>
        <div data-testid="child">OK</div>
      </RoleGate>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });
});
