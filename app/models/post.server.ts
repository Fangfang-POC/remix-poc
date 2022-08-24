import { prisma } from '~/db.server';
import type { Post } from '@prisma/client';

export async function getPosts(): Promise<Array<Post>> {
  return prisma.post.findMany();
}
export async function getPost(slug: string): Promise<Post | null> {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: Pick<Post, 'title' | 'slug' | 'markdown'>) {
  return prisma.post.create({ data: post });
}

export async function editPost(post: Pick<Post, 'title' | 'slug' | 'markdown'>) {
  return prisma.post.update({ where: { slug: post.slug }, data: post })
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}