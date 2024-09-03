// async function getPosts() {
//   const posts = await prisma.post.findMany({
//     where: { published: true },
//     include: {
//       author: {
//         select: { name: true },
//       },
//     },
//   });
//   return posts;
// }

export default function Home() {
  return (
    <>
      {/* <Sidebar /> */}
      {/* {posts?.map((post) => {
        return (
          <div key={post.id}>
            {post.title}
            <DeletePostButton postId={post.id} />
          </div>
        );
      })} */}
    </>
  );
}
