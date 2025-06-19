import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  GroupAddOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  ExpandLess,
  ExpandMore,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.jpeg";
import { useAuthStore } from "store/authStore";

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const [clientFacingOpen, setClientFacingOpen] = useState(false);
  const [dealsToolsOpen, setDealsToolsOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuthStore();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleNavigate = (path) => {
    navigate(`/${path}`);
    setActive(path);
  };

  const renderNavItems = (items, paddingLeft = 4) =>
    items.map(({ text, icon }) => {
      const lcText = text.toLowerCase();
      return (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => handleNavigate(lcText)}
            sx={{
              backgroundColor:
                active === lcText
                  ? theme.palette.secondary[300]
                  : "transparent",
              color:
                active === lcText
                  ? theme.palette.primary[600]
                  : theme.palette.secondary[100],
              pl: paddingLeft,
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  active === lcText
                    ? theme.palette.primary[600]
                    : theme.palette.secondary[200],
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
            {active === lcText && <ChevronRightOutlined sx={{ ml: "auto" }} />}
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            {/* Header */}
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  onClick={() => handleNavigate("dashboard")}
                >
                  CAP-ANALYTICS
                </Typography>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(false)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            <List>
              {/* Dashboard */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate("dashboard")}
                  sx={{
                    backgroundColor:
                      active === "dashboard"
                        ? theme.palette.secondary[300]
                        : "transparent",
                    color:
                      active === "dashboard"
                        ? theme.palette.primary[600]
                        : theme.palette.secondary[100],
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ml: "2rem",
                      color:
                        active === "dashboard"
                          ? theme.palette.primary[600]
                          : theme.palette.secondary[200],
                    }}
                  >
                    <HomeOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                  {active === "dashboard" && (
                    <ChevronRightOutlined sx={{ ml: "auto" }} />
                  )}
                </ListItemButton>
              </ListItem>

              {/* Client Facing */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setClientFacingOpen(!clientFacingOpen)}
                >
                  <ListItemText
                    primary="Client Facing"
                    sx={{ pl: "2rem", color: theme.palette.secondary[100] }}
                  />
                  {clientFacingOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              {clientFacingOpen &&
                renderNavItems(
                  [
                    { text: "Companies", icon: <ShoppingCartOutlined /> },
                    { text: "Investors", icon: <Groups2Outlined /> },
                    { text: "Users", icon: <GroupAddOutlined /> },
                    { text: "Fundings", icon: <PublicOutlined /> },
                    { text: "Employees", icon: <GroupAddOutlined /> },
                    { text: "BoardMembers", icon: <GroupAddOutlined /> },
                  ],
                  4
                )}

              {/* Deals and Tools */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setDealsToolsOpen(!dealsToolsOpen)}
                >
                  <ListItemText
                    primary="Deals and Tools"
                    sx={{ pl: "2rem", color: theme.palette.secondary[100] }}
                  />
                  {dealsToolsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              {dealsToolsOpen &&
                renderNavItems(
                  [
                    { text: "tools", icon: <PointOfSaleOutlined /> },
                    { text: "Charts", icon: <ExploreIcon /> },
                    { text: "Monthly", icon: <CalendarMonthOutlined /> },
                    { text: "Breakdown", icon: <PieChartOutlined /> },
                  ],
                  4
                )}

              {/* Management */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setManagementOpen(!managementOpen)}
                >
                  <ListItemText
                    primary="Management"
                    sx={{ pl: "2rem", color: theme.palette.secondary[100] }}
                  />
                  {managementOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              {managementOpen &&
                renderNavItems(
                  [
                    { text: "Admin", icon: <AdminPanelSettingsOutlined /> },
                    { text: "Performance", icon: <TrendingUpOutlined /> },
                  ],
                  4
                )}
            </List>
          </Box>

          {/* Footer */}
          <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={user?.photo || profileImage}
                height="50px"
                width="50px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.firstName + " " + user.lastName}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.role}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
