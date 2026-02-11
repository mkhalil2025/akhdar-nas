import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Welcome back, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Role: {user?.role}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Pending Leave Requests
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                            0
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Available Leave Days
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                            15
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Active Surveys
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                            0
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Activity
                </Typography>
                <Typography color="text.secondary">
                    No recent activity
                </Typography>
            </Paper>
        </Box>
    );
};

export default DashboardPage;
