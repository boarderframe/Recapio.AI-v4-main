'use client';

import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

export default function NavigationSkeleton() {
  return (
    <>
      {/* Mobile Menu Button */}
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <Skeleton variant="rectangular" width={40} height={40} />
      </Box>

      {/* Logo */}
      <Skeleton 
        variant="rectangular" 
        width={120} 
        height={32} 
        sx={{ display: 'flex', mr: { xs: 0, md: 4 } }} 
      />

      {/* Desktop Navigation */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          flexGrow: 1, 
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center'
        }}
      >
        {[1, 2, 3].map((item) => (
          <Skeleton 
            key={item} 
            variant="rectangular" 
            width={80} 
            height={36} 
          />
        ))}
      </Stack>

      {/* User Menu or Auth Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton 
          variant="rectangular" 
          width={80} 
          height={36} 
          sx={{ display: { xs: 'none', md: 'block' } }}
        />
        <Skeleton 
          variant="rectangular" 
          width={100} 
          height={36} 
          sx={{ display: { xs: 'none', md: 'block' } }}
        />
      </Box>
    </>
  );
} 