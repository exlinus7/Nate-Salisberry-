import { track } from './analytics';

/*
  Accessible lead forms. Markup contract:
    <form data-lead-form="name" data-success="success-panel-id" action="[FORM_ENDPOINT]" novalidate>
      <input id="x" required data-validate="phone|email|zip" aria-describedby="x-help x-error">
      <p id="x-error" class="field-error" aria-live="polite"></p>
      <div data-pill-group="best_time"> <button class="pill" data-value="Morning" data-phrase="in the morning"> … </div>
      <input type="hidden" name="best_time">
      <p data-form-error class="field-error" role="alert"></p>
    </form>
    <div id="success-panel-id" hidden> <h3 tabindex="-1" data-success-focus>…</h3> <span data-fill-from="best_time"></span>
      <button data-form-reset> </div>
*/

const DEFAULT_MESSAGES: Record<string, { required: string; invalid?: string }> = {
  phone: {
    required: 'Please enter a phone number so we can call you back.',
    invalid: 'Please include the area code, for example 555 123 4567.',
  },
  email: {
    required: 'Please enter your email address.',
    invalid: 'That email doesn’t look complete. Please check it, for example name@example.com.',
  },
  zip: {
    required: 'Please enter a ZIP code.',
    invalid: 'Please enter a 5-digit ZIP code, for example 12345.',
  },
};

function validateField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
  const value = field.value.trim();
  const kind = field.dataset.validate ?? (field.type === 'email' ? 'email' : '');
  const msgs = DEFAULT_MESSAGES[kind];
  const label = field.dataset.label ?? 'this field';

  if (!value) {
    return field.required ? (field.dataset.errorRequired ?? msgs?.required ?? `Please fill in ${label}.`) : '';
  }
  if (kind === 'phone') {
    const digits = value.replace(/\D/g, '');
    const ok = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
    if (!ok) return msgs.invalid!;
  }
  if (kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return msgs.invalid!;
  if (kind === 'zip' && !/^\d{5}(-\d{4})?$/.test(value)) return msgs.invalid!;
  return '';
}

function setError(field: HTMLElement, message: string) {
  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) errorEl.textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

function initPillGroups(form: HTMLFormElement): () => void {
  const resets: Array<() => void> = [];
  form.querySelectorAll<HTMLElement>('[data-pill-group]').forEach((group) => {
    const input = form.querySelector<HTMLInputElement>(`input[name="${group.dataset.pillGroup}"]`);
    const pills = group.querySelectorAll<HTMLButtonElement>('button[data-value]');
    const select = (pill: HTMLButtonElement) => {
      pills.forEach((p) => p.setAttribute('aria-pressed', String(p === pill)));
      if (input) {
        input.value = pill.dataset.value ?? '';
        input.dataset.phrase = pill.dataset.phrase ?? pill.dataset.value ?? '';
      }
    };
    pills.forEach((pill) => pill.addEventListener('click', () => select(pill)));
    const initial = group.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (initial) {
      select(initial);
      resets.push(() => select(initial));
    }
  });
  return () => resets.forEach((reset) => reset());
}

export function initLeadForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input:not([type=hidden]), textarea, select'),
    );
    const success = form.dataset.success ? document.getElementById(form.dataset.success) : null;
    const formError = form.querySelector<HTMLElement>('[data-form-error]');
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type=submit]');
    const submitLabel = submitBtn?.textContent ?? '';

    const resetPills = initPillGroups(form);

    // Clear a flagged field's error as soon as it's fixed. This runs while typing, not on blur:
    // removing the message on blur shifts the layout mid-click and makes the next click miss.
    fields.forEach((field) => {
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true' && !validateField(field)) setError(field, '');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formError) formError.textContent = '';

      let firstInvalid: HTMLElement | null = null;
      for (const field of fields) {
        const msg = validateField(field);
        setError(field, msg);
        if (msg && !firstInvalid) firstInvalid = field;
      }
      if (firstInvalid) {
        // Open a collapsed <details> if the problem is inside it
        firstInvalid.closest('details')?.setAttribute('open', '');
        firstInvalid.focus();
        return;
      }

      const endpoint = form.getAttribute('action') ?? '';
      const data = new FormData(form);
      data.set('page', location.pathname);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        if (endpoint && !endpoint.startsWith('[')) {
          const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`);
        } else {
          console.info('[WiseMove] Form endpoint is still a placeholder — submission not sent.', Object.fromEntries(data));
        }
        track('form_submit', { form_name: form.dataset.leadForm });

        if (success) {
          success.querySelectorAll<HTMLElement>('[data-fill-from]').forEach((el) => {
            const input = form.querySelector<HTMLInputElement>(`[name="${el.dataset.fillFrom}"]`);
            const text = input?.dataset.phrase || input?.value;
            if (text) el.textContent = text;
          });
          form.hidden = true;
          success.hidden = false;
          success.querySelector<HTMLElement>('[data-success-focus]')?.focus();
        }
      } catch (err) {
        console.error(err);
        if (formError) {
          formError.textContent =
            'Sorry, something went wrong sending your request. Please try again, or call us; we’re happy to help by phone.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        }
      }
    });

    success?.querySelector('[data-form-reset]')?.addEventListener('click', () => {
      form.reset();
      resetPills();
      success.hidden = true;
      form.hidden = false;
      fields[0]?.focus();
    });
  });
}
