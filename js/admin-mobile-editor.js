(function mobilePieceEditor() {
  'use strict';

  if (!matchMedia('(max-width:800px)').matches) return;

  const form = document.querySelector('#productForm');
  const modal = document.querySelector('#productModal');

  if (!form || !modal) return;

  const field = name => form.elements[name];

  const escapeHtml = value =>
    String(value ?? '').replace(
      /[&<>'"]/g,
      char =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        })[char]
    );

  function relationSelect(name, label) {
    const current = field(name);
    const select = document.createElement('select');

    select.name = name;
    select.required = true;
    select.setAttribute('aria-label', label);

    current.replaceWith(select);

    return select;
  }

  const brand = relationSelect('brand', 'Maker');
  const category = relationSelect('category', 'Category');

  function options() {
    const store = window.LEFUSIL_ADMIN_STORE;
    if (!store) return;

    const products = store.getProducts?.() || [];

    const makers =
      store.getBrands?.() ||
      [...new Set(products.map(item => item.brand).filter(Boolean))].map(
        name => ({ name })
      );

    const categories =
      store.getCategories?.() ||
      [...new Set(products.map(item => item.category).filter(Boolean))].map(
        name => ({ name })
      );

    const fill = (select, placeholder, items) => {
      const value = select.value;

      select.innerHTML =
        `<option value="">${escapeHtml(placeholder)}</option>` +
        items
          .map(item => {
            const name = item.name || '';
            return `<option value="${escapeHtml(name)}">${escapeHtml(
              name
            )}</option>`;
          })
          .join('');

      select.value = value;
    };

    fill(brand, 'Select maker', makers);
    fill(category, 'Select category', categories);
  }

  function group(title, names) {
    const section = document.createElement('section');

    section.className = 'mobile-editor-section';
    section.innerHTML = `<h3>${escapeHtml(title)}</h3><div></div>`;

    const body = section.lastElementChild;

    names.forEach(name => {
      const label = field(name)?.closest('label');
      if (label) body.append(label);
    });

    form.insertBefore(section, form.querySelector('.editor-section'));

    return section;
  }

  group('Basic Information', [
    'brand',
    'name',
    'model',
    'sku',
    'slug',
    'description'
  ]);

  group('Classification', ['category', 'calibre']);

  group('Pricing & Availability', [
    'price',
    'priceOnRequest',
    'status'
  ]);

  group('Visibility', ['featured']);

  const originalCore = form.querySelector('.editor-section');

  if (originalCore) {
    originalCore.classList.add('mobile-original-core');
  }

  const specs = document
    .querySelector('#specificationRows')
    ?.closest('.editor-section');

  if (specs) {
    specs.dataset.mobileTitle = 'Specifications';
  }

  /*
   * ------------------------------------------------------------
   * Product images
   * ------------------------------------------------------------
   */

  let pendingImages = [];

  const photos = document
    .querySelector('#imageRows')
    ?.closest('.editor-section');

  let imageInput;
  let imagePreview;
  let imageStatus;

  if (photos) {
    photos.classList.add('mobile-photos-section');

    const oldMessage = [...photos.children].find(element =>
      element.textContent?.includes(
        'Photo management will be connected'
      )
    );

    oldMessage?.remove();

    const imageUi = document.createElement('div');

    imageUi.className = 'mobile-image-upload';

    imageUi.innerHTML = `
      <label class="mobile-image-picker">
        <span>ADD PHOTOS</span>
        <small>JPEG, PNG, WebP or AVIF · max 15 MB each</small>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
        >
      </label>

      <div
        class="mobile-image-status"
        aria-live="polite"
      ></div>

      <div class="mobile-image-preview"></div>
    `;

    photos.append(imageUi);

    imageInput = imageUi.querySelector('input[type="file"]');
    imagePreview = imageUi.querySelector('.mobile-image-preview');
    imageStatus = imageUi.querySelector('.mobile-image-status');

    imageInput.addEventListener('change', () => {
      const files = [...(imageInput.files || [])];

      const allowedTypes = new Set([
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif'
      ]);

      const valid = [];
      const rejected = [];

      files.forEach(file => {
        if (!allowedTypes.has(file.type)) {
          rejected.push(`${file.name}: unsupported format`);
          return;
        }

        if (file.size > 15 * 1024 * 1024) {
          rejected.push(`${file.name}: larger than 15 MB`);
          return;
        }

        valid.push(file);
      });

      pendingImages = valid;

      if (rejected.length) {
        imageStatus.textContent = rejected.join(' · ');
      } else if (valid.length) {
        imageStatus.textContent =
          `${valid.length} photo${valid.length === 1 ? '' : 's'} selected`;
      } else {
        imageStatus.textContent = '';
      }

      renderImagePreview();
    });
  }

  function renderImagePreview() {
    if (!imagePreview) return;

    imagePreview.innerHTML = '';

    pendingImages.forEach((file, index) => {
      const item = document.createElement('div');
      const url = URL.createObjectURL(file);

      item.className = 'mobile-image-preview-item';

      item.innerHTML = `
        <img
          src="${url}"
          alt="${escapeHtml(file.name)}"
        >
        <div>
          <strong>
            ${index === 0 ? 'Cover' : `Gallery ${index}`}
          </strong>
          <span>${escapeHtml(file.name)}</span>
        </div>
        <button
          type="button"
          aria-label="Remove ${escapeHtml(file.name)}"
        >
          ×
        </button>
      `;

      item.querySelector('img').addEventListener(
        'load',
        () => URL.revokeObjectURL(url),
        { once: true }
      );

      item.querySelector('button').addEventListener('click', () => {
        pendingImages.splice(index, 1);

        if (imageStatus) {
          imageStatus.textContent = pendingImages.length
            ? `${pendingImages.length} photo${
                pendingImages.length === 1 ? '' : 's'
              } selected`
            : '';
        }

        renderImagePreview();
      });

      imagePreview.append(item);
    });
  }

  function resetPendingImages() {
    pendingImages = [];

    if (imageInput) {
      imageInput.value = '';
    }

    if (imagePreview) {
      imagePreview.innerHTML = '';
    }

    if (imageStatus) {
      imageStatus.textContent = '';
    }
  }

  function safeFileName(name) {
    const source = String(name || 'image');

    const dotIndex = source.lastIndexOf('.');
    const extension =
      dotIndex >= 0
        ? source
            .slice(dotIndex + 1)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
        : '';

    const baseName = (dotIndex >= 0
      ? source.slice(0, dotIndex)
      : source
    )
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

    return `${baseName || 'image'}${extension ? `.${extension}` : ''}`;
  }

  function uniqueImagePath(productId, file, index) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);

    return [
      productId,
      `${timestamp}-${index}-${random}-${safeFileName(file.name)}`
    ].join('/');
  }

  async function resolveProductId(savedProduct, values) {
    if (savedProduct?.id) {
      return savedProduct.id;
    }

    const provider = window.LEFUSIL_SUPABASE_DATA_PROVIDER;

    if (!provider?.getAdminProducts) {
      return values.id || null;
    }

    const products = await provider.getAdminProducts();

    const match = products.find(
      product =>
        product.id === values.id ||
        product.slug === values.slug ||
        product.sku === values.sku
    );

    return match?.id || values.id || null;
  }

  async function uploadPendingImages(productId, productName) {
    if (!pendingImages.length) return;

    const provider = window.LEFUSIL_SUPABASE_DATA_PROVIDER;

    if (
      !provider?.uploadProductImage ||
      !provider?.createMediaRecord
    ) {
      throw new Error('Product image service is unavailable.');
    }

    if (!productId) {
      throw new Error('Product ID is unavailable.');
    }

    for (let index = 0; index < pendingImages.length; index += 1) {
      const file = pendingImages[index];

      if (imageStatus) {
        imageStatus.textContent =
          `Uploading photo ${index + 1} of ${pendingImages.length}…`;
      }

      const path = uniqueImagePath(productId, file, index);

      const uploaded = await provider.uploadProductImage(
        file,
        path
      );

      await provider.createMediaRecord({
        product_id: productId,
        storage_bucket: uploaded.bucket,
        storage_path: uploaded.path,
        original_filename: file.name,
        mime_type: file.type,
        file_size: file.size,
        alt_text: productName || '',
        image_role: index === 0 ? 'cover' : 'gallery',
        display_order: index,
        is_active: true
      });
    }

    if (imageStatus) {
      imageStatus.textContent = 'Photos uploaded.';
    }
  }

  /*
   * ------------------------------------------------------------
   * Modal controls
   * ------------------------------------------------------------
   */

  const actions = form.querySelector('.modal-actions');
  const submit = actions?.querySelector('button[type="submit"]');

  if (!actions || !submit) return;

  actions.insertAdjacentHTML(
    'afterbegin',
    '<button type="button" class="mobile-editor-cancel">Cancel</button>'
  );

  actions
    .querySelector('.mobile-editor-cancel')
    .addEventListener('click', () => {
      modal.querySelector('[data-close-modal]')?.click();
    });

  const close = modal.querySelector('[data-close-modal]');

  if (close) {
    close.textContent = '← Back';
    close.setAttribute('aria-label', 'Back to Collection');
  }

  function syncPrice() {
    field('price').disabled = field('priceOnRequest').checked;

    field('price')
      .closest('label')
      ?.classList.toggle(
        'is-disabled',
        field('priceOnRequest').checked
      );
  }

  field('priceOnRequest')?.addEventListener(
    'change',
    syncPrice
  );

  function clearErrors() {
    form
      .querySelectorAll('.field-error')
      .forEach(item => item.remove());

    form
      .querySelectorAll('[aria-invalid="true"]')
      .forEach(item => item.removeAttribute('aria-invalid'));

    const formErrors = document.querySelector('#formErrors');

    if (formErrors) {
      formErrors.className = 'form-errors';
      formErrors.textContent = '';
    }
  }

  function showFormError(message) {
    const formErrors = document.querySelector('#formErrors');

    if (!formErrors) return;

    formErrors.className = 'form-errors show';
    formErrors.textContent = message;
  }

  function error(name, message) {
    const input = field(name);
    if (!input) return;

    input.setAttribute('aria-invalid', 'true');

    input
      .closest('label')
      ?.insertAdjacentHTML(
        'beforeend',
        `<small class="field-error">${escapeHtml(message)}</small>`
      );
  }

  function validate() {
    clearErrors();

    let valid = true;

    [
      ['brand', 'Select a maker.'],
      ['name', 'Enter a product name.'],
      ['category', 'Select a category.'],
      ['sku', 'Enter a reference.'],
      ['slug', 'Enter a URL slug.']
    ].forEach(([name, message]) => {
      if (!String(field(name)?.value || '').trim()) {
        error(name, message);
        valid = false;
      }
    });

    if (
      field('slug')?.value &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        field('slug').value
      )
    ) {
      error(
        'slug',
        'Use lowercase letters, numbers and hyphens only.'
      );
      valid = false;
    }

    if (
      !field('priceOnRequest')?.checked &&
      !(Number(field('price')?.value) > 0)
    ) {
      error(
        'price',
        'Enter a price or enable Price on Request.'
      );
      valid = false;
    }

    if (!valid) {
      form
        .querySelector('[aria-invalid="true"]')
        ?.focus();
    }

    return valid;
  }

  function data() {
    const specifications = {};

    form
      .querySelectorAll('#specificationRows .spec-row')
      .forEach(row => {
        const inputs = row.querySelectorAll('input');

        if (inputs.length < 2) return;

        const key = inputs[0].value.trim();
        const value = inputs[1].value.trim();

        if (key && value) {
          specifications[key] = value;
        }
      });

    return {
      id: field('id')?.value || '',
      name: field('name')?.value.trim() || '',
      brand: field('brand')?.value || '',
      model: field('model')?.value.trim() || '',
      sku: field('sku')?.value.trim() || '',
      slug: field('slug')?.value.trim() || '',
      category: field('category')?.value || '',
      calibre: field('calibre')?.value.trim() || '',
      price: field('priceOnRequest')?.checked
        ? null
        : Number(field('price')?.value),
      priceOnRequest:
        Boolean(field('priceOnRequest')?.checked),
      description:
        field('description')?.value.trim() || '',
      status: field('status')?.value || 'draft',
      featured: Boolean(field('featured')?.checked),
      specifications
    };
  }

  form.addEventListener(
    'submit',
    async event => {
      const store = window.LEFUSIL_ADMIN_STORE;

      if (store?.source !== 'supabase') return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (!validate()) return;

      const values = data();
      const editing = Boolean(values.id);
      const original = submit.textContent;

      submit.disabled = true;
      submit.textContent = pendingImages.length
        ? 'Saving & Uploading…'
        : 'Saving…';

      try {
        let savedProduct;

        if (editing) {
          savedProduct = await store.updateProduct(
            values.id,
            values
          );
        } else {
          savedProduct = await store.createProduct(values);
        }

        const productId = await resolveProductId(
          savedProduct,
          values
        );

        if (pendingImages.length) {
          await uploadPendingImages(
            productId,
            values.name
          );
        }

        submit.textContent = editing
          ? 'Changes Saved'
          : 'Piece Added';

        await new Promise(resolve =>
          setTimeout(resolve, 600)
        );

        resetPendingImages();

        modal
          .querySelector('[data-close-modal]')
          ?.click();

        document
          .querySelector('[data-view="products"]')
          ?.click();
      } catch (saveError) {
        console.error(
          '[LE FUSIL] Product save/upload failed:',
          saveError
        );

        const message =
          saveError?.message ||
          'Unable to save changes. Try again.';

        showFormError(message);

        if (imageStatus && pendingImages.length) {
          imageStatus.textContent =
            'Photo upload was not completed.';
        }
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    },
    true
  );

  new MutationObserver(() => {
    if (!modal.classList.contains('open')) return;

    options();

    const editing = Boolean(field('id')?.value);

    const editorTitle =
      document.querySelector('#editorTitle');

    if (editorTitle) {
      editorTitle.textContent = editing
        ? 'Edit Piece'
        : 'Add New Piece';
    }

    submit.textContent = editing
      ? 'Save Changes'
      : 'Save Piece';

    clearErrors();
    syncPrice();
    resetPendingImages();
  }).observe(modal, {
    attributes: true,
    attributeFilter: ['class']
  });

  addEventListener('lefusil:admin-products', options);

  options();

  /*
   * Small mobile-only styles for uploader.
   */

  const style = document.createElement('style');

  style.textContent = `
    .mobile-image-upload {
      margin-top: 20px;
    }

    .mobile-image-picker {
      display: flex;
      min-height: 88px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,.22);
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
    }

    .mobile-image-picker span {
      letter-spacing: .14em;
      font-size: 14px;
      font-weight: 600;
    }

    .mobile-image-picker small {
      opacity: .6;
      font-size: 13px;
      line-height: 1.4;
    }

    .mobile-image-status {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.5;
      opacity: .75;
    }

    .mobile-image-preview {
      display: grid;
      gap: 12px;
      margin-top: 14px;
    }

    .mobile-image-preview-item {
      display: grid;
      grid-template-columns: 72px minmax(0,1fr) 42px;
      gap: 12px;
      align-items: center;
      padding: 10px;
      border: 1px solid rgba(255,255,255,.15);
    }

    .mobile-image-preview-item img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      display: block;
    }

    .mobile-image-preview-item div {
      min-width: 0;
    }

    .mobile-image-preview-item strong,
    .mobile-image-preview-item span {
      display: block;
    }

    .mobile-image-preview-item strong {
      margin-bottom: 4px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: .12em;
    }

    .mobile-image-preview-item span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: .65;
      font-size: 13px;
    }

    .mobile-image-preview-item button {
      border: 0;
      background: transparent;
      color: inherit;
      font-size: 26px;
      cursor: pointer;
    }
  `;

  document.head.append(style);
})();
