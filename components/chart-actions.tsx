"use client"

import { useState } from "react"
import { FileCode, ImageDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
)

function copyComputedStyles(src: Element, dst: Element): void {
  const cs = window.getComputedStyle(src)
  const dstEl = dst as SVGElement
  if (dstEl.style) {
    for (const p of ["fill", "stroke", "stroke-width", "stroke-dasharray", "font-size", "font-family", "font-weight"]) {
      const v = cs.getPropertyValue(p)
      if (v) dstEl.style.setProperty(p, v)
    }
  }
  for (let i = 0; i < src.children.length; i++) {
    if (dst.children[i]) copyComputedStyles(src.children[i], dst.children[i])
  }
}

// SVG rendered via <img> runs in an isolated context with no access to page fonts,
// so text falls back to the browser default unless @font-face is embedded in the SVG itself.
let fontCssPromise: Promise<string> | null = null
async function getInlinedFontCSS(): Promise<string> {
  if (fontCssPromise) return fontCssPromise
  fontCssPromise = (async () => {
    const url = "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
    const css = await fetch(url).then((r) => r.text())
    const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1])
    const dataUrls = new Map<string, string>()
    await Promise.all(
      urls.map(async (u) => {
        const buf = await fetch(u).then((r) => r.blob())
        const dataUrl = await new Promise<string>((resolve) => {
          const fr = new FileReader()
          fr.onload = () => resolve(fr.result as string)
          fr.readAsDataURL(buf)
        })
        dataUrls.set(u, dataUrl)
      }),
    )
    return css.replace(/url\((https:\/\/[^)]+\.woff2)\)/g, (_, u) => `url(${dataUrls.get(u)})`)
  })().catch(() => "")
  return fontCssPromise
}

async function svgToImg(svg: SVGSVGElement, cr: DOMRect): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute("width", String(cr.width))
  clone.setAttribute("height", String(cr.height))
  copyComputedStyles(svg, clone)
  const fontCss = await getInlinedFontCSS()
  if (fontCss) {
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
    style.textContent = fontCss
    clone.insertBefore(style, clone.firstChild)
  }
  const xml = new XMLSerializer().serializeToString(clone)
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }))
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = reject
    img.src = url
  })
}

async function captureCard(bg: string): Promise<HTMLCanvasElement> {
  const el = document.getElementById("chart-card")
  if (!el) throw new Error("chart-card not found")
  const rect = el.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const out = document.createElement("canvas")
  out.width = Math.round(rect.width * dpr)
  out.height = Math.round(rect.height * dpr)
  const ctx = out.getContext("2d")!
  ctx.scale(dpr, dpr)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, rect.width, rect.height)
  for (const child of el.querySelectorAll<Element>("svg, canvas")) {
    const cr = child.getBoundingClientRect()
    const x = cr.left - rect.left
    const y = cr.top - rect.top
    if (child instanceof HTMLCanvasElement) {
      ctx.drawImage(child, x, y, cr.width, cr.height)
    } else if (child instanceof SVGSVGElement) {
      try {
        const img = await svgToImg(child, cr)
        ctx.drawImage(img, x, y, cr.width, cr.height)
      } catch {}
    }
  }
  return out
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  owner: string
  repo: string
  repoUrl: string
  stars: number
}

export function ChartActions({ owner, repo, repoUrl, stars }: Props) {
  const [busy, setBusy] = useState<string | null>(null)

  async function save(fmt: "png" | "jpeg" | "svg") {
    setBusy(fmt)
    try {
      const isDark = document.documentElement.classList.contains("dark")
      const canvas = await captureCard(isDark ? "#0a0a0a" : "#ffffff")
      const slug = `${owner}-${repo}-stars`
      if (fmt === "png") {
        canvas.toBlob((b) => b && triggerDownload(URL.createObjectURL(b), `${slug}.png`), "image/png")
      } else if (fmt === "jpeg") {
        canvas.toBlob((b) => b && triggerDownload(URL.createObjectURL(b), `${slug}.jpg`), "image/jpeg", 0.92)
      } else {
        // ponytail: SVG wraps bitmap since the dither fill is canvas-based; true vector needs SVG-only chart
        const dataUrl = canvas.toDataURL("image/png")
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`
        triggerDownload(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), `${slug}.svg`)
      }
    } finally {
      setBusy(null)
    }
  }

  const text = encodeURIComponent(`${owner}/${repo} has ${stars.toLocaleString()} ⭐ — track its star growth on Star Trail`)
  const url = encodeURIComponent(repoUrl)

  const socials = [
    { label: "Share on X", icon: <XIcon />, href: `https://x.com/intent/tweet?text=${text}&url=${url}` },
    { label: "Share on LinkedIn", icon: <LinkedInIcon />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: "Share on Instagram", icon: <InstagramIcon />, href: "https://www.instagram.com/" },
    { label: "Share on Reddit", icon: <RedditIcon />, href: `https://www.reddit.com/submit?url=${url}&title=${text}` },
  ]

  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {(["png", "jpeg", "svg"] as const).map((fmt) => (
          <Button key={fmt} variant="outline" size="sm" disabled={busy !== null} onClick={() => save(fmt)}>
            {fmt === "svg" ? <FileCode className="size-3.5" /> : <ImageDown className="size-3.5" />}
            {busy === fmt ? "Saving…" : `Save as ${fmt.toUpperCase()}`}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        {socials.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  )
}
