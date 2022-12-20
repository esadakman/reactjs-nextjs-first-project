# next-pre-rendering

## [Pre-rendering](https://nextjs.org/docs/basic-features/pages)

- By default, Next.js pre-renders every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Pre-rendering can result in better performance and SEO.
- Each generated HTML is associated with minimal JavaScript code necessary for that page. When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive. (This process is called hydration.)

## [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)

- If you export a function called getStaticProps (Static Site Generation) from a page, Next.js will pre-render this page at build time using the props returned by getStaticProps.

```jsx
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
```

<b>Note</b>: that irrespective of rendering type, any `props` will be passed to the page component and can be viewed on the client-side in the initial HTML. This is to allow the page to be hydrated correctly. Make sure that you don't pass any sensitive information that shouldn't be available on the client in `props`.

- `getStaticProps` always runs on the server and never on the client.
- `getStaticProps` always runs during `next build`
- `getStaticProps` runs in the background when using `fallback: true`
- `getStaticProps` is called before initial render when using `fallback: blocking`
- `getStaticProps` runs in the background when using `revalidate`
- `getStaticProps` runs on-demand in the background when using `revalidate()`
- `getStaticProps` does not have access to the incoming request (such as query parameters or HTTP headers) as it generates static HTML. If you need access to the request for your page, consider using Middleware in addition to `getStaticProps`.

## [Static Generation](https://nextjs.org/docs/basic-features/pages#static-generation)

- If a page uses Static Generation, the page HTML is generated at build time. That means in production, the page HTML is generated when you run `next build` . This HTML will then be reused on each request. It can be cached by a CDN.

- In Next.js, you can statically generate pages with or without data. Let's take a look at each case.

### Static Generation without data

- By default, Next.js pre-renders pages using Static Generation without fetching data. Here's an example:

```jsx
function About() {
  return <div>About</div>;
}
export default About;
```

- Note that this page does not need to fetch any external data to be pre-rendered. In cases like this, Next.js generates a single HTML file per page during build time.

### Static Generation with data

- Some pages require fetching external data for pre-rendering. There are two scenarios, and one or both might apply. In each case, you can use these functions that Next.js provides:

  - Your page content depends on external data: Use `getStaticProps`.
  - Your page paths depend on external data: Use `getStaticPaths` (usually in addition to `getStaticProps`).

#### Scenario 1: Your page content depends on external data

<b>Example:</b> Your blog page might need to fetch the list of blog posts from a CMS (content management system).

```jsx
// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
}
```

- To fetch this data on pre-render, Next.js allows you to export an async function called getStaticProps from the same file. This function gets called at build time and lets you pass fetched data to the page's props on pre-render.

```jsx
export default function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  };
}
```

#### Scenario 2: Your page paths depend on external data

- Next.js allows you to create pages with dynamic routes. For example, you can create a file called `pages/posts/[id].js` to show a single blog post based on id. This will allow you to show a blog post with `id: 1` when you access `posts/1`.

- However, which id you want to pre-render at build time might depend on external data.

- Example: suppose that you've only added one blog post (with id: 1) to the database. In this case, you'd only want to pre-render posts/1 at build time.

- Later, you might add the second post with id: 2. Then you'd want to pre-render posts/2 as well.

- So your page paths that are pre-rendered depend on external data. To handle this, Next.js lets you `export` an `async` function called `getStaticPaths` from a dynamic page (`pages/posts/[id].js` in this case). This function gets called at build time and lets you specify which paths you want to pre-render.

```jsx
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}
```

Also in pages/posts/[id].js, you need to export getStaticProps so that you can fetch the data about the post with this id and use it to pre-render the page:

```jsx
export default function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  // Pass post data to the page via props
  return { props: { post } };
}
```

## [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths)

- If a page has Dynamic Routes and uses getStaticProps, it needs to define a list of paths to be statically generated.

- When you export a function called getStaticPaths (Static Site Generation) from a page that uses dynamic routes, Next.js will statically pre-render all the paths specified by getStaticPaths.

```jsx
// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  return {
    // Passed to the page component as props
    props: { post: {} },
  };
}

export default function Post({ post }) {
  // Render post...
}
```

- The `getStaticPaths` API reference covers all parameters and props that can be used with `getStaticPaths`.

### When does getStaticPaths run

- `getStaticPaths` will only run during build in production, it will not be called during runtime.

### How does getStaticProps run with regards to getStaticPaths

- `getStaticPaths` runs during next build for any paths returned during build
- `getStaticPaths` runs in the background when using `fallback: true`
- `getStaticPaths` is called before initial render when using `fallback: blocking`

### Where can I use getStaticPaths

-  `getStaticPaths` must be used with `getStaticProps`
- You cannot use `getStaticPaths` with `getServerSideProps`
- You can export `getStaticPaths` from a Dynamic Route that also uses `getStaticProps`
- You cannot export `getStaticPaths` from non-page file (e.g. your `components` folder)
- You must export `getStaticPaths` as a standalone function, and not a property of the page component