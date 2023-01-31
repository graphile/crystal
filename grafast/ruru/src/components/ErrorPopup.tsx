import type { FC } from "react";

// TODO: this needs proper design and accessibility considerations

export const ErrorPopup: FC<{ error: Error; onClose: () => void }> = ({
  error,
  onClose,
}) => (
  <div className="errorPopup">
    <button className="errorPopupClose" onClick={onClose}>
      🗙
    </button>
    <div className="errorPopupError">{String(error)}</div>
  </div>
);
