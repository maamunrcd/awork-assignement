import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the command center (main dashboard)
  redirect("/dashboard");
}
