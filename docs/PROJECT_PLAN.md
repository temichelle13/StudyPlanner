# Project Plan

## Current Focus
The Study Planner product is prioritizing a discoverable, automatable core experience that keeps learners on track through intelligent scheduling, content surfacing, and nudging. The near-term objective is to validate workflows that can be enhanced by automation while preserving transparency and learner trust.

## Out of Scope
- Large, open-ended feature builds (e.g., full mobile apps, social communities) that would delay validation of the core planner value proposition.
- Enterprise integrations beyond the learning tools already identified for MVP discovery (additional student information systems, CRM/ERP connectors, etc.).
- Manual services that cannot be operationalized or augmented through the planner experience (concierge tutoring, bespoke coaching teams, etc.).
- Generic or experimental AI/ML explorations that are unrelated to the defined planner workflows. Purpose-built AI/ML components that directly enable tailored automation and meet the safeguards below are **explicitly in scope**.

## Personalization Layer Scope
To support tailored automation, discovery should concentrate on a constrained personalization layer that can be incrementally expanded after MVP validation.

### Data Inputs
- Core learner profile attributes: declared goals, target timelines, subject focus, availability windows, and preferred study modalities collected via onboarding.
- Behavioral signals captured in product: task completion rates, reschedules, skipped assignments, and engagement with recommended resources.
- Explicit learner feedback: quick reactions on recommendation usefulness, short surveys, and manual adjustments to schedules that reveal preferences.
- Instructor or institution data used with consent: class syllabi, assignment metadata, grading milestones (ingested through existing connectors only).

### Recommendation Features
- Automated study plan adjustments (task sequencing, pacing, and reminders) calibrated against profile goals and recent behavior trends.
- Content surfacing that highlights bite-sized resources or practice sets when gaps are detected in progress data.
- Suggestion of accountability actions (peer check-ins, tutor sessions) when risk indicators fire, with humans in the loop for escalation.
- Transparent explanations for every automated adjustment, including the inputs referenced and options to accept, edit, or dismiss.

### Privacy & Compliance Constraints
- Collect only data elements necessary for the defined recommendations, following data minimization and retention policies aligned to FERPA/GDPR where applicable.
- Require explicit opt-in for data sharing across cohorts; default to isolating learner data within its originating institution/tenant.
- Maintain auditable logs of personalization decisions and provide accessible history to learners and administrators.
- Enforce role-based access controls so only authorized staff can view sensitive data and override automation.

## AI Tooling Dependencies & Research Spikes
To responsibly include AI/ML automation, plan the following discovery and evaluation activities:
- **Model selection spike:** Compare vendor-hosted and self-managed models (e.g., fine-tuned transformers versus rules-based recommendation engines) for schedule optimization, focusing on data residency, latency, explainability, and ongoing tuning effort.
- **Data governance assessment:** Validate anonymization/pseudonymization approaches, consent flows, and retention policies with legal and compliance partners before ingesting training data.
- **Bias and fairness testing framework:** Identify metrics, representative datasets, and review cadences to detect disparate outcomes for protected classes; budget for external audits if required by institutions.
- **Safety guardrails:** Prototype moderation layers (prompt filters, output scoring) and human review workflows for high-impact recommendations (schedule changes, risk flags).
- **Toolchain integration check:** Ensure chosen AI services align with existing stack (Node.js backend, MongoDB/Realm data sources) and evaluate SDKs, API quotas, monitoring, and observability tooling needs.

Documenting these dependencies early enables the team to size discovery work, secure required expertise, and protect learners while leveraging AI for tailored automation.
