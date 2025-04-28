import React from "react";
import { Box, Button, useTheme, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "components/Header";
import Tools from "components/Tools";

import {
  useGetsdgFocusQuery,
  useGetSectorQuery,
  useGetTicketSizeQuery,
} from "state/api";

const ToolsOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: sectors, isLoading: loadingSectors } = useGetSectorQuery();
  const { data: ticketSizes, isLoading: loadingTicketSizes } = useGetTicketSizeQuery();
  const { data: sdgFocus, isLoading: loadingSdgFocus } = useGetsdgFocusQuery();

  const handleCreate = (type) => {
    navigate(`/tools/create/${type}`);
  };

  return (
    <>
      <Box mb={4} m="1.5rem 2.5rem">
        <Header title="Tools" subtitle="List of all Tools" mb={6} />

        {/* SECTORS */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            Sectors
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleCreate("sector")}>
            Create Sector
          </Button>
        </Box>
        <Tools data={sectors} type="sector" loading={loadingSectors} />

        {/* TICKET SIZES */}
        <Box mt={6} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            Ticket Sizes
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleCreate("ticketsize")}>
            Create Ticket Size
          </Button>
        </Box>
        <Tools data={ticketSizes} type="ticketsize" loading={loadingTicketSizes} />

        {/* SDG FOCUS */}
        <Box mt={6} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            SDG Focus
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleCreate("sdgfocus")}>
            Create SDG Focus
          </Button>
        </Box>
        <Tools data={sdgFocus} type="sdgfocus" loading={loadingSdgFocus} />
      </Box>
    </>
  );
};

export default ToolsOverview;
