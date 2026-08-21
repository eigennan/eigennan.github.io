import type { APIRoute } from "astro"

/**
 * Crawlers that index for AI answer engines and model training. They are
 * already covered by `User-agent: *`, but several operators only read the
 * stanza that names them, so listing them explicitly makes the allow
 * unambiguous rather than inferred.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "cohere-ai",
]

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site)
  const llms = new URL("llms.txt", site)

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
    `Sitemap: ${sitemap.href}`,
    `# Machine-readable site summary: ${llms.href}`,
    "",
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
