import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LibraryBooks as LibraryIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transcript Library', icon: <LibraryIcon />, path: '/transcripts' },
  ];

  const isCurrentPath = (path: string) => router.pathname === path;

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setDrawerOpen(true)}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            pt: 2,
          }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.path}
                passHref
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  button
                  sx={{
                    bgcolor: isCurrentPath(item.path)
                      ? theme.palette.action.selected
                      : 'transparent',
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
} 