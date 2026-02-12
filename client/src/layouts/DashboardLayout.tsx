import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
    Collapse,
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
    ExpandLess,
    ExpandMore,
    Add as AddIcon,
    List as ListIcon,
    CheckCircle as ApprovalsIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const DashboardLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [leaveMenuOpen, setLeaveMenuOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    const isManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

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
                {/* Dashboard */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/dashboard')}
                        selected={location.pathname === '/dashboard'}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(46, 125, 50, 0.08)',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'rgba(46, 125, 50, 0.12)',
                                '&:hover': {
                                    bgcolor: 'rgba(46, 125, 50, 0.16)',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#2E7D32', minWidth: 40 }}>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText
                            primary="Dashboard"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* Leave Management with Submenu */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => setLeaveMenuOpen(!leaveMenuOpen)}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(46, 125, 50, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#2E7D32', minWidth: 40 }}>
                            <EventNote />
                        </ListItemIcon>
                        <ListItemText
                            primary="Leave Management"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            }}
                        />
                        {leaveMenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={leaveMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4, borderRadius: 2, mx: 1 }}
                            onClick={() => navigate('/leaves/request')}
                            selected={location.pathname === '/leaves/request'}
                        >
                            <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
                                <AddIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="New Request"
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                            />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, borderRadius: 2, mx: 1 }}
                            onClick={() => navigate('/leaves/my-requests')}
                            selected={location.pathname === '/leaves/my-requests'}
                        >
                            <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
                                <ListIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="My Requests"
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                            />
                        </ListItemButton>
                        {isManager && (
                            <ListItemButton
                                sx={{ pl: 4, borderRadius: 2, mx: 1 }}
                                onClick={() => navigate('/leaves/approvals')}
                                selected={location.pathname === '/leaves/approvals'}
                            >
                                <ListItemIcon sx={{ color: '#2E7D32', minWidth: 36 }}>
                                    <ApprovalsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Approvals"
                                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                                />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>

                {/* Documents */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/documents')}
                        selected={location.pathname === '/documents'}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(46, 125, 50, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#2E7D32', minWidth: 40 }}>
                            <Folder />
                        </ListItemIcon>
                        <ListItemText
                            primary="Documents"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* 360 Surveys */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/surveys')}
                        selected={location.pathname === '/surveys'}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(46, 125, 50, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#2E7D32', minWidth: 40 }}>
                            <Assessment />
                        </ListItemIcon>
                        <ListItemText
                            primary="360 Surveys"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* Team Management (Admin & Manager only) */}
                {isManager && (
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => navigate('/team')}
                            selected={location.pathname === '/team'}
                            sx={{
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: 'rgba(46, 125, 50, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: '#2E7D32', minWidth: 40 }}>
                                <People />
                            </ListItemIcon>
                            <ListItemText
                                primary="Team"
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}
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
