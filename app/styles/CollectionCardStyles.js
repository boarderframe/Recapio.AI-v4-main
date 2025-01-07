import { alpha } from '@mui/material/styles';

export const collectionCardStyles = {
    paper: {
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            boxShadow: 1,
            transform: 'translateY(-2px)'
        }
    },
    header: {
        base: {
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: '72px 1fr 48px',
            gap: 3,
            p: 3,
            transition: 'background-color 0.2s ease-in-out'
        },
        iconCell: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        avatar: {
            width: 72,
            height: 72,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.05)'
            }
        },
        contentCell: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: 0.5,
            minWidth: 0
        },
        title: {
            fontSize: '1.375rem',
            fontWeight: 600,
            lineHeight: 1.2,
            m: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        subtitle: {
            fontSize: '0.875rem',
            lineHeight: 1.2,
            m: 0,
            opacity: 0.8
        },
        actionCell: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        actionButton: {
            width: 36,
            height: 36,
            transition: 'all 0.2s ease-in-out'
        },
        actionIcon: {
            fontSize: '1.75rem',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'rotate(90deg)'
            }
        }
    },
    content: {
        wrapper: {
            p: 2.5,
            height: 'calc(100% - 120px)',
            display: 'flex',
            flexDirection: 'column'
        },
        section: {
            mb: 2.5
        },
        sectionTitle: {
            mb: 1,
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        chipContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
        },
        itemList: {
            spacing: 1,
            flexGrow: 1,
            overflow: 'hidden'
        },
        itemIcon: {
            fontSize: '1.2rem',
            opacity: 0.8,
            mt: 0.3,
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': {
                opacity: 1
            }
        },
        itemContent: {
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
            flexGrow: 1
        },
        itemTitle: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
            fontWeight: 500
        },
        itemMeta: {
            display: 'block',
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
            fontSize: '0.75rem',
            opacity: 0.7
        },
        statusChip: {
            ml: 2,
            minWidth: 80,
            flexShrink: 0,
            height: 24,
            '& .MuiChip-label': {
                px: 1,
                fontSize: '0.75rem'
            }
        }
    }
}; 