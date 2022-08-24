import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { marked } from 'marked';
import { getPost } from '~/models/post.server';
import type { Post } from '@prisma/client';

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, `params.slug is required`);
    const post = await getPost(params.slug);
    invariant(post, `post with slug ${params.slug} not found`);
    return json({ post, html: marked(post.markdown) });
}
export default function PostSlug() {
    const { post, html } = useLoaderData<{ post: Post, html: string}>();
    return (
        <main className="mx-auto max-w-4xl">
            <h1 className="my-6 border-b-2 text-center text-3xl">
                Some Post： {post.title}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </main>
    );
}