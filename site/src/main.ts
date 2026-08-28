import './style.css';
import { copy } from './copy.mjs';

type Manifest = {
  schema_version: number;
  name: string;
  recommended_editor: string;
  editor_mappings: Record<string, string>;
  heuristics?: { camera_models?: string[]; sources?: string[]; extensions?: string[] };
  note?: string;
};

const sample: Manifest = {
  schema_version: 1,
  name: 'August portraits',
  recommended_editor: 'rawtherapee',
  editor_mappings: {
    darktable: 'Portrait neutral',
    rawtherapee: 'Portrait neutral v3',
  },
  heuristics: {
    camera_models: ['Fujifilm X-T5'],
    sources: ['camera-raw'],
    extensions: ['raf'],
  },
  note: 'Mixed window light; protect warm skin tones',
};

const fileInput = document.querySelector<HTMLInputElement>('#manifest-file')!;
const dropZone = document.querySelector<HTMLElement>('#drop-zone')!;
const output = document.querySelector<HTMLElement>('#recipe-output')!;
const sampleButton = document.querySelector<HTMLButtonElement>('#load-sample')!;
const offlineNote = document.querySelector<HTMLElement>('#offline-note')!;
const demoBanner = document.querySelector<HTMLElement>('#demo-banner')!;
const resetDemoButton = document.querySelector<HTMLButtonElement>('#reset-demo')!;
const routeAnnouncer = document.querySelector<HTMLElement>('#route-announcer')!;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!);
}

export function validateManifest(value: unknown): Manifest {
  if (!value || typeof value !== 'object') throw new Error(copy.notJson);
  const manifest = value as Partial<Manifest>;
  if (manifest.schema_version !== 1) throw new Error(copy.versionError(String(manifest.schema_version)));
  if (typeof manifest.name !== 'string' || !manifest.name.trim()) throw new Error(copy.missingName);
  if (typeof manifest.recommended_editor !== 'string' || !manifest.recommended_editor.trim()) throw new Error(copy.missingEditor);
  if (!manifest.editor_mappings || typeof manifest.editor_mappings !== 'object') throw new Error(copy.missingMappings);
  const profile = manifest.editor_mappings[manifest.recommended_editor];
  if (typeof profile !== 'string' || !profile.trim()) throw new Error(copy.missingProfile(manifest.recommended_editor));
  return manifest as Manifest;
}

function renderManifest(manifest: Manifest): void {
  const mappings = Object.entries(manifest.editor_mappings)
    .map(([editor, profile]) => `<li><span>${escapeHtml(editor)}</span><strong>${escapeHtml(profile)}</strong></li>`)
    .join('');
  const folderDetails = [
    ...(manifest.heuristics?.camera_models ?? []),
    ...(manifest.heuristics?.sources ?? []),
    ...(manifest.heuristics?.extensions ?? []).map((extension) => `.${extension}`),
  ];
  output.className = 'recipe-output is-ready';
  output.innerHTML = `
    <p class="output-kicker"><span aria-hidden="true">●</span> ${copy.validRecipe}</p>
    <h3>${escapeHtml(manifest.name)}</h3>
    <p class="recommended">Apply <strong>${escapeHtml(manifest.recommended_editor)}</strong> → <strong>${escapeHtml(manifest.editor_mappings[manifest.recommended_editor])}</strong></p>
    <dl><div><dt>Why</dt><dd>${escapeHtml(manifest.note ?? copy.noFolderNote)}</dd></div><div><dt>Camera, source, and file types</dt><dd>${folderDetails.length ? folderDetails.map(escapeHtml).join(' · ') : copy.noSignals}</dd></div></dl>
    <h4>Saved editor profiles</h4><ul class="mapping-list">${mappings}</ul>`;
}

function renderError(message: string): void {
  output.className = 'recipe-output is-error';
  output.innerHTML = `<p class="output-kicker">${copy.unreadable}</p><h3>${copy.checkRecipe}</h3><p>${escapeHtml(message)}</p><p>${copy.recovery.replace('folder-recipe inspect --json', '<code>folder-recipe inspect --json</code>')}</p>`;
}

async function readFile(file?: File): Promise<void> {
  if (!file) return;
  if (file.size > 1_000_000) {
    renderError(copy.tooLarge);
    return;
  }
  try {
    renderManifest(validateManifest(JSON.parse(await file.text())));
  } catch (error) {
    renderError(error instanceof Error ? error.message : copy.unparsed);
  }
}

fileInput.addEventListener('change', () => void readFile(fileInput.files?.[0]));
sampleButton.addEventListener('click', () => renderManifest(sample));
resetDemoButton.addEventListener('click', () => {
  fileInput.value = '';
  renderManifest(sample);
  routeAnnouncer.textContent = copy.reset;
});
for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('is-dragging'); });
}
for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('is-dragging'); });
}
dropZone.addEventListener('drop', (event) => void readFile(event.dataTransfer?.files[0]));

document.querySelector<HTMLButtonElement>('[data-copy]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  try {
    await navigator.clipboard.writeText(button.dataset.copy ?? '');
    button.textContent = copy.copied;
  } catch {
    button.textContent = copy.copyFallback;
  }
  window.setTimeout(() => { button.textContent = copy.copyAction; }, 1800);
});

function updateNetworkState(online = navigator.onLine): void {
  offlineNote.hidden = online;
}
window.addEventListener('online', () => updateNetworkState(true));
window.addEventListener('offline', () => updateNetworkState(false));
updateNetworkState();

const demoMode = document.body.dataset.forceDemo === 'true'
  || new URLSearchParams(window.location.search).get('demo') === '1'
  || window.location.pathname.replace(/\/$/, '') === '/demo';
if (demoMode) {
  document.body.classList.add('is-demo');
  demoBanner.hidden = false;
  document.querySelectorAll<HTMLElement>('[data-demo-only]').forEach((element) => { element.hidden = false; });
  renderManifest(sample);
  const demoDescription = 'Try Folder Recipe with an isolated sample shoot and saved editor profiles.';
  const demoUrl = 'https://folder-recipe-switcher.sociobot.in/demo/';
  document.title = 'Demo — Folder Recipe';
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = demoUrl;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', demoDescription);
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', 'Demo — Folder Recipe');
  }
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', demoDescription);
  }
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', demoUrl);
  const title = document.querySelector<HTMLElement>('#hero-title')!;
  title.textContent = 'Check saved profiles in a sample shoot';
  window.requestAnimationFrame(() => {
    title.focus();
    routeAnnouncer.textContent = copy.loaded;
  });
} else {
  let cameFromThisSite = false;
  try { cameFromThisSite = new URL(document.referrer).origin === window.location.origin; } catch { /* Direct visit. */ }
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const restoredFromHistory = navigation?.type === 'back_forward';
  if (cameFromThisSite || restoredFromHistory) {
    const title = document.querySelector<HTMLElement>('#hero-title')!;
    window.requestAnimationFrame(() => {
      title.focus();
      routeAnnouncer.textContent = title.textContent ?? 'Home loaded';
    });
  }
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const title = document.querySelector<HTMLElement>('#hero-title');
    title?.focus();
    routeAnnouncer.textContent = title?.textContent ?? 'Page restored';
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }));
}
