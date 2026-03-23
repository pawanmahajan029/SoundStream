import {
    createCollabRequest,
    getRequestsByCreator,
    getRequestsByListener,
    updateRequestStatus
} from '../dao/collabRequest.dao.js';

// POST /collab — listener sends a collab request
export const sendCollabRequest = async (req, res) => {
    try {
        const { toCreatorId, songId, message } = req.body;

        if (!toCreatorId || !songId || !message?.trim()) {
            return res.status(400).json({ message: 'Creator ID, song ID, and message are required.' });
        }

        // Prevent creator from sending to themselves
        if (req.user._id.toString() === toCreatorId) {
            return res.status(400).json({ message: 'You cannot send a collab request to yourself.' });
        }

        const request = await createCollabRequest({
            from: req.user._id,
            to: toCreatorId,
            song: songId,
            message: message.trim()
        });

        res.status(201).json({ message: 'Collab request sent!', request });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send collab request.', error: error.message });
    }
};

// GET /collab/inbox — creator views their inbox
export const getCollabInbox = async (req, res) => {
    try {
        const requests = await getRequestsByCreator(req.user._id);
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inbox.', error: error.message });
    }
};

// GET /collab/sent — listener views their sent requests
export const getSentRequests = async (req, res) => {
    try {
        const requests = await getRequestsByListener(req.user._id);
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sent requests.', error: error.message });
    }
};

// PUT /collab/:id — creator accepts or rejects
export const respondToCollabRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "accepted" or "rejected".' });
        }

        const updated = await updateRequestStatus(id, status);
        if (!updated) {
            return res.status(404).json({ message: 'Collab request not found.' });
        }

        res.status(200).json({ message: `Request ${status}.`, request: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update request.', error: error.message });
    }
};
