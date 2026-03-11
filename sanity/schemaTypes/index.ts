// sanity/schemaTypes/index.ts

import { postSchema }     from './post'
import { categorySchema } from './category'
import { commentSchema }  from './comment'

export const schemaTypes = [postSchema, categorySchema, commentSchema]