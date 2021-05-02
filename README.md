# Podcastr - NLW5
App to listen to the FalaDev podcast episodes.

- [Link](https://podcastr-next-beryl.vercel.app/)

![podcastr](https://raw.githubusercontent.com/saullbrandao/podcastr-next/main/public/podcastr.jpg "Podcastr")

## Technologies
- [Next.js](https://github.com/vercel/next.js/)
- [React](https://github.com/facebook/react)
- [Typescript](https://github.com/microsoft/TypeScript)
- [Sass](https://github.com/sass/sass)
- [Axios](https://github.com/axios/axios)
- [rc-slider](https://github.com/react-component/slider)
- [date-fns](https://github.com/date-fns/date-fns)

## Setup Instructions
- You will need [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/getting-started/install).

1. Clone the repository and run `yarn`
2. Create a .env.local file in the root directory of the project and add the code below: 
    
    ```bash
    API_URL=https://my-json-server.typicode.com/saullbrandao/podcastr-next
    ```
    If you fork the project, you can change the URL above to match your user and repository names on github
    
    ```bash
    API_URL=https://my-json-server.typicode.com/{username}/{repository}
    ```
3. Run `yarn dev`
