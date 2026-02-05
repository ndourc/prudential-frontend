import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  if (access) {
    redirect("/");
  }

  return <div>{children}</div>;
}

export default layout;
