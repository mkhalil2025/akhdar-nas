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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Stack,
} from '@mui/material';
import { Check as ApproveIcon, Close as RejectIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { leaveService } from '../services/leave.service';
import { LeaveRequest } from '../types/leave.types';

const LeaveApprovalsPage: React.FC = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadPendingApprovals();
    }, []);

    const loadPendingApprovals = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await leaveService.getPendingApprovals();
            setRequests(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (request: LeaveRequest, type: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setActionType(type);
        setComment('');
        setActionDialogOpen(true);
    };

    const handleActionConfirm = async () => {
        if (!selectedRequest || !actionType) return;

        try {
            setProcessing(true);
            if (actionType === 'approve') {
                await leaveService.approveLeaveRequest(selectedRequest.id, comment || undefined);
            } else {
                await leaveService.rejectLeaveRequest(selectedRequest.id, comment || undefined);
            }
            setActionDialogOpen(false);
            setSelectedRequest(null);
            setActionType(null);
            setComment('');
            loadPendingApprovals();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                `Failed to ${actionType} leave request`
            );
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString: string): string => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    return (
        <Box sx={{ py: 3 }}>
            <Box mb={3}>
                <Typography variant="h4" gutterBottom>
                    Leave Approvals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Approve or reject pending leave requests from your team
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : requests.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Typography variant="body1" color="text.secondary">
                                No pending approvals at this time
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Employee</TableCell>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell align="center">Days</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Requested On</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <div>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {request.applicant.firstName}{' '}
                                                        {request.applicant.lastName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {request.applicant.email}
                                                    </Typography>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={request.leaveType.name}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(request.startDate)}</TableCell>
                                            <TableCell>{formatDate(request.endDate)}</TableCell>
                                            <TableCell align="center">
                                                {request.workingDays || '-'}
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
                                            <TableCell>
                                                {formatDate(request.createdAt)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        startIcon={<ApproveIcon />}
                                                        onClick={() =>
                                                            handleActionClick(request, 'approve')
                                                        }
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<RejectIcon />}
                                                        onClick={() =>
                                                            handleActionClick(request, 'reject')
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Action Confirmation Dialog */}
            <Dialog
                open={actionDialogOpen}
                onClose={() => !processing && setActionDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
                </DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <>
                            <DialogContentText sx={{ mb: 2 }}>
                                <strong>Employee:</strong> {selectedRequest.applicant.firstName}{' '}
                                {selectedRequest.applicant.lastName}
                                <br />
                                <strong>Leave Type:</strong> {selectedRequest.leaveType.name}
                                <br />
                                <strong>Period:</strong> {formatDate(selectedRequest.startDate)} -{' '}
                                {formatDate(selectedRequest.endDate)}
                                <br />
                                <strong>Days:</strong> {selectedRequest.workingDays || 'N/A'}
                            </DialogContentText>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label={`Comment (Optional)`}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={
                                    actionType === 'approve'
                                        ? 'Add an approval note...'
                                        : 'Provide a reason for rejection...'
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialogOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleActionConfirm}
                        color={actionType === 'approve' ? 'success' : 'error'}
                        variant="contained"
                        disabled={processing}
                    >
                        {processing ? (
                            <CircularProgress size={24} />
                        ) : actionType === 'approve' ? (
                            'Approve'
                        ) : (
                            'Reject'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LeaveApprovalsPage;
