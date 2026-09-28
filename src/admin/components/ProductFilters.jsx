export default function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedFeatured,
  onFeaturedChange,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="admin-filters-card">
      <div className="admin-filters-search-wrap">
        <span className="admin-search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by cake title, category, or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search products"
        />
        {searchTerm && (
          <button
            type="button"
            className="admin-search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
          >
            ×
          </button>
        )}
      </div>

      <div className="admin-filters-row">
        {/* Category Filter */}
        <div className="admin-filter-group">
          <label htmlFor="filter-cat" className="admin-filter-label">
            Category
          </label>
          <select
            id="filter-cat"
            className="admin-filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="birthday">Birthday Cakes</option>
            <option value="wedding">Wedding Cakes</option>
            <option value="anniversary">Anniversary Cakes</option>
            <option value="celebration">Celebration Cakes</option>
            <option value="custom">Custom & Theme</option>
            <option value="desserts">Desserts & Treats</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="admin-filter-group">
          <label htmlFor="filter-status" className="admin-filter-label">
            Status
          </label>
          <select
            id="filter-status"
            className="admin-filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div className="admin-filter-group">
          <label htmlFor="filter-feat" className="admin-filter-label">
            Showcase
          </label>
          <select
            id="filter-feat"
            className="admin-filter-select"
            value={selectedFeatured}
            onChange={(e) => onFeaturedChange(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="featured">Featured Only</option>
            <option value="not_featured">Standard Only</option>
          </select>
        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-clear-filters-btn"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
