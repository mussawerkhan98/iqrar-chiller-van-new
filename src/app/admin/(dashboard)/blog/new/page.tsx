import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">New Post</h1>
      <p className="text-sm text-slate-500 mb-8">Draft, then publish when ready.</p>
      <BlogPostForm />
    </div>
  );
}
