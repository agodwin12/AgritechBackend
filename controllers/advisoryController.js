const fs = require('fs');
const path = require('path');

// Load advisory data once at startup
const advisoryData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/advisory_grouped_by_region.json'), 'utf-8')
);

console.log('✅ Advisory data loaded from AI-enhanced JSON file.');
console.log(`📊 Total entries loaded: ${advisoryData.length}`);

// GET all distinct regions for dropdown use
exports.getAllAdvisories = (req, res) => {
    console.log('📥 GET /api/advisory requested');

    const regions = [...new Set(advisoryData.map(
        item => item["User Input: Region (Specific Locality/Village)"]
    ))].sort();

    console.log(`📤 Sending ${regions.length} unique regions`);
    res.json({ regions });
};

// POST filtered advisory result based on region, season, and optional soil type
exports.getAdvisory = (req, res) => {
    console.log('📥 POST /api/advisory received');

    const { region, season, soil_type } = req.body;

    if (!region || !season) {
        console.log('❌ Missing region or season in request');
        return res.status(400).json({ message: 'Region and Season are required.' });
    }

    console.log('🧾 Request Body:', { region, season, soil_type });

    const entry = advisoryData.find(item =>
        item["User Input: Region (Specific Locality/Village)"]?.toLowerCase() === region.toLowerCase() &&
        item["User Input: Season (Relevant to Locality)"]?.toLowerCase() === season.toLowerCase() &&
        (!soil_type || item["User Input: Soil Type (Common in Locality)"]?.toLowerCase() === soil_type.toLowerCase())
    );

    if (!entry) {
        console.log(`❌ No advisory match found`);
        return res.status(404).json({ message: 'No advisory data found for the given parameters.' });
    }

    const result = {
        region: entry["User Input: Region (Specific Locality/Village)"],
        season: entry["User Input: Season (Relevant to Locality)"],
        soil_type: entry["User Input: Soil Type (Common in Locality)"],
        crop_recommendations: entry["AI Generated Output: Crop Recommendations (Diverse Examples)"],
        crop_rotation_plan: entry["AI Generated Output: Crop Rotation Planner (Example Sequence)"]
    };

    console.log('📤 Responding with advisory result:', result);
    res.json(result);
};
