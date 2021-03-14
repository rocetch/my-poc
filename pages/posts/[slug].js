import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllPosts, getPost } from '../../lib/wp-service';
import Link from 'next/link'

export async function getStaticProps({ params, locale }) {
    console.log('post getStaticProps: ' + params.slug + locale);
    const data = await getPost(params.slug, locale);
    console.log('post getStaticProps data:' + data);
    return {
      props: {
        postData: data,
        locale
      },
      revalidate: 60
    };
  }

function getLocaleByCode(langCode) {
    //console.log(langCode);
    switch (langCode) {
        case 'EN':
            return 'en';
        case 'ZH':
            return 'zh-TW';
    }
}

export async function getStaticPaths({ locales }) {
    console.log('page getStaticPaths locales: ' + locales);
    const allPosts = await getAllPosts();

    console.log(allPosts.edges.map(({node}) => ({params: { slug: node.slug }, locale: getLocaleByCode(node.language.code)})) || []);
    //paths.push(allPosts.edges.map(({node}) => ({params: { slug: node.slug }, locale})) || []);

    //console.log(paths);

    //const allPosts = await getAllPosts(locales);
    //console.log(allPosts.edges.map(({node}) => `/posts/${node.slug}`));
    //console.log(allPosts.edges.map(({node}) => ({params: { slug: node.slug }})) || []);
    //return allPosts.edges.map(node => {return {params: {slug: node.slug}}});
    return {
        paths: allPosts.edges.map(({node}) => ({params: { slug: node.slug }, locale: getLocaleByCode(node.language.code)})) || [],
        fallback: true
    };
    /*
    return {
        paths: allPosts.edges.map(({node}) => `/posts/${node.slug}`) || [],
        fallback: true
    };
    */
}

function getAnotherLang(locale) {
    console.log(locale);
    return locale == 'en' ? 'zh-TW' : 'en';
}

export default function Post({postData, locale}) {
    const router = useRouter();

    if (!router.isFallback && !postData?.slug) {
        return (<p>Error</p>);
    }

    return (
        <div>
            <Head>
                <title>my</title>
            </Head>

            <main>
                {router.isFallback ? (<h2>Loading...</h2>) :
                (
                    <article>
                    <p>{postData.title}</p>
                    <div dangerouslySetInnerHTML={{__html: postData.content}}></div>
                    
                    <Link href={`/posts/${postData.translations[0].slug}`} locale={getAnotherLang(locale)}><a>Change</a></Link>
                    </article>
                )}
            </main>
        </div>
    );
}