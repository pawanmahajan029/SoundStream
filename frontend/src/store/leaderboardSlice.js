import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../config/api';

// Record a play event after 10s of listening
export const recordPlay = createAsyncThunk(
    'leaderboard/recordPlay',
    async ({ songId, creatorId }, { rejectWithValue }) => {
        try {
            await api.post('/leaderboard/play', { songId, creatorId });
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to record play.');
        }
    }
);

// Fetch top listeners for a creator
export const fetchLeaderboard = createAsyncThunk(
    'leaderboard/fetch',
    async (creatorId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/leaderboard/${creatorId}`);
            return { creatorId, topListeners: res.data.topListeners };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch leaderboard.');
        }
    }
);

const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState: {
        // keyed by creatorId for caching
        data: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data[action.payload.creatorId] = action.payload.topListeners;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default leaderboardSlice.reducer;
