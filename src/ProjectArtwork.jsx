import {
  Activity, Box, BriefcaseBusiness, Building2, ClipboardList, Code2, Database,
  GraduationCap, Handshake, HeartPulse, House, Landmark, Milk, Network,
  Snowflake, Stethoscope, Users, Video,
} from 'lucide-react'

const artwork = {
  cemso: { primary: Building2, secondary: Stethoscope, color: '#b8a2ff', glow: 'rgba(144, 113, 236, 0.24)' },
  'nex-em': { primary: Video, secondary: HeartPulse, color: '#8bd8ef', glow: 'rgba(83, 169, 209, 0.24)' },
  'sta-katak': { primary: Landmark, secondary: ClipboardList, color: '#a3d8b7', glow: 'rgba(91, 178, 135, 0.22)' },
  ahidms: { primary: HeartPulse, secondary: Database, color: '#f0b597', glow: 'rgba(205, 127, 91, 0.22)' },
  'rent-buy-sale-guy': { primary: House, secondary: Building2, color: '#e4ba83', glow: 'rgba(195, 141, 78, 0.22)' },
  'sanjog-consultancy': { primary: Handshake, secondary: BriefcaseBusiness, color: '#9acff2', glow: 'rgba(91, 155, 201, 0.22)' },
  'danza-enterprise': { primary: Building2, secondary: Network, color: '#c4b1f5', glow: 'rgba(153, 124, 213, 0.22)' },
  'frozen-corner': { primary: Snowflake, secondary: Box, color: '#9fdded', glow: 'rgba(99, 185, 210, 0.22)' },
  'four-medical': { primary: Stethoscope, secondary: Activity, color: '#a4e1cb', glow: 'rgba(82, 177, 152, 0.22)' },
  'dairy-firm-training': { primary: GraduationCap, secondary: Milk, color: '#e3d3a0', glow: 'rgba(188, 165, 99, 0.22)' },
  'hindu-temple-st-louis': { primary: Landmark, secondary: Users, color: '#edbd9e', glow: 'rgba(204, 139, 94, 0.22)' },
  'cube-project': { primary: Box, secondary: Code2, color: '#acbcff', glow: 'rgba(119, 138, 225, 0.22)' },
  'nag-associates': { primary: BriefcaseBusiness, secondary: Users, color: '#b4d2ec', glow: 'rgba(105, 154, 198, 0.22)' },
  mscl: { primary: Network, secondary: Building2, color: '#c6b5ec', glow: 'rgba(157, 125, 202, 0.22)' },
  'kaling-chikisha': { primary: Building2, secondary: HeartPulse, color: '#9ddcc7', glow: 'rgba(86, 174, 143, 0.22)' },
}

const defaultArtwork = { primary: Code2, secondary: Box, color: '#b8a2ff', glow: 'rgba(144, 113, 236, 0.24)' }

export default function ProjectArtwork({ project }) {
  const { primary: Primary, secondary: Secondary, color, glow } = artwork[project.id] || defaultArtwork

  return (
    <div className="project-art" style={{ '--art-accent': color, '--art-glow': glow }} aria-hidden="true">
      <div className="art-grid" />
      <div className="art-terminal">
        <div className="art-terminal-header"><span className="art-window-dots"><i /><i /><i /></span><span>project / overview</span></div>
        <div className="art-terminal-body">
          <span className="art-prompt">&gt;_ PROJECT FILE</span>
          <span className="art-project-name">{project.acronym || project.name}</span>
          <span className="art-domain">{project.domain}</span>
          <span className="art-code-bars"><i /><i /><i /></span>
        </div>
      </div>
      <div className="art-illustration">
        <div className="art-orbit art-orbit-outer" />
        <div className="art-orbit art-orbit-inner" />
        <div className="art-icon-panel"><Primary size={52} strokeWidth={1.3} /></div>
        <div className="art-secondary-icon"><Secondary size={22} strokeWidth={1.6} /></div>
        <span className="art-cross art-cross-one">+</span>
        <span className="art-cross art-cross-two">+</span>
      </div>
    </div>
  )
}
