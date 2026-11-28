// One WebMCP registration path for the recipe app and the static pages.
// Chrome 152+ exposes document.modelContext. Older Chrome still has navigator.modelContext.
// registerTool returns a Promise as of Chrome 151. Browsers with neither skip registration.

/**
 * @typedef {{
 *   registerTool: (tool: object, options?: { signal?: AbortSignal }) => Promise<unknown> | unknown,
 * }} ModelContext
 */

/**
 * @param {any[]} tools
 * @returns {() => void}
 */
export function registerAgentTools(tools) {
    if (typeof document === 'undefined') return () => {};
    const modelContext =
        /** @type {Document & { modelContext?: ModelContext }} */ (document).modelContext ||
        /** @type {Navigator & { modelContext?: ModelContext }} */ (navigator).modelContext;
    if (!modelContext || typeof modelContext.registerTool !== 'function') return () => {};
    const controller = new AbortController();
    void (async () => {
        for (const tool of tools) {
            try {
                await modelContext.registerTool(tool, { signal: controller.signal });
            } catch {
                // A failed registration leaves the page usable.
            }
        }
    })();
    const stop = () => controller.abort();
    if (typeof window !== 'undefined') window.addEventListener('pagehide', stop, { once: true });
    return stop;
}

/**
 * Read-only tool that copies a table or list into one result object.
 * `columns` selectors are relative to each row. Omit `selector` to read the row itself.
 * `text: true` returns an array of strings (a list) instead of row objects.
 * @param {string} name
 * @param {string} description
 * @param {{
 *   row: string,
 *   columns?: Record<string, { selector?: string, attr?: string }>,
 *   text?: boolean,
 *   require?: string,
 *   resultKey?: string,
 * }} spec
 */
export function readTableTool(name, description, spec) {
    const resultKey = spec.resultKey ?? 'rows';
    return {
        name,
        description,
        inputSchema: { type: 'object', properties: {} },
        execute() {
            /** @type {any[]} */
            const items = [];
            for (const el of document.querySelectorAll(spec.row)) {
                if (spec.text) {
                    items.push(el.textContent ?? '');
                    continue;
                }
                /** @type {Record<string, string | null>} */
                const record = {};
                for (const [key, col] of Object.entries(spec.columns ?? {})) {
                    const target = col.selector ? el.querySelector(col.selector) : el;
                    record[key] = col.attr
                        ? target
                            ? target.getAttribute(col.attr)
                            : null
                        : (target?.textContent ?? '');
                }
                if (spec.require && !record[spec.require]) continue;
                items.push(record);
            }
            return { [resultKey]: items };
        },
        annotations: { readOnlyHint: true },
    };
}
