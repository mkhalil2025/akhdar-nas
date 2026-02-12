import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { leaveService } from '../services/leave.service';
import { LeaveRequest, LeaveStatus } from '../types/leave.types';

const MyLeavesPage: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadRequests();
    }, [selectedTab]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const statusFilter = getStatusFilter();
            const data = await leaveService.getMyLeaveRequests(statusFilter);
            setRequests(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    const getStatusFilter = (): LeaveStatus | undefined => {
        switch (selectedTab) {
            case 1:
                return LeaveStatus.PENDING;
            case 2:
                return LeaveStatus.APPROVED;
            case 3:
                return LeaveStatus.REJECTED;
            default:
                return undefined; // All
        }
    };

    const handleDeleteClick = (requestId: string) => {
        setRequestToDelete(requestId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!requestToDelete) return;

        try {
            setDeleting(true);
            await leaveService.cancelLeaveRequest(requestToDelete);
            setDeleteDialogOpen(false);
            setRequestToDelete(null);
            loadRequests();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to cancel leave request');
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status: LeaveStatus): 'warning' | 'success' | 'error' => {
        switch (status) {
            case LeaveStatus.PENDING:
                return 'warning';
            case LeaveStatus.APPROVED:
                return 'success';
            case LeaveStatus.REJECTED:
                return 'error';
        }
    };

    const formatDate = (dateString: string): string => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    return (
        <Box sx={{ py: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <div>
                    <Typography variant="h4" gutterBottom>
                        My Leave Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and manage your leave requests
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/leaves/request')}
                >
                    New Request
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Card>
                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="All" />
                    <Tab label="Pending" />
                    <Tab label="Approved" />
                    <Tab label="Rejected" />
                </Tabs>

                <CardContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : requests.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Typography variant="body1" color="text.secondary">
                                No leave requests found
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/leaves/request')}
                            >
                                Create Your First Request
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell align="center">Days</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.leaveType.name}</TableCell>
                                            <TableCell>{formatDate(request.startDate)}</TableCell>
                                            <TableCell>{formatDate(request.endDate)}</TableCell>
                                            <TableCell align="center">
                                                {request.workingDays || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={request.status}
                                                    color={getStatusColor(request.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {request.reason}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {request.status === LeaveStatus.PENDING && (
                                                    <Tooltip title="Cancel Request">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDeleteClick(request.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
                <DialogTitle>Cancel Leave Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this leave request? This action cannot be
                        undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                        No, Keep It
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" disabled={deleting}>
                        {deleting ? <CircularProgress size={24} /> : 'Yes, Cancel Request'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyLeavesPage;
