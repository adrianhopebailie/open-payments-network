import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";

import { db } from "~/utils/db.server";
import { requireClientId } from "~/utils/session.server";
import KeyCard from "~/components/key";
import { convertJwkToKey, Ed25519JWK, generateEd25519KeyPair, isValidEd25519JwkPublicKey } from "~/models/key";
import { importJWK } from "jose";
import { JOSENotSupported } from "jose/dist/types/util/errors";

type LoaderData = {
  clientId: string,
  publicKey: string
}

type ActionData = LoaderData & {
  error: string,
}


export const loader: LoaderFunction = async ({ request }) => {
  const clientId = await requireClientId(request);
  const publicKey = JSON.stringify(await generateEd25519KeyPair(), null, 2);
  return { clientId, publicKey }
}

export const action: ActionFunction = async ({ request }) => {

  const clientId = await requireClientId(request)
  const publicKey = await (await request.formData()).get('jwk');

  if (typeof publicKey !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  try {
    const jwk = JSON.parse(publicKey)
    if(!isValidEd25519JwkPublicKey(jwk)){
      return json({
        clientId,
        publicKey,
        error: "Invalid key parameters."
      })
    }
    
    await importJWK(jwk, 'EdDSA')

    const key = await db.clientKey.create({ data: {
      clientId,
      ...convertJwkToKey(jwk)
    }});
  
    return redirect(`/keys/${key.id}`);
  
  } catch (e: any) {

    if(e instanceof SyntaxError){
      return json({
        clientId,
        publicKey,
        error: "JWK is not valid JSON."
      })  
    }

    if(e?.code === 'ERR_JOSE_NOT_SUPPORTED'){
      return json({
        clientId,
        publicKey,
        error: "JSON provided is not a valid JWK."
      })  
    }
    return e
  }  
};

export default function NewKeyRoute() {
  const actionData = useActionData<ActionData>()
  const loaderData = useLoaderData<LoaderData>()
  const { publicKey } = (!actionData) ? loaderData : actionData
  return (
    <form method="post">
      <h3>Import a key</h3>
        {actionData ? (
        <div>
          <p style={{ color: "red" }}>
            {actionData.error}
          </p>
        </div>
        ) : (
        <div>
          <p>The key below has been auto-generated and is ready to be imported.</p>
          <p>Replace this key with your own or <strong>record the private key value (d)</strong> and import this key.</p>
        </div>
        )}      
      <label>Public Key:
        <textarea name="jwk" cols={80} rows={10} defaultValue={publicKey} />
      </label>
      <button type="submit">Import</button>
    </form>
  );
}
