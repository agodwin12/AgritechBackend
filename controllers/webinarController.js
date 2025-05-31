const db = require('../config/db.js');
const { QueryTypes } = require('sequelize');
const path = require('path');

const {
    WebinarRequest,
    Webinar,
    WebinarAttendee,
    WebinarQuestion,
    User,
} = require('../models');

// ✅ 1. User requests a webinar
exports.requestWebinar = async (req, res) => {
    try {
        const { title, description, preferred_date, user_id } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !description || !preferred_date || !user_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const preferredDateTime = new Date(preferred_date);
        if (preferredDateTime < new Date()) {
            return res.status(400).json({ message: 'Preferred date must be in the future.' });
        }

        await WebinarRequest.create({
            title,
            description,
            preferred_date,
            image,
            requested_by_user_id: user_id
        });

        return res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.error('❌ Error submitting webinar request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ 2. Admin fetches all pending requests
exports.getPendingRequests = async (req, res) => {
    console.log('📥 [REQUEST] Fetching pending webinar requests');
    try {
        const baseUrl = 'http://10.0.2.2:3000/uploads/'; // Change to your production domain if needed

        const requests = await WebinarRequest.findAll({
            where: { status: 'pending' },
            include: [
                {
                    model: User,
                    as: 'requestedBy',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        // Add full image URLs
        const requestsWithImageUrl = requests.map(req => {
            const requestJson = req.toJSON();
            requestJson.image_url = req.image ? baseUrl + req.image : null;
            return requestJson;
        });

        console.log(`✅ Found ${requests.length} pending requests`);
        return res.status(200).json({ requests: requestsWithImageUrl });
    } catch (error) {
        console.error('❌ Error in getPendingRequests:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// ✅ 3. Admin approves a request & creates a webinar
exports.approveWebinarRequest = async (req, res) => {
    const requestId = req.params.id;

    try {
        const request = await WebinarRequest.findByPk(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found.' });

        // Create a new webinar using request data, including image ✅
        const webinar = await Webinar.create({
            title: request.title,
            description: request.description,
            scheduled_date: request.preferred_date,
            host_user_id: request.requested_by_user_id,
            approved_request_id: request.id,
            status: 'scheduled',
            image: request.image, // ✅ this line ensures the image is carried over
            stream_url: `https://meet.jit.si/${request.title.replace(/\s+/g, '')}_${Date.now()}`
        });

        // Update the request status
        request.status = 'approved';
        await request.save();

        res.status(201).json({ message: 'Webinar approved.', webinar });
    } catch (error) {
        console.error('❌ Error approving request:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ✅ 4. Get all upcoming webinars
exports.getUpcomingWebinars = async (req, res) => {
    console.log('📥 [REQUEST] Get upcoming webinars');
    try {
        const webinars = await Webinar.findAll({
            where: { status: 'scheduled' },
            include: [
                { model: User, as: 'host', attributes: ['id', 'full_name'] },
                {
                    model: WebinarQuestion,
                    include: [{ model: User, attributes: ['full_name'] }],
                },
            ],
            order: [['scheduled_date', 'ASC']],
        });

        const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

        const formatted = webinars.map(w => {
            const json = w.toJSON();
            json.image_url = w.image ? baseUrl + w.image : null;
            return json;
        });

        console.log(`✅ Found ${formatted.length} upcoming webinars`);
        return res.status(200).json({ webinars: formatted });
    } catch (error) {
        console.error('❌ Error in getUpcomingWebinars:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};



// ✅ 5. User joins a webinar
exports.joinWebinar = async (req, res) => {
    console.log(`📥 [REQUEST] User joining webinar ID: ${req.params.id}`);
    try {
        const { user_id } = req.body;
        const { id: webinar_id } = req.params;

        const attendee = await WebinarAttendee.create({ user_id, webinar_id });

        console.log(`✅ User ${user_id} joined webinar ${webinar_id}`);
        return res.status(200).json({ message: 'User joined webinar.', attendee });
    } catch (error) {
        console.error('❌ Error in joinWebinar:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// ✅ 6. Submit question during webinar
exports.submitQuestion = async (req, res) => {
    console.log(`📥 [REQUEST] Submit question for webinar ID: ${req.params.id}`);
    try {
        const { user_id, question_text } = req.body;
        const { id: webinar_id } = req.params;

        if (!question_text || !user_id) {
            console.log('❌ Missing user_id or question_text');
            return res.status(400).json({ message: 'Missing question or user ID.' });
        }

        const question = await WebinarQuestion.create({
            user_id,
            webinar_id,
            question_text,
        });

        console.log(`✅ Question submitted: ${question_text}`);
        return res.status(201).json({ message: 'Question submitted.', question });
    } catch (error) {
        console.error('❌ Error in submitQuestion:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// ✅ 7. Mark question as answered
exports.createWebinar = async (req, res) => {
    try {
        const { title, description, scheduled_date, stream_url, host_id } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !description || !scheduled_date || !stream_url || !host_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [result] = await db.query(
            `INSERT INTO webinars (title, description, scheduled_date, stream_url, host_id, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [title, description, scheduled_date, stream_url, host_id, image]
        );

        console.log(`✅ Webinar "${title}" created by admin ${host_id}`);

        res.status(201).json({ message: 'Webinar created successfully' });
    } catch (error) {
        console.error('❌ Error creating webinar:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ✅ 8. Manual creation of webinar by admin
exports.createWebinar = async (req, res) => {
    console.log('📥 [ADMIN] Manual webinar creation received');
    try {
        const { title, description, scheduled_date, host_user_id } = req.body;

        console.log('📦 Payload:', { title, description, scheduled_date, host_user_id });

        if (!title || !description || !scheduled_date || !host_user_id) {
            console.log('❌ Missing fields');
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const jitsiUrl = `https://meet.jit.si/${title.replace(/\s+/g, '_')}_${Date.now()}`;

        const webinar = await Webinar.create({
            title,
            description,
            scheduled_date,
            stream_url: jitsiUrl,
            host_user_id,
        });

        console.log(`✅ Webinar successfully created with ID: ${webinar.id}`);
        console.log('🔗 Stream URL:', jitsiUrl);

        return res.status(201).json({ message: 'Webinar created.', webinar });
    } catch (error) {
        console.error('❌ Error in createWebinar:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

//9. mark questions
exports.markQuestionAnswered = async (req, res) => {
    const { id } = req.params;

    try {
        const question = await db.WebinarQuestion.findByPk(id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        question.is_answered = true;
        await question.save();

        res.json({ message: "Question marked as answered" });
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
