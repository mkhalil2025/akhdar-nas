import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    MenuItem,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../services/leave.service';
import { LeaveType, LeaveBalance } from '../types/leave.types';

const LeaveRequestPage: React.FC = () => {
    const navigate = useNavigate();
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: null as Date | null,
        endDate: null as Date | null,
        reason: '',
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [typesData, balancesData] = await Promise.all([
                leaveService.getLeaveTypes(),
                leaveService.getLeaveBalance(),
            ]);
            setLeaveTypes(typesData);
            setLeaveBalances(balancesData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load leave types and balances');
        } finally {
            setLoading(false);
        }
    };

    const getBalanceForType = (leaveTypeId: string): LeaveBalance | undefined => {
        return leaveBalances.find((b) => b.leaveTypeId === leaveTypeId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.endDate < formData.startDate) {
            setError('End date must be after or equal to start date');
            return;
        }

        try {
            setSubmitting(true);
            await leaveService.createLeaveRequest({
                leaveTypeId: formData.leaveTypeId,
                startDate: formData.startDate.toISOString(),
                endDate: formData.endDate.toISOString(),
                reason: formData.reason,
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/leaves/my-requests');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit leave request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    const selectedBalance = formData.leaveTypeId ? getBalanceForType(formData.leaveTypeId) : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ maxWidth: 800, mx: 'auto', py: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Request Leave
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Submit a new leave request for approval
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Leave request submitted successfully! Redirecting...
                    </Alert>
                )}

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Leave Type"
                                        value={formData.leaveTypeId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, leaveTypeId: e.target.value })
                                        }
                                        required
                                    >
                                        {leaveTypes.map((type) => (
                                            <MenuItem key={type.id} value={type.id}>
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {selectedBalance && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                                            <Typography variant="subtitle2">Leave Balance</Typography>
                                            <Typography variant="h6">
                                                {selectedBalance.totalDays - selectedBalance.usedDays} days
                                                available
                                            </Typography>
                                            <Typography variant="caption">
                                                (Used: {selectedBalance.usedDays} / Total:{' '}
                                                {selectedBalance.totalDays})
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Start Date"
                                        value={formData.startDate}
                                        onChange={(date: Date | null) => setFormData({ ...formData, startDate: date })}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="End Date"
                                        value={formData.endDate}
                                        onChange={(date: Date | null) => setFormData({ ...formData, endDate: date })}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                            },
                                        }}
                                        minDate={formData.startDate || undefined}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Reason"
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reason: e.target.value })
                                        }
                                        required
                                        helperText="Please provide a reason for your leave request"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" gap={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={submitting}
                                        >
                                            {submitting ? <CircularProgress size={24} /> : 'Submit Request'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => navigate('/leaves/my-requests')}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </LocalizationProvider>
    );
};

export default LeaveRequestPage;
