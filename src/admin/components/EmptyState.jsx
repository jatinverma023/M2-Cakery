export default function EmptyState({
  icon = '📦',
  title = 'No products found',
  description = 'Try adjusting your search or category filters.',
  actionText,
  onAction,
}) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="admin-empty-title">{title}</h3>
      {description && <p className="admin-empty-desc">{description}</p>}
      {actionText && onAction && (
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-empty-btn"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
