import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../config/api';

// Listener sends a collab request
export const sendCollabRequest = createAsyncThunk(
    'collab/sendRequest',
    async ({ toCreatorId, songId, message }, { rejectWithValue }) => {
        try {
            const res = await api.post('/collab', { toCreatorId, songId, message });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send collab request.');
        }
    }
);

// Creator fetches their inbox
export const fetchCollabInbox = createAsyncThunk(
    'collab/fetchInbox',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/collab/inbox');
            return res.data.requests;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch inbox.');
        }
    }
);

// Creator responds to a request
export const respondToRequest = createAsyncThunk(
    'collab/respond',
    async ({ requestId, status }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/collab/${requestId}`, { status });
            return res.data.request;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update request.');
        }
    }
);

const collabSlice = createSlice({
    name: 'collab',
    initialState: {
        inbox: [],
        loading: false,
        sendLoading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearCollabMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Send Request
            .addCase(sendCollabRequest.pending, (state) => {
                state.sendLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(sendCollabRequest.fulfilled, (state) => {
                state.sendLoading = false;
                state.successMessage = 'Collab request sent to the creator!';
            })
            .addCase(sendCollabRequest.rejected, (state, action) => {
                state.sendLoading = false;
                state.error = action.payload;
            })
            // Fetch Inbox
            .addCase(fetchCollabInbox.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCollabInbox.fulfilled, (state, action) => {
                state.loading = false;
                state.inbox = action.payload;
            })
            .addCase(fetchCollabInbox.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Respond to Request
            .addCase(respondToRequest.fulfilled, (state, action) => {
                const updated = action.payload;
                state.inbox = state.inbox.map(req =>
                    req._id === updated._id ? { ...req, status: updated.status } : req
                );
            });
    }
});

export const { clearCollabMessages } = collabSlice.actions;
export default collabSlice.reducer;
