import Link from 'next/link';
import { ArrowRight, BarChart3, Download, FileText, Shield, Sparkles, Target, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const features = [
  {
    icon: <Sparkles className="text-brand-400" size={22} />,
    title: 'AI Writing Assistant',
    desc: 'Generate summaries, sharpen bullet points, and tailor content to a live job description.',
  },
  {
    icon: <BarChart3 className="text-emerald-400" size={22} />,
    title: 'ATS Optimization',
    desc: 'Measure keyword coverage, score fit, and get practical recommendations before you apply.',
  },
  {
    icon: <Target className="text-sky-400" size={22} />,
    title: 'Role-Specific Resumes',
    desc: 'Keep multiple polished resume versions for different companies, seniority levels, and tracks.',
  },
  {
    icon: <Zap className="text-amber-400" size={22} />,
    title: 'Live Preview',
    desc: 'Edit on the left, see the finished resume update instantly on the right without context switching.',
  },
  {
    icon: <FileText className="text-rose-400" size={22} />,
    title: 'PDF Export',
    desc: 'Download clean, recruiter-friendly PDFs from modern, minimal, and professional templates.',
  },
  {
    icon: <Shield className="text-violet-400" size={22} />,
    title: 'Secure by Default',
    desc: 'JWT auth, input validation, rate limiting, and environment-based secrets are built in.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-100 dark:opacity-100 light:opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_24%),linear-gradient(180deg,#020617_0%,#020617_35%,#0f172a_100%)] dark:block light:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.1),transparent_50%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_50%),linear-gradient(180deg,#ffffff_0%,#f8fafc_50%,#f1f5f9_100%)] light:block dark:hidden" />

      <div className="relative">
        <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-xl text-slate-900 dark:text-white">ResumeAI</div>
              <div className="text-xs text-slate-500">AI resume workspace for job seekers</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login" className="btn-ghost text-slate-300 dark:text-slate-300 text-slate-700">
              Sign in
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Start free
            </Link>
          </div>
        </nav>

        <section className="px-6 pt-14 pb-20 max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-600/20 to-purple-600/20 border border-brand-500/30 text-brand-300 text-sm font-medium mb-8 animate-float">
                <Sparkles size={14} className="animate-pulse-glow" />
                Built for ATS-ready resumes and faster applications
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white leading-[1.02] mb-6 max-w-4xl animate-fade-in">
                Build resumes that feel{' '}
                <span className="gradient-text animate-shimmer bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text">
                  tailored
                </span>{' '}
                before the interview even starts.
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 text-balance leading-relaxed animate-slide-up animation-delay-200">
                Create polished resumes with AI-assisted writing, role-based tailoring, live preview, and export-ready templates in one focused workflow.
              </p>

              <div className="flex items-center gap-4 flex-wrap mb-10 animate-slide-up animation-delay-400">
                <Link href="/auth/register" className="btn-primary text-base px-7 py-3.5 group">
                  Build my resume{' '}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link href="/auth/login" className="btn-outline text-base px-7 py-3.5">
                  Open dashboard
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl animate-slide-up animation-delay-600">
                {[
                  { value: '3', label: 'Resume templates', icon: <FileText size={16} className="text-emerald-400" /> },
                  { value: '5', label: 'AI copilots', icon: <Sparkles size={16} className="text-purple-400" /> },
                  { value: '1-click', label: 'PDF export', icon: <Download size={16} className="text-blue-400" /> },
                ].map((stat, index) => (
                  <div key={stat.label} className="glass-card p-4 hover:scale-105 transition-transform duration-300 animate-scale-in" style={{ animationDelay: `${800 + index * 100}ms` }}>
                    <div className="flex items-center gap-2 mb-1">
                      {stat.icon}
                      <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-brand-500/20 via-sky-500/10 to-transparent blur-2xl" />
              <div className="relative rounded-[28px] border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-5 shadow-2xl shadow-slate-950/50">
                <div className="rounded-[22px] border border-slate-800 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Resume Snapshot</div>
                      <div className="text-white font-semibold mt-1">Senior Product Engineer</div>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                      ATS Score 87%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
                      <div className="text-sm font-medium text-white mb-2">AI Summary</div>
                      <p className="text-sm leading-6 text-slate-400">
                        Product-minded engineer with 6+ years shipping customer-facing platforms, scaling frontend architecture, and improving delivery speed across cross-functional teams.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
                        <div className="text-sm font-medium text-white mb-2">Missing Keywords</div>
                        <div className="flex flex-wrap gap-2">
                          {['A/B testing', 'roadmapping', 'experimentation'].map((keyword) => (
                            <span key={keyword} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
                        <div className="text-sm font-medium text-white mb-2">Tailoring Tips</div>
                        <ul className="space-y-2 text-sm text-slate-400">
                          <li>Add experimentation impact to current role.</li>
                          <li>Move analytics stack higher in skills.</li>
                          <li>Use the target job title in the summary.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
                      <div className="text-sm font-medium text-white mb-1">Templates and PDF export</div>
                      <div className="text-sm text-slate-300">
                        Switch layouts instantly and export a recruiter-ready PDF when the draft looks right.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div key={feature.title} className="glass-card p-6 hover:border-slate-700/80 hover:scale-105 transition-all duration-300 animate-scale-in group cursor-pointer" style={{ animationDelay: `${1000 + index * 100}ms` }}>
              <div className="w-11 h-11 rounded-2xl bg-slate-800/80 group-hover:bg-slate-700/80 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-slate-100 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{feature.desc}</p>
            </div>
          ))}
        </section>

        <section className="text-center pb-24 px-6">
          <div className="max-w-3xl mx-auto glass-card p-12 glow">
            <div className="text-xs uppercase tracking-[0.22em] text-brand-300 mb-4">Ready to apply smarter?</div>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Turn one rough draft into role-specific, interview-ready resumes.
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Build faster, tailor better, and keep every version organized in one place.
            </p>
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5">
              Start for free <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
          © {new Date().getFullYear()} ResumeAI. Built with Next.js and OpenAI.
        </footer>
      </div>
    </div>
  );
}
