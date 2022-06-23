import { Client, ClientKey } from "@prisma/client";
import { Link } from "remix";
import { ClientKeyWithPartialClient, convertClientKeyToJwk, Ed25519JWK } from "~/models/key";

export type KeyProps = { clientKey: ClientKeyWithPartialClient}

export default function KeyCard(props: KeyProps) {
  const { clientKey } = props
  return <div>
      <h3>Key: {clientKey.id}</h3>
      <div>Client: <Link to={`/directory/clients/${clientKey.client.id}`}>{clientKey.client.name}</Link></div>
      <JWK { ...convertClientKeyToJwk(clientKey) } />
  </div>
}

export function JWK(props: Ed25519JWK) {
  const jwk = Object.assign({}, props)
  jwk.kid = `https://openpayments.network/directory/keys/${props.kid}`
  return <pre>
    {
      JSON.stringify(jwk, null,2)
    }
  </pre>
}