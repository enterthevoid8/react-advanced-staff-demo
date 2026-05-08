import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { Modal } from "./Modal";
import { useFeatureFlags } from "../flags/FeatureFlagProvider";

const commands = [
  { label: "Go to Dashboard", path: "/" },
  { label: "Go to Users", path: "/users" },
  { label: "Go to Projects", path: "/projects" },
  { label: "Go to Experiments", path: "/experiments" },
  { label: "Go to Admin", path: "/admin" }
];

export function CommandPalette() {
  const navigate = useNavigate();
  const { isEnabled } = useFeatureFlags();
  const open = useUIStore((state) => state.commandPaletteOpen);
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);
  const closeCommandPalette = useUIStore((state) => state.closeCommandPalette);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isEnabled("command-palette")) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isCommandK) {
        event.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isEnabled, openCommandPalette]);

  const filteredCommands = useMemo(() => {
    return commands.filter((command) =>
      command.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  if (!open) {
    return null;
  }

  return (
    <Modal title="Command Palette" onClose={closeCommandPalette}>
      <input
        autoFocus
        placeholder="Search command..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="command-list">
        {filteredCommands.map((command) => (
          <button
            key={command.path}
            onClick={() => {
              navigate(command.path);
              closeCommandPalette();
            }}
          >
            {command.label}
          </button>
        ))}
      </div>
    </Modal>
  );
}