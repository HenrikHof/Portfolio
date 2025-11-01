"use client"

import React, { useRef, useState } from "react"
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { playHoverSound, playButtonClickSound } from "@/lib/sounds"

interface FloatingDockItem {
  title: string
  icon: React.ReactNode
  href: string
  onClick?: () => void
}

interface FloatingDockProps {
  items: FloatingDockItem[]
  desktopClassName?: string
  mobileClassName?: string
}

function IconContainer({
  mouseX,
  title,
  icon,
  onHover,
}: {
  mouseX: MotionValue<number>
  title: string
  icon: React.ReactNode
  onHover?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseEnter={onHover}
      className="relative flex aspect-square w-10 items-center justify-center rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/50 shadow-sm backdrop-blur-sm"
    >
      <motion.div
        style={{
          scale: useTransform(distance, [-150, 0, 150], [1, 1.5, 1]),
        }}
        className="relative z-10 h-[60%] w-[60%] flex items-center justify-center"
      >
        {icon}
      </motion.div>
      <motion.span
        style={{
          opacity: useTransform(distance, [-150, 0, 150], [0, 1, 0]),
        }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground shadow-sm"
      >
        {title}
      </motion.span>
    </motion.div>
  )
}

export function FloatingDock({
  items,
  desktopClassName,
  mobileClassName,
}: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity)
  const [lastHoveredIndex, setLastHoveredIndex] = useState<number | null>(null)

  const handleIconHover = (index: number) => {
    if (index !== lastHoveredIndex) {
      setLastHoveredIndex(index)
      playHoverSound()
    }
  }

  return (
    <>
      {/* Desktop Dock */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => {
          mouseX.set(Infinity)
          setLastHoveredIndex(null)
        }}
        className={cn(
          "fixed bottom-8 left-1/2 z-50 hidden md:flex -translate-x-1/2 items-end gap-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-border p-2 shadow-lg",
          desktopClassName,
        )}
      >
        {items.map((item, index) => (
          <div key={`${item.href}-${index}`} className="flex flex-col items-center gap-1">
            {item.onClick ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  playButtonClickSound()
                  item.onClick?.()
                }}
                className="flex h-full w-full items-center justify-center"
                data-dock-item
                data-index={index}
              >
                <IconContainer 
                  mouseX={mouseX} 
                  title={item.title} 
                  icon={item.icon}
                  onHover={() => handleIconHover(index)}
                />
              </button>
            ) : item.href.startsWith("http") ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playButtonClickSound()}
                className="flex h-full w-full items-center justify-center"
                data-dock-item
                data-index={index}
              >
                <IconContainer 
                  mouseX={mouseX} 
                  title={item.title} 
                  icon={item.icon}
                  onHover={() => handleIconHover(index)}
                />
              </a>
            ) : (
              <Link 
                href={item.href} 
                onClick={() => playButtonClickSound()}
                className="flex h-full w-full items-center justify-center"
                data-dock-item
                data-index={index}
              >
                <IconContainer 
                  mouseX={mouseX} 
                  title={item.title} 
                  icon={item.icon}
                  onHover={() => handleIconHover(index)}
                />
              </Link>
            )}
          </div>
        ))}
      </motion.div>

      {/* Mobile Dock */}
      <motion.div
        className={cn(
          "fixed bottom-8 left-1/2 z-50 flex md:hidden -translate-x-1/2 items-end gap-2 rounded-2xl bg-background/80 backdrop-blur-xl border border-border p-2 shadow-lg",
          mobileClassName,
        )}
      >
        {items.slice(0, 5).map((item, index) => (
          <div key={`${item.href}-${index}`} className="flex flex-col items-center">
            {item.onClick ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  playButtonClickSound()
                  item.onClick?.()
                }}
                onMouseEnter={() => playHoverSound()}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/50 shadow-sm transition-all hover:scale-105"
              >
                <div className="h-[60%] w-[60%] text-muted-foreground flex items-center justify-center">{item.icon}</div>
              </button>
            ) : item.href.startsWith("http") ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playButtonClickSound()}
                onMouseEnter={() => playHoverSound()}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/50 shadow-sm transition-all hover:scale-105"
              >
                <div className="h-[60%] w-[60%] text-muted-foreground flex items-center justify-center">{item.icon}</div>
              </a>
            ) : (
              <Link
                href={item.href}
                onClick={() => playButtonClickSound()}
                onMouseEnter={() => playHoverSound()}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/50 shadow-sm transition-all hover:scale-105"
              >
                <div className="h-[60%] w-[60%] text-muted-foreground flex items-center justify-center">{item.icon}</div>
              </Link>
            )}
          </div>
        ))}
      </motion.div>
    </>
  )
}

