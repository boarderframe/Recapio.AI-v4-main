import { Box, IconButton, Tooltip } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import SearchIcon from '@mui/icons-material/Search';

interface TableControlsProps {
    onSearch?: (value: string) => void;
    onColumnsClick?: () => void;
    onFiltersClick?: () => void;
    onDensityClick?: () => void;
    searchPlaceholder?: string;
}

export default function TableControls({
    onSearch,
    onColumnsClick,
    onFiltersClick,
    onDensityClick,
    searchPlaceholder = 'Search...'
}: TableControlsProps) {
    return (
        <Box 
            sx={{ 
                p: 2, 
                display: 'flex', 
                gap: 2,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}
        >
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Columns">
                    <IconButton 
                        onClick={onColumnsClick}
                        size="small"
                        sx={{ 
                            p: 1,
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <ViewColumnIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Filters">
                    <IconButton 
                        onClick={onFiltersClick}
                        size="small"
                        sx={{ 
                            p: 1,
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <FilterListIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Density">
                    <IconButton 
                        onClick={onDensityClick}
                        size="small"
                        sx={{ 
                            p: 1,
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <FormatLineSpacingIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box 
                sx={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    '&:focus-within': {
                        borderColor: 'primary.main',
                        boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}20`
                    }
                }}
            >
                <SearchIcon sx={{ color: 'text.secondary' }} />
                <input 
                    type="text" 
                    placeholder={searchPlaceholder}
                    onChange={(e) => onSearch?.(e.target.value)}
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        color: 'inherit'
                    }}
                />
            </Box>
        </Box>
    );
} 