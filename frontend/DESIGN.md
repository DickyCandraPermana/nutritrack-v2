---
version: alpha
name: Clinical Precision
description: High-performance clinical nutrition tracking and medical-grade dietary command console.
colors:
  primary: "#10b981"
  primary-container: "#00422b"
  inverse-primary: "#4edea3"
  secondary: "#34d399"
  tertiary: "#f43f5e"
  neutral: "#0c131f"
  surface: "#111c2d"
  surface-card: "#162238"
  surface-border: "#23334d"
  text-primary: "#f8fafc"
  text-muted: "#94a3b8"
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  display-metric:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#002113"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.inverse-primary}"
  card-bento:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 20px
---

## Overview

Clinical Precision is an Operate & Command console for nutrition telemetry, macro tracking, and OCR food intake analysis. It replaces marketing fluff and unearned aesthetic slop (floating blur orbs, oversized decorative heroes, generic stock testimonials) with high-density, tactile, and verifiable data visualization.

## Colors

- **Primary (#10B981 / Emerald):** Signals optimal metabolic balance, active logging, and completed caloric targets.
- **Secondary (#34D399 / Mint):** Micro-nutrients, vitamins, and secondary nutritional metrics.
- **Tertiary (#F43F5E / Crimson Rose):** Metabolic alerts, sodium or sugar limits, and caloric deficit/surplus warnings.
- **Surface (#111C2D & #162238):** Deep clinical navy slate providing high contrast for continuous daily monitoring without visual fatigue.
- **Border (#23334D):** Hairline precision grid separation.

## Typography

- **Plus Jakarta Sans:** Expressive, clean geometric sans-serif for command headings and metric cards.
- **Inter:** Technical workhorse with Tabular Numbers (`tnum`) applied across all calories, grams, percentages, and timestamps.

## Layout

- **12-Column Responsive Bento Grid:** Structured modules for quick scanning.
- **Action-First Hierarchy:** Search foods (`/`), scan label, or log meal reachable in <1 click.
- **No Decorative Slop:** Every pixel represents actual state or direct user capability.

## Elevation & Depth

- Hairline 1px borders (`#23334d`) with subtle ambient elevation.
- Active card hover shifts border highlight to Emerald (`#10b981/40`).
