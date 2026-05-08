import { ReactNode, useMemo, useState } from "react";

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem
}: {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem(item: T, index: number): ReactNode;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = Math.min(items.length, start + visibleCount + 4);

    return {
      start: Math.max(0, start - 2),
      end
    };
  }, [scrollTop, itemHeight, height, items.length]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      className="virtual-list"
      style={{ height }}
      onScroll={(event) => {
        setScrollTop(event.currentTarget.scrollTop);
      }}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index;

          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                height: itemHeight,
                left: 0,
                right: 0
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}