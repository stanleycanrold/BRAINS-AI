import { createIdea } from "./actions";

export default function NewIdeaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Capture a new idea</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Don&apos;t overthink it. Raw is fine — BRAINS will help you structure it
          into a testable hypothesis.
        </p>
      </div>

      <form action={createIdea} className="space-y-6">
        {/* Core */}
        <div className="card space-y-6">
          <div>
            <label className="label" htmlFor="title">
              Idea title <span className="text-pink">*</span>
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

          <div>
            <label className="label" htmlFor="description">
              What&apos;s the idea, in your words?
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe it like you&apos;re telling a friend. No jargon."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="label">
              What stage are you at? <span className="text-pink">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="stage"
                  value="idea"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="rounded-lg border border-bg-border bg-bg-surface px-4 py-3 text-center text-sm transition-colors peer-checked:border-cyan peer-checked:bg-cyan/10 peer-checked:text-cyan">
                  💡 Idea
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="stage"
                  value="prototype"
                  className="peer sr-only"
                />
                <div className="rounded-lg border border-bg-border bg-bg-surface px-4 py-3 text-center text-sm transition-colors peer-checked:border-cyan peer-checked:bg-cyan/10 peer-checked:text-cyan">
                  🔨 Prototype
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="stage"
                  value="live_product"
                  className="peer sr-only"
                />
                <div className="rounded-lg border border-bg-border bg-bg-surface px-4 py-3 text-center text-sm transition-colors peer-checked:border-cyan peer-checked:bg-cyan/10 peer-checked:text-cyan">
                  🚀 Live
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="card space-y-6">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            Context
          </h2>

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

          <div>
            <label className="label" htmlFor="targetUser">
              Target user (ICP)
            </label>
            <input
              id="targetUser"
              name="targetUser"
              type="text"
              placeholder="e.g. Solo founders, 25-40, pre-revenue, technical"
              className="input-field"
            />
          </div>

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

        {/* Build context (if applicable) */}
        <div className="card space-y-6">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            What you&apos;re building
          </h2>

          <div>
            <label className="label" htmlFor="productDesc">
              Product description
            </label>
            <textarea
              id="productDesc"
              name="productDesc"
              rows={3}
              placeholder="What are you building (or planning to build)?"
              className="input-field resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="websiteUrl">
                Website URL
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                placeholder="https://..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label" htmlFor="repoUrl">
                Repo URL
              </label>
              <input
                id="repoUrl"
                name="repoUrl"
                type="url"
                placeholder="https://github.com/..."
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="traction">
              Current traction (if live)
            </label>
            <textarea
              id="traction"
              name="traction"
              rows={2}
              placeholder="Users, revenue, signups, anything measurable."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="label" htmlFor="competitors">
              Known competitors
            </label>
            <textarea
              id="competitors"
              name="competitors"
              rows={2}
              placeholder="Who else is doing this? What's different about your approach?"
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
