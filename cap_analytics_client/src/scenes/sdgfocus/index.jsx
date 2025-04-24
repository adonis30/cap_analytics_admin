import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetsdgFocusQuery } from "state/api";
import StatBox from "components/StatBox";
import { CircleChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SdgFocusGrid from "components/SdgFocusGrid";

const SdgFocusOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: rawData, isLoading } = useGetsdgFocusQuery();
  

  // 1) Show a loader while fetching
  if (isLoading) return <CircleChevronRight />;

  // 2) Normalize into an actual array
  //    If your endpoint returns { sdgFocus: [...] } adjust accordingly:
  const sdgFocusList = Array.isArray(rawData)
    ? rawData
    : rawData?.sdgFocus ?? [];

  const handleCreate = () => navigate("/sdgfocus/create");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SDG Focus" subtitle="List of all SDG Focus" mb={6} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">SDG Focus</Typography>
      </Box>

      {/* 3) Safely read length */}
      <StatBox
        title={sdgFocusList.length}
        subtitle="Total SDG Focus"
        icon={<CircleChevronRight />}
        onClick={handleCreate}
      />

      {/* 4) Pass the array down */}
      <SdgFocusGrid data={sdgFocusList} />
    </Box>
  );
};

export default SdgFocusOverview;
