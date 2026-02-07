// Test file to check GoogleGenAI API
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'test' });

// Log what methods/properties are available
console.log('GoogleGenAI instance:', ai);
console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ai)));
console.log('Properties:', Object.keys(ai));
