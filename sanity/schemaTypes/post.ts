// sanity/schemaTypes/post.ts

import { defineField, defineType } from 'sanity'

export const postSchema = defineType({
  name:  'post',
  title: 'Post',
  type:  'document',
  fields: [
    defineField({
      name:       'title',
      title:      'Title',
      type:       'string',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name:       'slug',
      title:      'Slug',
      type:       'slug',
      options:    { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  'heroImage',
      title: 'Hero Image',
      type:  'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
      ],
    }),
    defineField({
      name:  'excerpt',
      title: 'Excerpt',
      type:  'text',
      rows:  3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name:  'body',
      title: 'Body',
      type:  'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({
              name:    'caption',
              type:    'string',
              title:   'Caption',
            }),
          ],
        },
      ],
    }),
    defineField({
      name:  'category',
      title: 'Category',
      type:  'reference',
      to:    [{ type: 'category' }],
    }),
    // Clerk userId of the author
    defineField({
      name:       'authorId',
      title:      'Author Clerk ID',
      type:       'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  'authorName',
      title: 'Author Name',
      type:  'string',
    }),
    defineField({
      name:  'authorImage',
      title: 'Author Image URL',
      type:  'url',
    }),
    defineField({
      name:  'publishedAt',
      title: 'Published At',
      type:  'datetime',
    }),
    defineField({
      name:    'tags',
      title:   'Tags',
      type:    'array',
      of:      [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    // Array of Clerk userIds who upvoted
    defineField({
      name:  'upvotes',
      title: 'Upvotes',
      type:  'array',
      of:    [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title:  'title',
      author: 'authorName',
      media:  'heroImage',
    },
    prepare({ title, author, media }) {
      return { title, subtitle: `by ${author ?? 'Unknown'}`, media }
    },
  },
})
// NOTE: also add tags field inside postSchema.fields array:
// defineField({
//   name:  'tags',
//   title: 'Tags',
//   type:  'array',
//   of:    [{ type: 'string' }],
//   options: { layout: 'tags' },
// }),