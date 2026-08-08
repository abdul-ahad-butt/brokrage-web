interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-content-muted">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-content-primary">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-content-secondary">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
