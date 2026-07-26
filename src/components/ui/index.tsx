import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({ children, className = "", elevated = false }: CardProps) {
  return (
    <div className={`${elevated ? "card-elevated" : "card"} ${className}`.trim()}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const baseClass = "badge";
  const variantClass = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  }[variant];

  return (
    <span className={`${baseClass} ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    success: "btn-success",
  }[variant];

  return (
    <button type={type} className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
