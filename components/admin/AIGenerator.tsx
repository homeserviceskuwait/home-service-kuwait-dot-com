import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateContent, translateText, generateSEO } from '../../services/geminiService';

interface AIGeneratorProps {
    onGenerate: (result: any) => void;
    type: 'text' | 'translation' | 'seo';
    prompt?: string; // For 'text' type
    sourceText?: string; // For 'translation' and 'seo'
    targetLang?: 'en' | 'ar';
    className?: string;
    label?: string;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({
    onGenerate,
    type,
    prompt,
    sourceText,
    targetLang = 'en',
    className = '',
    label
}) => {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            let result;
            if (type === 'text' && prompt) {
                result = await generateContent(prompt);
            } else if (type === 'translation' && sourceText) {
                result = await translateText(sourceText, targetLang as 'en' | 'ar');
            } else if (type === 'seo' && sourceText) {
                result = await generateSEO(sourceText, targetLang as 'en' | 'ar');
            }

            if (result) {
                onGenerate(result);
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("Failed to generate content. Please check your API key and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || (type !== 'text' && !sourceText)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${loading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                } ${className}`}
            title="Generate with AI"
        >
            {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <Sparkles className="w-3.5 h-3.5" />
            )}
            {loading ? 'Generating...' : (label || 'AI Generate')}
        </button>
    );
};

export default AIGenerator;
