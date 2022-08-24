import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, useTransition, Form } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { getPost, editPost, deletePost } from '~/models/post.server';
import type { Post } from '@prisma/client';

type ActionData =
    | {
        title: null | string;
        // slug: null | string;
        markdown: null | string;
    }
    | undefined;

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");
    const errors: ActionData = {
        title: title ? null : "Title is required",
        // slug: slug ? null : "Slug is required",
        markdown: markdown ? null : "Markdown is required",
    };
    console.log('slug', slug);
    const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
    );
    if (hasErrors) {
        return json<ActionData>(errors);
    }
    invariant(
        typeof title === "string",
        "title must be a string"
    );
    invariant(
        typeof slug === "string",
        "slug must be a string"
    );
    invariant(
        typeof markdown === "string",
        "markdown must be a string"
    );
    await new Promise((res) => setTimeout(res, 1000));
    const result = await editPost({ slug, title, markdown });
    console.log(result);

    return redirect("/posts/admin");
};

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, `params.slug is required`);
    const post = await getPost(params.slug);
    invariant(post, `post with slug ${params.slug} not found`);
    return json({ post });
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function EditPost() {
    const { post } = useLoaderData<{ post: Post }>();
    const errors = useActionData();
    const transition = useTransition();
    const isCreating = Boolean(transition.submission);
    return (
        <Form method="post">
            <p>
                <label>
                    Post Title:{" "}
                    {errors?.title ? (
                        <em className="text-red-600">{errors.title}</em>
                    ) : null}
                    <input
                        defaultValue={post.title}
                        type="text"
                        name="title"
                        className={inputClassName}
                    />
                </label>
            </p>
            <p>
                <label>
                    Post Slug: {post.slug}
                    <input
                        type="hidden"
                        name="slug"
                        defaultValue={post.slug}
                    />
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:
                    {errors?.markdown ? (
                        <em className="text-red-600">
                            {errors.markdown}
                        </em>
                    ) : null}
                </label>
                <br />
                <textarea
                    defaultValue={post.markdown}
                    id="markdown"
                    rows={20}
                    name="markdown"
                    className={`${inputClassName} font-mono`}
                />
            </p>
            <p className="text-right">
                <button
                    type="submit"
                    className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
                    disabled={isCreating}
                >
                    {isCreating ? 'Editing post' : 'Edit Post'}
                </button>
            </p>
        </Form>
    );
}
// export default function PostSlug() {
//     const { post, html } = useLoaderData<{ post: Post, html: string}>();
//     return (
//         <main className="mx-auto max-w-4xl">
//             <h1 className="my-6 border-b-2 text-center text-3xl">
//                 Some Post： {post.title}
//             </h1>
//             <div dangerouslySetInnerHTML={{ __html: html }} />
//         </main>
//     );
// }