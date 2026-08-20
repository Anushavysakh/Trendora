import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(-1)}
      sx={{
        color: "#555",
        textTransform: "none",
        fontWeight: 600,
        mb: 2,

        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      Back
    </Button>
  );
}

export default BackButton;