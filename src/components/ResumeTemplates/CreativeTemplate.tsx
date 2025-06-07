import { ParsedResume } from '@/types'

interface CreativeTemplateProps {
  resume: ParsedResume
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-black max-w-4xl mx-auto min-h-[11in] shadow-lg" id="resume-content">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">{resume.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {resume.email && <div className="flex items-center"><span className="mr-2">📧</span><span className="break-all">{resume.email}</span></div>}
              {resume.phone_no && <div className="flex items-center"><span className="mr-2">📱</span>{resume.phone_no}</div>}
              {resume.address && <div className="flex items-center"><span className="mr-2">📍</span><span className="break-words">{resume.address}</span></div>}
            </div>
            <div className="space-y-2">
              {resume.linkedin_profile && <div className="flex items-center"><span className="mr-2">💼</span><span className="break-all">{resume.linkedin_profile}</span></div>}
              {resume.github_profile && <div className="flex items-center"><span className="mr-2">💻</span><span className="break-all">{resume.github_profile}</span></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {resume.summary && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-gradient-to-b from-purple-500 to-pink-500">
              <p className="text-gray-700 leading-relaxed italic">{resume.summary}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mr-4 flex items-center justify-center">
                <span className="text-white text-sm">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Skills & Expertise</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {resume.skills.map((skill, index) => {
                const colors = [
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-cyan-500',
                  'from-green-500 to-teal-500',
                  'from-yellow-500 to-orange-500',
                  'from-red-500 to-pink-500',
                  'from-indigo-500 to-purple-500'
                ];
                const colorClass = colors[index % colors.length];
                return (
                  <div key={index} className={`bg-gradient-to-r ${colorClass} text-white px-4 py-2 rounded-full text-center text-sm font-medium shadow-lg transform hover:scale-105 transition-transform`}>
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-4 flex items-center justify-center">
                <span className="text-white text-sm">💼</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {resume.experiences.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl shadow-lg p-6 ml-8 border-l-4 border-blue-500">
                    <div className="absolute -left-4 top-6 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{exp.role}</h3>
                    <p className="text-lg font-semibold text-blue-600 mb-4">{exp.company_name}</p>
                    <ul className="space-y-2">
                      {exp.bulletin.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-4 flex items-center justify-center">
                <span className="text-white text-sm">🛠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Featured Projects</h2>
            </div>
            <div className="grid gap-6">
              {resume.projects.map((project, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-3"></span>
                    {project.name}
                  </h3>
                  <ul className="space-y-2">
                    {project.roles.map((role, roleIndex) => (
                      <li key={roleIndex} className="text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white text-sm">🎓</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Education</h2>
              </div>
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-indigo-500">
                    <p className="text-gray-700 font-medium">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Certifications</h2>
              </div>
              <div className="space-y-3">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-gray-700 font-medium">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Awards */}
        {resume.awards && resume.awards.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-4 flex items-center justify-center">
                <span className="text-white text-sm">🌟</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Awards & Recognition</h2>
            </div>
            <div className="grid gap-4">
              {resume.awards.map((award, index) => (
                <div key={index} className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200 shadow-md">
                  <p className="text-gray-700 font-medium flex items-center">
                    <span className="w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-3"></span>
                    {award}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 