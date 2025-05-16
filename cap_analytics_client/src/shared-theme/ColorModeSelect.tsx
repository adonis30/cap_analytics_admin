import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

interface ColorModeSelectProps {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}

export default function ColorModeSelect({ mode, setMode }: ColorModeSelectProps) {
  return (
    <Select
      value={mode}
      onChange={(e) => setMode(e.target.value as "light" | "dark")}
      SelectDisplayProps={{
        "data-screenshot": "toggle-mode",
      }}
      size="small"
      sx={{ width: 120 }}
    >
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
}
