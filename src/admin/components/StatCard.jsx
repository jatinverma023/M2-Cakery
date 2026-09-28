export default function StatCard({
  label,
  value,
  icon,
  subtext,
  variant = 'default',
}) {
  return (
    <div className={`admin-stat-card admin-stat-${variant}`}>
      <div className="admin-stat-top">
        <span className="admin-stat-label">{label}</span>
        {icon && (
          <span className="admin-stat-icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="admin-stat-value">{value}</div>
      {subtext && <div className="admin-stat-subtext">{subtext}</div>}
    </div>
  );
}
