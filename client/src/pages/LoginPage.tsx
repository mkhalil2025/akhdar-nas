import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3a1e 0%, #2d5a2d 25%, #3d7a3d 50%, #2d5a2d 75%, #1e3a1e 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                padding: 2,
                position: 'relative',
                overflow: 'hidden',
                '@keyframes gradientShift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)',
                    animation: 'rotate 30s linear infinite',
                },
                '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            }}
        >
            <Card
                sx={{
                    maxWidth: 480,
                    width: '100%',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
            >
                <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="AkhdarNas Logo"
                            sx={{
                                height: 120,
                                mb: 3,
                                filter: 'drop-shadow(0 4px 12px rgba(46, 125, 50, 0.3))',
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '2rem',
                                letterSpacing: '-0.5px',
                            }}
                        >
                            ناس أخضر
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Internal HR Portal
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#2E7D32',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2E7D32',
                                        borderWidth: 2,
                                    },
                                },
                            }}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                mb: 3.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#2E7D32',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2E7D32',
                                        borderWidth: 2,
                                    },
                                },
                            }}
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{
                                py: 1.8,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                                boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1B5E20 0%, #0d3d10 100%)',
                                    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.6)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(0px)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
                        </Button>
                    </form>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 4, textAlign: 'center', fontSize: '0.875rem' }}
                    >
                        © 2026 Akhdar. All rights reserved.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
