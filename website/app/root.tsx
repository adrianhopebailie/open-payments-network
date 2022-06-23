import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction, LinksFunction } from "remix";

import styles from "~/styles/mvp.css";
import Footer from "~/components/footer";
import Menu from "./components/menu";

export const meta: MetaFunction = () => {
  return { title: "Open Payments Network" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Menu />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
