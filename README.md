## Getting Started

- npx create-next-app project-name
- cd project-name
- yarn dev

### Routing

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
