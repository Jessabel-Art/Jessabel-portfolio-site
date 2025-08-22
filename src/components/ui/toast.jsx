import { cn } from '@/lib/utils';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import React from 'react';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // mobile: full-width at top; ≥sm: bottom-right stack
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  // base container + motion
  'group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl p-5 pr-9 shadow-lg ' +
    'border transition-all data-[swipe=move]:transition-none ' +
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] ' +
    'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] ' +
    'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
    'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 ' +
    'data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full ' +
    'data-[state=closed]:slide-out-to-right-full',
  {
    variants: {
      variant: {
        // Use glass surface + token colors
        default: 'glass border-white/10 text-[hsl(var(--foreground))]',
        destructive:
          'group destructive border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // outline yellow that fills on hover
      'inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-sm font-semibold ' +
        'border border-[hsl(var(--accent))] text-[hsl(var(--accent))] ' +
        'bg-transparent transition-colors hover:bg-[hsl(var(--accent))] hover:text-[#0B0F1A] ' +
        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] ' +
        'disabled:pointer-events-none disabled:opacity-50 ' +
        'group-[.destructive]:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-[hsl(var(--muted-foreground))] opacity-0 transition-opacity ' +
        'hover:text-[hsl(var(--foreground))] focus:opacity-100 focus:outline-none ' +
        'focus:ring-2 focus:ring-[hsl(var(--accent))] group-hover:opacity-100 ' +
        'group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm text-[hsl(var(--muted-foreground))]', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};