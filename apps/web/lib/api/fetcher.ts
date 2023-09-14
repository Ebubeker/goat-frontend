import { getSession } from "next-auth/react";

export const fetcher = async (url: string) => {
  const options = {};
  const session = await getSession();
  if (session?.access_token) {
    options["headers"] = {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  const res = await fetch(url, options);
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateRessource = async (url: string, { arg }: { arg: any }) => {
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
};
