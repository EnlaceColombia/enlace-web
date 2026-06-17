import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Newspaper } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedBlogPosts } from "@/lib/api/blog.functions";
import { formatBlogDate } from "@/lib/blog/types";

export const Route = createFileRoute("/reflexiones/")({
  loader: async () => {
    const posts = await getPublishedBlogPosts();
    return { posts };
  },
  head: () => ({
    meta: [
      { title: "Reflexiones — Corporación Enlace Colombia" },
      {
        name: "description",
        content:
          "Devocionales, enseñanzas y palabras de aliento de los pastores y consejeros de Enlace Colombia.",
      },
    ],
  }),
  component: ReflexionesIndexPage,
});

function ReflexionesIndexPage() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Blog</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
            Reflexiones que <span className="text-violet">alimentan el alma</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Devocionales, enseñanzas y palabras de aliento de nuestros pastores y consejeros.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 sm:p-14 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl surface-violet">
              <Newspaper className="h-6 w-6 text-white" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-foreground">Próximamente</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Estamos preparando contenido nuevo para esta sección.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lift transition"
              >
                {post.coverImageUrl ? (
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[16/10] w-full surface-violet opacity-90" />
                )}
                <div className="p-5">
                  <time className="text-xs font-semibold text-muted-foreground">
                    {formatBlogDate(post.publishedAt)}
                  </time>
                  <h2 className="mt-2 text-lg font-bold text-foreground group-hover:text-violet transition">
                    <Link to="/reflexiones/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    to="/reflexiones/$slug"
                    params={{ slug: post.slug }}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet"
                  >
                    Leer más
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
