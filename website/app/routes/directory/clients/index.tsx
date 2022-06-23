import { json,  useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = {
  clients: Array<{id: string, name: string, url: string, email: string}>
}
export const loader : LoaderFunction = async () => {
  const data: LoaderData = {
    clients: await db.client.findMany({
      take: 5,
      select: { id: true, name: true, url: true, email: true },
      orderBy: { name: "desc" },
    }),
  };
  return json(data);
};

export default function ClientsIndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <table>
    <thead>
      <tr>
        <th>Client</th><th>Website</th><th>Email</th>
      </tr>
    </thead>
    <tbody>{
      data.clients.map((client) => (
        <tr key={client.id}>
          <td> <Link to={client.id}>{client.name}</Link></td>
          <td>{client.url}</td>
          <td>{client.email}</td>
        </tr>
        ))}
    </tbody>
  </table>
  );
}