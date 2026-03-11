// sanity/lib/queries.ts

export const ALL_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    publishedAt,
    authorId,
    authorName,
    authorImage,
    "upvoteCount": count(upvotes),
    "commentCount": count(*[_type == "comment" && references(^._id)]),
    category-> { title, slug }
  }
`

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    body,
    publishedAt,
    authorId,
    authorName,
    authorImage,
    upvotes,
    "upvoteCount": count(upvotes),
    category-> { title, slug }
  }
`

export const COMMENTS_BY_POST_QUERY = `
  *[_type == "comment" && post._ref == $postId] | order(createdAt asc) {
    _id,
    authorId,
    authorName,
    authorImage,
    body,
    createdAt
  }
`

export const ALL_CATEGORIES_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug
  }
`

export const POSTS_BY_CATEGORY_QUERY = `
  *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    publishedAt,
    authorId,
    authorName,
    authorImage,
    "upvoteCount": count(upvotes),
    "commentCount": count(*[_type == "comment" && references(^._id)]),
    category-> { title, slug }
  }
`
export const LATEST_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    publishedAt,
    authorName,
    "readTime": round(length(pt::text(body)) / 1000) + " min read",
    category-> { title, slug }
  }
`