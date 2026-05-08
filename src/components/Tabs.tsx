import { ReactNode, createContext, useContext, useId, useState } from "react";

type TabsContextValue = {
  selected: string;
  setSelected(value: string): void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs.Root>");
  }

  return context;
}

function Root({
  defaultValue,
  children
}: {
  defaultValue: string;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState(defaultValue);
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ selected, setSelected, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <div className="tab-list" role="tablist">
      {children}
    </div>
  );
}

function Trigger({
  value,
  children
}: {
  value: string;
  children: ReactNode;
}) {
  const { selected, setSelected, baseId } = useTabsContext();
  const active = selected === value;

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${baseId}-panel-${value}`}
      className={active ? "active" : ""}
      onClick={() => setSelected(value)}
    >
      {children}
    </button>
  );
}

function Panel({
  value,
  children
}: {
  value: string;
  children: ReactNode;
}) {
  const { selected, baseId } = useTabsContext();

  if (selected !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className="tab-panel"
    >
      {children}
    </div>
  );
}

export const Tabs = {
  Root,
  List,
  Trigger,
  Panel
};