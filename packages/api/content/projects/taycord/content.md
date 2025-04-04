## archived!

taycord is no longer in development, and has been replaced by [euphony](./euphony).

## about

taycord is a free and open source discord client built from the ground up designed to look and feel good. it is built vue, and is written in typescript and uses the vite build tool.

as of now, taycord is barely usable, the basic layout is there including the sidebar w/ channels and guilds and the chat view, but not much else. message fetching is supported as well as sending messages, but gateway events? nope, so you’ll have to refresh the page to see new messages.

## logging in

to use taycord, you’ll need to log in with your discord token. you can get this by:

- going to discord in your browser
- opening the developer console (^shift+i)
- going to the network tab, and refreshing the page
- search “discord api” in the filter text box
- click on any request, and look for the “authorization” header under “request headers”
- copy the value of the “authorization” header, and paste it into the login form

## risks

taycord is a third-party discord client, and as such, it is against discord’s terms of service to use it. using taycord could result in your account being banned, so use at your own risk.
