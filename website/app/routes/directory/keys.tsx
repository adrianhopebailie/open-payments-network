import { Outlet } from "remix";

export default function KeysRoute() {
  return (
    <main>
      <h1>Keys</h1>
      <p>Keys are associated with a client.</p>
      <p>They are used to sign client requests as a way to identify the client and secure the integrity of the request.</p>
      <Outlet />
    </main>
  );
}