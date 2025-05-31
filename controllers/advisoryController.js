const fs = require('fs');
const path = require('path');

// Load advisory data once at startup
const advisoryData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/advisory_grouped_by_region.json'), 'utf-8')
);

console.log('✅ Advisory data loaded from JSON file.');
console.log(`📊 Total advisory entries: ${advisoryData.length}`);

// GET all advisory data — used for dropdowns in Flutter
exports.getAllAdvisories = (req, res) => {
    console.log('📥 GET /api/advisory requested');
    console.log('📤 Sending all advisory data');
    res.json(advisoryData);
};

// POST filtered advisory recommendation
exports.getAdvisory = (req, res) => {
    console.log('📥 POST /api/advisory received');

    const { region, season, soil_type } = req.body;

    console.log('🧾 Request Body:', { region, season, soil_type });

    // Validate input
    if (!region || !season) {
        console.log('❌ Missing region or season in request');
        return res.status(400).json({ message: 'Region and Season are required.' });
    }

    // Search for region
    const entry = advisoryData.find(
        (r) => r.region.toLowerCase() === region.toLowerCase()
    );

    if (!entry) {
        console.log(`❌ Region not found: "${region}"`);
        return res.status(404).json({ message: 'Region not found.' });
    }

    console.log(`✅ Region found: "${entry.region}"`);

    const matchedSoil = soil_type
        ? entry.common_soil_types.includes(soil_type)
        : true;

    if (soil_type) {
        console.log(
            `🧪 Soil type "${soil_type}" is ${matchedSoil ? '✅ matched' : '❌ NOT matched'} in region "${entry.region}"`
        );
    }

    const cropRotation = entry.crop_rotation_plans[season] || [];
    const cropRecommendations = entry.crop_recommendations || [];

    console.log(`🌾 Found ${cropRecommendations.length} crop recommendations`);
    console.log(`🔁 Found ${cropRotation.length} crop rotation plans for season "${season}"`);

    const result = {
        region: entry.region,
        matched_soil: matchedSoil,
        season,
        crop_recommendations: cropRecommendations,
        crop_rotation_plan: cropRotation,
        advisory_notes: entry.advisory_notes
    };

    console.log('📤 Responding with filtered advisory result:', result);
    res.json(result);
};
