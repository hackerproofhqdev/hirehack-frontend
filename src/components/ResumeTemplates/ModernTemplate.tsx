import { ParsedResume } from '@/types'

interface ModernTemplateProps {
  resume: ParsedResume
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
  return (
    <div className="bg-white text-black max-w-4xl mx-auto min-h-[11in] shadow-lg flex" id="resume-content">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-50 p-6">
        {/* Profile */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
            {resume.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{resume.name}</h1>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-1">CONTACT</h2>
          <div className="space-y-3 text-sm text-gray-600">
            {resume.email && (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
                <span className="break-all">{resume.email}</span>
              </div>
            )}
            {resume.phone_no && (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
                <span>{resume.phone_no}</span>
              </div>
            )}
            {resume.address && (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
                <span className="break-words">{resume.address}</span>
              </div>
            )}
            {resume.linkedin_profile && (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
                <span className="break-all">{resume.linkedin_profile}</span>
              </div>
            )}
            {resume.github_profile && (
              <div className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-3"></span>
                <span className="break-all">{resume.github_profile}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-1">SKILLS</h2>
            <div className="space-y-2">
              {resume.skills.map((skill, index) => (
                <div key={index} className="bg-white rounded-lg p-2 shadow-sm">
                  <span className="text-sm text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-1">EDUCATION</h2>
            {resume.education.map((edu, index) => (
              <div key={index} className="mb-3 bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-700">{edu}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-1">CERTIFICATIONS</h2>
            {resume.certifications.map((cert, index) => (
              <div key={index} className="mb-2 bg-white rounded-lg p-2 shadow-sm">
                <p className="text-sm text-gray-700">{cert}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8">
        {/* Summary */}
        {resume.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">PROFESSIONAL SUMMARY</h2>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">EXPERIENCE</h2>
            {resume.experiences.map((exp, index) => (
              <div key={index} className="mb-6 relative">
                <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="ml-6 border-l-2 border-gray-200 pl-6 pb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{exp.role}</h3>
                  <p className="text-blue-600 font-medium mb-3">{exp.company_name}</p>
                  <ul className="space-y-2">
                    {exp.bulletin.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{bullet}</span>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">PROJECTS</h2>
            {resume.projects.map((project, index) => (
              <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{project.name}</h3>
                <ul className="space-y-2">
                  {project.roles.map((role, roleIndex) => (
                    <li key={roleIndex} className="text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Awards */}
        {resume.awards && resume.awards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AWARDS & ACHIEVEMENTS</h2>
            <div className="grid gap-3">
              {resume.awards.map((award, index) => (
                <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-gray-700">{award}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 