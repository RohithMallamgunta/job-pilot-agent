# Job Pilot Agent

**An open-source, cloud-based AI agent for intelligent job discovery, resume tailoring, ATS-readiness validation, and automated job applications.**

> Find opportunities. Tailor intelligently. Stay in control.

**Project Status: In Development**

Job Pilot Agent is being built as a configurable AI automation system that reduces repetitive tasks in the job application process while allowing users to control how much autonomy they give the agent.

## The Problem

Job hunting involves repetitive and time-consuming activities:

- Searching multiple job platforms for relevant opportunities.
- Comparing job descriptions against personal experience.
- Customizing resumes for individual roles.
- Checking resume compatibility and relevance.
- Tracking applications and their outcomes.

Job Pilot Agent aims to bring these activities into one automated workflow.

## Planned Features

**Intelligent Job Discovery**  
Discover relevant openings from user-configured, supported job sources.

**AI-Powered Job Matching**  
Evaluate opportunities against a candidate's verified skills, experience, and preferences.

**Personalized Resume Generation**  
Generate job-specific resumes without inventing qualifications or experience.

**ATS-Readiness Checker**  
Validate resume structure, text extraction, formatting, and job-description alignment using transparent quality checks.

**Flexible Approval Modes**  
Choose human-reviewed applications (recommended) or explicitly opt into automated submission with safeguards.

**Telegram Integration**  
Receive job reports, review tailored resumes, approve applications, and monitor progress.

**Spreadsheet-Based Configuration**  
Configure schedules, job preferences, sources, resume links, and approval settings without modifying code.

**Application Tracking**  
Maintain a record of discovered jobs, resume versions, application statuses, and submission outcomes.

## Proposed Workflow

```text
User Configuration
        |
        v
Job Discovery
        |
        v
AI Job Matching
        |
        v
Resume Customization
        |
        v
ATS-Readiness Validation
        |
        v
Approval Decision
    /          \
 Manual       Automatic
    \          /
        v
Supported Application Submission
        |
        v
Application Tracker
```

## Proposed Technology Stack

| Component | Technology |
|---|---|
| Configuration and tracking | Google Sheets |
| Resume storage | Google Drive |
| AI processing | Gemini API or compatible LLM |
| Automation | Google Apps Script |
| Messaging | Telegram Bot API |
| Cloud execution | Serverless infrastructure |
| Application automation | Playwright |
| Version control and CI/CD | GitHub and GitHub Actions |

*The architecture and technology choices may evolve during development.*

## Design Principles

- **Human control:** Manual approval is recommended; automatic mode requires explicit opt-in.
- **Truthfulness:** Never fabricate qualifications, experience, or application answers.
- **Transparency:** Make decisions, resume changes, and application outcomes traceable.
- **Privacy:** Keep user data and credentials outside public repositories.
- **Accessibility:** Prioritize beginner-friendly configuration and free-tier infrastructure.
- **Responsible automation:** Respect job-platform restrictions and require manual intervention when necessary.

## Development Status

The project is currently in its foundation and planning phase.

Our development roadmap includes configuration, job discovery, AI matching, resume generation, ATS-readiness validation, approval workflows, application submission, cloud deployment, and testing.

Installation and deployment instructions will be added as functional components become available.

## Limitations

ATS-readiness scores will be internal quality indicators, not guarantees of acceptance by an employer's applicant tracking system.

Automated submission will be limited to supported application workflows. Authentication challenges, unsupported forms, and uncertain application answers may require human intervention.

## License

MIT License.

---

**Job Pilot Agent — Building an intelligent, configurable, human-controlled job application workflow.**
