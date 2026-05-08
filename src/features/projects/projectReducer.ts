import type { Project } from "../../services/mockApi";

export type ProjectWorkflowState = {
  selectedProjectId: string | null;
  draftStatus: Project["status"];
  history: ProjectWorkflowStateSnapshot[];
};

type ProjectWorkflowStateSnapshot = {
  selectedProjectId: string | null;
  draftStatus: Project["status"];
};

export type ProjectWorkflowAction =
  | { type: "select-project"; projectId: string; status: Project["status"] }
  | { type: "change-status"; status: Project["status"] }
  | { type: "undo" }
  | { type: "reset" };

export const initialProjectWorkflowState: ProjectWorkflowState = {
  selectedProjectId: null,
  draftStatus: "planning",
  history: []
};

function snapshot(state: ProjectWorkflowState): ProjectWorkflowStateSnapshot {
  return {
    selectedProjectId: state.selectedProjectId,
    draftStatus: state.draftStatus
  };
}

export function projectWorkflowReducer(
  state: ProjectWorkflowState,
  action: ProjectWorkflowAction
): ProjectWorkflowState {
  switch (action.type) {
    case "select-project":
      return {
        selectedProjectId: action.projectId,
        draftStatus: action.status,
        history: [...state.history, snapshot(state)]
      };

    case "change-status":
      return {
        ...state,
        draftStatus: action.status,
        history: [...state.history, snapshot(state)]
      };

    case "undo": {
      const previous = state.history.at(-1);

      if (!previous) {
        return state;
      }

      return {
        ...previous,
        history: state.history.slice(0, -1)
      };
    }

    case "reset":
      return initialProjectWorkflowState;

    default:
      return state;
  }
}