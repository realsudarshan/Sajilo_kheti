import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandCard } from "./LandCard";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("LandCard", () => {
  const baseLand = {
    id: "land-1",
    title: "Test plot",
    description: "Fertile soil",
    location: "Kathmandu",
    pricePerMonth: 12000,
    sizeInSqmeter: 500,
    status: "AVAILABLE",
    heroImageUrl: null as string | null,
  };

  it("renders fallback when no hero image", () => {
    render(<LandCard land={baseLand} />);
    expect(screen.getByText("Test plot")).toBeInTheDocument();
    expect(screen.getByText("Rs 12,000")).toBeInTheDocument();
    expect(screen.getByText("500m²")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Details/i })).toHaveAttribute(
      "href",
      "/dashboard/lands/land-1"
    );
  });

  it("renders hero image when URL is set", () => {
    render(
      <LandCard land={{ ...baseLand, heroImageUrl: "https://example.com/x.jpg" }} />
    );
    const img = screen.getByRole("img", { name: "Test plot" });
    expect(img).toHaveAttribute("src", "https://example.com/x.jpg");
  });

  it("shows status badge", () => {
    render(<LandCard land={{ ...baseLand, status: "IN_NEGOTIATION" }} />);
    expect(screen.getByText(/IN NEGOTIATION/i)).toBeInTheDocument();
  });
});
