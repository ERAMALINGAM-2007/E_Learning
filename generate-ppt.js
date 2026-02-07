import PptxGenJS from "pptxgenjs";

const pres = new PptxGenJS();

// Set metadata
pres.title = "Cognition AI Learning";
pres.subject = "Project Presentation";
pres.author = "Cognition AI Team";
pres.layout = "LAYOUT_16x9";

// Define theme colors
const COLORS = {
    bg: "0f172a", // Slate 950
    text: "f8fafc", // Slate 50
    brand: "3b82f6", // Blue 500
    accent: "a855f7", // Purple 500
    subtext: "94a3b8" // Slate 400
};

// Common slide master
pres.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: COLORS.bg },
    objects: [
        { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: COLORS.brand } } }, // Top bar
        { text: { text: "Cognition AI Learning", options: { x: 0.5, y: "95%", fontSize: 10, color: COLORS.subtext } } }
    ]
});

// Helper to add a slide with title and content
const addSlide = (title, contentLines = []) => {
    let slide = pres.addSlide({ masterName: "MASTER_SLIDE" });

    // Title
    slide.addText(title, {
        x: 0.5, y: 0.5, w: "90%", h: 1,
        fontSize: 32, color: COLORS.brand, bold: true, fontFace: "Arial"
    });

    // Content bullets
    if (contentLines.length > 0) {
        let bullets = contentLines.map(line => ({
            text: line.text,
            options: {
                fontSize: 18,
                color: COLORS.text,
                breakLine: true,
                bullet: line.bullet !== false,
                indentLevel: line.indent || 0
            }
        }));

        slide.addText(bullets, {
            x: 0.5, y: 1.5, w: "90%", h: 5,
            lineSpacing: 32, fontFace: "Arial"
        });
    }
    return slide;
};

// --- SLIDE 1: Title Slide ---
let slide1 = pres.addSlide();
slide1.background = { color: COLORS.bg };
slide1.addText("Cognition AI Learning", {
    x: 0, y: "35%", w: "100%", align: "center",
    fontSize: 54, color: COLORS.brand, bold: true
});
slide1.addText("Empowering the Next Generation with AI-Driven Personalized Education", {
    x: 0, y: "50%", w: "100%", align: "center",
    fontSize: 24, color: COLORS.text
});
slide1.addText('"Master any skill, faster than ever."', {
    x: 0, y: "60%", w: "100%", align: "center",
    fontSize: 18, color: COLORS.accent, italic: true
});


// --- SLIDE 2: The Problem ---
addSlide("The Problem: Traditional Education is Static", [
    { text: "One-size-fits-all: Standardized curriculums don't adapt to individual pacing." },
    { text: "Passive Learning: Text-heavy content leads to low engagement and retention." },
    { text: "Lack of Feedback: Waiting for human grading slows down the learning loop." },
    { text: "Mental Fatigue: Burnout is real without wellness integration." }
]);

// --- SLIDE 3: The Solution ---
addSlide("The Solution: Intelligent, Immersive, Holistic", [
    { text: "AI-First Core: Powered by Google Gemini models for dynamic content." },
    { text: "Adaptive Pathways: Curriculum that evolves with the learner's progress." },
    { text: "Holistic Approach: Integrating gamification and wellness tools." },
    { text: "Cross-Platform: Seamless experience on Web and Mobile (Android/iOS)." }
]);

// --- SLIDE 4: Key Feature - AI Powerhouse ---
addSlide("NeuroLearn AI & Intelligent Tutoring", [
    { text: "AI Tutor Chatbot: 24/7 personalized assistance implementing RAG." },
    { text: "Course Generation: Instantly create curriculums, descriptions, and quizzes." },
    { text: "Visual Learning: Dynamic image generation (Imagen 3) for concepts." },
    { text: "Technical Edge: Leveraging @google/genai for multimodal capabilities." }
]);

// --- SLIDE 5: Engagement & Gamification ---
addSlide("Immersive Experience: Play to Learn", [
    { text: "Game Center: Interactive games to reinforce knowledge." },
    { text: "Daily Challenges: Streak-based incentives to build habits." },
    { text: "Achievements: Visual rewards system (XP, Badges, Streaks)." },
    { text: "Community: Blog, Art Gallery, and Success Stories." }
]);

// --- SLIDE 6: Student Wellness ---
addSlide("Student Wellness: The 'Relax Tab'", [
    { text: "Concept: A dedicated space for mental clarity and focus." },
    { text: "Implementation: Custom Music Player with 432Hz Audio." },
    { text: "Tech Visuals: Real-time Audio Visualization (Web Audio API)." },
    { text: "Benefit: Reduces burnout and improves long-term retention." }
]);

// --- SLIDE 7: The Ecosystem ---
addSlide("Complete Platform Ecosystem", [
    { text: "Student Dashboard: Personalized recommendations & progress tracking." },
    { text: "Instructor Dashboard: Course creation suite & analytics." },
    { text: "Mobile App: Native React Native experience." },
    { text: "Payments: Integrated processing for premium courses." }
]);

// --- SLIDE 8: Technical Architecture ---
addSlide("Built on Modern Technology", [
    { text: "Frontend: React 19 + Vite + Tailwind CSS + Framer Motion" },
    { text: "Backend: Node.js + Express + Nodemailer" },
    { text: "AI Engine: Google Gemini API" },
    { text: "Mobile: React Native + Expo Router" },
    { text: "Database: MongoDB + Mongoose" }
]);

// --- SLIDE 9: Demo Walkthrough ---
addSlide("Demo Walkthrough", [
    { text: "1. Landing Page: Wave theme transition & 3D hero elements." },
    { text: "2. Auth Flow: Login celebration animation." },
    { text: "3. Dashboard: Active courses & Daily Challenges." },
    { text: "4. AI Course Gen: Generate curriculum with AI." },
    { text: "5. Relax Tab: Real-time audio visualization." }
]);

// --- SLIDE 10: Roadmap ---
addSlide("Future Roadmap", [
    { text: "Voice Mode: Real-time voice conversation with AI Tutor." },
    { text: "AR/VR: Immersive labs for science/engineering." },
    { text: "Collaborative Learning: Multiplayer classrooms." },
    { text: "Global Reach: AI-powered real-time translation." }
]);

// --- Closing Slide ---
let closingSlide = pres.addSlide();
closingSlide.background = { color: COLORS.bg };
closingSlide.addText("Thank You", {
    x: 0, y: "40%", w: "100%", align: "center",
    fontSize: 60, color: COLORS.brand, bold: true
});
closingSlide.addText("Reshaping the future of education.", {
    x: 0, y: "55%", w: "100%", align: "center",
    fontSize: 24, color: COLORS.text
});


// Generate File
pres.writeFile({ fileName: "Cognition_AI_Presentation.pptx" })
    .then(fileName => {
        console.log(`Created file: ${fileName}`);
    })
    .catch(err => {
        console.error(err);
    });
