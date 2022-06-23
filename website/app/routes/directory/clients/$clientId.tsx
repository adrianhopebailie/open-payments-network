import { json, useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";
import type { ClientWithKeyIds } from "~/models/client";

import { db } from "~/utils/db.server";

type LoaderData = { client: ClientWithKeyIds }

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.clientId) {
    throw Error("expected params.clientId")
  }

  const client = await db.client.findUnique({
    include: {
      keys: {
        select: {
          id: true,
          publicKey: true
        }
      }
    },
    where: { id: params.clientId },
  });

  if (!client) throw new Response("Client not found", { status: 404 });

  const data: LoaderData = { client };
  return json(data);

};


export default function ClientRoute() {
  const { client } = useLoaderData<LoaderData>();
  return (
    <div>
      <h2><a href={client.url}>{client.name}</a></h2>
      <p>
        <div>Website: {client.url}</div>
        <div>Email: {client.email}</div>
      </p>
      <div>
        <table>
          <thead>
            <tr>
              <th>Key ID</th><th>Public Key</th>
            </tr>
          </thead>
          <tbody>
            {client.keys.map((key) => (
              <tr key={key.id}>
                <td> <Link to={`/keys/${key.id}`}>{key.id}</Link></td>
                <td>{key.publicKey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Link to="/clients">Back</Link> | <Link to="/keys/new">Add key...</Link>
      </div>
    </div>
  );
}