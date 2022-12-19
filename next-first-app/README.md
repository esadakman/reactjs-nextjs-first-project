## Getting Started

- npx create-next-app project-name
- cd project-name
- yarn dev

## [Routing](https://nextjs.org/docs/routing/introduction)

- Next.js has a file-system based router built on the concept of pages.

- When a file is added to the pages directory, it's automatically available as a route.

### Index Routes

- The router will automatically route files named index to the root of the directory.
  - `pages/index.js` → `/`
  - `pages/blog/index.js` → `/blog`

### Nested Routes

- The router supports nested files. If you create a nested folder structure, files will automatically be routed in the same way still.
  - `pages/blog/first-post.js` → `/blog/first-post`
  - `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

### Dynamic Routes

- Defining routes by using predefined paths is not always enough for complex applications. In Next.js you can add brackets to a page ([param]) to create a dynamic route (a.k.a. url slugs, pretty urls, and others).

```jsx
import { useRouter } from "next/router";

function ProductDetail() {
  const router = useRouter();
  //   const productId = router.query.productId
  const { productId } = router.query;
  return <h1>Details About Product {productId}</h1>;
}

export default ProductDetail;
```

### Catch all routes

- Dynamic routes can be extended to catch all paths by adding three dots (...) inside the brackets. For example:
  - `pages/post/[...slug].js` matches `/post/a` but also `/post/a/b`, `/post/a/b/c` and so on.
- Matched parameters will be sent as a query parameter (slug in the example) to the page, and it will always be an array, so, the path `/post/a` will have the following query object: `{ "slug": ["a"] }`
- And in the case of /post/a/b, and any other matching path, new parameters will be added to the array, like so: `{ "slug": ["a", "b"] }`

### Optional catch all routes

Catch all routes can be made optional by including the parameter in double brackets `([[...slug]])`.

For example, `pages/post/[[...slug]].js` will match `/post, /post/a, /post/a/b,` and so on.

The main difference between catch all and optional catch all routes is that with optional, the route without the parameter is also matched (/post in the example above).

The query objects are as follows:

```jsx
{ } // GET `/post` (empty object)
{ "slug": ["a"] } // `GET /post/a` (single-element array)
{ "slug": ["a", "b"] } // `GET /post/a/b` (multi-element array)
```

## [Navigate Between Pages](https://nextjs.org/learn/basics/navigate-between-pages/link-component)

### Link Component

- When linking between pages on websites, you use the `<a>` HTML tag.
- In Next.js, you can use the Link Component next/link to link between pages in your application. `<Link>` allows you to do client-side navigation and accepts props that give you better control over the navigation behavior.

#### Using `<Link>`

```jsx
import Link from "next/link";

export default function FirstPost() {
  return (
    <>
      <h1>First Post</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
```

- As you can see, the Link component is similar to using `<a>` tags, but instead of `<a href="…">`, you use `<Link href="…">`

NOTE: Before Next.js 12.2, it was required that the Link component wrapped an `<a>` tag, but this is not required in versions 12.2 and above.

Link accepts the following props:

- href - The path or URL to navigate to. This is the only required prop. It can also be an object, see example here
- as - Optional decorator for the path that will be shown in the browser URL bar. Before Next.js 9.5.3 this was used for dynamic routes, check our previous docs to see how it worked. Note: when this path differs from the one provided in href the previous href/as behavior is used as shown in the previous docs.
- legacyBehavior - Changes behavior so that child must be `<a>`. Defaults to false.
- passHref - Forces Link to send the href property to its child. Defaults to false
- prefetch - Prefetch the page in the background. Defaults to true. Any `<Link />` that is in the viewport (initially or through scroll) will be preloaded. Prefetch can be disabled by passing prefetch={false}. When prefetch is set to false, prefetching will still occur on hover. Pages using Static Generation will preload JSON files with the data for faster page transitions. Prefetching is only enabled in production.
- replace - Replace the current history state instead of adding a new url into the stack. Defaults to false
- scroll - Scroll to the top of the page after a navigation. Defaults to true
- shallow - Update the path of the current page without rerunning getStaticProps, getServerSideProps or getInitialProps. Defaults to false
- locale - The active locale is automatically prepended. locale allows for providing a different locale. When false href has to include the locale as the default behavior is disabled.

<b>NOTE:</b> when legacyBehavior is not set to true, all anchor tag properties can be passed to next/link as well such as, className, onClick, etc.

## [next/router](https://nextjs.org/docs/api-reference/next/router)

- If you want to access the router object inside any function component in your app, you can use the useRouter hook, take a look at the following example:
- `router.push('/product')`

## [404 Page](https://nextjs.org/docs/advanced-features/custom-error-page#404-page)

- To create a custom 404 page you can create a pages/404.js file. This file is statically generated at build time.

```jsx
// pages/404.js
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```