/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default function BasicModal({
  children,
  open,
  setOpen,
  disableEscapeKeyDown = false,
  disableMouseEvent = false,
}) {
  const handleClose = (event, reason) => {
    if (reason === "backdropClick" && !disableMouseEvent) {
      setOpen(false);
    }

    if (reason === "escapeKeyDown" && !disableEscapeKeyDown) {
      setOpen(false);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={disableEscapeKeyDown}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
}
