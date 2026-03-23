import CollabRequest from '../models/collabRequest.model.js';

export const createCollabRequest = (data) => {
    return CollabRequest.create(data);
};

export const getRequestsByCreator = (creatorId) => {
    return CollabRequest.find({ to: creatorId })
        .populate('from', 'email')
        .populate('song', 'title artist poster')
        .sort({ createdAt: -1 });
};

export const getRequestsByListener = (listenerId) => {
    return CollabRequest.find({ from: listenerId })
        .populate('to', 'email')
        .populate('song', 'title artist poster')
        .sort({ createdAt: -1 });
};

export const updateRequestStatus = (requestId, status) => {
    return CollabRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
    );
};
