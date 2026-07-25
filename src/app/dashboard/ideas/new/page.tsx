import { createIdea } from "./actions";

export default function NewIdeaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Capture a new idea</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Don't overthink it. Raw is fine — BRAINS will help you structure it
          into a testable hypothesis.
        </p>
      </div>

      <form action={createIdea} className="space-y-6">
        <div className="card space-y-6">
          {/* Title */}
          <div>
            <label className="label" htmlFor="title">
              Idea title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. A tool that helps founders validate before building"
              className="input-field"
            />
          </div>

          {/* Problem */}
          <div>
            <label className="label" htmlFor="problem">
              What problem are you solving?
            </label>
            <textarea
              id="problem"
              name="problem"
              rows={3}
              placeholder="Describe the pain you've observed. Who hurts and how?"
              className="input-field resize-none"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="label" htmlFor="audience">
              Who is it for?
            </label>
            <textarea
              id="audience"
              name="audience"
              rows={2}
              placeholder="Be specific. 'Founders in Nairobi building their first SaaS' beats 'entrepreneurs'."
              className="input-field resize-none"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="label" htmlFor="solution">
              What do you believe will solve it?
            </label>
            <textarea
              id="solution"
              name="solution"
              rows={3}
              placeholder="Your hypothesis for the solution. This will be tested — don't commit yet."
              className="input-field resize-none"
            />
          </div>

          {/* Why now */}
          <div>
            <label className="label" htmlFor="whyNow">
              Why now?
            </label>
            <textarea
              id="whyNow"
              name="whyNow"
              rows={2}
              placeholder="What changed that makes this possible or urgent now?"
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            Capture idea
          </button>
          <a href="/dashboard" className="btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
