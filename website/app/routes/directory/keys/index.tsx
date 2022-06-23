import { json, useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";

import { db } from "~/utils/db.server";
import { getClientId } from "~/utils/session.server";

type LoaderData = {
  clientId: string | null,
  keys: Array<{ id: string, publicKey: string, client: { id: string, name: string } }>
}
export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    clientId: await getClientId(request),
    keys: await db.clientKey.findMany({
      take: 20,
      select: {
        id: true,
        publicKey: true,
        client: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    }),
  };
  return json(data);
};

export default function KeysIndexRoute() {
  const { keys, clientId } = useLoaderData<LoaderData>();
  return (
    <div>
      <p>
      {(clientId) ? (
        <Link to="/keys/new">Import a new key</Link>
      ) : (
        <Link to="/login">Login/Register to import a new key</Link>
      )}
      </p>
      <table>
        <thead>
          <tr>
            <th>Key ID</th><th>Client</th><th>Public Key</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td> <Link to={key.id}>{key.id}</Link></td>
              <td> <Link to={`/clients/${key.client.id}`}>{key.client.name}</Link></td>
              <td>{key.publicKey}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}