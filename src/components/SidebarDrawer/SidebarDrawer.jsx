import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import { Drawer, List, ListItem } from "@mui/material";
import { IconDashboard, IconCalendar, IconNotes } from "@tabler/icons-react";
import Menu from "../Menu/Menu";

const SidebarDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        }
      }}
    >
      <Menu />
    </Drawer>
  );
};

export default SidebarDrawer;