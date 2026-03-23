import PlayEvent from '../models/playEvent.model.js';

export const recordPlay = ({ userId, songId, creatorId }) => {
    return PlayEvent.create({ user: userId, song: songId, creator: creatorId });
};

export const getTopListeners = async (creatorId) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return PlayEvent.aggregate([
        {
            $match: {
                creator: creatorId,
                playedAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: '$user',
                playCount: { $sum: 1 }
            }
        },
        { $sort: { playCount: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        { $unwind: '$userInfo' },
        {
            $project: {
                _id: 0,
                userId: '$_id',
                playCount: 1,
                email: '$userInfo.email',
            }
        }
    ]);
};
