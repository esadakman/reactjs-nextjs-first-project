# [Authentication](https://nextjs.org/docs/authentication)

Authentication verifies who a user is, while authorization controls what a user can access. Next.js supports multiple authentication patterns, each designed for different use cases. This page will go through each case so that you can choose based on your constraints.

## Authentication Patterns

The first step to identifying which authentication pattern you need is understanding the data-fetching strategy you want. We can then determine which authentication providers support this strategy. There are two main patterns:

- Use static generation to server-render a loading state, followed by fetching user data client-side.
- Fetch user data server-side to eliminate a flash of unauthenticated content.

### Authenticating Statically Generated Pages

- Next.js automatically determines that a page is static if there are no blocking data requirements. This means the absence of `getServerSideProps` and `getInitialProps` in the page. Instead, your page can render a loading state from the server, followed by fetching the user client-side.

- One advantage of this pattern is it allows pages to be served from a global CDN and preloaded using `next/link`. In practice, this results in a faster TTI (Time to Interactive).

- Let's look at an example for a profile page. This will initially render a loading skeleton. Once the request for a user has finished, it will show the user's name:

```jsx
/ pages/profile.js

import useUser from '../lib/useUser'
import Layout from '../components/Layout'

const Profile = () => {
  // Fetch the user client-side
  const { user } = useUser({ redirectTo: '/login' })

  // Server-render loading state
  if (!user || user.isLoggedIn === false) {
    return <Layout>Loading...</Layout>
  }

  // Once the user request finishes, show the user
  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  )
}

export default Profile
```

### Authenticating Server-Rendered Pages

- If you export an async function called `getServerSideProps` from a page, Next.js will pre-render this page on each request using the data returned by `getServerSideProps`.

```jsx
export async function getServerSideProps(context) {
  return {
    props: {}, // Will be passed to the page component as props
  };
}
```

- Let's transform the profile example to use server-side rendering. If there's a session, return `user` as a prop to the `Profile` component in the page. Notice there is not a loading skeleton in this example.

```jsx
// pages/profile.js

import withSession from "../lib/session";
import Layout from "../components/Layout";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const { user } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});

const Profile = ({ user }) => {
  // Show the user. No loading state is required
  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  );
};

export default Profile;
```

- An advantage of this pattern is preventing a flash of unauthenticated content before redirecting. It's important to note fetching user data in `getServerSideProps` will block rendering until the request to your authentication provider resolves. To prevent creating a bottleneck and increasing your TTFB (Time to First Byte), you should ensure your authentication lookup is fast. Otherwise, consider static generation.

# [Next Auth](https://next-auth.js.org/getting-started/introduction)

- NextAuth.js is a complete open-source authentication solution for Next.js applications.

- It is designed from the ground up to support Next.js and Serverless.

### [Securing pages and API routes](https://next-auth.js.org/tutorials/securing-pages-and-api-routes)

#### Client Side

- If data on a page is fetched using calls to secure API routes - i.e. routes which use getSession() or getToken() to access the session - you can use the useSession React Hook to secure pages.

```jsx
import { useSession, getSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </>
  );
}
```

#### Server Side

- You can protect server side rendered pages using the `unstable_getServerSession` method. This is different from the old `getSession()` method, in that it does not do an extra fetch out over the internet to confirm data from itself, increasing performance significantly.

- You need to add this to every server rendered page you want to protect. Be aware, `unstable_getServerSession` takes slightly different arguments than the method it is replacing, `getSession`.

```jsx
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (typeof window === "undefined") return null;

  if (session) {
    return (
      <>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>
      </>
    );
  }
  return <p>Access Denied</p>;
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}
```

#### Securing API Routes

<b>Using unstable_getServerSession()</b>

- You can protect API routes using the `unstable_getServerSession()` method.

`pages/api/get-session-example.js`
```jsx 
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2))
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
```