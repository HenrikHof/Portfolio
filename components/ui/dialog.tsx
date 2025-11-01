'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon, GripVertical } from 'lucide-react'
import { motion, useDragControls } from 'framer-motion'

import { cn } from '@/lib/utils'

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const dragControls = useDragControls()
  const constraintsRef = React.useRef<HTMLDivElement>(null)

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none" />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        asChild
        {...props}
      >
        <motion.div
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={constraintsRef}
          initial={{ 
            opacity: 0, 
            scale: 0.95,
            x: '-50%',
            y: '-50%',
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: '-50%',
            y: '-50%',
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            x: '-50%',
            y: '-50%',
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
          }}
          className={cn(
            'bg-background z-50 w-full sm:max-w-[calc(100%-2rem)] rounded-xl border border-border/50 shadow-2xl backdrop-blur-sm cursor-grab active:cursor-grabbing',
            className,
          )}
          dragListener={false}
          onPointerDown={(e) => {
            // Only start drag if clicking on the dialog itself, not on interactive elements
            const target = e.target as HTMLElement
            if (target.closest('a, button, input, textarea')) {
              return
            }
            dragControls.start(e)
          }}
        >
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {children}
          </div>
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-50 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none p-1.5 hover:bg-muted/50"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
