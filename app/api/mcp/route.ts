import { WINDOWS, parseEventsCsv, summarizeWindow } from "@/lib/analytics";
import type { WindowKey } from "@/lib/analytics";
import { ToolInputError, optionalString, requireString, respondToMcpRequest } from "@/lib/mcp";
import type { McpTool } from "@/lib/mcp";

const SERVER = { name: "bookchaowalit-analytics-dashboard", version: "0.2.0" };
const WINDOW_KEYS = Object.keys(WINDOWS);
const MAX_CSV_CHARS = 2_000_000;

const TOOLS: McpTool[] = [
  {
    name: "summarize_events_csv",
    description:
      "Summarise an events CSV (header: timestamp, optional segment and value) for a 24H, 7D or 30D window ending at the newest event. Stateless: the CSV is not stored.",
    inputSchema: {
      type: "object",
      properties: {
        csv: { type: "string", description: "CSV text, max 2,000,000 characters" },
        window: { type: "string", enum: WINDOW_KEYS },
      },
      required: ["csv"],
    },
    handler: (args) => {
      const csv = requireString(args, "csv");
      if (csv.length > MAX_CSV_CHARS) throw new ToolInputError("CSV is too large for this tool.");
      const window = optionalString(args, "window") ?? "7D";
      if (!WINDOW_KEYS.includes(window)) throw new ToolInputError(`Unknown window "${window}".`);
      const { events, errors } = parseEventsCsv(csv);
      const summary = summarizeWindow(events, window as WindowKey);
      return {
        window,
        rowsRead: events.length,
        parseErrors: errors,
        ...summary,
        lastObservation: summary.lastObservation === null ? null : new Date(summary.lastObservation).toISOString(),
      };
    },
  },
];

export async function POST(request: Request) {
  return respondToMcpRequest(request, SERVER, TOOLS);
}
