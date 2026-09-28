import { SITE_CONFIG, getWhatsAppUrl } from '../config/site'

export default function AnnouncementBar() {
  const { announcement } = SITE_CONFIG

  if (!announcement || !announcement.enabled) return null

  return (
    <aside className="announcement-bar" aria-label="Announcement">
      <div className="container announcement-container">
        <span className="announcement-text">{announcement.text}</span>
        <a
          className="announcement-link"
          href={getWhatsAppUrl('Hi M² Cakery! I would like to check availability for an upcoming order.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {announcement.linkText}
        </a>
      </div>
    </aside>
  )
}
