import './style.css';

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

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!);
}

export function validateManifest(value: unknown): Manifest {
  if (!value || typeof value !== 'object') throw new Error('This file is not a JSON object.');
  const manifest = value as Partial<Manifest>;
  if (manifest.schema_version !== 1) throw new Error(`Schema version ${String(manifest.schema_version)} is not supported. Use version 1.`);
  if (typeof manifest.name !== 'string' || !manifest.name.trim()) throw new Error('The manifest needs a non-empty “name”.');
  if (typeof manifest.recommended_editor !== 'string' || !manifest.recommended_editor.trim()) throw new Error('The manifest needs a “recommended_editor”.');
  if (!manifest.editor_mappings || typeof manifest.editor_mappings !== 'object') throw new Error('The manifest needs explicit “editor_mappings”.');
  const profile = manifest.editor_mappings[manifest.recommended_editor];
  if (typeof profile !== 'string' || !profile.trim()) throw new Error(`There is no profile mapped for “${manifest.recommended_editor}”.`);
  return manifest as Manifest;
}

function renderManifest(manifest: Manifest): void {
  const mappings = Object.entries(manifest.editor_mappings)
    .map(([editor, profile]) => `<li><span>${escapeHtml(editor)}</span><strong>${escapeHtml(profile)}</strong></li>`)
    .join('');
  const clues = [
    ...(manifest.heuristics?.camera_models ?? []),
    ...(manifest.heuristics?.sources ?? []),
    ...(manifest.heuristics?.extensions ?? []).map((extension) => `.${extension}`),
  ];
  output.className = 'recipe-output is-ready';
  output.innerHTML = `
    <p class="output-kicker"><span aria-hidden="true">●</span> Valid schema v1</p>
    <h3>${escapeHtml(manifest.name)}</h3>
    <p class="recommended">Apply <strong>${escapeHtml(manifest.recommended_editor)}</strong> → <strong>${escapeHtml(manifest.editor_mappings[manifest.recommended_editor])}</strong></p>
    <dl><div><dt>Why</dt><dd>${escapeHtml(manifest.note ?? 'No folder note recorded')}</dd></div><div><dt>Clues</dt><dd>${clues.length ? clues.map(escapeHtml).join(' · ') : 'No source clues recorded'}</dd></div></dl>
    <h4>Explicit mappings</h4><ul class="mapping-list">${mappings}</ul>`;
}

function renderError(message: string): void {
  output.className = 'recipe-output is-error';
  output.innerHTML = `<p class="output-kicker">Could not read recipe</p><h3>Check this manifest</h3><p>${escapeHtml(message)}</p><p>Choose a version 1 manifest or run <code>folder-recipe inspect --json</code> to diagnose it.</p>`;
}

async function readFile(file?: File): Promise<void> {
  if (!file) return;
  if (file.size > 1_000_000) {
    renderError('The file is larger than 1 MB, which is unusually large for a folder recipe.');
    return;
  }
  try {
    renderManifest(validateManifest(JSON.parse(await file.text())));
  } catch (error) {
    renderError(error instanceof Error ? error.message : 'The file could not be parsed.');
  }
}

fileInput.addEventListener('change', () => void readFile(fileInput.files?.[0]));
sampleButton.addEventListener('click', () => renderManifest(sample));
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
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select the command above to copy';
  }
  window.setTimeout(() => { button.textContent = 'Copy install command'; }, 1800);
});

function updateNetworkState(online = navigator.onLine): void {
  offlineNote.hidden = online;
}
window.addEventListener('online', () => updateNetworkState(true));
window.addEventListener('offline', () => updateNetworkState(false));
updateNetworkState();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }));
}
