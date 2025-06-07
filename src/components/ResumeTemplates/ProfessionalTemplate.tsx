import { ParsedResume } from '@/types'

interface ProfessionalTemplateProps {
  resume: ParsedResume
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  return (
    <div className="bg-white text-black max-w-4xl mx-auto min-h-[11in] shadow-lg" id="resume-content">
      {/* Header */}
      <div className="bg-gray-800 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">{resume.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            {resume.email && <div className="break-all">Email: {resume.email}</div>}
            {resume.phone_no && <div>Phone: {resume.phone_no}</div>}
          </div>
          <div className="space-y-2">
            {resume.address && <div className="break-words">Address: {resume.address}</div>}
          </div>
          <div className="space-y-2">
            {resume.linkedin_profile && <div className="break-all">LinkedIn: {resume.linkedin_profile}</div>}
            {resume.github_profile && <div className="break-all">GitHub: {resume.github_profile}</div>}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {resume.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">EXECUTIVE SUMMARY</h2>
            <div className="bg-gray-50 p-6 border-l-4 border-gray-800">
              <p className="text-gray-700 leading-relaxed text-justify">{resume.summary}</p>
            </div>
          </div>
        )}

        {/* Core Competencies */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">CORE COMPETENCIES</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {resume.skills.map((skill, index) => (
                <div key={index} className="bg-gray-100 border border-gray-300 px-4 py-2 text-center font-medium text-gray-800">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-800">PROFESSIONAL EXPERIENCE</h2>
            {resume.experiences.map((exp, index) => (
              <div key={index} className="mb-8 border-l-4 border-gray-300 pl-6">
                <div className="bg-gray-50 p-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{exp.role}</h3>
                  <p className="text-lg font-semibold text-gray-600 mb-2">{exp.company_name}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Responsibilities & Achievements:</h4>
                  <ul className="space-y-2">
                    {exp.bulletin.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-gray-700 flex items-start">
                        <span className="inline-block w-2 h-2 bg-gray-800 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                        <span className="text-justify">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-800">KEY PROJECTS</h2>
            {resume.projects.map((project, index) => (
              <div key={index} className="mb-6 border border-gray-300 p-6 bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-800 text-white p-3 -m-6 mb-4">
                  {project.name}
                </h3>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Project Details:</h4>
                  <ul className="space-y-2">
                    {project.roles.map((role, roleIndex) => (
                      <li key={roleIndex} className="text-gray-700 flex items-start">
                        <span className="inline-block w-2 h-2 bg-gray-600 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                        <span className="text-justify">{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-800">EDUCATION</h2>
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="border border-gray-300 p-4 bg-gray-50">
                    <p className="text-gray-700 font-medium">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-800">CERTIFICATIONS</h2>
              <div className="space-y-3">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="border border-gray-300 p-4 bg-gray-50">
                    <p className="text-gray-700 font-medium">• {cert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Awards */}
        {resume.awards && resume.awards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">AWARDS & RECOGNITION</h2>
            <div className="grid gap-4">
              {resume.awards.map((award, index) => (
                <div key={index} className="bg-gray-800 text-white p-4 border-l-4 border-gray-600">
                  <p className="font-medium">{award}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 