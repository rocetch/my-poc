const API_URL = process.env.WP_API_URL;

async function fetchAPI(query, { variables } = {}) {
  // Set up some headers to tell the fetch call
  // that this is an application/json type
  const headers = { 'Content-Type': 'application/json' };

  // build out the fetch() call using the API_URL
  // environment variable pulled in at the start
  // Note the merging of the query and variables
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });

  //console.log(query);

  // error handling work
  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    console.log('error details', query, variables);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getAllPosts(locale) {
    console.log('getAllPosts locale:' + locale);
    const lang = getLangCodeByLocale(locale);
    const data = await fetchAPI(
      `
      query AllPosts {
        posts(where: {language: ${lang}}) {
            edges {
              node {
                date
                id
                slug
                title
                language {
                  code
                  locale
                }
                content
              }
            }
          }
      }
      `
    );

    return data?.posts;
}

function getLangCodeByLocale(locale) {
    switch (locale) {
        case 'en':
        case 'en-US':
            return 'EN';
        case 'zh':
        case 'zh-TW':
            return 'ZH';
        default:
            return 'ALL';
    }
}

export async function getPost3(slug, locale) {
    console.log('getPost:' + slug + ':' + locale);
    //const lang = getLangCodeByLocale(locale);
    const data = await fetchAPI(
      `
      query GetPost {
        post(id: "${slug}", idType: SLUG) {
            content
            title
            slug
          }
      }
      `
    );
    //console.log('getPost:' + JSON.stringify(data));
    return data?.post;
}

export async function getPost(slug, locale) {
    console.log('getPost:' + slug + ':' + locale);
    //const lang = getLangCodeByLocale(locale);
    const data = await fetchAPI(
      `
      query GetPost ($id: ID!, $idType: PostIdType!) {
        post(id: $id, idType: $idType) {
            content
            title
            slug
            language {
                locale
            }
            translations {
                slug
                language {
                    locale
                }
            }
          }
      }
      `, {
          variables: {
            id: slug,
            idType: 'SLUG'
          }
      }
    );
    console.log('getPost:' + data?.post);
    return data?.post;
}