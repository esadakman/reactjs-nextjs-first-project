# Miscellaneous Section

## [next/image](https://nextjs.org/docs/api-reference/next/image)

- This next/image component uses browser native lazy loading, which may fallback to eager loading for older browsers before Safari 15.4. When using the blur-up placeholder, older browsers before Safari 12 will fallback to empty placeholder. When using styles with width/height of auto, it is possible to cause Layout Shift on older browsers before Safari 15 that don't preserve the aspect ratio. For more details, see this MDN video.

### Required Props

- The `<Image />` component requires the following properties.

#### src

Must be one of the following:

- A statically imported image file, or
- A path string. This can be either an absolute external URL, or an internal path depending on the loader prop.
  When using an external URL, you must add it to remotePatterns in next.config.js.

#### width

- The width property represents the rendered width in pixels, so it will affect how large the image appears.

- Required, except for statically imported images or images with the fill property.

#### height

- The height property represents the rendered height in pixels, so it will affect how large the image appears.

- Required, except for statically imported images or images with the fill property.

#### alt

- The alt property is used to describe the image for screen readers and search engines. It is also the fallback text if images have been disabled or an error occurs while loading the image.

- It should contain text that could replace the image without changing the meaning of the page. It is not meant to supplement the image and should not repeat information that is already provided in the captions above or below the image.

- If the image is purely decorative or not intended for the user, the alt property should be an empty string (alt="").

### Optional Props

- The `<Image />` component accepts a number of additional properties beyond those which are required. This section describes the most commonly-used properties of the Image component. Find details about more rarely-used properties in the Advanced Props section.

#### loader

- A custom function used to resolve image URLs.

- A loader is a function returning a URL string for the image, given the following parameters:
  - src
  - width
  - quality

Here is an example of using a custom loader:

```jsx
import Image from "next/image";

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
};

const MyImage = (props) => {
  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
};
```

#### fill

- A boolean that causes the image to fill the parent element instead of setting width and height.

- The parent element must assign position: "relative", position: "fixed", or position: "absolute" style.

- By default, the img element will automatically be assigned the position: "absolute" style.

- The default image fit behavior will stretch the image to fit the container. You may prefer to set object-fit: "contain" for an image which is letterboxed to fit the container and preserve aspect ratio.

- Alternatively, object-fit: "cover" will cause the image to fill the entire container and be cropped to preserve aspect ratio. For this to look correct, the overflow: "hidden" style should be assigned to the parent element.

#### sizes

- A string that provides information about how wide the image will be at different breakpoints. The value of sizes will greatly affect performance for images using fill or which are styled to have a responsive size.

#### quality

- The quality of the optimized image, an integer between 1 and 100, where 100 is the best quality and therefore largest file size. Defaults to 75.

#### priority

- When true, the image will be considered high priority and preload. Lazy loading is automatically disabled for images using priority.

- You should use the priority property on any image detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.

- Should only be used when the image is visible above the fold. Defaults to false.

#### placeholder

- A placeholder to use while the image is loading. Possible values are blur or empty. Defaults to empty.

- When blur, the blurDataURL property will be used as the placeholder. If src is an object from a static import and the imported image is .jpg, .png, .webp, or .avif, then blurDataURL will be automatically populated.

- For dynamic images, you must provide the blurDataURL property. Solutions such as Plaiceholder can help with base64 generation.

- When empty, there will be no placeholder while the image is loading, only empty space.

## [Absolute Imports and Module path aliases](https://nextjs.org/docs/advanced-features/module-path-aliases)

- Next.js automatically supports the tsconfig.json and jsconfig.json "paths" and "baseUrl" options since Next.js 9.4.

`Note: jsconfig.json can be used when you don't use TypeScript`
`Note: you need to restart dev server to reflect modifications done in tsconfig.json / jsconfig.json`

- These options allow you to configure module aliases, for example a common pattern is aliasing certain directories to use absolute paths.

- One useful feature of these options is that they integrate automatically into certain editors, for example vscode.

- The baseUrl configuration option allows you to import directly from the root of the project.

An example of this configuration:

```jsx
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

```jsx
// components/button.js
export default function Button() {
  return <button>Click me</button>;
}
```

```jsx
// pages/index.js
import Button from "components/button";

export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  );
}
```

- While baseUrl is useful you might want to add other aliases that don't match 1 on 1. For this TypeScript has the "paths" option.

- Using "paths" allows you to configure module aliases. For example @/components/_ to components/_.

An example of this configuration:

```jsx
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```jsx
// components/button.js
export default function Button() {
  return <button>Click me</button>;
}
```

```jsx
// pages/index.js
import Button from "@/components/button";

export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  );
}
```

# Next Build, start and export

- next build — Builds the application for production in the .next folder
- next start - Starts a Node.js server that supports hybrid pages, serving both statically generated and server-side rendered pages
- next export - Exports all your pages to static HTM L files that you can serve without the need of a Node.js server
- Host your app on any static hosting service or a CDN without having to maintain a server
- Cannot use ISR or SSR
- Client side data fetching for dynamic content
- Landing pages, blogs and any app where the content is generated at build time

# [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode)

- In the Pages documentation and the Data Fetching documentation, we talked about how to pre-render a page at build time (Static Generation) using getStaticProps and getStaticPaths.

- Static Generation is useful when your pages fetch data from a headless CMS. However, it’s not ideal when you’re writing a draft on your headless CMS and want to preview the draft immediately on your page. You’d want Next.js to render these pages at request time instead of build time and fetch the draft content instead of the published content. You’d want Next.js to bypass Static Generation only for this specific case.

- Next.js has a feature called Preview Mode which solves this problem.

## [Redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects) 

- Redirects allow you to redirect an incoming request path to a different destination path.

- To use Redirects you can use the redirects key in `next.config.js`:

```jsx
module.exports = {
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },

    ];
  },
};
```
- redirects is an async function that expects an array to be returned holding objects with source, destination, and permanent properties:

  - `source` is the incoming request path pattern.
  - `destination` is the path you want to route to.
  - `permanent` `true` or `false` - if true will use the 308 status code which instructs clients/search engines to cache the redirect forever, if `false` will use the 307 status code which is temporary and is not cached.
  - `basePath`: `false` or `undefined` - if false the basePath won't be included when matching, can be used for external redirects only.
  - `locale`: false or undefined - whether the locale should not be included when matching.
  - `has` is an array of has objects with the `type`, `key` and `value` properties.
  - `missing` is an array of missing objects with the `type`, `key` and `value` properties.

- Redirects are checked before the filesystem which includes pages and /public files.

- Redirects are not applied to client-side routing (Link, router.push), unless Middleware is present and matches the path.

- When a redirect is applied, any query values provided in the request will be passed through to the redirect destination. For example, see the following redirect configuration:
```jsx
{
  source: '/old-blog/:path*',
  destination: '/blog/:path*',
  permanent: false
}
```
- When `/old-blog/post-1?hello=world` is requested, the client will be redirected to `/blog/post-1?hello=world`.

## [Path Matching](https://nextjs.org/docs/api-reference/next.config.js/redirects#path-matching)
- Path matches are allowed, for example /old-blog/:slug will match /old-blog/hello-world (no nested paths):
```jsx
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
}
```

# [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

- Next.js comes with built-in support for environment variables, which allows you to do the following:
  - Use `.env.local` to load environment variables
  - Expose environment variables to the browser by prefixing with `NEXT_PUBLIC_`

### Loading Environment Variables
- Next.js has built-in support for loading environment variables from `.env.local` into `process.env`.
An example `.env.local:`
```
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```
This loads `process.env.DB_HOST`, `process.env.DB_USER`, and `process.env.DB_PASS` into the Node.js environment automatically allowing you to use them in Next.js data fetching methods and API routes.

For example, using `getStaticProps`:

```jsx
// pages/index.js
export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

