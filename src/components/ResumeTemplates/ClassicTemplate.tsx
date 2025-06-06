import { ParsedResume } from '@/types'

interface ClassicTemplateProps {
  resume: ParsedResume
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto min-h-[11in] shadow-lg" id="resume-content">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{resume.name}</h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone_no && <span>•</span>}
          {resume.phone_no && <span>{resume.phone_no}</span>}
          {resume.address && <span>•</span>}
          {resume.address && <span>{resume.address}</span>}
        </div>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mt-1">
          {resume.linkedin_profile && <span>{resume.linkedin_profile}</span>}
          {resume.github_profile && resume.linkedin_profile && <span>•</span>}
          {resume.github_profile && <span>{resume.github_profile}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experiences && resume.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
          {resume.experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-800">{exp.role}</h3>
                <span className="text-sm text-gray-600 font-medium">{exp.company_name}</span>
              </div>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                {exp.bulletin.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="mb-1">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="text-gray-700">{edu}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">TECHNICAL SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">PROJECTS</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{project.name}</h3>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                {project.roles.map((role, roleIndex) => (
                  <li key={roleIndex} className="mb-1">{role}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">CERTIFICATIONS</h2>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <p className="text-gray-700">• {cert}</p>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {resume.awards && resume.awards.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">AWARDS & ACHIEVEMENTS</h2>
          {resume.awards.map((award, index) => (
            <div key={index} className="mb-2">
              <p className="text-gray-700">• {award}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 