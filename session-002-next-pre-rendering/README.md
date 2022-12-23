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

- `getStaticPaths` must be used with `getStaticProps`
- You cannot use `getStaticPaths` with `getServerSideProps`
- You can export `getStaticPaths` from a Dynamic Route that also uses `getStaticProps`
- You cannot export `getStaticPaths` from non-page file (e.g. your `components` folder)
- You must export `getStaticPaths` as a standalone function, and not a property of the page component

## [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)

- If you export a function called `getStaticProps` (Static Site Generation) from a page, Next.js will pre-render this page at build time using the props returned by `getStaticProps`.

```jsx
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
```

### When should I use getStaticProps?

- You should use `getStaticProps` if:
  - The data required to render th e page is available at build time ahead of a user’s request
  - The data comes from a headless CMS
  - The page must be pre-rendered (for SEO) and be very fast — `getStaticProps` generates HTML and JSON files, both of which can be cached by a CDN for performance
  - The data can be publicly cached (not user-specific). This condition can be bypassed in certain specific situation by using a Middleware to rewrite the path.

### When does getStaticProps run

- `getStaticProps` always runs on the server and never on the client. You can validate code written inside `getStaticProps` is removed from the client-side bundle with this tool.

  - `getStaticProps` always runs during next build
  - `getStaticProps` runs in the background when using fallback: true
  - `getStaticProps` is called before initial render when using fallback: blocking
  - `getStaticProps` runs in the background when using revalidate
  - `getStaticProps` runs on-demand in the background when using revalidate()

- When combined with Incremental Static Regeneration, `getStaticProps` will run in the background while the stale page is being revalidated, and the fresh page served to the browser.

- `getStaticProps` does not have access to the incoming request (such as query parameters or HTTP headers) as it generates static HTML. If you need access to the request for your page, consider using Middleware in addition to `getStaticProps`.

### [SSR with getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props)

If you export a function called getServerSideProps (Server-Side Rendering) from a page, Next.js will pre-render this page on each request using the data returned by getServerSideProps.

```jsx
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
```

- getServerSideProps only runs on server-side and never runs on the browser. If a page uses getServerSideProps, then:

  - When you request this page directly, getServerSideProps runs at request time, and this page will be pre-rendered with the returned props
  - When you request this page on client-side page transitions through next/link or next/router, Next.js sends an API request to the server, which runs getServerSideProps

- getServerSideProps returns JSON which will be used to render the page. All this work will be handled automatically by Next.js, so you don’t need to do anything extra as long as you have getServerSideProps defined.
- getServerSideProps can only be exported from a page. You can’t export it from non-page files.

## [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

- Next.js allows you to create or update static pages after you’ve built your site. Incremental Static Regeneration (ISR) enables you to use static-generation on a per-page basis, without needing to rebuild the entire site. With ISR, you can retain the benefits of static while scaling to millions of pages.

- To use ISR, add the revalidate prop to getStaticProps:

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default Blog;
```

- When a request is made to a page that was pre-rendered at build time, it will initially show the cached page.

  - Any requests to the page after the initial request and before 10 seconds are also cached - and instantaneous.
  - After the 10-second window, the next request will still show the cached (stale) page
  - Next.js triggers a regeneration of the page in the background.
  - Once the page generates successfully, Next.js will invalidate the cache and show the updated page. If the background regeneration fails, the old page would still be unaltered.

- When a request is made to a path that hasn’t been generated, Next.js will server-render the page on the first request. Future requests will serve the static file from the cache. ISR on Vercel persists the cache globally and handles rollbacks.

## [Client-side data fetching](https://nextjs.org/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-swr)

- Client-side data fetching is useful when your page doesn't require SEO indexing, when you don't need to pre-render your data, or when the content of your pages needs to update frequently. Unlike the server-side rendering APIs, you can use client-side data fetching at the component level.

- If done at the page level, the data is fetched at runtime, and the content of the page is updated as the data changes. When used at the component level, the data is fetched at the time of the component mount, and the content of the component is updated as the data changes.

- It's important to note that using client-side data fetching can affect the performance of your application and the load speed of your pages. This is because the data fetching is done at the time of the component or pages mount, and the data is not cached. -->

### Client-side data fetching with SWR

- The team behind Next.js has created a React hook library for data fetching called SWR. It is highly recommended if you are fetching data on the client-side. It handles caching, revalidation, focus tracking, refetching on intervals, and more.

- Using the same example as above, we can now use SWR to fetch the profile data. SWR will automatically cache the data for us and will revalidate the data if it becomes stale.

- For more information on using SWR, check out the SWR docs.

```jsx
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Profile() {
  const { data, error } = useSWR("/api/profile-data", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  );
}
```

## Pre-rendering & Data Fetching Summary

Pre-rendering refers to the process of generating HTML in advance which results in better performance and SE0 Next JS supports two forms of pre-rendering

- Static Generation and Server-side Rendering Static Generation

  - A method of pre-rendering where the HTML pages are generated at build time
  - Pages can be built once, cached by a CDN and served to clients almost instantly
  - Example: Marketing or Blogging site
  - For a normal page, use getStaticProps function to fetch the data ahead of time
  - For a dynamic page, you also need the getStaticPaths function
  - fallback: false I true I 'blocking'
  - Pages cannot be updated without a full re-build
  - Incremental Static Regeneration

- Server-side rendering
  - Fetch data at request time
  - Personalize data based on user information in the incoming request
  - Example: News listing page
  - getServerSideProps function helps with SSR data fetching
  - Combining pre-rendering with client-side data fetching
  - Shallow routing — Routing without calling getStaticProps/getServerSideProps

