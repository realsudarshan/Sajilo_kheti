import { describe, expect, it } from "vitest";
import { filterBlogPosts } from "./blog-filter";

describe("filterBlogPosts", () => {
  const posts = [
    { _id: "1", category: { slug: { current: "news" } }, tags: ["rice", "soil"] },
    { _id: "2", category: { slug: { current: "guides" } }, tags: ["soil"] },
    { _id: "3", tags: ["rice"] },
  ];

  it("returns all posts when no category or tag", () => {
    const out = filterBlogPosts(posts, {});
    expect(out).toHaveLength(3);
  });

  it("filters by category slug", () => {
    const out = filterBlogPosts(posts, { category: "news" });
    expect(out.map((p) => p._id)).toEqual(["1"]);
  });

  it("filters by tag", () => {
    const out = filterBlogPosts(posts, { tag: "soil" });
    expect(out.map((p) => p._id)).toEqual(["1", "2"]);
  });

  it("returns empty when no match", () => {
    expect(filterBlogPosts(posts, { category: "missing" })).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const copy = structuredClone(posts);
    filterBlogPosts(posts, { tag: "rice" });
    expect(posts).toEqual(copy);
  });
});
