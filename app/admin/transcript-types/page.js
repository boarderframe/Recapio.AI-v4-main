'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, IconButton, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Add as AddIcon,
    AccountBox,
    AccountCircle,
    Assignment,
    AssignmentInd,
    AssignmentTurnedIn,
    Audiotrack,
    Book,
    Bookmark,
    BookmarkBorder,
    Build,
    Business,
    BusinessCenter,
    Chat,
    ChatBubble,
    Class,
    Comment,
    Description,
    DocumentScanner,
    Event,
    EventNote,
    EventSeat,
    Forum,
    Gavel,
    Group,
    Groups,
    GroupWork,
    Headphones,
    Headset,
    Help,
    LibraryBooks,
    LiveHelp,
    LiveTv,
    LocalHospital,
    LocationOn,
    MeetingRoom,
    MenuBook,
    Mic,
    MicNone,
    Movie,
    Note,
    NoteAdd,
    Notes,
    NotificationsActive,
    OndemandVideo,
    People,
    PeopleAlt,
    PeopleOutline,
    Person,
    PersonAdd,
    PersonalVideo,
    Phone,
    PhoneInTalk,
    PlayCircle,
    Podcasts,
    Psychology,
    Public,
    QuestionAnswer,
    RecordVoiceOver,
    School,
    Science,
    Slideshow,
    SpeakerNotes,
    SupportAgent,
    Task,
    TaskAlt,
    Today,
    Topic,
    Translate,
    TrendingUp,
    VideoCall,
    VideoChat,
    VideoFile,
    VideoLibrary,
    VolumeUp,
    Work,
    WorkHistory,
    WorkOutline,
    WorkspacePremium,
    AutoFixHigh as AutoFixHighIcon
} from '@mui/icons-material';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TranscriptTypesPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        type: '',
        sub_type: '',
        category_color: '',
        category_icon: '',
        analysis_instructions: '',
        json_schema: null,
        api_parameters: null
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const materialIcons = [
        { name: 'account_box', icon: <AccountBox /> },
        { name: 'account_circle', icon: <AccountCircle /> },
        { name: 'assignment', icon: <Assignment /> },
        { name: 'assignment_ind', icon: <AssignmentInd /> },
        { name: 'assignment_turned_in', icon: <AssignmentTurnedIn /> },
        { name: 'audiotrack', icon: <Audiotrack /> },
        { name: 'book', icon: <Book /> },
        { name: 'bookmark', icon: <Bookmark /> },
        { name: 'bookmark_border', icon: <BookmarkBorder /> },
        { name: 'build', icon: <Build /> },
        { name: 'business', icon: <Business /> },
        { name: 'business_center', icon: <BusinessCenter /> },
        { name: 'chat', icon: <Chat /> },
        { name: 'chat_bubble', icon: <ChatBubble /> },
        { name: 'class', icon: <Class /> },
        { name: 'comment', icon: <Comment /> },
        { name: 'description', icon: <Description /> },
        { name: 'document_scanner', icon: <DocumentScanner /> },
        { name: 'event', icon: <Event /> },
        { name: 'event_note', icon: <EventNote /> },
        { name: 'event_seat', icon: <EventSeat /> },
        { name: 'forum', icon: <Forum /> },
        { name: 'gavel', icon: <Gavel /> },
        { name: 'group', icon: <Group /> },
        { name: 'groups', icon: <Groups /> },
        { name: 'group_work', icon: <GroupWork /> },
        { name: 'headphones', icon: <Headphones /> },
        { name: 'headset', icon: <Headset /> },
        { name: 'help', icon: <Help /> },
        { name: 'library_books', icon: <LibraryBooks /> },
        { name: 'live_help', icon: <LiveHelp /> },
        { name: 'live_tv', icon: <LiveTv /> },
        { name: 'local_hospital', icon: <LocalHospital /> },
        { name: 'location_on', icon: <LocationOn /> },
        { name: 'meeting_room', icon: <MeetingRoom /> },
        { name: 'menu_book', icon: <MenuBook /> },
        { name: 'mic', icon: <Mic /> },
        { name: 'mic_none', icon: <MicNone /> },
        { name: 'movie', icon: <Movie /> },
        { name: 'note', icon: <Note /> },
        { name: 'note_add', icon: <NoteAdd /> },
        { name: 'notes', icon: <Notes /> },
        { name: 'notifications_active', icon: <NotificationsActive /> },
        { name: 'ondemand_video', icon: <OndemandVideo /> },
        { name: 'people', icon: <People /> },
        { name: 'people_alt', icon: <PeopleAlt /> },
        { name: 'people_outline', icon: <PeopleOutline /> },
        { name: 'person', icon: <Person /> },
        { name: 'person_add', icon: <PersonAdd /> },
        { name: 'personal_video', icon: <PersonalVideo /> },
        { name: 'phone', icon: <Phone /> },
        { name: 'phone_in_talk', icon: <PhoneInTalk /> },
        { name: 'play_circle', icon: <PlayCircle /> },
        { name: 'podcasts', icon: <Podcasts /> },
        { name: 'psychology', icon: <Psychology /> },
        { name: 'public', icon: <Public /> },
        { name: 'question_answer', icon: <QuestionAnswer /> },
        { name: 'record_voice_over', icon: <RecordVoiceOver /> },
        { name: 'school', icon: <School /> },
        { name: 'science', icon: <Science /> },
        { name: 'slideshow', icon: <Slideshow /> },
        { name: 'speaker_notes', icon: <SpeakerNotes /> },
        { name: 'support_agent', icon: <SupportAgent /> },
        { name: 'task', icon: <Task /> },
        { name: 'task_alt', icon: <TaskAlt /> },
        { name: 'today', icon: <Today /> },
        { name: 'topic', icon: <Topic /> },
        { name: 'translate', icon: <Translate /> },
        { name: 'trending_up', icon: <TrendingUp /> },
        { name: 'video_call', icon: <VideoCall /> },
        { name: 'video_chat', icon: <VideoChat /> },
        { name: 'video_file', icon: <VideoFile /> },
        { name: 'video_library', icon: <VideoLibrary /> },
        { name: 'volume_up', icon: <VolumeUp /> },
        { name: 'work', icon: <Work /> },
        { name: 'work_history', icon: <WorkHistory /> },
        { name: 'work_outline', icon: <WorkOutline /> },
        { name: 'workspace_premium', icon: <WorkspacePremium /> }
    ];

    const columns = [
        { 
            field: 'category', 
            headerName: 'Category', 
            flex: 1,
            minWidth: 150,
            filterable: true
        },
        { 
            field: 'type', 
            headerName: 'Type', 
            flex: 1,
            minWidth: 150,
            filterable: true
        },
        { 
            field: 'sub_type', 
            headerName: 'Sub Type', 
            flex: 1.5,
            minWidth: 200,
            filterable: true
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                        onClick={() => handleEdit(params.row)} 
                        size="small"
                        sx={{ 
                            color: 'primary.main',
                            '&:hover': { 
                                bgcolor: 'primary.lighter',
                                color: 'primary.dark'
                            }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        onClick={() => handleDeleteClick(params.row.id)} 
                        size="small"
                        sx={{ 
                            color: 'error.main',
                            '&:hover': { 
                                bgcolor: 'error.lighter',
                                color: 'error.dark'
                            }
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        }
    ];

    useEffect(() => {
        fetchTranscriptTypes();
    }, []);

    const fetchTranscriptTypes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('transcript_types')
                .select('*')
                .order('category')
                .order('type')
                .order('sub_type');

            if (error) {
                console.error('Error fetching transcript types:', error);
                throw error;
            }

            const processedRows = data?.map(row => ({
                id: row.id,
                category: row.category || '',
                type: row.type || '',
                sub_type: row.sub_type || '',
                category_color: row.category_color || '',
                category_icon: row.category_icon || '',
                analysis_instructions: row.analysis_instructions || '',
                json_schema: row.json_schema || null,
                api_parameters: row.api_parameters || null
            })) || [];

            setRows(processedRows);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingRow(null);
        setFormData({
            category: '',
            type: '',
            sub_type: '',
            category_color: '',
            category_icon: '',
            analysis_instructions: '',
            json_schema: null,
            api_parameters: null
        });
        setOpenDialog(true);
    };

    const handleEdit = (row) => {
        setEditingRow(row);
        setFormData({
            category: row.category,
            type: row.type,
            sub_type: row.sub_type,
            category_color: row.category_color,
            category_icon: row.category_icon,
            analysis_instructions: row.analysis_instructions || '',
            json_schema: row.json_schema || null,
            api_parameters: row.api_parameters || null
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('transcript_types')
                .delete()
                .eq('id', deletingId);

            if (error) throw error;
            
            await fetchTranscriptTypes();
            alert('Record deleted successfully');
        } catch (error) {
            console.error('Error deleting transcript type:', error);
            alert('Error deleting record: ' + error.message);
        } finally {
            setDeleteConfirmOpen(false);
            setDeletingId(null);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.category || !formData.type || !formData.sub_type || !formData.category_color || !formData.category_icon) {
                alert('Please fill in all required fields');
                return;
            }

            const updateData = {
                category: formData.category,
                type: formData.type,
                sub_type: formData.sub_type,
                category_color: formData.category_color,
                category_icon: formData.category_icon,
                analysis_instructions: formData.analysis_instructions,
                json_schema: formData.json_schema,
                api_parameters: formData.api_parameters
            };

            if (editingRow) {
                console.log('Updating record:', editingRow.id, updateData);
                const { data, error } = await supabase
                    .from('transcript_types')
                    .update(updateData)
                    .eq('id', editingRow.id)
                    .select();

                if (error) {
                    console.error('Error updating record:', error);
                    throw error;
                }
                console.log('Update successful:', data);
            } else {
                console.log('Inserting new record:', updateData);
                const { data, error } = await supabase
                    .from('transcript_types')
                    .insert([updateData])
                    .select();

                if (error) {
                    console.error('Error inserting record:', error);
                    throw error;
                }
                console.log('Insert successful:', data);
            }

            setOpenDialog(false);
            await fetchTranscriptTypes();
        } catch (error) {
            console.error('Error saving transcript type:', error);
            alert('Error saving transcript type: ' + error.message);
        }
    };

    const handleGeneratePrompt = async () => {
        if (!formData.category || !formData.type || !formData.sub_type) {
            alert('Please fill in Category, Type, and Sub Type fields first');
            return;
        }

        try {
            setIsGenerating(true);
            const response = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: formData.category,
                    type: formData.type,
                    sub_type: formData.sub_type
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate prompt');
            }

            const data = await response.json();
            
            setFormData(prev => ({
                ...prev,
                analysis_instructions: data.analysis_instructions,
                json_schema: data.json_schema,
                api_parameters: data.api_parameters
            }));
        } catch (error) {
            console.error('Error generating prompt:', error);
            alert('Error generating prompt: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>Transcript Types</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {rows.length} {rows.length === 1 ? 'record' : 'records'} found
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add New Type
                </Button>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                autoHeight
                loading={loading}
                hideFooter={true}
                initialState={{
                    sorting: {
                        sortModel: [
                            { field: 'category', sort: 'asc' },
                            { field: 'type', sort: 'asc' },
                            { field: 'sub_type', sort: 'asc' }
                        ]
                    }
                }}
                sortingOrder={['asc', 'desc']}
                slots={{
                    toolbar: GridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                        printOptions: { disableToolbarButton: true },
                        csvOptions: { disableToolbarButton: true }
                    },
                }}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 100}
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'hidden',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& .MuiDataGrid-cell': {
                        padding: '8px 16px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                    },
                    '& .MuiDataGrid-row': {
                        minHeight: '52px !important',
                        alignItems: 'flex-start'
                    },
                    '& .MuiDataGrid-main': {
                        width: '100%',
                        overflowX: 'hidden'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        overflowX: 'hidden'
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        padding: '8px 16px',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '& .MuiButton-root': {
                            color: 'primary.main',
                            padding: '4px 8px',
                            minWidth: 'auto',
                            fontSize: '0.875rem',
                            '&:hover': {
                                bgcolor: 'primary.lighter',
                                color: 'primary.dark',
                            },
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.25rem',
                                color: 'primary.main',
                            },
                        },
                        '& .MuiFormControl-root': {
                            minWidth: 200,
                            margin: 0,
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'primary.main',
                            },
                        }
                    }
                }}
                components={{
                    NoRowsOverlay: () => (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            p: 2,
                            color: 'text.secondary'
                        }}>
                            No transcript types found
                        </Box>
                    ),
                    LoadingOverlay: () => (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            p: 2
                        }}>
                            <CircularProgress size={24} />
                        </Box>
                    ),
                }}
            />

            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'primary.lighter',
                    p: 2
                }}>
                    <Typography variant="h6" color="primary.dark" fontWeight={600}>
                        {editingRow ? 'Edit Transcript Type' : 'Add New Transcript Type'}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 4 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 3,
                        mt: 2
                    }}>
                        <TextField
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Sub Type"
                            value={formData.sub_type}
                            onChange={(e) => setFormData({ ...formData, sub_type: e.target.value })}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Category Color"
                            value={formData.category_color}
                            onChange={(e) => setFormData({ ...formData, category_color: e.target.value })}
                            type="color"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <TextField
                            select
                            label="Category Icon"
                            value={formData.category_icon}
                            onChange={(e) => setFormData({ ...formData, category_icon: e.target.value })}
                            fullWidth
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 300
                                        }
                                    }
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiSelect-select': {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }
                            }}
                        >
                            {materialIcons.map((iconOption) => (
                                <MenuItem 
                                    key={iconOption.name} 
                                    value={iconOption.name}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: 1
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        color: 'primary.main',
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.25rem'
                                        }
                                    }}>
                                        {iconOption.icon}
                                    </Box>
                                    <Box sx={{ 
                                        textTransform: 'capitalize',
                                    }}>
                                        {iconOption.name.replace(/_/g, ' ')}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Analysis Instructions"
                            value={formData.analysis_instructions}
                            onChange={(e) => setFormData({ ...formData, analysis_instructions: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />

                        <TextField
                            label="JSON Schema"
                            value={formData.json_schema ? JSON.stringify(formData.json_schema, null, 2) : ''}
                            onChange={(e) => {
                                try {
                                    const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                                    setFormData({ ...formData, json_schema: parsed });
                                } catch (error) {
                                    // Don't update if JSON is invalid
                                    console.error('Invalid JSON schema:', error);
                                }
                            }}
                            multiline
                            rows={4}
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '& textarea': {
                                        fontFamily: 'monospace'
                                    }
                                },
                            }}
                        />

                        <TextField
                            label="API Parameters"
                            value={formData.api_parameters ? JSON.stringify(formData.api_parameters, null, 2) : ''}
                            onChange={(e) => {
                                try {
                                    const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                                    setFormData({ ...formData, api_parameters: parsed });
                                } catch (error) {
                                    // Don't update if JSON is invalid
                                    console.error('Invalid API parameters:', error);
                                }
                            }}
                            multiline
                            rows={4}
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '& textarea': {
                                        fontFamily: 'monospace'
                                    }
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.subtle',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button 
                        onClick={handleGeneratePrompt}
                        startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                        disabled={isGenerating}
                        sx={{
                            color: 'secondary.main',
                            '&:hover': {
                                bgcolor: 'secondary.lighter',
                            },
                            '& .MuiCircularProgress-root': {
                                color: 'inherit'
                            }
                        }}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Prompt'}
                    </Button>
                    <Box>
                        <Button 
                            onClick={() => setOpenDialog(false)}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                                mr: 1
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            variant="contained"
                            sx={{
                                px: 3,
                            }}
                        >
                            {editingRow ? 'Save Changes' : 'Add Type'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'error.lighter',
                    p: 2
                }}>
                    <Typography variant="h6" color="error.dark" fontWeight={600}>
                        Confirm Delete
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 3 }}>
                    <Typography>
                        Are you sure you want to delete this transcript type? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ 
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.subtle',
                    px: 3,
                    py: 2
                }}>
                    <Button 
                        onClick={() => setDeleteConfirmOpen(false)}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            px: 3,
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 