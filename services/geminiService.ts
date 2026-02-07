
import { GoogleGenAI } from "@google/genai";
import { QuizQuestion, Flashcard } from '../types';

// Initialize the GoogleGenAI client 
// According to official docs, GoogleGenAI({}) automatically reads from GEMINI_API_KEY env variable
const getAIClient = () => {
  console.log("AI Service: Initializing GoogleGenAI client...");

  try {
    // The SDK expects GEMINI_API_KEY (not VITE_GEMINI_API_KEY) in the environment
    // But we need to pass it explicitly in browser environments
    // @ts-ignore  
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ CRITICAL: No Gemini API key found!");
      console.error("Please ensure VITE_GEMINI_API_KEY is set in your .env file");
      throw new Error(
        "Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file. " +
        "You can get a free API key from https://ai.google.dev/"
      );
    }

    console.log("✅ AI Service: API key found (length:", apiKey.length, ")");

    // Initialize with API key
    const ai = new GoogleGenAI({ apiKey });
    console.log("✅ AI Service: Client initialized successfully");
    return ai;
  } catch (error) {
    console.error("❌ Failed to initialize AI client:", error);
    throw error;
  }
};

// Helper to clean JSON responses
const cleanJSON = (text: string): string => {
  if (!text) return '{}';
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

// --- Course Generation ---

export const generateCourseOutline = async (topic: string, level: string): Promise<any> => {
  console.log("Generating course outline for:", topic, "at level:", level);
  const ai = getAIClient();

  const prompt = `Create a detailed course outline for "${topic}" at "${level}" difficulty.
Return ONLY a valid JSON object with this exact structure:
{
  "title": "Course Title",
  "description": "2-sentence description",
  "modules": [
    {
      "title": "Module Title",
      "lessons": [
        {"title": "Lesson Title", "duration": "5 min"}
      ]
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const cleaned = cleanJSON(text);
    const parsed = JSON.parse(cleaned);

    console.log("Course outline generated successfully");
    return parsed;
  } catch (error) {
    console.error("Course outline generation error:", error);
    throw new Error("Failed to generate course outline. Please try again.");
  }
};

export const generateLessonContent = async (courseTitle: string, lessonTitle: string): Promise<string> => {
  console.log("Generating lesson content for:", lessonTitle);
  const ai = getAIClient();

  const prompt = `Write comprehensive educational content in Markdown format for the lesson "${lessonTitle}" in the course "${courseTitle}".
Include headings, bullet points, examples, and a brief summary. Keep it under 500 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    console.log("Lesson content generated successfully");
    return response.text || 'Content generation failed.';
  } catch (error) {
    console.error("Lesson content generation error:", error);
    return "Failed to generate lesson content. Please try again.";
  }
};

// --- Image Generation ---

export const generateImage = async (prompt: string): Promise<string> => {
  console.log("Image generation requested for:", prompt);
  // Using Pollinations AI for free, dynamic AI image generation
  // This service generates images based on text prompts
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&nologo=true`;
};

// --- AI Tutor (Chat) ---

export const generateTutorResponse = async (
  history: { role: 'user' | 'model', text: string }[],
  currentMessage: string,
  context: string
): Promise<string> => {
  console.log("Generating tutor response for message:", currentMessage.substring(0, 50));
  const ai = getAIClient();

  const systemPrompt = `You are a helpful AI Tutor. Use this lesson content as context:

${context}

Answer the student's question based on this context. If the answer isn't in the context, use your general knowledge but mention it's outside the current lesson scope.`;

  try {
    const messages = [
      { role: 'user' as const, parts: [{ text: systemPrompt }] },
      ...history.map(h => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: h.text }]
      })),
      { role: 'user' as const, parts: [{ text: currentMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages
    });

    console.log("Tutor response generated successfully");
    return response.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Chat generation error:", error);
    return "Sorry, I'm having trouble connecting to the AI right now.";
  }
};

// --- Quiz Generation ---

export const generateQuiz = async (content: string): Promise<QuizQuestion[]> => {
  console.log("Generating quiz from content (length:", content.length, ")");
  const ai = getAIClient();

  const prompt = `Generate exactly 3 multiple-choice quiz questions based on this text:

"${content.substring(0, 2000)}"

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswerIndex": 0
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const cleaned = cleanJSON(response.text || '[]');
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid quiz format");
    }

    console.log("Quiz generated successfully:", parsed.length, "questions");
    return parsed;
  } catch (error) {
    console.error("Quiz generation error:", error);
    return [];
  }
};

// --- Summary Generation ---

export const generateSummary = async (content: string): Promise<string> => {
  console.log("Generating summary from content (length:", content.length, ")");
  const ai = getAIClient();

  const prompt = `Summarize the following lesson content into 3 concise, key takeaways using bullet points:

"${content.substring(0, 3000)}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    console.log("Summary generated successfully");
    return response.text || 'Unable to generate summary.';
  } catch (error) {
    console.error("Summary generation error:", error);
    return "Failed to generate summary.";
  }
};

// --- Flashcard Generation ---

export const generateFlashcards = async (content: string): Promise<Flashcard[]> => {
  console.log("Generating flashcards from content (length:", content.length, ")");
  const ai = getAIClient();

  const prompt = `Create exactly 5 study flashcards based on key concepts in this text:

"${content.substring(0, 3000)}"

Return ONLY a valid JSON array in this exact format:
[
  {
    "front": "Concept or question",
    "back": "Definition or answer"
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const cleaned = cleanJSON(response.text || '[]');
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid flashcard format");
    }

    console.log("Flashcards generated successfully:", parsed.length, "cards");
    return parsed;
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return [];
  }
};

// --- Video Generation (Placeholder) ---

export const generatePreviewVideo = async (courseTitle: string): Promise<string | null> => {
  console.log("Video generation not available in current SDK");
  // Video generation (Veo) may not be available in @google/genai v1.30.0
  // Returning null to indicate feature unavailable
  return null;
};
