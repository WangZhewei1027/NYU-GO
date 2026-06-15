import { redirect } from "next/navigation";

// Server-side redirect: crawlers receive a 307 to the live tracker instead of
// an empty client-rendered page, preserving link equity to the canonical app.
export default function Page() {
  redirect("/main/track");
}
