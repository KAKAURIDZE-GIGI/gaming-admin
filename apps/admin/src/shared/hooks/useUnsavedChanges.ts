import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChanges(isDirty: boolean) {
  const stateRef = useRef({ isDirty, saved: false });

  useEffect(() => {
    stateRef.current.isDirty = isDirty;
    if (!isDirty) {
      stateRef.current.saved = false;
    }
  }, [isDirty]);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const { isDirty: dirty, saved } = stateRef.current;
    return (
      dirty && !saved && currentLocation.pathname !== nextLocation.pathname
    );
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (confirm) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const { isDirty: dirty, saved } = stateRef.current;
      if (dirty && !saved) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const markSaved = () => {
    stateRef.current.saved = true;
    stateRef.current.isDirty = false;
  };

  return { markSaved };
}
