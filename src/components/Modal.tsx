import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({
  title,
  children,
  onClose
}: {
  title: string;
  children: ReactNode;
  onClose(): void;
}) {
  const previouslyFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement;

    return () => {
      if (previouslyFocusedElement.current instanceof HTMLElement) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button onClick={onClose}>Close</button>
        </div>

        {children}
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}