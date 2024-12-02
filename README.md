# Rizzlr.ai

### Install dependencies
Run this command in both the `client` and `server` folders
```shell
npm install
```

### Start Client & Server
Run this command in both the `client` and `server` folders
```shell
npm run dev
```

### Get Local Webhook Endpoint Online
Install ngrok

Add your authtoken to the default ngrok.yml configuration file

`ngrok config add-authtoken YOUR_AUTH_TOKEN`

Start ngrok

Either your ephemeral domain

`ngrok http http://localhost:8080`

Or your static domain

`ngrok http --url=YOUR_STATIC_DOMAIN_NAME.ngrok-free.app 8080`

Get endpoint here (example)

`Forwarding                    https://3868-38-39-161-71.ngrok-free.app -> http://localhost:8080`

Put it in Retell Custom LLM dashboard like this

![image](https://github.com/user-attachments/assets/9bec4740-fdb4-432e-9867-444978b6de06)
![image](https://github.com/user-attachments/assets/151e246b-cd83-4884-8d9e-aeab21507326)

(one of these ways work, maybe both work idk too lazy to test)

### Environment Variables
Make two `.env.development` files and put each in the same level as the `package.json` in the `client` and `server` folders.

Run `npm install dotenv`

Put this in the file
```shell
OPENAI_ORGANIZATION_ID=""
OPENAI_APIKEY=""

TWILIO_ACCOUNT_ID="" # optional
TWILIO_AUTH_TOKEN="" # optional

OPENROUTER_API_KEY=""

RETELL_API_KEY=""

NGROK_IP_ADDRESS=""
```
Your OpenAI API key and Retell API key go here

### Troubleshooting
If running into an error like
```shell
While resolving: framer-motion@11.12.0
npm error Found: react@19.0.0-rc-66855b96-20241106
npm error node_modules/react
npm error   react@"19.0.0-rc-66855b96-20241106" from the root project
npm error   peer react@"^18.2.0 || 19.0.0-rc-66855b96-20241106" from next@15.0.3
npm error   node_modules/next
npm error     next@"15.0.3" from the root project
npm error   2 more (react-dom, styled-jsx)
npm error
npm error Could not resolve dependency:
npm error peerOptional react@"^18.0.0" from framer-motion@11.12.0
npm error node_modules/framer-motion
npm error   framer-motion@"^11.12.0" from the root project
```
Just `--force` everything istg

`npm i framer-motion clsx tailwind-merge three @react-three/fiber @types/three --force`
