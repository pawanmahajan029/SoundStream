import mongoose from 'mongoose';

const collabRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs',
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 500,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

export default mongoose.model('CollabRequest', collabRequestSchema);
