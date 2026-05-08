import {
  useDeferredValue,
  useMemo,
  useState,
  useTransition
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServices } from "../../services/createServices";
import { VirtualList } from "../../components/VirtualList";
import { PermissionGate } from "../../auth/PermissionGate";
import { useUIStore } from "../../store/uiStore";
import { useFeatureFlags } from "../../flags/FeatureFlagProvider";

export function UsersPage() {
  const { api, telemetry } = useServices();
  const queryClient = useQueryClient();
  const pushToast = useUIStore((state) => state.pushToast);
  const { isEnabled } = useFeatureFlags();

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [isPending, startTransition] = useTransition();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => api.getUsers(signal)
  });

  const toggleMutation = useMutation({
    mutationFn: api.toggleUserActive,

    async onMutate(userId) {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<Awaited<ReturnType<typeof api.getUsers>>>([
        "users"
      ]);

      queryClient.setQueryData<typeof previousUsers>(["users"], (current) =>
        current?.map((user) =>
          user.id === userId ? { ...user, active: !user.active } : user
        )
      );

      return { previousUsers };
    },

    onError(error, _userId, context) {
      queryClient.setQueryData(["users"], context?.previousUsers);
      telemetry.error(error, { area: "users.toggle" });
    },

    onSuccess() {
      pushToast("User updated");
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const filteredUsers = useMemo(() => {
    const normalizedSearch = deferredSearch.toLowerCase();

    return (usersQuery.data ?? []).filter((user) =>
      `${user.name} ${user.role}`.toLowerCase().includes(normalizedSearch)
    );
  }, [usersQuery.data, deferredSearch]);

  if (usersQuery.isLoading) {
    return <div className="card">Loading users...</div>;
  }

  if (usersQuery.isError) {
    return <div className="card danger">Failed to load users.</div>;
  }

  return (
    <div className="stack">
      <section className="card">
        <h1>Users</h1>
        <p>
          Demonstrates React Query, optimistic updates, deferred search,
          virtualization, permissions, and service boundaries.
        </p>

        <input
          placeholder="Search users..."
          value={search}
          onChange={(event) => {
            const nextValue = event.target.value;

            startTransition(() => {
              setSearch(nextValue);
            });
          }}
        />

        {isPending && <p>Filtering...</p>}
      </section>

      <section className="card">
        {isEnabled("virtualized-users") ? (
          <VirtualList
            height={360}
            itemHeight={72}
            items={filteredUsers}
            renderItem={(user) => (
              <div className="row">
                <div>
                  <strong>{user.name}</strong>
                  <p>
                    {user.role} · {user.active ? "active" : "inactive"}
                  </p>
                </div>

                <PermissionGate
                  permission="users:write"
                  fallback={<span>No write permission</span>}
                >
                  <button
                    disabled={toggleMutation.isPending}
                    onClick={() => toggleMutation.mutate(user.id)}
                  >
                    Toggle active
                  </button>
                </PermissionGate>
              </div>
            )}
          />
        ) : (
          filteredUsers.map((user) => (
            <div className="row" key={user.id}>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}