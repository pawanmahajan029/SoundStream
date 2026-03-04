import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./src/config/config.js";
import songModel from "./src/models/song.model.js";

dotenv.config();

const seedSongs = async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log("Connected to MongoDB for seeding...");

        await songModel.deleteMany({});
        console.log("Cleared existing songs.");

        const mockSongs = [
            {
                title: "Electronic Pulse",
                artist: "SoundHelix",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80"
            },
            {
                title: "Acoustic Journey",
                artist: "SoundHelix",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80"
            },
            {
                title: "Upbeat Energy",
                artist: "SoundHelix",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80"
            }
        ];

        await songModel.insertMany(mockSongs);
        console.log("Successfully seeded 3 mock songs!");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedSongs();
