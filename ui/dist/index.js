import { jsxs as r, jsx as e, Fragment as C } from "/node_modules/react/jsx-runtime";
import { useState as u, useEffect as P } from "/node_modules/react";
function S({ onSelect: c, isLoading: s, error: i }) {
  const [n, t] = u("");
  return /* @__PURE__ */ r("div", { className: "space-y-6", children: [
    /* @__PURE__ */ r("div", { children: [
      /* @__PURE__ */ e("h2", { className: "text-2xl font-bold mb-2", children: "Select Character Card" }),
      /* @__PURE__ */ e("p", { className: "text-text-secondary", children: "Choose a PNG character card file. Character cards contain embedded metadata that defines the character's personality, backstory, and behavior." })
    ] }),
    /* @__PURE__ */ r("div", { className: "space-y-2", children: [
      /* @__PURE__ */ r("label", { className: "block text-sm font-medium", children: [
        "Character Card File",
        /* @__PURE__ */ e("span", { className: "text-status-error ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ r("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "text",
            value: n,
            onChange: (m) => t(m.target.value),
            placeholder: "/path/to/character-card.png",
            className: "flex-1 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            onClick: async () => {
              try {
                const m = await window.electron.openFile({
                  title: "Select Character Card",
                  filters: [
                    { name: "Character Cards", extensions: ["png"] },
                    { name: "All Files", extensions: ["*"] }
                  ]
                });
                !m.canceled && m.filePaths.length > 0 && t(m.filePaths[0]);
              } catch (m) {
                console.error("Failed to open file dialog:", m);
              }
            },
            className: "px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors",
            children: "Browse"
          }
        )
      ] }),
      /* @__PURE__ */ e("p", { className: "text-xs text-text-tertiary", children: "Supports Character Card V2 format (used by SillyTavern, TavernAI, etc.)" })
    ] }),
    i && /* @__PURE__ */ e("div", { className: "p-4 bg-status-error/10 border border-status-error rounded-md", children: /* @__PURE__ */ e("p", { className: "text-status-error text-sm", children: i }) }),
    /* @__PURE__ */ r("div", { className: "p-4 bg-bg-tertiary rounded-md border border-border-secondary", children: [
      /* @__PURE__ */ r("h3", { className: "font-semibold mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ e("span", { children: "ℹ️" }),
        "What are Character Cards?"
      ] }),
      /* @__PURE__ */ r("div", { className: "text-sm text-text-secondary space-y-2", children: [
        /* @__PURE__ */ e("p", { children: "Character cards are PNG images with embedded JSON metadata that describe an AI character's personality, appearance, and behavior." }),
        /* @__PURE__ */ e("p", { children: "Popular sources include:" }),
        /* @__PURE__ */ r("ul", { className: "list-disc list-inside ml-2 space-y-1", children: [
          /* @__PURE__ */ e("li", { children: "Chub.ai - Large character database" }),
          /* @__PURE__ */ e("li", { children: "Character Hub - Community characters" }),
          /* @__PURE__ */ e("li", { children: "SillyTavern exports" }),
          /* @__PURE__ */ e("li", { children: "TavernAI exports" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "flex justify-end pt-4 border-t border-border-primary", children: /* @__PURE__ */ e(
      "button",
      {
        onClick: () => {
          n && c(n);
        },
        disabled: !n || s,
        className: "px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
        children: s ? /* @__PURE__ */ r(C, { children: [
          /* @__PURE__ */ e("span", { className: "animate-spin", children: "⏳" }),
          "Reading Card..."
        ] }) : "Continue"
      }
    ) })
  ] });
}
function I({ card: c, filePath: s, onContinue: i, onBack: n }) {
  const t = c.data || c, l = `file://${s}`;
  return /* @__PURE__ */ r("div", { className: "space-y-6", children: [
    /* @__PURE__ */ r("div", { children: [
      /* @__PURE__ */ e("h2", { className: "text-2xl font-bold mb-2", children: "Character Preview" }),
      /* @__PURE__ */ e("p", { className: "text-text-secondary", children: "Review the character information before importing." })
    ] }),
    /* @__PURE__ */ r("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ e("div", { className: "flex-shrink-0", children: /* @__PURE__ */ e("div", { className: "w-32 h-32 rounded-lg overflow-hidden bg-bg-tertiary border border-border-primary", children: /* @__PURE__ */ e(
        "img",
        {
          src: l,
          alt: t.name,
          className: "w-full h-full object-cover",
          onError: (d) => {
            d.target.style.display = "none";
          }
        }
      ) }) }),
      /* @__PURE__ */ r("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ e("h3", { className: "text-xl font-bold", children: t.name }),
        t.creator && /* @__PURE__ */ r("p", { className: "text-sm text-text-secondary", children: [
          "by ",
          t.creator,
          t.character_version && ` • v${t.character_version}`
        ] }),
        t.personality && /* @__PURE__ */ r("p", { className: "text-sm", children: [
          /* @__PURE__ */ e("span", { className: "font-medium", children: "Personality:" }),
          " ",
          t.personality
        ] }),
        t.tags && t.tags.length > 0 && /* @__PURE__ */ e("div", { className: "flex flex-wrap gap-1 mt-2", children: t.tags.map((d, m) => /* @__PURE__ */ e(
          "span",
          {
            className: "px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs rounded",
            children: d
          },
          m
        )) })
      ] })
    ] }),
    t.description && /* @__PURE__ */ r("div", { className: "space-y-2", children: [
      /* @__PURE__ */ e("h4", { className: "font-semibold text-sm text-text-secondary uppercase tracking-wide", children: "Description" }),
      /* @__PURE__ */ e("div", { className: "p-4 bg-bg-tertiary rounded-md border border-border-secondary max-h-48 overflow-y-auto", children: /* @__PURE__ */ e("p", { className: "text-sm whitespace-pre-wrap", children: t.description }) })
    ] }),
    t.scenario && /* @__PURE__ */ r("div", { className: "space-y-2", children: [
      /* @__PURE__ */ e("h4", { className: "font-semibold text-sm text-text-secondary uppercase tracking-wide", children: "Scenario" }),
      /* @__PURE__ */ e("div", { className: "p-4 bg-bg-tertiary rounded-md border border-border-secondary max-h-32 overflow-y-auto", children: /* @__PURE__ */ e("p", { className: "text-sm whitespace-pre-wrap", children: t.scenario }) })
    ] }),
    t.first_mes && /* @__PURE__ */ r("div", { className: "space-y-2", children: [
      /* @__PURE__ */ e("h4", { className: "font-semibold text-sm text-text-secondary uppercase tracking-wide", children: "Opening Message" }),
      /* @__PURE__ */ e("div", { className: "p-4 bg-bg-tertiary rounded-md border border-border-secondary max-h-48 overflow-y-auto", children: /* @__PURE__ */ e("p", { className: "text-sm whitespace-pre-wrap italic", children: t.first_mes }) })
    ] }),
    t.creator_notes && /* @__PURE__ */ r("div", { className: "space-y-2", children: [
      /* @__PURE__ */ e("h4", { className: "font-semibold text-sm text-text-secondary uppercase tracking-wide", children: "Creator Notes" }),
      /* @__PURE__ */ e("div", { className: "p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-md", children: /* @__PURE__ */ e("p", { className: "text-sm", children: t.creator_notes }) })
    ] }),
    /* @__PURE__ */ r("div", { className: "text-xs text-text-tertiary", children: [
      "Card Format: ",
      c.spec || "Unknown",
      " ",
      c.spec_version ? `v${c.spec_version}` : ""
    ] }),
    /* @__PURE__ */ r("div", { className: "flex justify-between pt-4 border-t border-border-primary", children: [
      /* @__PURE__ */ e(
        "button",
        {
          onClick: n,
          className: "px-6 py-2 bg-bg-tertiary border border-border-primary rounded-md hover:bg-bg-hover transition-colors",
          children: "Back"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          onClick: i,
          className: "px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors",
          children: "Continue to Options"
        }
      )
    ] })
  ] });
}
const k = [
  { id: "anthropic", name: "Anthropic (Claude)" },
  { id: "openai", name: "OpenAI (GPT)" },
  { id: "ollama", name: "Ollama (Local)" },
  { id: "lmstudio", name: "LM Studio (Local)" }
], w = {
  anthropic: [
    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" }
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" }
  ],
  ollama: [
    { id: "llama3.2", name: "Llama 3.2" },
    { id: "mistral", name: "Mistral" },
    { id: "mixtral", name: "Mixtral" }
  ],
  lmstudio: [
    { id: "local-model", name: "Local Model (auto-detect)" }
  ]
};
function A({ card: c, onStart: s, onBack: i, isLoading: n }) {
  var y, g, f, N;
  const t = c.data || c, [l, d] = u({
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    includeGreeting: !0,
    includeExamples: !0,
    includePostInstructions: !1
  }), m = (a) => {
    d((o) => {
      var b, p;
      return {
        ...o,
        provider: a,
        model: ((p = (b = w[a]) == null ? void 0 : b[0]) == null ? void 0 : p.id) || ""
      };
    });
  }, h = () => {
    s(l);
  };
  return /* @__PURE__ */ r("div", { className: "space-y-6", children: [
    /* @__PURE__ */ r("div", { children: [
      /* @__PURE__ */ e("h2", { className: "text-2xl font-bold mb-2", children: "Configure Import" }),
      /* @__PURE__ */ r("p", { className: "text-text-secondary", children: [
        "Customize how ",
        /* @__PURE__ */ e("strong", { children: t.name }),
        " will be created as an Enclave agent."
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "space-y-4", children: [
      /* @__PURE__ */ e("h3", { className: "font-semibold", children: "AI Model" }),
      /* @__PURE__ */ r("div", { className: "space-y-2", children: [
        /* @__PURE__ */ e("label", { className: "block text-sm font-medium", children: "Provider" }),
        /* @__PURE__ */ e(
          "select",
          {
            value: l.provider,
            onChange: (a) => m(a.target.value),
            className: "w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary",
            children: k.map((a) => /* @__PURE__ */ e("option", { value: a.id, children: a.name }, a.id))
          }
        )
      ] }),
      /* @__PURE__ */ r("div", { className: "space-y-2", children: [
        /* @__PURE__ */ e("label", { className: "block text-sm font-medium", children: "Model" }),
        /* @__PURE__ */ e(
          "select",
          {
            value: l.model,
            onChange: (a) => d((o) => ({ ...o, model: a.target.value })),
            className: "w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary",
            children: (y = w[l.provider]) == null ? void 0 : y.map((a) => /* @__PURE__ */ e("option", { value: a.id, children: a.name }, a.id))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "space-y-4", children: [
      /* @__PURE__ */ e("h3", { className: "font-semibold", children: "Import Options" }),
      /* @__PURE__ */ r("label", { className: "flex items-start gap-3 cursor-pointer", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "checkbox",
            checked: l.includeExamples,
            onChange: (a) => d((o) => ({ ...o, includeExamples: a.target.checked })),
            className: "mt-1 rounded"
          }
        ),
        /* @__PURE__ */ r("div", { children: [
          /* @__PURE__ */ e("span", { className: "font-medium", children: "Include example dialogues" }),
          /* @__PURE__ */ e("p", { className: "text-sm text-text-secondary", children: "Add example messages to help the AI understand the character's speaking style." })
        ] })
      ] }),
      /* @__PURE__ */ r("label", { className: "flex items-start gap-3 cursor-pointer", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "checkbox",
            checked: l.includeGreeting,
            onChange: (a) => d((o) => ({ ...o, includeGreeting: a.target.checked })),
            className: "mt-1 rounded"
          }
        ),
        /* @__PURE__ */ r("div", { children: [
          /* @__PURE__ */ e("span", { className: "font-medium", children: "Store opening message" }),
          /* @__PURE__ */ e("p", { className: "text-sm text-text-secondary", children: "Save the first message for starting new conversations with this character." })
        ] })
      ] }),
      t.post_history_instructions && /* @__PURE__ */ r("label", { className: "flex items-start gap-3 cursor-pointer", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "checkbox",
            checked: l.includePostInstructions,
            onChange: (a) => d((o) => ({ ...o, includePostInstructions: a.target.checked })),
            className: "mt-1 rounded"
          }
        ),
        /* @__PURE__ */ r("div", { children: [
          /* @__PURE__ */ e("span", { className: "font-medium", children: "Include post-history instructions" }),
          /* @__PURE__ */ r("p", { className: "text-sm text-text-secondary", children: [
            "Add additional instructions that appear after the conversation history.",
            /* @__PURE__ */ e("span", { className: "text-status-warning ml-1", children: "(May include roleplay-specific formatting)" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "p-4 bg-bg-tertiary rounded-md border border-border-secondary", children: [
      /* @__PURE__ */ e("h4", { className: "font-semibold mb-2", children: "Import Summary" }),
      /* @__PURE__ */ r("ul", { className: "text-sm space-y-1", children: [
        /* @__PURE__ */ r("li", { children: [
          /* @__PURE__ */ e("span", { className: "text-text-secondary", children: "Name:" }),
          " ",
          t.name
        ] }),
        /* @__PURE__ */ r("li", { children: [
          /* @__PURE__ */ e("span", { className: "text-text-secondary", children: "Provider:" }),
          " ",
          (g = k.find((a) => a.id === l.provider)) == null ? void 0 : g.name
        ] }),
        /* @__PURE__ */ r("li", { children: [
          /* @__PURE__ */ e("span", { className: "text-text-secondary", children: "Model:" }),
          " ",
          ((N = (f = w[l.provider]) == null ? void 0 : f.find((a) => a.id === l.model)) == null ? void 0 : N.name) || l.model
        ] }),
        /* @__PURE__ */ r("li", { children: [
          /* @__PURE__ */ e("span", { className: "text-text-secondary", children: "Avatar:" }),
          " Will be imported from character card"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "flex justify-between pt-4 border-t border-border-primary", children: [
      /* @__PURE__ */ e(
        "button",
        {
          onClick: i,
          disabled: n,
          className: "px-6 py-2 bg-bg-tertiary border border-border-primary rounded-md hover:bg-bg-hover transition-colors disabled:opacity-50",
          children: "Back"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          onClick: h,
          disabled: n,
          className: "px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors disabled:opacity-50 flex items-center gap-2",
          children: n ? /* @__PURE__ */ r(C, { children: [
            /* @__PURE__ */ e("span", { className: "animate-spin", children: "⏳" }),
            "Creating Agent..."
          ] }) : /* @__PURE__ */ r(C, { children: [
            /* @__PURE__ */ e("span", { children: "✨" }),
            "Create Agent"
          ] })
        }
      )
    ] })
  ] });
}
function E({ result: c, onReset: s, onViewAgents: i }) {
  var n, t;
  return c.success ? /* @__PURE__ */ r("div", { className: "space-y-6", children: [
    /* @__PURE__ */ r("div", { className: "text-center", children: [
      /* @__PURE__ */ e("span", { className: "text-6xl block mb-4", children: "🎉" }),
      /* @__PURE__ */ e("h2", { className: "text-2xl font-bold mb-2", children: "Agent Created!" }),
      /* @__PURE__ */ e("p", { className: "text-text-secondary", children: "Your character has been imported as an Enclave agent." })
    ] }),
    c.agent && /* @__PURE__ */ r("div", { className: "p-6 bg-bg-tertiary rounded-lg border border-border-secondary", children: [
      /* @__PURE__ */ r("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ e(
          "div",
          {
            className: "w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold",
            style: { backgroundColor: c.agent.color || "#667eea" },
            children: ((t = (n = c.agent.name) == null ? void 0 : n[0]) == null ? void 0 : t.toUpperCase()) || "?"
          }
        ),
        /* @__PURE__ */ r("div", { children: [
          /* @__PURE__ */ e("h3", { className: "text-xl font-bold", children: c.agent.name }),
          /* @__PURE__ */ r("p", { className: "text-sm text-text-secondary", children: [
            c.agent.provider,
            " / ",
            c.agent.model
          ] })
        ] })
      ] }),
      c.agent.description && /* @__PURE__ */ e("p", { className: "mt-4 text-sm text-text-secondary", children: c.agent.description })
    ] }),
    /* @__PURE__ */ r("div", { className: "p-4 bg-accent-primary/10 border border-accent-primary rounded-md", children: [
      /* @__PURE__ */ r("h4", { className: "font-semibold mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ e("span", { children: "💡" }),
        "Next Steps"
      ] }),
      /* @__PURE__ */ r("ul", { className: "text-sm space-y-1 list-disc list-inside", children: [
        /* @__PURE__ */ e("li", { children: "View your new agent in the Agents view" }),
        /* @__PURE__ */ e("li", { children: "Start a new chat with this character" }),
        /* @__PURE__ */ e("li", { children: "Customize the agent's settings or system prompt" }),
        /* @__PURE__ */ e("li", { children: "Import more character cards" })
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "flex gap-3 pt-4 border-t border-border-primary", children: [
      /* @__PURE__ */ e(
        "button",
        {
          onClick: i,
          className: "flex-1 px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors font-medium",
          children: "View Agents"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          onClick: s,
          className: "px-6 py-3 bg-bg-tertiary border border-border-primary rounded-md hover:bg-bg-hover transition-colors",
          children: "Import Another"
        }
      )
    ] })
  ] }) : /* @__PURE__ */ r("div", { className: "space-y-6", children: [
    /* @__PURE__ */ r("div", { className: "text-center", children: [
      /* @__PURE__ */ e("span", { className: "text-6xl block mb-4", children: "😞" }),
      /* @__PURE__ */ e("h2", { className: "text-2xl font-bold mb-2", children: "Import Failed" }),
      /* @__PURE__ */ e("p", { className: "text-text-secondary", children: "Unfortunately, the character card could not be imported." })
    ] }),
    /* @__PURE__ */ e("div", { className: "p-4 bg-status-error/10 border border-status-error rounded-md", children: /* @__PURE__ */ e("p", { className: "text-sm text-status-error", children: c.error }) }),
    /* @__PURE__ */ e("div", { className: "flex justify-center pt-4", children: /* @__PURE__ */ e(
      "button",
      {
        onClick: s,
        className: "px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors",
        children: "Try Again"
      }
    ) })
  ] });
}
function T({ onNavigate: c } = {}) {
  const [s, i] = u("select"), [n, t] = u({
    options: {
      includeExamples: !0,
      includeGreeting: !0,
      includePostInstructions: !1
    }
  }), [l, d] = u(!1), [m, h] = u(null);
  P(() => {
    const a = (p) => {
      d(!1), p.success ? (t((x) => ({ ...x, card: p.card })), i("preview"), h(null)) : h(p.error || "Failed to read character card");
    }, o = (p) => {
      d(!1), t((x) => ({
        ...x,
        result: {
          success: !0,
          agent: p.agent
        }
      })), i("result");
    }, b = (p) => {
      d(!1), t((x) => ({
        ...x,
        result: {
          success: !1,
          error: p.message || "Import failed"
        }
      })), i("result");
    };
    return window.electron && (window.electron.on("character-card-import:preview-result", a), window.electron.on("character-card-import:complete", o), window.electron.on("character-card-import:error", b)), () => {
      window.electron && (window.electron.off("character-card-import:preview-result", a), window.electron.off("character-card-import:complete", o), window.electron.off("character-card-import:error", b));
    };
  }, []);
  const y = (a) => {
    t((o) => ({ ...o, filePath: a })), d(!0), h(null), window.electron.emitPluginEvent("character-card-import:preview", { filePath: a });
  }, g = (a) => {
    t((o) => ({ ...o, options: a })), d(!0), window.electron.emitPluginEvent("character-card-import:start", {
      filePath: n.filePath,
      options: a
    });
  }, f = () => {
    t({
      options: {
        includeExamples: !0,
        includeGreeting: !0,
        includePostInstructions: !1
      }
    }), i("select"), h(null);
  }, N = () => {
    c && c("agents");
  };
  return /* @__PURE__ */ r("div", { className: "max-w-3xl mx-auto", children: [
    /* @__PURE__ */ r("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ e(
        v,
        {
          step: 1,
          label: "Select Card",
          active: s === "select",
          completed: s !== "select"
        }
      ),
      /* @__PURE__ */ e("div", { className: "flex-1 h-px bg-border-primary mx-4" }),
      /* @__PURE__ */ e(
        v,
        {
          step: 2,
          label: "Preview",
          active: s === "preview",
          completed: s === "options" || s === "result"
        }
      ),
      /* @__PURE__ */ e("div", { className: "flex-1 h-px bg-border-primary mx-4" }),
      /* @__PURE__ */ e(
        v,
        {
          step: 3,
          label: "Configure",
          active: s === "options",
          completed: s === "result"
        }
      ),
      /* @__PURE__ */ e("div", { className: "flex-1 h-px bg-border-primary mx-4" }),
      /* @__PURE__ */ e(
        v,
        {
          step: 4,
          label: "Complete",
          active: s === "result",
          completed: !1
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "bg-bg-secondary rounded-lg border border-border-primary p-8", children: [
      s === "select" && /* @__PURE__ */ e(
        S,
        {
          onSelect: y,
          isLoading: l,
          error: m
        }
      ),
      s === "preview" && n.card && /* @__PURE__ */ e(
        I,
        {
          card: n.card,
          filePath: n.filePath,
          onContinue: () => i("options"),
          onBack: () => i("select")
        }
      ),
      s === "options" && n.card && /* @__PURE__ */ e(
        A,
        {
          card: n.card,
          onStart: g,
          onBack: () => i("preview"),
          isLoading: l
        }
      ),
      s === "result" && n.result && /* @__PURE__ */ e(
        E,
        {
          result: n.result,
          onReset: f,
          onViewAgents: N
        }
      )
    ] })
  ] });
}
function v({ step: c, label: s, active: i, completed: n }) {
  return /* @__PURE__ */ r("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${i ? "bg-accent-primary text-white border-accent-primary" : n ? "bg-accent-primary/20 text-accent-primary border-accent-primary" : "bg-bg-tertiary text-text-tertiary border-border-primary"}`,
        children: n ? "✓" : c
      }
    ),
    /* @__PURE__ */ e(
      "span",
      {
        className: `text-sm font-medium ${i ? "text-text-primary" : "text-text-secondary"}`,
        children: s
      }
    )
  ] });
}
export {
  T as CharacterCardImportWizard,
  T as default
};
//# sourceMappingURL=index.js.map
