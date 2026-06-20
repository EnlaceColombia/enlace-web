import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BlogMarkdown } from "@/components/blog-markdown";
import { getBlogPostBySlug } from "@/lib/api/blog.functions";
import { formatBlogDate } from "@/lib/blog/types";
import { buildPublicPageHead } from "@/lib/seo/meta";
import { getSiteOgImageUrl, getSiteUrl } from "@/lib/site";

export const Route = createFileRoute("/reflexiones/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug({ data: { slug: params.slug } });
    if (!post) throw new Error("Entrada no encontrada");
    return { post };
  },
  head: ({ loaderData, params }) => {
    const title = `${loaderData.post.title} — Reflexiones | Corporación Enlace Colombia`;
    const description = loaderData.post.excerpt || loaderData.post.title;
    const head = buildPublicPageHead({
      path: `/reflexiones/${params.slug}`,
      title,
      description,
    });

    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.post.title,
            description,
            image: loaderData.post.coverImageUrl ?? getSiteOgImageUrl(),
            datePublished: loaderData.post.publishedAt,
            dateModified: loaderData.post.updatedAt,
            author: {
              "@type": "Organization",
              name: "Corporación Enlace Colombia",
              url: getSiteUrl(),
            },
            publisher: {
              "@type": "Organization",
              name: "Corporación Enlace Colombia",
              logo: {
                "@type": "ImageObject",
                url: `${getSiteUrl()}/favicon.png`,
              },
            },
            mainEntityOfPage: `${getSiteUrl()}/reflexiones/${params.slug}`,
          }),
        },
      ],
    };
  },
  component: ReflexionPostPage,
});

function ReflexionPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <Link
          to="/reflexiones"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas las reflexiones
        </Link>

        <article className="mt-8">
          <time className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            {formatBlogDate(post.publishedAt)}
          </time>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
          )}

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt=""
              className="mt-8 w-full rounded-2xl border border-border shadow-card object-cover max-h-[420px]"
            />
          )}

          <BlogMarkdown content={post.content} className="mt-8" />
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
