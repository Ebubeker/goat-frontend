import useSWR from "swr";
import { fetchWithAuth, fetcher } from "@/lib/api/fetcher";
import type { Organization } from "@/lib/validations/organization";
import type { InvitationPaginated } from "@/lib/validations/invitation";
import type { GetInvitationsQueryParams } from "@/lib/validations/user";

export const USERS_API_BASE_URL = new URL(
  "api/v1/users",
  process.env.NEXT_PUBLIC_ACCOUNTS_API_URL,
).href;

export const useOrganization = () => {
  const { data, isLoading, error, mutate, isValidating } = useSWR<Organization>(
    `${USERS_API_BASE_URL}/organization`,
    fetcher,
  );
  return {
    organization: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};

export const useInvitations = (queryParams?: GetInvitationsQueryParams) => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR<InvitationPaginated>(
      [`${USERS_API_BASE_URL}/invitations`, queryParams],
      fetcher,
    );
  return {
    invitations: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};

export const acceptInvitation = async (invitationId: string) => {
  const response = await fetchWithAuth(
    `${USERS_API_BASE_URL}/invitations/${invitationId}`,
    {
      method: "PATCH",
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};

export const declineInvitation = async (invitationId: string) => {
  const response = await fetchWithAuth(
    `${USERS_API_BASE_URL}/invitations/${invitationId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};
