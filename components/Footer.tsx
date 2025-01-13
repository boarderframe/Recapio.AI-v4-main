'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
  IconButton,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import {
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import Logo from './Logo';

interface FooterProps {
  minimal?: boolean;
}

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Use Cases', href: '/use-cases' },
      { label: 'API', href: '/api-docs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Support', href: '/support' },
      { label: 'Status', href: '/status' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { icon: <TwitterIcon />, href: 'https://twitter.com/recapio' },
  { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/recapio' },
  { icon: <GitHubIcon />, href: 'https://github.com/recapio' },
];

export default function Footer({ minimal = false }: FooterProps) {
  const theme = useTheme();
  const year = new Date().getFullYear();

  if (minimal) {
    return (
      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          py: 2,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              © {year} Recapio.AI
            </Typography>
            <Stack direction="row" spacing={2}>
              <MuiLink
                component={Link}
                href="/terms"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Terms
              </MuiLink>
              <MuiLink
                component={Link}
                href="/privacy"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Privacy
              </MuiLink>
            </Stack>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Transform your audio and video content into actionable insights with our
              AI-powered transcription platform.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    href={link.href}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8 }}
        >
          © {year} Recapio.AI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
} 