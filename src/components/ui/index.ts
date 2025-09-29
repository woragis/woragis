// Layout components
export * from "./layout";

// Admin components
export * from "./admin";

// Feedback components
export * from "./feedback";

// Data display components
export * from "./data-display";

// Navigation components
export * from "./navigation";

// Form components
export * from "./forms";

// Other components
export { ActionButton } from "./ActionButton";
export { ClientOnly } from "../ClientOnly";
export * from "./ValorantBackground";
export { ValorantBackground as GamingBackground } from "./ValorantBackground";
export * from "./AbstractIcons";

// Backward compatibility - direct exports for old import paths
// Layout components
export { Button } from "./layout/Button";
export { Card } from "./layout/Card";
export { Container } from "./layout/Container";
export { Section } from "./layout/Section";

// Admin components
export { AdminGrid } from "./admin/AdminGrid";
export { AdminList } from "./admin/AdminList";
export type { AdminGridItem } from "./admin/AdminGrid";
export type { AdminListItem } from "./admin/AdminList";

// Feedback components
export { Modal } from "./feedback/Modal";
export { EmptyState } from "./feedback/EmptyState";
export { StatusBadge } from "./feedback/StatusBadge";

// Data display components
export { DataTable, DataTableRow, DataTableCell } from "./data-display/DataTable";
export { SearchBar } from "./data-display/SearchBar";
export { FilterTabs } from "./data-display/FilterTabs";

// Navigation components
export { Breadcrumb } from "./navigation/Breadcrumb";
export { PageHeader } from "./navigation/PageHeader";
export { ThemeToggle } from "./navigation/ThemeToggle";
export { LanguageSwitcher } from "./navigation/LanguageSwitcher";
export { DisplayToggle } from "./navigation/DisplayToggle";

// Form components
export { FileUpload } from "./forms/FileUpload";
export { MarkdownEditor } from "./forms/MarkdownEditor";
export { Input } from "./forms/input";
export { Label } from "./forms/label";
export { Select } from "./forms/select";
export { Textarea } from "./forms/textarea";
export { Switch } from "./forms/switch";
export { Badge } from "./forms/badge";
