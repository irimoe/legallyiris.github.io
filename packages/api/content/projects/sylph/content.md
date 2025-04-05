sylph aims to provide a decent alternative to existing projects like
[Alexays/Waybar] and [Arlur/Astal] that doesn't use the annoyingly limiting
GTK toolkit, instead opting to embed a webview, allowing the end user to do
essentially _whatever they want_.

## about

instead of being constrained by gtk's css implementation or predefined widgets,
sylph allows users to create their desktop components using standard web
technologies. want a status bar? write it in html and css. custom widget? same
deal. sylph provides the foundation and lets you handle the rest.

## technical details

sylph is written in rust and uses gtk's layer shell protocol for wayland
integration. it embeds a webview to render widgets, so that you can use
standard web technologies for styling and interactivity. system information
is exposed through a custom `sylph://` protocol, which supports querying
system information through the `sylph://ipc/*` routes.

[Alexays/Waybar]: https://github.com/Alexays/Waybar
[Arlur/Astal]: https://github.com/Arlur/Astal
