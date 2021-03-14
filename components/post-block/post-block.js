import Link from 'next/link'

export default function PostBlock({ posts, locale }) {
    return (
        <section>
        {posts.map(({ node }) => (
            <div>
              <h2>{node.title}</h2>
              <p>{node.content}</p>
              <Link href={`/posts/${node.slug}`} locale={locale}><a>Read more</a></Link>
            </div>
        ))}
      </section>
    );
}