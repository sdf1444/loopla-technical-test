'use client';

import { Collapse, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SuccessAlertProps {
  show: boolean;       // Determines whether the alert is visible
  onClose: () => void; // Callback when user closes the alert
}

export default function SuccessAlert({ show, onClose }: SuccessAlertProps) {
  return (
    // Collapse animates the alert when showing or hiding
    <Collapse in={show}>
      <Alert
        severity="success"
        sx={{ mb: 2 }}
        action={
          // Close button for dismissing the alert
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {/* Message displayed when an event is successfully created */}
        Event created successfully! 🎉
      </Alert>
    </Collapse>
  );
}