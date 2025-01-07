import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  Lightbulb,
  Timeline,
  Assessment,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '@/components/ThemeProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

export default function Dashboard() {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();
  const [showSnackbar, setShowSnackbar] = useState(true);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recapio Dashboard
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Insights</Typography>
              </Box>
              <Typography variant="h4">128</Typography>
              <Typography color="textSecondary">Total insights generated</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Transcripts</Typography>
              </Box>
              <Typography variant="h4">45</Typography>
              <Typography color="textSecondary">Processed transcripts</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Analysis</Typography>
              </Box>
              <Typography variant="h4">89%</Typography>
              <Typography color="textSecondary">Accuracy rate</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Insights Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Insights */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Recent Insights</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Key Discussion Points
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Product Strategy" color="primary" />
                    <Chip label="Market Analysis" color="secondary" />
                    <Chip label="Customer Feedback" />
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success">
          Dashboard loaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 