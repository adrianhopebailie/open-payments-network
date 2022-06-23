import type { ActionFunction } from "remix";
import { useActionData, json, useSearchParams } from "remix";

import { db } from "~/utils/db.server";
import { createClientSession, login } from "~/utils/session.server";

function validateEmail(email: unknown) {
  if (typeof email !== "string" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return `Invalid email address`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) =>
  json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/clients";
  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case "login": {
      const client = await login({ email, password });
      console.log({ client });
      if (!client) {
        return badRequest({
          fields,
          formError: `Email/Password combination is incorrect`,
        });
      }
      return createClientSession(client.id, redirectTo);
    }
    case "register": {
      const clientExists = await db.client.findFirst({
        where: { email },
      });
      if (clientExists) {
        return badRequest({
          fields,
          formError: `Client with email address ${email} already exists`,
        });
      }
      // create the client
      // create their session and redirect to /client/$clientId
      return badRequest({
        fields,
        formError: "Not implemented",
      });
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <main>
      <h1>Login</h1>
      <form method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={
            searchParams.get("redirectTo") ?? undefined
          }
        />
        <fieldset>
          <legend>
            Login or Register?
          </legend>
          <label>
            <input
              type="radio"
              name="loginType"
              value="login"
              defaultChecked={
                !actionData?.fields?.loginType ||
                actionData?.fields?.loginType === "login"
              }
            />{" "}
            Login
          </label>
          <label>
            <input
              type="radio"
              name="loginType"
              value="register"
              defaultChecked={
                actionData?.fields?.loginType ===
                "register"
              }
            />{" "}
            Register
          </label>
        </fieldset>
        <div>
          <label htmlFor="email-input">Email</label>
          <input
            type="text"
            id="email-input"
            name="email"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(
              actionData?.fieldErrors?.email
            )}
            aria-errormessage={
              actionData?.fieldErrors?.email
                ? "email-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p
              className="form-validation-error"
              role="alert"
              id="email-error"
            >
              {actionData.fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            name="password"
            defaultValue={actionData?.fields?.password}
            type="password"
            aria-invalid={
              Boolean(
                actionData?.fieldErrors?.password
              ) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.password
                ? "password-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <button type="submit" className="button">
          Submit
        </button>
      </form>
    </main>
  );
}