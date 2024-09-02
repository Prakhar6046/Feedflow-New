"use client";

import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  async function handleDeletePost() {
    try {
      await fetch(`/api/post/${postId}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }
  return <button onClick={handleDeletePost}>Delete Post</button>;
}
