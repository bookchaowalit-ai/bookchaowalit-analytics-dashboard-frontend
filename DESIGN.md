# Design direction — Signal Ledger

## World

A night-shift operations console assembled from ledger paper, amber instrument
light, and hard registration rules. The dashboard is a place to inspect a
signal, not a wall of decorative KPIs.

## First viewport

The first viewport leads with the operating question and immediately exposes
the connection state. A single telemetry window carries a labeled illustrative
trace while the adjacent ledger records that no real source is attached.

## Palette and material

- Ink navy `#101925` is the console ground.
- Calico `#e8e3d6` carries readable copy and the paper ledger.
- Safety orange `#f4a261` marks the active trace and attention.
- Faded blue `#75869a` is reserved for inactive grid and context.

## Type

`Space Grotesk` gives the operator headings a compact, technical voice.
`DM Mono` carries timestamps, ranges, and connection labels. Metrics use
tabular numerals and never imply live values when the source is absent.

## Interaction and states

The range control switches between three clearly labeled illustrative windows.
The disconnected state is persistent and prominent. Focus states use orange,
and motion is limited to a short trace reveal that disappears for reduced-motion
users.

## Responsive rules

The desktop console is a chart plus a narrow ledger rail. On mobile the ledger
comes first, then the chart becomes a wide scroll-free panel with a minimum
readable height.
