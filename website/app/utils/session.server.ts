import bcrypt from "bcryptjs";
import {
  createCookieSessionStorage,
  redirect,
} from "remix";

import { db } from "./db.server";

type LoginForm = {
  email: string;
  password: string;
};

export async function login({ email, password }: LoginForm) {
  console.log(`login: ${email}, ${password}, ${bcrypt.hashSync(password)}`)
  const client = await db.client.findUnique({
    select: {
      id: true,
      passwordHash: true
    },
    where: { email },
  });
  if (!client) return null;

  const isCorrectPassword = await bcrypt.compare(
    password,
    client.passwordHash
  );

  if (!isCorrectPassword) return null;

  return { id: client.id, email };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "openpaymentsnetwork_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getSessionCookie(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getClientId(request: Request) {
  const sessionCookie = await getSessionCookie(request);
  const clientId = sessionCookie.get("clientId");
  if (!clientId || typeof clientId !== "string") return null;
  return clientId;
}

export async function requireClientId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getSessionCookie(request);
  const clientId = session.get("clientId");
  if (!clientId || typeof clientId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return clientId;
}

export async function createClientSession(clientId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("clientId", clientId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}