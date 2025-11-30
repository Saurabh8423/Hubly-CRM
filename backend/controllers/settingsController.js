import Settings from "../models/Settings.js";


export const getSettings = async (req, res) => {
    try {
        const doc = await Settings.findOne({ key: "global" }).lean();
        const value = doc ? doc.value : { missedTimerMs: 10 * 60 * 1000 };
        res.json({ success: true, settings: value });
    } catch (err) {
        console.error("getSettings ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const updateSettings = async (req, res) => {
    try {
        const payload = req.body || {};
        let doc = await Settings.findOne({ key: "global" });
        if (!doc) {
            doc = await Settings.create({ key: "global", value: payload });
        } else {
            doc.value = payload;
            await doc.save();
        }
        res.json({ success: true, settings: doc.value });
    } catch (err) {
        console.error("updateSettings ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};