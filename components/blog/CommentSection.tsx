'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ThumbsUp, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Comment {
  _id: string
  authorId: string
  authorName?: string
  authorImage?: string
  body: string
  createdAt: string
}

interface CommentSectionProps {
  postId: string
  postSlug: string // ADDED THIS LINE
  initialComments: Comment[]
  initialUpvotes: string[]
  currentUserId?: string
}

export default function CommentSection({
  postId,
  postSlug, // DESTRUCTURED THIS HERE
  initialComments,
  initialUpvotes,
  currentUserId,
}: CommentSectionProps) {
  const { isSignedIn } = useUser()

  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [upvotes, setUpvotes] = useState<string[]>(initialUpvotes)
  const [commentBody, setCommentBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvoting, setUpvoting] = useState(false)
  const [commentError, setCommentError] = useState('')

  const hasUpvoted = currentUserId ? upvotes.includes(currentUserId) : false

  // ── Upvote ────────────────────────────────────────────────────────────────
  const handleUpvote = async () => {
    if (!isSignedIn || upvoting) return
    setUpvoting(true)
    try {
      const res = await fetch('/api/blog/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      const data = await res.json()
      if (data.success) {
        setUpvotes(
          data.hasUpvoted
            ? [...upvotes, currentUserId!]
            : upvotes.filter((id) => id !== currentUserId)
        )
      }
    } catch (err) {
      console.error("Upvote error:", err)
    } finally {
      setUpvoting(false)
    }
  }

  // ── Comment ───────────────────────────────────────────────────────────────
  const handleComment = async () => {
    if (!isSignedIn || !commentBody.trim() || submitting) return
    setCommentError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/blog/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            postId, 
            postSlug, // You can now use this in your API call if needed
            body: commentBody 
        }),
      })
      const data = await res.json()
      if (data.success) {
        setComments([...comments, data.comment])
        setCommentBody('')
      } else {
        setCommentError(data.error ?? 'Failed to post comment')
      }
    } catch (err) {
       setCommentError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Upvote button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleUpvote}
          disabled={!isSignedIn || upvoting}
          variant={hasUpvoted ? 'default' : 'outline'}
          className={`gap-2 rounded-xl ${hasUpvoted ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
        >
          {upvoting
            ? <Loader2 size={16} className="animate-spin" />
            : <ThumbsUp size={16} />
          }
          {hasUpvoted ? 'Upvoted' : 'Upvote'} · {upvotes.length}
        </Button>
        {!isSignedIn && (
          <p className="text-xs text-slate-400">Sign in to upvote</p>
        )}
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Comments <span className="text-slate-400 font-normal text-base">({comments.length})</span>
        </h3>

        {/* Comment input */}
        {isSignedIn ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts…"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              maxLength={500}
              rows={3}
              className="rounded-2xl resize-none border-slate-200 focus:border-emerald-400"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{commentBody.length}/500</span>
              <div className="flex items-center gap-2">
                {commentError && <p className="text-xs text-red-500">{commentError}</p>}
                <Button
                  onClick={handleComment}
                  disabled={!commentBody.trim() || submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
                >
                  {submitting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Send size={14} />
                  }
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              <a href="/sign-in" className="text-emerald-600 font-semibold hover:underline">Sign in</a> to leave a comment
            </p>
          </div>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                {comment.authorImage ? (
                  <img src={comment.authorImage} className="h-8 w-8 rounded-full object-cover shrink-0 mt-1" alt={comment.authorName} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0 mt-1">
                    {comment.authorName?.[0] ?? 'U'}
                  </div>
                )}
                <div className="flex-1 bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-800">{comment.authorName ?? 'User'}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}