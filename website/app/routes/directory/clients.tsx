import { Outlet } from "remix";

export default function ClientsRoute() {
  return (
      <main>
        <h1>Clients</h1>
        <p>Clients are participants on the Open Payments Network that access Open Payment APIs at providers.</p>
        <p>When a client makes a request it identifies itself by signing the request using a key in the registry.</p>
        <Outlet />
      </main>
  );
}