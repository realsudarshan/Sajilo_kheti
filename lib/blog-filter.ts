/** Pure filter for Sanity blog posts — no I/O, safe to unit test. */
type BlogPostFilterable = {
  category?: { slug?: { current?: string } };
  tags?: string[];
};

export function filterBlogPosts<T extends BlogPostFilterable>(
  posts: T[],
  params: { category?: string; tag?: string }
): T[] {
  return posts.filter((p) => {
    if (params.category) return p.category?.slug?.current === params.category;
    if (params.tag) return p.tags?.includes(params.tag);
    return true;
  });
}
