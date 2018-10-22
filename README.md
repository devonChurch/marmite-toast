# Marmite Toast 🍞 🍽️ 😋

An [AWS](https://aws.amazon.com/) / [Okta](https://www.okta.com/) Serverless authentication system.

![aws](https://user-images.githubusercontent.com/15273233/47283361-9a9c0500-d63f-11e8-86fa-64a059c14263.png) ![plus](https://user-images.githubusercontent.com/15273233/47283507-3463b200-d640-11e8-8ac9-a4c698a96a0c.png) ![okta](https://user-images.githubusercontent.com/15273233/47283363-9e2f8c00-d63f-11e8-8936-099d5db746a6.png)

## Client side authentication

Application authentication is handled via a [React](https://reactjs.org/) based implementation with [Okta's Higher order component](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react) and [React Router](https://github.com/ReactTraining/react-router).

I created a custom `<AuthViews /> component that handles the three authentication views on a per route basis:

1. ### Is _authenticating..._.

   A _"standby"_ phase while we authenticate the current user session against Okta.

   ![authenticating](https://user-images.githubusercontent.com/15273233/47283013-e8b00900-d63d-11e8-9b77-33b057910d10.png)

2. ### Is authenticated.

   The _"logged in"_ view after successfully authenticating the current user session against Okta.

   ![is authenticated](https://user-images.githubusercontent.com/15273233/47283007-e2ba2800-d63d-11e8-9aa9-cd0825178520.png)

   Once logged in we can obtain more information about the user and use this meta data to display a custom welcome message or log bespoke user event to [Google Analytics](https://analytics.google.com/).

3. ### Is **not** authenticated.

   The _"logged out"_ view after either destroying a logged in state or failing to authenticate the current user session against Okta.

   ![not authenticated](https://user-images.githubusercontent.com/15273233/47283010-e5b51880-d63d-11e8-9d51-33490917fe7b.png)

## Server side authentication

Private Data is retrieved from behind a Lambda _"bridge"_ that is backed by [Okta's JWT Verifier](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier).

The Lambda scaffold is generated via the [serverless.com framework](https://serverless.com/) and granted permission to access via the `server less.yml` IAM hooks.

The sequence in this proof of concept is as follows:

1. The `getdata` handler receives a `POST` request.
2. The JWT from the authorisation header is extracted and verified with Okta.
3. Once authenticated, we retrieve the sensitive data _(in this case a `.csv` files in S3)_.
4. The data is converted into `json` and returned to the client.

### Infrastructure

![marmite-toast](https://user-images.githubusercontent.com/15273233/47283069-2ca30e00-d63e-11e8-88cd-8bc4c0650f72.png)

## Single page app

Because we are using an SPA methodology in conjunction with a Serverless implementation we need to serve our application shell from a single static cached reference. We cannot therefore resolve routes server side so we use AWS Route 53 and AWS CloudFront to return any route under the application domain with the application shell. This allows routing to be resolved on the client which keeps infrastructure costs low and performance fast due to leveraging Edge Locations.

## GLHF

🎉 😀 👍
