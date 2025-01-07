"use client";

import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Divider,
    useTheme,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';

export default function PricingPage() {
    const theme = useTheme();
    const [expandedFaq, setExpandedFaq] = React.useState(false);

    const handleFaqChange = (panel) => (event, isExpanded) => {
        setExpandedFaq(isExpanded ? panel : false);
    };

    const faqs = [
        {
            question: "How accurate is the AI transcription?",
            answer: "Our AI transcription system achieves over 95% accuracy across most English accents and dialects. The accuracy improves over time as our AI learns from corrections and feedback."
        },
        {
            question: "Can I upgrade or downgrade my plan at any time?",
            answer: "Yes, you can change your plan at any time. When upgrading, you'll have immediate access to new features. When downgrading, the changes will take effect at the start of your next billing cycle."
        },
        {
            question: "What happens after my free trial ends?",
            answer: "After your 14-day free trial, your account will automatically switch to the plan you selected. We'll send you a reminder email before the trial ends, and you can cancel or change plans at any time."
        },
        {
            question: "Do you support languages other than English?",
            answer: "Yes, we currently support transcription and summarization in 30+ languages including Spanish, French, German, Chinese, and Japanese. The full list of supported languages is available in our documentation."
        },
        {
            question: "What types of files can I upload?",
            answer: "We support all major audio and video formats including MP3, WAV, MP4, AVI, and more. Files can be uploaded directly or imported from popular services like Zoom, Google Drive, and Dropbox."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we take security seriously. All data is encrypted in transit and at rest, and we're compliant with GDPR, HIPAA, and SOC 2 Type II standards. Enterprise plans include additional security features like SSO and custom data retention policies."
        },
        {
            question: "What kind of support do you offer?",
            answer: "Basic plans include email support with 24-hour response time. Professional plans get priority support with 4-hour response time. Enterprise plans receive 24/7 dedicated support with a guaranteed 1-hour response time and a dedicated account manager."
        },
        {
            question: "Can I integrate Recapio.ai with my existing tools?",
            answer: "Yes, we offer integrations with popular platforms like Slack, Microsoft Teams, Zoom, and major CRM systems. Professional and Enterprise plans include access to our API for custom integrations."
        },
        {
            question: "What's included in the Enterprise plan?",
            answer: "Enterprise plans include everything in Professional plus custom feature development, unlimited transcription hours, dedicated account management, custom training sessions, and the option for on-premise deployment. Contact our sales team for a customized solution."
        },
        {
            question: "Do you offer refunds?",
            answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service. Enterprise plans have custom refund policies based on the contract terms."
        }
    ];

    const plans = [
        {
            title: 'Basic',
            price: '$9',
            period: 'per user/month',
            description: 'Perfect for individuals and small teams getting started',
            features: [
                'Up to 10 hours of transcription',
                'Basic AI summarization',
                'Email support',
                'Standard integrations',
                'Mobile app access',
                'Basic analytics',
            ],
            buttonText: 'Start Free Trial',
            highlight: false,
        },
        {
            title: 'Professional',
            price: '$29',
            period: 'per user/month',
            description: 'Ideal for growing businesses and teams',
            features: [
                'Up to 50 hours of transcription',
                'Advanced AI summarization',
                'Priority support',
                'Advanced integrations',
                'Custom workflows',
                'Team collaboration tools',
                'Advanced analytics',
                'API access',
            ],
            buttonText: 'Get Started',
            featured: true,
            highlight: true,
        },
        {
            title: 'Enterprise',
            price: 'Custom',
            period: 'contact for pricing',
            description: 'Tailored solutions for large organizations',
            features: [
                'Unlimited transcription',
                'Enterprise AI features',
                '24/7 dedicated support',
                'Custom integrations',
                'Advanced security',
                'SLA guarantee',
                'Dedicated account manager',
                'Custom training',
                'On-premise deployment option',
            ],
            buttonText: 'Contact Sales',
            highlight: false,
        },
    ];

    return (
        <PageLayout
            title="Pricing Plans"
            subtitle={
                <>
                    Choose the plan that's right for you
                    <br />
                    Start with a 14-day free trial. No credit card needed.
                </>
            }
        >
            {/* Pricing Cards */}
            <ContentCard>
                <Typography variant="h6" gutterBottom>
                    Available Plans
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Select the plan that best fits your needs
                </Typography>

                <Grid container spacing={4} sx={{ mt: 1 }}>
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: plan.featured ? 'primary.main' : 'divider',
                                    p: 0.5,
                                }}
                            >
                                {plan.featured && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: theme.palette.primary.main,
                                            color: 'white',
                                            px: 3,
                                            py: 0.75,
                                            borderRadius: '100px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.02em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            whiteSpace: 'nowrap',
                                            zIndex: 2,
                                        }}
                                    >
                                        <StarIcon sx={{ fontSize: 16 }} />
                                        Most Popular
                                    </Box>
                                )}

                                <Box sx={{ p: 3 }}>
                                    {/* Plan Header */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography 
                                            variant="h6"
                                            sx={{ 
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                mb: 1,
                                            }}
                                        >
                                            {plan.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ 
                                                mb: 2,
                                                height: '2.4em',
                                            }}
                                        >
                                            {plan.description}
                                        </Typography>

                                        {/* Price */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'baseline',
                                            gap: 1,
                                            mb: 1,
                                        }}>
                                            <Typography 
                                                variant="h4"
                                                sx={{ 
                                                    fontWeight: 700,
                                                    color: 'text.primary',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {plan.price}
                                            </Typography>
                                            <Typography 
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontWeight: 500 }}
                                            >
                                                {plan.period}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Features */}
                                    <List sx={{ 
                                        flexGrow: 1,
                                        mb: 3,
                                    }}>
                                        {plan.features.map((feature, idx) => (
                                            <ListItem 
                                                key={idx} 
                                                disableGutters 
                                                sx={{ 
                                                    py: 0.75,
                                                    px: 0,
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 28, mr: 1 }}>
                                                    <CheckCircleIcon 
                                                        sx={{ 
                                                            color: 'success.main',
                                                            fontSize: '1.25rem',
                                                        }} 
                                                    />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={feature}
                                                    sx={{
                                                        m: 0,
                                                        '& .MuiListItemText-primary': {
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500,
                                                            lineHeight: 1.4,
                                                            color: 'text.primary',
                                                        }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    {/* Button */}
                                    <Box sx={{ mt: 'auto' }}>
                                        <Button
                                            fullWidth
                                            variant={plan.featured ? "contained" : "outlined"}
                                            color="primary"
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </ContentCard>

            {/* FAQ Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Typography variant="h6" gutterBottom>
                    Frequently Asked Questions
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Find answers to common questions about our services
                </Typography>

                <Box sx={{ mt: 3 }}>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expandedFaq === `panel${index}`}
                            onChange={handleFaqChange(`panel${index}`)}
                            elevation={0}
                            sx={{
                                mb: 1,
                                bgcolor: 'background.default',
                                '&:before': { display: 'none' },
                                borderRadius: '8px !important',
                                border: '1px solid',
                                borderColor: expandedFaq === `panel${index}` ? 'primary.main' : 'divider',
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    minHeight: 'unset',
                                    '& .MuiAccordionSummary-content': {
                                        my: 1,
                                    },
                                }}
                            >
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        fontWeight: 600,
                                        color: expandedFaq === `panel${index}` ? 'primary.main' : 'text.primary',
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.6 }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </ContentCard>

            {/* Contact Support Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Typography variant="h6" gutterBottom>
                    Still Have Questions?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Our support team is here to help you find the perfect plan for your needs
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    href="/contact"
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                    }}
                >
                    Contact Our Support Team
                </Button>
            </ContentCard>
        </PageLayout>
    );
}
