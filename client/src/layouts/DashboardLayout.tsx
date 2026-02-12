import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    EventNote,
    Folder,
    Assessment,
    Notifications,
    People,
    Logout,
    AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const DashboardLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Leave Requests', icon: <EventNote />, path: '/leaves' },
        { text: 'Documents', icon: <Folder />, path: '/documents' },
        { text: '360 Surveys', icon: <Assessment />, path: '/surveys' },
        ...(user?.role === 'ADMIN' || user?.role === 'MANAGER'
            ? [{ text: 'Team', icon: <People />, path: '/team' }]
            : []),
    ];

    const drawer = (
        <Box>
            <Toolbar
                sx={{
                    bgcolor: 'white',
                    color: '#2E7D32',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 3,
                    gap: 1,
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Box
                    component="img"
                    src="/logo.png"
                    alt="AkhdarNas Logo"
                    sx={{
                        height: 60,
                        mb: 1,
                    }}
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                    ناس أخضر
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    HR Portal
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 1, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: 'rgba(46, 125, 50, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: '#2E7D32', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        AkhdarNas Portal
                    </Typography>
                    <IconButton
                        onClick={() => navigate('/notifications')}
                        sx={{
                            mr: 2,
                            '&:hover': {
                                bgcolor: 'rgba(46, 125, 50, 0.08)',
                            },
                        }}
                    >
                        <Badge badgeContent={0} color="error">
                            <Notifications sx={{ color: 'text.secondary' }} />
                        </Badge>
                    </IconButton>
                    <IconButton onClick={handleMenuOpen}>
                        <Avatar sx={{ bgcolor: '#2E7D32' }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem disabled>
                            <Typography variant="body2">
                                {user?.firstName} {user?.lastName}
                            </Typography>
                        </MenuItem>
                        <MenuItem disabled>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                            <ListItemIcon>
                                <AccountCircle fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8,
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
