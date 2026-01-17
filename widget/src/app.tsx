import { useState } from 'preact/hooks';
import { MessageSquare, X, Check, Loader2 } from 'lucide-preact';
import { feedbackSchema, type FeedbackInput } from './schema';

interface AppProps {
  projectKey: string;
}

export function App({ projectKey }: AppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackInput, string>>>({});

  const [formData, setFormData] = useState<FeedbackInput>({
    userName: '',
    userEmail: '',
    type: 'OTHER',
    message: ''
  });

  function getApiBase(): string {
    // Prefer currentScript
    const current = document.currentScript;
    if (current instanceof HTMLScriptElement && current.src) {
      return new URL(current.src).origin;
    }

    // Fallback: find widget.js
    const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]");
    const widgetScript = [...scripts].find(s =>
      s.src.includes("widget.js")
    );

    if (widgetScript) {
      return new URL(widgetScript.src).origin;
    }

    // Absolute fallback
    return window.location.origin;
  }


  const API_BASE = getApiBase();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Validate form data
    const result = feedbackSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FeedbackInput, string>> = {};
      result.error.issues.forEach((issue) => {
        // Zod issue path is an array of strings/numbers
        const path = issue.path[0] as keyof FeedbackInput;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${API_BASE}/api/widget/feedback`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectKey,
          ...result.data
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setSuccess(true);
      setFormData({ userName: '', userEmail: '', type: 'OTHER', message: '' });
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-9999 font-sans antialiased">
      {/* Popover Content */}
      <div
        className={`absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}
      >
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg">Send Feedback</h3>
            <p className="text-sm text-neutral-500 mt-1">
              We'd love to hear your thoughts.
            </p>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-green-600 animate-in fade-in duration-300">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Check size={32} />
              </div>
              <p className="font-semibold text-lg">Thank you!</p>
              <p className="text-neutral-500 mt-2 text-center">Your feedback has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name <span className="text-neutral-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  className={`w-full px-4 py-2.5 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all ${errors.userName ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'}`}
                  placeholder="Your name"
                  value={formData.userName}
                  onInput={(e) => setFormData({ ...formData, userName: (e.target as HTMLInputElement).value })}
                />
                {errors.userName && <p className="text-xs text-red-500 font-medium">{errors.userName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Email <span className="text-neutral-400 font-normal">(Optional)</span></label>
                <input
                  type="email"
                  className={`w-full px-4 py-2.5 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all ${errors.userEmail ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'}`}
                  placeholder="name@example.com"
                  value={formData.userEmail}
                  onInput={(e) => setFormData({ ...formData, userEmail: (e.target as HTMLInputElement).value })}
                />
                {errors.userEmail && <p className="text-xs text-red-500 font-medium">{errors.userEmail}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Type</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 focus:bg-white transition-all appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: (e.target as HTMLSelectElement).value as FeedbackInput['type'] })}
                  >
                    <option value="BUG">Bug Report</option>
                    <option value="FEATURE">Feature Request</option>
                    <option value="OTHER">General / Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Message</label>
                <textarea
                  className={`w-full px-4 py-3 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all min-h-[100px] resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'}`}
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onInput={(e) => setFormData({ ...formData, message: (e.target as HTMLTextAreaElement).value })}
                />
                {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold shadow-lg shadow-black/10 hover:shadow-xl hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black relative z-10 ${isOpen ? 'bg-white text-black rotate-90' : 'bg-black text-white hover:bg-neutral-800 hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
