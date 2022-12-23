# [API Routes](https://nextjs.org/docs/api-routes/introduction)

- Next JS is a full stack framework
- You can write the FE code in React and also write
- APIs that can be called by the front end code API routes allow you to create RESTful endpoints as part of your Next.js application folder structure
- Within the pages folder, you need to create a folder called 'api'
- Within that 'api' folder, you can define all the APIs for your application
- You can add business logic without needing to write any additional custom server code and without having to configure any API routes
- Next JS gives you everything you need to write full-stack React + Node applications

<!-- - API routes provide a solution to build your API with Next.js.

- Any file inside the folder pages/api is mapped to /api/\* and will be treated as an API endpoint instead of a page. They are server-side only bundles and won't increase your client-side bundle size.

- For example, the following API route pages/api/user.js returns a json response with a status code of 200:

```jsx
export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}
``` -->

- For an API route to work, you need to export a function as default (a.k.a request handler), which then receives the following parameters:

  - `req`: An instance of http.IncomingMessage, plus some pre-built middlewares
  - `res`: An instance of http.ServerResponse, plus some helper functions

- To handle different HTTP methods in an API route, you can use req.method in your request handler, like so:

```jsx
export default function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

## API Routes Section Summary 
- API routing mechanism is similar to page based routing mechanism 
- APIs are associated with a route based on their file name 
- Every API route exports a default function typically named as handler function 
- The handler function receives the request and response as parameters  
- We should not call our own API routes for pre-rendering content 
