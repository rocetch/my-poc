import Head from 'next/head'
import PostBlock from '../components/post-block/post-block'
import styles from '../styles/Home.module.css'
import { getAllPosts } from '../lib/wp-service';
import Link from 'next/link'

export async function getStaticProps({ locale }) {
  console.log('getStaticProps: ' + locale);
  const allPosts = await getAllPosts(locale);
  return {
    props: {
      allPosts,
      locale
    },
    revalidate: 60
  };
}

export default function Home({ allPosts: { edges }, locale }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>my</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          my
        </h1>

        <Link href="/" locale="en"><a>English</a></Link>
        <Link href="/" locale="zh-TW"><a>中文</a></Link>
        Current locale: {locale}

        <PostBlock posts={edges} locale={locale}></PostBlock>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
