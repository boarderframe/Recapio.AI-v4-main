import React, { useState } from 'react';
import { 
    Box,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
    Typography
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as Icons from '@mui/icons-material';
import { categories } from '@/app/config/categories';

interface SidebarProps {
    selectedType: string;
    onTypeSelect: (typeId: string) => void;
}

export default function Sidebar({ selectedType, onTypeSelect }: SidebarProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    if (!categories || categories.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">No categories loaded</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 280, bgcolor: 'background.paper' }}>
            <List component="nav">
                <ListItemButton
                    selected={selectedType === 'all'}
                    onClick={() => onTypeSelect('all')}
                >
                    <ListItemText primary="All Types" />
                </ListItemButton>

                {categories.map((category) => {
                    const isExpanded = expandedCategory === category.id;
                    const CategoryIcon = Icons[category.icon as keyof typeof Icons];

                    return (
                        <Box key={category.id}>
                            <ListItemButton
                                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                            >
                                <ListItemIcon>
                                    {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                                </ListItemIcon>
                                {CategoryIcon && <CategoryIcon sx={{ mr: 1 }} />}
                                <ListItemText primary={category.name} />
                            </ListItemButton>

                            <Collapse in={isExpanded} timeout="auto">
                                <List component="div" disablePadding>
                                    {category.types.map((type) => (
                                        <ListItemButton
                                            key={type.id}
                                            selected={selectedType === type.id}
                                            onClick={() => onTypeSelect(type.id)}
                                            sx={{ pl: 4 }}
                                        >
                                            <ListItemText primary={type.name} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
} 