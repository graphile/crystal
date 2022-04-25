import type { FC, MouseEventHandler } from "react";
import { useCallback, useRef } from "react";

import type { ExplainDetails } from "../hooks/useExplain.js";

function getWindowWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth,
  );
}

function getWindowHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight,
  );
}

// How wide should the "drag" bar be?
export const DRAG_WIDTH = 14;

interface DragDetails {
  startX: number;
  startY: number;
}

export const ExplainDragBar: FC<{ details: ExplainDetails }> = ({
  details,
}) => {
  const detailsRef = useRef(details);
  detailsRef.current = details;
  const currentDragRef = useRef<DragDetails | null>(null);
  const onMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (currentDragRef.current) {
      return;
    }
    e.preventDefault();
    currentDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
    };
    function mouseMove(e: MouseEvent) {
      const drag = currentDragRef.current;
      if (!drag) {
        return;
      }
      e.preventDefault();
      const diffX = e.clientX - drag.startX;
      const diffY = e.clientY - drag.startY;
      console.log(diffX, diffY);
      const deets = detailsRef.current;
      const setW = () =>
        deets.setExplainSize(getWindowWidth() - e.clientX + 0.5 * DRAG_WIDTH);
      const setH = () =>
        deets.setExplainSize(getWindowHeight() - e.clientY + 0.5 * DRAG_WIDTH);
      if (!deets.explainAtBottom) {
        if (diffY > Math.abs(diffX) && diffY > 50) {
          deets.setExplainAtBottom(true);
          setH();
          currentDragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
          };
        } else {
          setW();
        }
      } else {
        if (diffX > Math.abs(diffY) && diffX > 50) {
          deets.setExplainAtBottom(false);
          setW();
          currentDragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
          };
        } else {
          setH();
        }
      }
    }
    function mouseUp() {
      currentDragRef.current = null;
      window.removeEventListener("mousemove", mouseMove, false);
      window.removeEventListener("mouseup", mouseUp, false);
    }
    window.addEventListener("mousemove", mouseMove, false);
    window.addEventListener("mouseup", mouseUp, false);
  }, []);
  return (
    <div
      style={{
        boxSizing: "border-box",
        flex: `0 0 ${DRAG_WIDTH}px`,
        backgroundColor: "rgb(238, 238, 238)",
        border: "1px solid rgb(224, 224, 224)",
        ...(details.explainAtBottom
          ? {
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            }
          : {
              borderTopWidth: 0,
              borderBottomWidth: 0,
              borderLeftWidth: 1,
              borderRightWidth: 1,
            }),
        cursor: details.explainAtBottom ? "row-resize" : "col-resize",
      }}
      onMouseDown={onMouseDown}
    ></div>
  );
};
