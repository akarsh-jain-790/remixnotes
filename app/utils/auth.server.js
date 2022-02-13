import bcrypt from "bcryptjs";

import {
  createCookieSessionStorage,
  redirect
} from "remix";

import { db } from "./db.server";

export async function register({
  email,
  password
}) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.users.create({
    data: { email, password:passwordHash, date:new Date() }
  });
}

export async function login({
  email,
  password
}) {
  const user = await db.users.findUnique({
    where: { email }
  });

  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.password
  );
  if (!isCorrectPassword) return null;
  return user;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
});

export function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.users.findUnique({
      where: { id: userId }
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request) {
  const session = await storage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

export async function createUserSession(
  userId,
  redirectTo
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
