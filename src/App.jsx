import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ProjectChallenge from './ProjectChallenge'
import ProjectArtwork from './ProjectArtwork'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  Check,
  CirclePlay,
  Code2,
  Contact,
  Database,
  Download,
  Layers3,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Palette,
  Phone,
  Send,
  Sun,
  Terminal,
  X,
} from 'lucide-react'
import {
  achievements,
  blogTopics,
  education,
  experience,
  languages,
  profile,
  projects,
  skills,
  workHighlights,
} from './data/portfolio'

const navigation = [
  ['About', 'about'],
  ['Skills', 'skills'],
  ['Experience', 'experience'],
  ['Projects', 'projects'],
  ['Writing', 'writing'],
  ['Contact', 'contact'],
]

const themeAccents = [
  { id: 'violet', label: 'Violet', color: '#aa91ff' },
  { id: 'blue', label: 'Blue', color: '#75a9ff' },
  { id: 'teal', label: 'Teal', color: '#6dd6c2' },
  { id: 'rose', label: 'Rose', color: '#ff8caa' },
]

const currentYear = new Date().getFullYear()

function PageJump() {
  const [goToTop, setGoToTop] = useState(false)

  useEffect(() => {
    function updateDirection() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      setGoToTop(scrollableHeight > 0 && window.scrollY >= scrollableHeight / 2)
    }

    updateDirection()
    const observer = new ResizeObserver(updateDirection)
    observer.observe(document.body)
    window.addEventListener('scroll', updateDirection, { passive: true })
    window.addEventListener('resize', updateDirection)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateDirection)
      window.removeEventListener('resize', updateDirection)
    }
  }, [])

  return (
    <nav className="page-jump" aria-label="Page navigation">
      <a
        href={goToTop ? '#home' : '#page-bottom'}
        aria-label={goToTop ? 'Go to top of page' : 'Go to bottom of page'}
        title={goToTop ? 'Go to top' : 'Go to bottom'}
      >
        {goToTop ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
      </a>
    </nav>
  )
}

function CodeCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let x = 0
    let y = 0

    function hideCursor() {
      cancelAnimationFrame(frame)
      frame = 0
      cursor.classList.remove('is-visible')
    }

    function moveCursor(event) {
      if (!enabled.matches || event.pointerType !== 'mouse' || event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) {
        hideCursor()
        return
      }

      x = Math.min(event.clientX + 16, window.innerWidth - 38)
      y = Math.min(event.clientY + 16, window.innerHeight - 26)
      if (!frame) {
        frame = requestAnimationFrame(() => {
          cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
          cursor.classList.add('is-visible')
          frame = 0
        })
      }
    }

    function leaveWindow(event) {
      if (!event.relatedTarget) hideCursor()
    }

    function handleVisibility() {
      if (document.hidden) hideCursor()
    }

    window.addEventListener('pointermove', moveCursor)
    document.addEventListener('pointerout', leaveWindow)
    window.addEventListener('blur', hideCursor)
    document.addEventListener('visibilitychange', handleVisibility)
    enabled.addEventListener('change', hideCursor)

    return () => {
      hideCursor()
      window.removeEventListener('pointermove', moveCursor)
      document.removeEventListener('pointerout', leaveWindow)
      window.removeEventListener('blur', hideCursor)
      document.removeEventListener('visibilitychange', handleVisibility)
      enabled.removeEventListener('change', hideCursor)
    }
  }, [])

  return <span ref={cursorRef} className="code-cursor" aria-hidden="true">&lt;/&gt;</span>
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ number, eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow"><span>{number}</span> / {eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}

function SkillsDialog({ open, onClose }) {
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef(null)
  const [activeGroup, setActiveGroup] = useState('All')
  const groups = ['All', ...new Set(skills.map((skill) => skill.group))]
  const visibleGroups = activeGroup === 'All'
    ? groups.slice(1)
    : [activeGroup]
  const codeGroups = visibleGroups.map((group, groupIndex) => {
    const groupSkills = skills.filter((skill) => skill.group === group)
    const precedingLines = visibleGroups.slice(0, groupIndex).reduce(
      (count, precedingGroup) => count + skills.filter((skill) => skill.group === precedingGroup).length + 2,
      0,
    )
    const headerLine = precedingLines + 2
    const skillLines = groupSkills.map((skill, index) => ({ skill, line: headerLine + index + 1 }))
    const closingLine = headerLine + groupSkills.length + 1
    return { group, groupSkills, headerLine, skillLines, closingLine }
  })
  const objectClosingLine = 2 + codeGroups.reduce((count, group) => count + group.groupSkills.length + 2, 0)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    dialogRef.current?.querySelector('button')?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="dialog-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            ref={dialogRef}
            className="project-dialog skills-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skills-dialog-title"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <div className="dialog-topline">
              <span><Terminal size={15} /> sanjay.dev / skills / inventory</span>
              <button className="icon-button" type="button" onClick={onClose} aria-label="Close skills explorer">
                <X size={18} />
              </button>
            </div>
            <div className="dialog-content skills-dialog-content">
              <p className="eyebrow">ENGINEERING TOOLKIT · {skills.length} SKILLS</p>
              <h2 id="skills-dialog-title">Skills explorer</h2>
              <p className="skills-dialog-intro">A résumé-backed inventory of technical tools, delivery practices and core strengths.</p>
              <div className="skills-explorer">
                <nav className="skill-filters" aria-label="Filter skills by category">
                  {groups.map((group) => (
                    <button
                      className={activeGroup === group ? 'skill-filter is-active' : 'skill-filter'}
                      key={group}
                      type="button"
                      aria-pressed={activeGroup === group}
                      onClick={() => setActiveGroup(group)}
                    >
                      <span>{group === 'All' ? '*' : '>'}</span>{group}
                    </button>
                  ))}
                </nav>
                <div className="skills-code-window" aria-live="polite">
                  <div className="skills-filebar"><span><Code2 size={13} /> skills.js</span><span>JavaScript · {skills.length} items</span></div>
                  <div className="skills-code">
                    <div className="skills-code-line">
                      <span className="code-line-number">01</span>
                      <span><span className="code-keyword">const</span> <span className="code-variable">skills</span> = {'{'}</span>
                    </div>
                    {codeGroups.map(({ group, groupSkills, headerLine, skillLines, closingLine }, groupIndex) => (
                        <div className="code-group" key={group}>
                          <div className="skills-code-line">
                            <span className="code-line-number">{String(headerLine).padStart(2, '0')}</span>
                            <span><span className="code-property">{JSON.stringify(group.toLowerCase())}</span>: [</span>
                          </div>
                          {skillLines.map(({ skill, line }, index) => (
                            <div className="skills-code-line code-skill-line" key={skill.name}>
                              <span className="code-line-number">{String(line).padStart(2, '0')}</span>
                              <span><span className="code-string">{JSON.stringify(skill.name)}</span>{index < groupSkills.length - 1 ? ',' : ''}</span>
                            </div>
                          ))}
                          <div className="skills-code-line">
                            <span className="code-line-number">{String(closingLine).padStart(2, '0')}</span><span>]{groupIndex < visibleGroups.length - 1 ? ',' : ''}</span>
                          </div>
                        </div>
                    ))}
                    <div className="skills-code-line"><span className="code-line-number">{String(objectClosingLine).padStart(2, '0')}</span><span>{'}'};</span></div>
                    <div className="skills-status"><span><i /> READY</span><span>{activeGroup === 'All' ? skills.length : skills.filter((skill) => skill.group === activeGroup).length} entries</span></div>
                  </div>
                </div>
              </div>
            </div>
            <button className="button button-secondary dialog-close" type="button" onClick={onClose}>
              Close explorer <ArrowRight size={16} />
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProjectDialog({ project, onClose }) {
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef(null)
  const [visibleLength, setVisibleLength] = useState(0)
  const message = 'Thank you! Opening it for you.'

  useEffect(() => {
    if (!project) return undefined
    if (reduceMotion) return undefined
    const timer = window.setInterval(() => {
      setVisibleLength((length) => {
        if (length >= message.length) {
          window.clearInterval(timer)
          return length
        }
        return length + 1
      })
    }, 28)
    return () => window.clearInterval(timer)
  }, [project, reduceMotion, message.length])

  const typedMessage = reduceMotion ? message : message.slice(0, visibleLength)

  useEffect(() => {
    if (!project) return undefined
    const previousFocus = document.activeElement
    dialogRef.current?.querySelector('button')?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="dialog-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            ref={dialogRef}
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <div className="dialog-topline">
              <span><Terminal size={15} /> sanjay.dev / projects / {project.id}</span>
              <button className="icon-button" type="button" onClick={onClose} aria-label="Close project details">
                <X size={18} />
              </button>
            </div>
            <div className="dialog-content">
              <p className="eyebrow">PROJECT CASE STUDY</p>
              <h2 id="dialog-title">{project.name}</h2>
              <p className="project-type">{project.domain}</p>
              <div className="terminal-response" aria-live="polite">
                <span className="terminal-prompt">$ open --project {project.id}</span>
                <p><span className="terminal-check">✓</span> {project.company} / {project.role}</p>
                <p><span className="terminal-check">✓</span> {typedMessage}<span className="typing-cursor" aria-hidden="true" /></p>
              </div>
              <p className="dialog-overview">{project.description}</p>
              <div className="project-detail-grid">
                <div><span>CONTRIBUTION</span><strong>{project.role}</strong></div>
                <div><span>ORGANIZATION</span><strong>{project.company}</strong></div>
                <div><span>PERIOD</span><strong>{project.period}</strong></div>
                <div><span>DOMAIN / LOCATION</span><strong>{project.domain} · {project.location}</strong></div>
              </div>
              <p className="case-study-note">The résumé does not specify project-level responsibilities or outcomes. Add those details when ready, and they can be included here.</p>
            </div>
            <button className="button button-secondary dialog-close" type="button" onClick={onClose}>
              Back to projects <ArrowRight size={16} />
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProjectCard({ project, index, onOpen, featured = false }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      layout
      className="project-card"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, layout: { duration: reduceMotion ? 0 : 0.24 } }}
    >
      <div className="project-card-top">
        <span>{project.category.toUpperCase()} / {project.domain.toUpperCase()}</span>
        <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <ProjectArtwork project={project} />
      <div className="project-card-body">
        <div className="project-title-line">
          <h3>{project.name}</h3>
          {featured && <span className="featured-mark">FEATURED</span>}
        </div>
        {project.acronym && <p className="project-acronym">{project.acronym}</p>}
        <p className="project-card-description">{project.description}</p>
        <div className="project-stack"><span>{project.company}</span></div>
        <button className="project-link" type="button" onClick={() => onOpen(project)}>
          Open project file <ArrowRight size={15} />
        </button>
      </div>
    </motion.article>
  )
}

const projectCategories = [
  { id: 'All', label: 'All projects' },
  { id: 'Company', label: 'Company projects' },
  { id: 'Personal', label: 'Personal projects' },
  { id: 'Other', label: 'Other projects' },
]

function App() {
  const reduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [themePickerOpen, setThemePickerOpen] = useState(false)
  const [colorMode, setColorMode] = useState(() => window.localStorage.getItem('portfolio-color-mode') === 'light' ? 'light' : 'dark')
  const [accentColor, setAccentColor] = useState(() => {
    const savedAccent = window.localStorage.getItem('portfolio-accent')
    return themeAccents.some(({ id }) => id === savedAccent) ? savedAccent : 'violet'
  })
  const themePickerRef = useRef(null)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [projectsUnlocked, setProjectsUnlocked] = useState(false)
  const [projectCategory, setProjectCategory] = useState('All')
  const [projectSearch, setProjectSearch] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [preparedMessage, setPreparedMessage] = useState('')
  const whatsappUrl = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
    'Hello Sanjay, I visited your portfolio and would like to connect.',
  )}`

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode
    document.documentElement.dataset.accent = accentColor
    window.localStorage.setItem('portfolio-color-mode', colorMode)
    window.localStorage.setItem('portfolio-accent', accentColor)
  }, [colorMode, accentColor])

  useEffect(() => {
    if (!themePickerOpen) return

    function closePickerOnOutsideClick(event) {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target)) {
        setThemePickerOpen(false)
      }
    }

    function closePickerOnEscape(event) {
      if (event.key === 'Escape') {
        setThemePickerOpen(false)
        themePickerRef.current?.querySelector('button')?.focus()
      }
    }

    document.addEventListener('pointerdown', closePickerOnOutsideClick)
    document.addEventListener('keydown', closePickerOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closePickerOnOutsideClick)
      document.removeEventListener('keydown', closePickerOnEscape)
    }
  }, [themePickerOpen])

  useEffect(() => {
    document.body.classList.toggle('dialog-open', Boolean(selectedProject || skillsOpen || challengeOpen))
    return () => document.body.classList.remove('dialog-open')
  }, [selectedProject, skillsOpen, challengeOpen])

  function handleContactSubmit(event) {
    event.preventDefault()
    const text = `Hello Sanjay, I'm ${contactName}.\n\n${contactMessage}`
    setPreparedMessage(text)
    setMessageSent(true)
  }

  const closeProject = useCallback(() => setSelectedProject(null), [])
  const closeSkills = useCallback(() => setSkillsOpen(false), [])
  const closeChallenge = useCallback(() => setChallengeOpen(false), [])
  function unlockProjects() {
    setProjectsUnlocked(true)
    setShowAllProjects(true)
    setChallengeOpen(false)
  }
  const featuredProjects = projects.filter((project) => project.featured)
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = projectCategory === 'All' || project.category === projectCategory
    const query = projectSearch.trim().toLowerCase()
    const matchesSearch = !query || [
      project.name,
      project.acronym,
      project.company,
      project.domain,
      project.location,
    ].filter(Boolean).some((value) => value.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })
  const messageUrl = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(preparedMessage)}`
  const socialLinks = [
    profile.links.linkedin && { label: 'LinkedIn', href: profile.links.linkedin, Icon: Contact },
    { label: 'Naukri', href: profile.links.naukri, Icon: BriefcaseBusiness },
    profile.links.instagram && { label: 'Instagram', href: profile.links.instagram, Icon: Camera },
    profile.links.youtube && { label: 'YouTube', href: profile.links.youtube, Icon: CirclePlay },
    profile.links.github && { label: 'GitHub', href: profile.links.github, Icon: Code2 },
  ].filter(Boolean)

  return (
    <>
      <CodeCursor />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="Sanjay Patel home">
            <span className="brand-mark">SP</span>
            <span>sanjay<span className="brand-dot">.</span>dev</span>
          </a>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open)
              setThemePickerOpen(false)
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => { setMenuOpen(false); setThemePickerOpen(false) }}>{label}</a>
            ))}
            <a className="nav-cta" href="#contact" onClick={() => { setMenuOpen(false); setThemePickerOpen(false) }}>
              Let’s talk <ArrowUpRight size={14} />
            </a>
            <div className="theme-picker" ref={themePickerRef}>
              <button
                className="theme-picker-trigger"
                type="button"
                aria-expanded={themePickerOpen}
                aria-controls="theme-picker-panel"
                onClick={() => setThemePickerOpen((open) => !open)}
              >
                <Palette size={15} />
                <span>Theme</span>
              </button>
              {themePickerOpen && (
                <div className="theme-picker-panel" id="theme-picker-panel" aria-label="Website theme settings">
                  <p className="theme-picker-title">Appearance</p>
                  <div className="theme-mode-options" role="group" aria-label="Color mode">
                    <button
                      className={colorMode === 'dark' ? 'is-active' : ''}
                      type="button"
                      aria-pressed={colorMode === 'dark'}
                      onClick={() => setColorMode('dark')}
                    >
                      <Moon size={14} /> Dark
                    </button>
                    <button
                      className={colorMode === 'light' ? 'is-active' : ''}
                      type="button"
                      aria-pressed={colorMode === 'light'}
                      onClick={() => setColorMode('light')}
                    >
                      <Sun size={14} /> Light
                    </button>
                  </div>
                  <p className="theme-picker-title">Accent color</p>
                  <div className="theme-accent-options" role="group" aria-label="Accent color">
                    {themeAccents.map(({ id, label, color }) => (
                      <button
                        key={id}
                        className={accentColor === id ? 'is-active' : ''}
                        type="button"
                        aria-label={`${label} accent color`}
                        aria-pressed={accentColor === id}
                        title={label}
                        style={{ '--swatch': color }}
                        onClick={() => setAccentColor(id)}
                      >
                        {accentColor === id && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero section-shell" id="home">
          <motion.div
            className="hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55 }}
          >
            <p className="availability"><span className="availability-dot" /> Focused on backend &amp; database engineering</p>
            <p className="eyebrow hero-eyebrow">SOFTWARE ENGINEER <span>·</span> BACKEND SYSTEMS</p>
            <h1>Hi, I’m <span className="gradient-text">Sanjay Patel.</span><br />I build for the <span className="serif-accent">real world.</span></h1>
            <p className="hero-summary">{profile.summary}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <ArrowDownRight size={16} /></a>
              {profile.resumePath ? (
                <a className="button button-quiet" href={profile.resumePath} download>
                  Download résumé <Download size={15} />
                </a>
              ) : (
                <a className="button button-quiet" href="#contact">Résumé available on request <ArrowRight size={15} /></a>
              )}
            </div>
            <div className="hero-meta">
              <span><strong>{profile.experience}</strong> experience</span>
              <span className="meta-divider" />
              <span>Backend <strong>&</strong> databases</span>
              <span className="meta-divider" />
              <span>PHP <strong>·</strong> Laravel</span>
            </div>
          </motion.div>

          <Reveal className="hero-visual">
            <div className="hero-code" aria-hidden="true">
              <div className="hero-code-block">
                <span className="hero-code-line">const engineer = {'{'}</span>
                <span className="hero-code-line">  focus: 'backend',</span>
                <span className="hero-code-line">  stack: ['PHP', 'Laravel']</span>
                <span className="hero-code-line">{'}'};</span>
              </div>
              <div className="hero-code-block hero-code-block-end">
                <span className="hero-code-line">build({'{'} reliable: true {'}'})</span>
                <span className="hero-code-line">// always learning</span>
              </div>
            </div>
            <div className="profile-orbit orbit-one" />
            <div className="profile-orbit orbit-two" />
            <div className="profile-card">
              <div className="profile-card-top"><span>PROFILE / 001</span><span className="live-mark"><i /> PORTFOLIO</span></div>
              <div className="profile-avatar">
                <motion.img
                  src={`${import.meta.env.BASE_URL}sanjay-patel-portrait.png`}
                  alt={`${profile.name}, software engineer`}
                  animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={reduceMotion ? undefined : { duration: 4, ease: 'easeInOut', repeat: Infinity }}
                />
                <div className="avatar-spark">✳</div>
              </div>
              <div className="profile-card-name">{profile.name}</div>
              <div className="profile-card-role">{profile.role}</div>
              <div className="profile-card-rule" />
              <div className="profile-card-foot"><span><Code2 size={14} /> PHP ENGINEER</span><span>DEV / 01</span></div>
            </div>
            <div className="floating-chip chip-code"><Code2 size={15} /><span>Clean code</span></div>
            <div className="floating-chip chip-database"><Database size={15} /><span>Data minded</span></div>
            <div className="hero-visual-caption"><span>01</span> ENGINEERING WITH INTENT</div>
          </Reveal>

          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
        </section>

        <motion.section
          className="section-shell connect-section"
          id="connect"
          aria-labelledby="connect-title"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
        >
          <div className="connect-heading">
            <p className="eyebrow"><span>&gt;_</span> LET'S CONNECT</p>
            <h2 id="connect-title">Find me online<span>.</span></h2>
            <p>Have an idea or opportunity? Let’s start a conversation.</p>
          </div>
          <div className="connect-content">
            <div className="connect-direct">
              <a className="connect-detail" href={`mailto:${profile.email}`}><Mail size={17} /><span><small>EMAIL</small><strong>{profile.email}</strong></span><ArrowUpRight size={14} /></a>
              <a className="connect-detail" href={`tel:${profile.phone}`}><Phone size={17} /><span><small>PHONE</small><strong>{profile.phoneDisplay}</strong></span><ArrowUpRight size={14} /></a>
            </div>
            <div className="connect-socials" aria-label="Social profiles">
              {socialLinks.map(({ label, href, Icon }) => href ? (
                <a className="connect-social" key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon size={16} /><span>{label}</span><ArrowUpRight size={13} />
                </a>
              ) : (
                <a className="connect-social" key={label} href={`mailto:${profile.email}?subject=${encodeURIComponent('Naukri profile request')}`}>
                  <Icon size={16} /><span>{label} <small>request profile</small></span><ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="marquee-band" aria-label="Core technologies">
          <div className="marquee-track">
            {[...skills.slice(0, 7), ...skills.slice(0, 7)].map((skill, index) => (
              <span key={`${skill.name}-${index}`}>{skill.name}<i>✳</i></span>
            ))}
          </div>
        </div>

        <section className="section-shell section-block about-section" id="about">
          <Reveal>
            <SectionHeading number="01" eyebrow="A LITTLE ABOUT ME" title={<>Curious by nature.<br />Engineer by choice.</>} />
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-copy">
              <p className="large-copy">{profile.about}</p>
              <a className="text-link" href="#contact">A bit more about me <ArrowUpRight size={15} /></a>
            </Reveal>
            <Reveal className="about-note" delay={0.1}>
              <span className="note-icon"><Layers3 size={18} /></span>
              <p className="eyebrow">MY APPROACH</p>
              <p>Good software should be useful, dependable and easy to build on. I care about the details behind the interface: clear APIs, thoughtful data models and code that teams can maintain.</p>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-block skills-section" id="skills">
          <Reveal>
            <SectionHeading number="02" eyebrow="TOOLS OF MY TRADE" title="A practical toolkit." description="A snapshot of the technologies I use to build and support applications." />
          </Reveal>
          <div className="skills-grid">
            {skills.filter((skill) => skill.featured).map((skill, index) => (
              <Reveal key={skill.name} delay={index * 0.025}>
                <div className="skill-card">
                  <span className="skill-icon">{skill.group === 'Databases' ? <Database size={17} /> : <Code2 size={17} />}</span>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-group">{skill.group}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <button className="all-skills-button" type="button" onClick={() => setSkillsOpen(true)}>
            <Terminal size={15} /> Browse all {skills.length} skills <ArrowUpRight size={15} />
          </button>
        </section>

        <section className="section-shell section-block experience-section" id="experience">
          <Reveal>
            <SectionHeading number="03" eyebrow="PROFESSIONAL JOURNEY" title="Experience that compounds." description="A career built through collaborative teams and real-world software work." />
          </Reveal>
          <div className="timeline">
            {experience.map((job, index) => (
              <Reveal key={job.company} delay={index * 0.07}>
                <article className="timeline-item">
                  <span className="timeline-marker"><BriefcaseBusiness size={15} /></span>
                  <div className="timeline-content">
                    <p className="timeline-period">{job.period}</p>
                    <h3>{job.role}</h3>
                    <p className="timeline-company">{job.company}</p>
                  </div>
                  <span className="timeline-index">0{index + 1}</span>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="work-highlights">
            <p className="eyebrow">RESPONSIBILITIES &amp; CONTRIBUTIONS</p>
            <div className="work-highlights-grid">
              {workHighlights.map((item, index) => (
                <p className="work-highlight" key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section-shell section-block projects-section" id="projects">
          <Reveal>
            <SectionHeading number="04" eyebrow="PROJECT ARCHIVE" title="A few things I’ve helped build." description="Explore selected work from my professional experience, then open the full project archive to browse by category or search by name, company and domain." />
          </Reveal>
          <div className="projects-grid">
            <AnimatePresence mode="sync">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} featured onOpen={setSelectedProject} />
              ))}
            </AnimatePresence>
          </div>
          <Reveal className="project-archive-toggle">
            <div className="project-count"><span>{projects.length.toString().padStart(2, '0')}</span> résumé-listed projects</div>
            <button
              className="button button-secondary browse-projects-button"
              type="button"
              aria-expanded={showAllProjects}
              aria-controls="all-projects"
              onClick={() => {
                if (showAllProjects || projectsUnlocked) {
                  setShowAllProjects((isOpen) => !isOpen)
                } else {
                  setChallengeOpen(true)
                }
              }}
            >
              <Terminal size={15} /> {showAllProjects ? 'Show featured only' : `Browse all ${projects.length} projects`}
              <ArrowDown size={15} className={showAllProjects ? 'archive-chevron is-open' : 'archive-chevron'} />
            </button>
          </Reveal>

          <AnimatePresence initial={false}>
            {showAllProjects && (
              <motion.div
                id="all-projects"
                className="project-directory"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
              >
                <div className="directory-heading">
                  <div>
                    <p className="eyebrow">SANJAY.DEV / PROJECTS</p>
                    <h3>Project directory<span> ({filteredProjects.length})</span></h3>
                  </div>
                  <label className="project-search">
                    <Terminal size={14} />
                    <input
                      type="search"
                      value={projectSearch}
                      onChange={(event) => setProjectSearch(event.target.value)}
                      placeholder="Search projects..."
                      aria-label="Search projects"
                    />
                  </label>
                </div>
                <div className="project-filters" role="group" aria-label="Filter projects by category">
                  {projectCategories.map(({ id, label }) => {
                    const count = id === 'All' ? projects.length : projects.filter((project) => project.category === id).length
                    return (
                      <button
                        key={id}
                        className={projectCategory === id ? 'project-filter is-active' : 'project-filter'}
                        type="button"
                        aria-pressed={projectCategory === id}
                        onClick={() => setProjectCategory(id)}
                      >
                        {label}<span>{String(count).padStart(2, '0')}</span>
                      </button>
                    )
                  })}
                </div>
                {filteredProjects.length > 0 ? (
                  <div className="projects-grid directory-grid">
                    <AnimatePresence mode="sync">
                      {filteredProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={projects.indexOf(project)}
                          onOpen={setSelectedProject}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="project-empty-state">
                    <span className="empty-terminal"><Terminal size={17} /></span>
                    <div>
                      <p className="eyebrow">$ find ./projects -type {projectCategory.toLowerCase()}</p>
                      <h4>{projectSearch ? 'No matching projects found.' : `No ${projectCategory.toLowerCase()} projects added yet.`}</h4>
                      <p>{projectSearch ? 'Try another search term or category.' : 'This category is ready for your personal or other project details when you want to add them.'}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="project-footnote"><span><Check size={14} /></span> Descriptions are based on résumé details. Personal and other projects can be added when you share them.</div>
        </section>

        <section className="section-shell section-block credentials-section">
          <div className="credentials-grid">
            <Reveal>
              <SectionHeading number="05" eyebrow="EDUCATION" title="Learning is ongoing." />
              <div className="education-list">
                {education.map((item) => (
                  <article className="education-item" key={item.short}>
                    <span className="education-icon"><Code2 size={17} /></span>
                    <div>
                      <h3>{item.degree}</h3>
                      <p>{item.institution}</p>
                      <p>{[item.period, item.result].filter(Boolean).join(' · ')}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading number="06" eyebrow="LANGUAGES & CERTIFICATES" title="Beyond the code." />
              <div className="language-list">
                {languages.map((item) => (
                  <div className="language-item" key={item.name}>
                    <span>{item.name}</span><span>{item.proficiency}</span>
                  </div>
                ))}
              </div>
              <div className="achievement-list">
                <p className="eyebrow">CERTIFICATIONS</p>
                {achievements.map((item) => (
                  <article className="achievement-item" key={item.title}>
                    <span className="achievement-check"><Check size={13} /></span>
                    <div><h3>{item.title}</h3><p>{[item.issuer, item.year].filter(Boolean).join(' · ')}</p></div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-block writing-section" id="writing">
          <Reveal>
            <SectionHeading number="07" eyebrow="NOTES FROM THE BUILD" title="Ideas worth sharing." description="A future home for practical lessons from engineering work." />
          </Reveal>
          <div className="writing-grid">
            {blogTopics.map((topic, index) => (
              <Reveal key={topic} delay={index * 0.06}>
                <article className="writing-card">
                  <span className="writing-number">0{index + 1} / DRAFT TOPIC</span>
                  <h3>{topic}</h3>
                  <span className="writing-status">Coming soon <ArrowUpRight size={14} /></span>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-shell contact-section" id="contact">
          <Reveal className="contact-panel">
            <div className="contact-copy">
              <p className="eyebrow"><span>08</span> / CONTACT</p>
              <h2>Have a good problem?<br /><span>Let’s solve it.</span></h2>
              <p className="contact-intro">I’m always happy to talk about software, collaboration and ideas worth building.</p>
              <div className="contact-links">
                <a className="contact-link whatsapp-link" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} /> Message me on WhatsApp <ArrowUpRight size={15} />
                </a>
                <a className="contact-link" href={`mailto:${profile.email}`}><Mail size={17} /> {profile.email}</a>
                <a className="contact-link" href={`tel:${profile.phone}`}><Phone size={17} /> {profile.phoneDisplay}</a>
                <a className="contact-link" href="#connect">Social profiles <ArrowUpRight size={15} /></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <p className="eyebrow">START A CONVERSATION</p>
              <label htmlFor="contact-name">Your name</label>
              <input id="contact-name" autoComplete="name" value={contactName} onChange={(event) => { setMessageSent(false); setContactName(event.target.value) }} placeholder="How should I address you?" required />
              <label htmlFor="contact-message">A little about what’s on your mind</label>
              <textarea id="contact-message" value={messageSent ? '' : contactMessage} onChange={(event) => { setMessageSent(false); setContactMessage(event.target.value) }} placeholder="Tell me about your idea, project or question..." rows="3" required />
              {messageSent ? (
                <a className="button button-primary send-button" href={messageUrl} target="_blank" rel="noreferrer">
                  Continue in WhatsApp <ArrowUpRight size={15} />
                </a>
              ) : (
                <button className="button button-primary send-button" type="submit">Prepare WhatsApp message <Send size={15} /></button>
              )}
              <p className="form-note">Your message opens in WhatsApp. Nothing is stored on this website.</p>
            </form>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer section-shell" id="page-bottom">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">SP</span><span>sanjay<span className="brand-dot">.</span>dev</span></a>
        <p>Designed with intent. Built with care.</p>
        <a className="back-top" href="#home">Back to top <ArrowUpRight size={14} /></a>
        <span className="footer-year">© {currentYear} Sanjay Patel</span>
      </footer>

      <PageJump />

      <SkillsDialog open={skillsOpen} onClose={closeSkills} />
      <ProjectDialog key={selectedProject?.id ?? 'closed'} project={selectedProject} onClose={closeProject} />
      <AnimatePresence>
        {challengeOpen && <ProjectChallenge onClose={closeChallenge} onUnlock={unlockProjects} />}
      </AnimatePresence>
    </>
  )
}

export default App
