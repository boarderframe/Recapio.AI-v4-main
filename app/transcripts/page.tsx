"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  CircularProgress,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Clear as ClearIcon,
  TuneRounded as FilterIcon,
  AccessTime as RecentIcon,
  Star as StarIcon,
  Folder as CollectionsIcon,
  Tag as TagIcon,
  AllInbox as AllIcon,
} from "@mui/icons-material";
import { debounce } from "lodash";

import { PageLayout } from "@/components/layout/PageLayout";
import ContentCard from "@/components/ContentCard";
import TranscriptList from "../../src/components/Transcripts/TranscriptList";
import TranscriptGrid from "../../src/components/Transcripts/TranscriptGrid";
import { useTranscripts } from "../../src/hooks/useTranscripts";
import type { Transcript } from "../../src/types/transcript";

const sidebarItems = [
  { id: "recent", label: "Recent", icon: <RecentIcon />, count: 5 },
  { id: "favorites", label: "Favorites", icon: <StarIcon />, count: 3 },
  { id: "collections", label: "Collections", icon: <CollectionsIcon />, count: 2 },
  { id: "tags", label: "AI Tags", icon: <TagIcon />, count: 8 },
];

const allTranscriptsItem = { id: "all", label: "Transcripts", icon: <AllIcon />, count: 12 };

export default function TranscriptsPage() {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { transcripts, isLoading, error } = useTranscripts();

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const filteredTranscripts = useMemo(() => {
    if (!transcripts) return [];

    return transcripts.filter((transcript: Transcript) => {
      const matchesSearch =
        !searchQuery ||
        transcript.title.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      switch (selectedType) {
        case "recent": {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(transcript.date) >= oneWeekAgo;
        }
        case "favorites":
          return transcript.isFavorite;
        case "collections":
          return !!transcript.category;
        case "tags":
          return transcript.type !== undefined;
        case "all":
        default:
          return true;
      }
    });
  }, [transcripts, searchQuery, selectedType]);

  if (error) {
    return (
      <PageLayout
        layout="app"
        title="Transcripts"
        subtitle="Manage your transcripts"
      >
        <Typography color="error" variant="h6">
          Failed to load transcripts. Please try again later.
        </Typography>
      </PageLayout>
    );
  }

  const toolbar = (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        mb: 3,
        border: "1px solid",
        borderColor: theme.palette.divider,
        borderRadius: 1,
        bgcolor: "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: 1,
        height: 48,
      }}
    >
      {/* Search Field Container */}
      <Box 
        sx={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center",
          height: "100%",
        }}
      >
        <TextField
          placeholder={`Search ${selectedType}...`}
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: 20,
                  }} 
                />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'transparent',
                    }
                  }}
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              height: 40,
              '& .MuiInputAdornment-root': {
                height: 40,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }
          }}
          sx={{
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              paddingLeft: 1,
              paddingRight: 1,
              '& input': {
                padding: '8px 0',
              }
            },
          }}
        />
      </Box>

      {/* Action Buttons Container */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center",
          height: 40,
          gap: 0.5,
        }}
      >
        <IconButton
          color="primary"
          onClick={() => {
            // filter logic here
          }}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: theme.palette.grey[50],
            '&:hover': {
              bgcolor: theme.palette.grey[100],
            },
            '& .MuiSvgIcon-root': {
              fontSize: 20,
            }
          }}
        >
          <FilterIcon />
        </IconButton>

        <ToggleButtonGroup
          size="small"
          value={viewMode}
          exclusive
          onChange={(_, value) => value && setViewMode(value)}
          sx={{
            height: 40,
            gap: 0.5,
            border: 'none',
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: 1,
              width: 40,
              height: 40,
              padding: 0,
              '&.Mui-selected': {
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              },
              '&:hover': {
                bgcolor: theme.palette.grey[100],
              },
              '& .MuiSvgIcon-root': {
                fontSize: 20,
              }
            },
          }}
        >
          <ToggleButton value="list" aria-label="list view">
            <ListIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <GridIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );

  const content = (
    <ContentCard>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              position: "sticky",
              top: 24,
              bgcolor: theme.palette.grey[50],
              transition: "box-shadow 0.2s ease-in-out",
              "&:hover": {
                boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
              },
            }}
          >
            {/* Sidebar Header */}
            <Box 
              sx={{ 
                m: 0,
                mx: -2,
                mt: -2,
                height: 56,
                bgcolor: theme.palette.primary.main,
                background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                boxShadow: `0 2px 4px ${theme.palette.primary.main}40`,
                position: 'sticky',
                top: 24,
                zIndex: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${theme.palette.common.white}30, transparent)`,
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  m: 0,
                  p: 0,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: 'white',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                Browse Transcripts
              </Typography>
            </Box>

            {/* Sidebar Items */}
            <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <List sx={{ px: 0, mt: 0.5 }}>
                {sidebarItems.map((item) => {
                  const isSelected = selectedType === item.id;
                  return (
                    <ListItem
                      key={item.id}
                      onClick={() => setSelectedType(item.id)}
                      button
                      selected={isSelected}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 1,
                        cursor: "pointer",
                        mb: 0.5,
                        px: 2,
                        height: 48,
                        position: "relative",
                        borderLeft: isSelected
                          ? `4px solid ${theme.palette.primary.main}`
                          : "4px solid transparent",
                        bgcolor: isSelected
                          ? theme.palette.action.selected
                          : "transparent",
                        color: isSelected
                          ? theme.palette.primary.main
                          : "text.primary",
                        transition: "background-color 0.3s, border-left 0.3s",
                        "&:hover": {
                          bgcolor: isSelected
                            ? theme.palette.action.selected
                            : theme.palette.action.hover,
                        },
                      }}
                      aria-current={isSelected ? "page" : undefined}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 20,
                          height: 20,
                          mr: 2,
                          color: isSelected ? "inherit" : "primary.main",
                          "& svg": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: "0.95rem",
                            fontWeight: isSelected ? 600 : 500,
                            letterSpacing: "-0.01em",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            mt: 0,
                            mb: 0,
                          },
                        }}
                      />
                      <ListItemSecondaryAction
                        sx={{
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <Box
                          sx={{
                            px: 1.25,
                            height: 20,
                            minWidth: 24,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isSelected
                              ? "primary.dark"
                              : "action.hover",
                            color: isSelected
                              ? "primary.contrastText"
                              : "text.secondary",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {item.count}
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
                
                {/* Separator */}
                <Box sx={{ my: 1.5, borderTop: `1px solid ${theme.palette.divider}` }} />

                {/* All Transcripts Item */}
                <ListItem
                  onClick={() => setSelectedType(allTranscriptsItem.id)}
                  button
                  selected={selectedType === allTranscriptsItem.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 1,
                    cursor: "pointer",
                    mb: 0.5,
                    px: 2,
                    height: 48,
                    position: "relative",
                    borderLeft: selectedType === allTranscriptsItem.id
                      ? `4px solid ${theme.palette.primary.main}`
                      : "4px solid transparent",
                    bgcolor: selectedType === allTranscriptsItem.id
                      ? theme.palette.action.selected
                      : "transparent",
                    color: selectedType === allTranscriptsItem.id
                      ? theme.palette.primary.main
                      : "text.primary",
                    transition: "background-color 0.3s, border-left 0.3s",
                    "&:hover": {
                      bgcolor: selectedType === allTranscriptsItem.id
                        ? theme.palette.action.selected
                        : theme.palette.action.hover,
                    },
                  }}
                  aria-current={selectedType === allTranscriptsItem.id ? "page" : undefined}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      mr: 2,
                      color: selectedType === allTranscriptsItem.id ? "inherit" : "primary.main",
                      "& svg": {
                        fontSize: 18,
                      },
                    }}
                  >
                    {allTranscriptsItem.icon}
                  </Box>
                  <ListItemText
                    primary={allTranscriptsItem.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: selectedType === allTranscriptsItem.id ? 600 : 500,
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mt: 0,
                        mb: 0,
                      },
                    }}
                  />
                  <ListItemSecondaryAction
                    sx={{
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.25,
                        height: 20,
                        minWidth: 24,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: selectedType === allTranscriptsItem.id
                          ? "primary.dark"
                          : "action.hover",
                        color: selectedType === allTranscriptsItem.id
                          ? "primary.contrastText"
                          : "text.secondary",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {allTranscriptsItem.count}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: theme.palette.divider,
              borderRadius: 2,
              bgcolor: theme.palette.grey[50],
              transition: "box-shadow 0.2s ease-in-out",
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              "&:hover": {
                boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
              },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                m: 0,
                mx: -2,
                mt: -2,
                height: 56,
                bgcolor: theme.palette.primary.main,
                background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                gap: 1,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                boxShadow: `0 2px 4px ${theme.palette.primary.main}40`,
                position: 'sticky',
                top: 24,
                zIndex: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${theme.palette.common.white}30, transparent)`,
                }
              }}
            >
              {/* Search Label */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                height: '100%'
              }}>
                <SearchIcon sx={{ 
                  fontSize: 20,
                  color: 'white'
                }} />
                <Typography
                  variant="h6"
                  sx={{
                    m: 0,
                    p: 0,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: 'white',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  {`SEARCH ${selectedType === 'all' ? 
                    allTranscriptsItem.label.toUpperCase() : 
                    sidebarItems.find(item => item.id === selectedType)?.label.toUpperCase()}...`}
                </Typography>
              </Box>

              {/* Action Buttons Container */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                height: 40
              }}>
                <IconButton
                  color="inherit"
                  sx={{
                    width: 40,
                    height: 40,
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)' 
                    }
                  }}
                >
                  <FilterIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <ToggleButtonGroup
                  size="small"
                  value={viewMode}
                  exclusive
                  onChange={(_, value) => value && setViewMode(value)}
                  sx={{
                    height: 40,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    padding: 0,
                    '& .MuiToggleButton-root': {
                      width: 40,
                      height: 40,
                      color: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.15)',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                      },
                    },
                  }}
                >
                  <ToggleButton value="list">
                    <ListIcon />
                  </ToggleButton>
                  <ToggleButton value="grid">
                    <GridIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {/* Body - Only this part scrolls */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)', // Adjust based on header heights
              p: 2
            }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredTranscripts.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ py: 4 }}>
                  No transcripts found.
                </Typography>
              ) : viewMode === "list" ? (
                <TranscriptList
                  transcripts={filteredTranscripts}
                  isLoading={isLoading}
                />
              ) : (
                <TranscriptGrid
                  transcripts={filteredTranscripts}
                  isLoading={isLoading}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </ContentCard>
  );

  return (
    <PageLayout
      layout="app"
      title="Transcript Library"
      subtitle="View and manage your transcripts"
      toolbar={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="list">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="grid">
              <GridIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      }
    >
      {content}
    </PageLayout>
  );
}