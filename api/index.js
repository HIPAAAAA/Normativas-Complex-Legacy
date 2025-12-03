import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://complexrp:complexrp@hipaaaaa.kjko0im.mongodb.net/normativas?appName=Hipaaaaa";

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

// Schema
const RuleSchema = new mongoose.Schema({
    slug: String, // 'police', 'saes', 'general', 'illegal'
    type: String, // 'faction' | 'generic'
    title: String,
    content: String,
    author: String,
    lastUpdated: { type: Date, default: Date.now }
});

const RuleModel = mongoose.models.Rule || mongoose.model('Rule', RuleSchema);

// --- ROUTES ---

// 1. Get All Rules (for AI context)
app.get('/api/rules', async (req, res) => {
    await connectToDatabase();
    const { type, slug } = req.query;
    let query = {};
    if (type) query.type = type;
    if (slug) query.slug = slug;
    
    try {
        const rules = await RuleModel.find(query).sort({ _id: 1 }); // Sort by creation/ID by default
        res.json(rules.map(r => ({
            id: r._id.toString(),
            title: r.title,
            content: r.content,
            lastUpdated: r.lastUpdated,
            author: r.author,
            slug: r.slug,
            type: r.type
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Add Rule
app.post('/api/rules', async (req, res) => {
    await connectToDatabase();
    try {
        const newRule = new RuleModel(req.body);
        const saved = await newRule.save();
        res.json({
            id: saved._id.toString(),
            ...saved.toObject()
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Update Rule
app.put('/api/rules/:id', async (req, res) => {
    await connectToDatabase();
    try {
        const { title, content, author } = req.body;
        const updated = await RuleModel.findByIdAndUpdate(
            req.params.id, 
            { title, content, author, lastUpdated: Date.now() },
            { new: true }
        );
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 4. Delete Rule
app.delete('/api/rules/:id', async (req, res) => {
    await connectToDatabase();
    try {
        await RuleModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 5. Move Rule (Swap)
app.post('/api/rules/swap', async (req, res) => {
    await connectToDatabase();
    try {
        const { id1, id2 } = req.body;
        const rule1 = await RuleModel.findById(id1);
        const rule2 = await RuleModel.findById(id2);

        if(rule1 && rule2) {
            const tempTitle = rule1.title;
            const tempContent = rule1.content;
            
            rule1.title = rule2.title;
            rule1.content = rule2.content;
            
            rule2.title = tempTitle;
            rule2.content = tempContent;

            await rule1.save();
            await rule2.save();
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 6. Seeder
app.post('/api/seed', async (req, res) => {
    await connectToDatabase();
    try {
        const count = await RuleModel.countDocuments();
        if (count > 0) return res.json({ message: "Database already populated" });

        const { rules } = req.body;
        await RuleModel.insertMany(rules);
        res.json({ success: true, count: rules.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Root route
app.get('/api', (req, res) => {
    res.send('Complex Legacy API is running');
});

// Local Development Server
// In Vercel, this file is imported, so we don't listen.
// Locally, we listen on PORT.
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

export default app;