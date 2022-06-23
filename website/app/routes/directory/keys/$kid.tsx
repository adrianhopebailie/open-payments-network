import { json, useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";
import type { ClientKey, ClientKeyWithPartialClient } from "~/models/key";

import { db } from "~/utils/db.server";
import KeyCard from "~/components/key";

type LoaderData = { clientKey: ClientKeyWithPartialClient }

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.kid) {
    throw Error("expected params.kid")
  }

  const key = await db.clientKey.findUnique({
    include : {
      client : true
    },
    where: { id: params.kid },
  });

  if (!key) throw new Response("Key not found", { status: 404 });

  const data: LoaderData = { clientKey: key };
  return json(data);

};

export default function KeyRoute() {
  const data = useLoaderData<LoaderData>();
  return <KeyCard {...data} />;
}