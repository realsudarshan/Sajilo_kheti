// sanity/schemaTypes/comment.ts

import { defineField, defineType } from 'sanity'

export const commentSchema = defineType({
  name:  'comment',
  title: 'Comment',
  type:  'document',
  fields: [
    defineField({
      name:  'post',
      title: 'Post',
      type:  'reference',
      to:    [{ type: 'post' }],
      validation: (Rule) => Rule.required(),
    }),
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
      name:       'body',
      title:      'Comment',
      type:       'text',
      rows:       3,
      validation: (Rule) => Rule.required().min(1).max(500),
    }),
    defineField({
      name:  'createdAt',
      title: 'Created At',
      type:  'datetime',
    }),
  ],
  preview: {
    select: {
      title:    'body',
      subtitle: 'authorName',
    },
  },
})