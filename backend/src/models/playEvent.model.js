import mongoose from 'mongoose';

const playEventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs',
        required: true,
    },
    // Denormalized creator field for fast leaderboard aggregations
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    playedAt: {
        type: Date,
        default: Date.now,
    }
});

// Index for fast leaderboard queries (by creator + time window)
playEventSchema.index({ creator: 1, playedAt: -1 });
playEventSchema.index({ user: 1, song: 1 });

export default mongoose.model('PlayEvent', playEventSchema);
