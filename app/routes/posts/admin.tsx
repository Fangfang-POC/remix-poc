
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, Outlet, Form, } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPosts, deletePost } from "~/models/post.server";

type LoaderData = {
    posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
    return json({ posts: await getPosts() });
};
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const slug = formData.get("slug");
    console.log('slug', slug);
    invariant(
        typeof slug === "string",
        "slug must be a string"
    );

    await new Promise((res) => setTimeout(res, 1000));
    const result = await deletePost(slug);
    console.log(result);

    return null;
    // return redirect("/posts/admin");
};
export default function PostAdmin() {
    const { posts } = useLoaderData() as LoaderData;
    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
                Blog Admin
            </h1>
            <div className="grid grid-cols-4 gap-6">
                <nav className="col-span-4 md:col-span-1">
                    <ul>
                        <Form method="post">
                            {posts.map((post) => (
                                <li key={post.slug}>
                                    <Link
                                        to={`${post.slug}`}
                                        className="text-blue-600 underline"
                                    >
                                        {post.title}
                                    </Link>
                                    <input
                                        type="hidden"
                                        name="slug"
                                        defaultValue={post.slug}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white"                
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </Form>
                    </ul>
                </nav>
                <main className="col-span-4 md:col-span-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}