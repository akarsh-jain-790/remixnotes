import {
  useActionData,
  json,
  useSearchParams,
} from "remix";

import { db } from "~/utils/db.server";

import {
  createUserSession,
  login,
  register
} from "~/utils/auth.server";

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

const badRequest = (data) =>
  json(data, { status: 400 });

export const action = async ({
  request
}) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/notes";
  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    });
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case "login": {
      const user = await login({ email, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `email/Password combination is incorrect`
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.users.findFirst({
        where: { email }
      });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with email ${email} already exists`
        });
      }
      const user = await register({ email, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <div className="content">
    <div className="container">
      <div className="row">
        <div className="col-md-6 contents">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="mb-4">
              <h3>Sign In</h3>
            </div>
			<form
				method="post"
				aria-describedby={
				actionData?.formError
				? "form-error-message"
				: undefined}
			>
			 <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <label className="me-2">
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
        <div className="form-group first">
				<input
				  type="text"
				  id="email-input"
				  name="email"
          placeholder="email"
				  className="form-control"
				  defaultValue={actionData?.fields?.email}
				  aria-invalid={Boolean(
					actionData?.fieldErrors?.email
				  )}
				  aria-describedby={
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
					{actionData?.fieldErrors.email}
				</p>
			  ) : null}
              </div>
              <div className="form-group last mb-4">
            <input
              id="password-input"
              name="password"
			        className="form-control"
              placeholder="password"
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={
                Boolean(
                  actionData?.fieldErrors?.password
                ) || undefined
              }
              aria-describedby={
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
                {actionData?.fieldErrors.password}
              </p>
            ) : null}
              </div>
            <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData?.formError}
              </p>
            ) : null}
			</div>
             <input type="submit" value="Submit" className="btn btn-block btn-primary"/>

            </form>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </div>
  );
}