(() => {
  'use strict';

  const STORAGE_KEY = 'senspices.cinnamon-batches.v1';
  const SEED_BATCHES = [
    { code: 'LOT-YB-2415', factory: 'Yên Bái', date: '2026-11-08', inputKg: 6500, moisture: 28.4, pipeKg: 3590, brokenKg: 1510, powderKg: 370 },
    { code: 'LOT-HN-2417', factory: 'Hà Nam', date: '2026-11-09', inputKg: 4800, moisture: 23.7, pipeKg: 3000, brokenKg: 920, powderKg: 280 },
    { code: 'LOT-YB-2420', factory: 'Yên Bái', date: '2026-11-10', inputKg: 7200, moisture: 30.1, pipeKg: 4320, brokenKg: 1620, powderKg: 410 }
  ];

  const $ = (selector) => document.querySelector(selector);
  const form = $('#batch-form');
  const fields = {
    code: $('#batch-code'), factory: $('#factory'), date: $('#batch-date'),
    moisture: $('#moisture'), inputKg: $('#input-kg'), pipeKg: $('#pipe-kg'),
    brokenKg: $('#broken-kg'), powderKg: $('#powder-kg')
  };
  const numberFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
  const percentFormat = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let batches = loadBatches();
  let toastTimer;

  function calculate(batch) {
    const outputKg = round2(Number(batch.pipeKg) + Number(batch.brokenKg) + Number(batch.powderKg));
    const lossKg = round2(Number(batch.inputKg) - outputKg);
    const lossRate = Number(batch.inputKg) > 0 ? (lossKg / Number(batch.inputKg)) * 100 : 0;
    return { ...batch, outputKg, lossKg, lossRate };
  }

  function round2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function loadBatches() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.map(calculate);
      }
    } catch (error) {
      console.warn('Không thể đọc dữ liệu Senspices trên thiết bị.', error);
    }
    const initial = SEED_BATCHES.map((batch) => ({ ...calculate(batch), createdAt: new Date().toISOString() }));
    persist(initial);
    return initial;
  }

  function persist(data = batches) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Không thể lưu dữ liệu Senspices trên thiết bị.', error);
      return false;
    }
  }

  function formatKg(value) {
    return numberFormat.format(Number(value) || 0);
  }

  function formatRate(value) {
    return `${percentFormat.format(Number(value) || 0)}%`;
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function renderDashboard() {
    const totals = batches.reduce((sum, item) => {
      sum.input += Number(item.inputKg) || 0;
      sum.output += Number(item.outputKg) || 0;
      sum.loss += Number(item.lossKg) || 0;
      return sum;
    }, { input: 0, output: 0, loss: 0 });
    const averageRate = totals.input > 0 ? totals.loss / totals.input * 100 : 0;
    $('#stat-input').textContent = formatKg(totals.input);
    $('#stat-output').textContent = formatKg(totals.output);
    $('#stat-loss-rate').textContent = percentFormat.format(averageRate);
    $('#batch-count').textContent = batches.length;
  }

  function statusMarkup(batch) {
    const isAlert = Number(batch.lossRate) > 15;
    return `<span class="status-pill ${isAlert ? 'status-alert' : 'status-ok'}">${isAlert ? 'Cần kiểm tra' : 'Trong ngưỡng'}</span>`;
  }

  function renderHistory() {
    const sorted = [...batches].sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const empty = sorted.length === 0;
    $('#history-empty').hidden = !empty;
    $('#history-table-wrap').hidden = empty;
    $('#history-body').innerHTML = sorted.map((batch) => `
      <tr>
        <td><div class="code-cell"><strong>${safeText(batch.code)}</strong><span>${safeText(batch.factory)}</span></div></td>
        <td>${formatDate(batch.date)}</td>
        <td class="numeric number-cell">${formatKg(batch.inputKg)}</td>
        <td class="numeric">${percentFormat.format(Number(batch.moisture) || 0)}%</td>
        <td class="numeric">${formatKg(batch.pipeKg)}</td>
        <td class="numeric">${formatKg(batch.brokenKg)}</td>
        <td class="numeric">${formatKg(batch.powderKg)}</td>
        <td class="numeric total-cell">${formatKg(batch.outputKg)}</td>
        <td class="numeric loss-cell">${formatKg(batch.lossKg)} <span style="font-weight:500;color:#929087">(${formatRate(batch.lossRate)})</span></td>
        <td>${statusMarkup(batch)}</td>
      </tr>`).join('');

    $('#history-cards').innerHTML = sorted.map((batch) => `
      <article class="history-card">
        <div class="history-card-top">
          <div class="history-card-code"><strong>${safeText(batch.code)}</strong><span>${safeText(batch.factory)}</span></div>
          <div class="history-card-meta">Ngày nhập<br><strong>${formatDate(batch.date)}</strong></div>
        </div>
        <div class="history-card-stats">
          <div class="history-card-stat"><span>Nguyên liệu</span><strong>${formatKg(batch.inputKg)} kg</strong></div>
          <div class="history-card-stat"><span>Độ ẩm</span><strong>${percentFormat.format(Number(batch.moisture) || 0)}%</strong></div>
          <div class="history-card-stat emphasis"><span>Tổng thành phẩm</span><strong>${formatKg(batch.outputKg)} kg</strong></div>
          <div class="history-card-stat"><span>Quế ống điếu</span><strong>${formatKg(batch.pipeKg)} kg</strong></div>
          <div class="history-card-stat"><span>Quế vụn</span><strong>${formatKg(batch.brokenKg)} kg</strong></div>
          <div class="history-card-stat"><span>Bột quế</span><strong>${formatKg(batch.powderKg)} kg</strong></div>
        </div>
        <div class="history-card-bottom"><span>Hao hụt: <strong>${formatKg(batch.lossKg)} kg · ${formatRate(batch.lossRate)}</strong></span>${statusMarkup(batch)}</div>
      </article>`).join('');
  }

  function renderAll() {
    renderDashboard();
    renderHistory();
  }

  function updateCalculation() {
    const inputKg = Math.max(0, Number(fields.inputKg.value) || 0);
    const pipeKg = Math.max(0, Number(fields.pipeKg.value) || 0);
    const brokenKg = Math.max(0, Number(fields.brokenKg.value) || 0);
    const powderKg = Math.max(0, Number(fields.powderKg.value) || 0);
    const outputKg = round2(pipeKg + brokenKg + powderKg);
    const lossKg = round2(inputKg - outputKg);
    const lossRate = inputKg > 0 ? lossKg / inputKg * 100 : 0;

    $('#calc-output').innerHTML = `${formatKg(outputKg)} <small>kg</small>`;
    $('#calc-loss').innerHTML = `${lossKg < 0 ? '−' : ''}${formatKg(Math.abs(lossKg))} <small>kg</small>`;
    $('#calc-rate').textContent = formatRate(lossRate);
    $('#calc-warning').hidden = outputKg <= inputKg;
    $('#calc-loss').style.color = lossKg < 0 ? 'var(--danger)' : '';
    $('#calc-rate').style.color = lossRate > 15 ? 'var(--danger)' : '';
  }

  function showError(message) {
    const error = $('#form-error');
    error.textContent = message;
    error.hidden = false;
    error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    $('#form-error').hidden = true;
  }

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function clearForm() {
    form.reset();
    fields.date.value = localDateValue();
    fields.factory.value = 'Yên Bái';
    hideError();
    updateCalculation();
    fields.code.focus();
  }

  function localDateValue() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function handleSubmit(event) {
    event.preventDefault();
    hideError();

    for (const [key, input] of Object.entries(fields)) {
      if (input.value.trim() === '') {
        showError('Vui lòng điền đầy đủ các trường bắt buộc trước khi lưu lô.');
        input.focus();
        return;
      }
      if (input.type === 'number' && (!Number.isFinite(Number(input.value)) || Number(input.value) < 0)) {
        showError('Khối lượng và độ ẩm phải là giá trị số không âm.');
        input.focus();
        return;
      }
    }

    const code = fields.code.value.trim();
    const moisture = Number(fields.moisture.value);
    const inputKg = Number(fields.inputKg.value);
    const pipeKg = Number(fields.pipeKg.value);
    const brokenKg = Number(fields.brokenKg.value);
    const powderKg = Number(fields.powderKg.value);
    if (moisture > 100) {
      showError('Độ ẩm ban đầu cần nằm trong khoảng từ 0 đến 100%.');
      fields.moisture.focus();
      return;
    }
    if (batches.some((batch) => String(batch.code).toLocaleLowerCase('vi') === code.toLocaleLowerCase('vi'))) {
      showError('Mã lô này đã tồn tại. Vui lòng nhập một mã lô khác.');
      fields.code.focus();
      return;
    }

    const batch = calculate({
      code, factory: fields.factory.value, date: fields.date.value,
      inputKg: round2(inputKg), moisture: round2(moisture),
      pipeKg: round2(pipeKg), brokenKg: round2(brokenKg), powderKg: round2(powderKg),
      createdAt: new Date().toISOString()
    });
    if (batch.outputKg > batch.inputKg) {
      showError('Tổng thành phẩm đang vượt khối lượng nguyên liệu đầu vào. Vui lòng kiểm tra lại số liệu.');
      return;
    }

    const nextBatches = [batch, ...batches];
    if (!persist(nextBatches)) {
      showError('Không thể lưu vào bộ nhớ trình duyệt. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.');
      return;
    }
    batches = nextBatches;
    renderAll();
    clearForm();
    notify(`Đã lưu lô ${code} thành công.`);
  }

  function csvCell(value) {
    return `"${String(value ?? '').replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    if (!batches.length) {
      notify('Chưa có dữ liệu lô hàng để xuất.');
      return;
    }
    const headers = ['Mã lô', 'Nhà máy', 'Ngày nhập', 'Nguyên liệu đầu vào (kg)', 'Độ ẩm ban đầu (%)', 'Quế ống điếu (kg)', 'Quế vụn (kg)', 'Bột quế (kg)', 'Tổng thành phẩm (kg)', 'Hao hụt (kg)', 'Tỷ lệ hao hụt (%)', 'Trạng thái'];
    const rows = [...batches].sort((a, b) => String(b.date).localeCompare(String(a.date))).map((batch) => [
      batch.code, batch.factory, batch.date,
      batch.inputKg, batch.moisture, batch.pipeKg, batch.brokenKg, batch.powderKg,
      batch.outputKg, batch.lossKg, round2(batch.lossRate),
      Number(batch.lossRate) > 15 ? 'Cần kiểm tra' : 'Trong ngưỡng'
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `senspices-lich-su-lo-${localDateValue()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Đã tải file CSV tương thích Excel.');
  }

  form.addEventListener('submit', handleSubmit);
  form.addEventListener('input', (event) => {
    if (event.target.matches('input')) {
      hideError();
      updateCalculation();
    }
  });
  form.addEventListener('change', (event) => {
    if (event.target.matches('select, input')) hideError();
  });
  $('#export-button').addEventListener('click', exportCsv);

  $('#today-label').textContent = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  $('#footer-year').textContent = new Date().getFullYear();
  fields.date.value = localDateValue();
  renderAll();
  updateCalculation();
})();
