import type { CookieOptions, Request } from "express";

export function getSessionCookieOptions(req: Request): CookieOptions {
  const isLocalHttp = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  // Preview is public HTTPS in a cross-site frame even when the upstream request is HTTP.
  return isLocalHttp
    ? { httpOnly: true, path: "/", sameSite: "lax", secure: false }
    : { httpOnly: true, path: "/", sameSite: "none", secure: true };
}
