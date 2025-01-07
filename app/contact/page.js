"use client";
import { 
    Grid, 
    Card, 
    Typography, 
    Box, 
    TextField, 
    Button,
    InputAdornment,
    IconButton,
} from '@mui/material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';
import { 
    Email, 
    Phone, 
    LocationOn, 
    Person, 
    Send,
    LinkedIn,
    Twitter,
    Facebook,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function ContactUs() {
    const theme = useTheme();
    const contactInfo = [
        {
            icon: <Email sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
            title: 'Email Us',
            content: 'support@recapio.ai',
            description: 'We\'ll respond within 24 hours',
            action: 'mailto:support@recapio.ai',
            contentColor: theme.palette.primary.main,
        },
        {
            icon: <Phone sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
            title: 'Call Us',
            content: '(724) 562-4729',
            description: 'Mon-Fri from 9am to 5pm EST',
            action: 'tel:+17245624729',
            contentColor: theme.palette.primary.main,
        },
        {
            icon: <LocationOn sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
            title: 'Visit Us',
            content: 'Columbus, OH',
            description: '123 Tech Street, Suite 100',
            action: 'https://maps.google.com',
            contentColor: theme.palette.primary.main,
        },
    ];

    const socialLinks = [
        { icon: <LinkedIn sx={{ fontSize: 20 }} />, href: '#' },
        { icon: <Twitter sx={{ fontSize: 20 }} />, href: '#' },
        { icon: <Facebook sx={{ fontSize: 20 }} />, href: '#' },
    ];

    return (
        <PageLayout
            title="Contact Us"
            subtitle={
                <>
                    Have questions? We'd love to hear from you
                    <br />
                    Our team is here to help
                </>
            }
        >
            {/* Main Contact Section */}
            <ContentCard>
                <Typography variant="h6" gutterBottom>
                    Send us a Message
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fill out the form below and we'll get back to you shortly
                </Typography>

                <Grid container spacing={4} sx={{ mt: 1 }}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Card
                            sx={{
                                height: '100%',
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                p: { xs: 3, md: 4 },
                            }}
                        >
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person sx={{ color: 'text.secondary' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person sx={{ color: 'text.secondary' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Message"
                                    variant="outlined"
                                    multiline
                                    rows={10}
                                    placeholder="How can we help you?"
                                />
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<Send />}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Send Message
                                </Button>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {contactInfo.map((item, index) => (
                                <Card
                                    key={index}
                                    component="a"
                                    href={item.action}
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 3,
                                        bgcolor: 'background.default',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            bgcolor: `${theme.palette.primary.main}14`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, mb: 1 }}>
                                            {item.content}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Card>
                            ))}

                            {/* Social Links */}
                            <Card
                                sx={{
                                    p: 3,
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    mt: 'auto',
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                                    Connect With Us
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {socialLinks.map((social, index) => (
                                        <IconButton
                                            key={index}
                                            href={social.href}
                                            sx={{
                                                color: 'primary.main',
                                                bgcolor: `${theme.palette.primary.main}14`,
                                                '&:hover': {
                                                    bgcolor: `${theme.palette.primary.main}29`,
                                                },
                                            }}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </ContentCard>

            {/* Help Center Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Typography variant="h6" gutterBottom>
                    Need More Help?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Check out our frequently asked questions or browse our knowledge base
                </Typography>
                <Button
                    variant="outlined"
                    size="large"
                    href="/faq"
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        mt: 2,
                    }}
                >
                    Visit Help Center
                </Button>
            </ContentCard>
        </PageLayout>
    );
}
