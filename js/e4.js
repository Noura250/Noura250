/* Cette page permet de travailler sur une copie personnelle du tableau.
   Les données du portfolio restent intactes : seul le navigateur conserve le brouillon. */
(() => {
  'use strict';
  const key = 'noura-e4-brouillon-v1';
  const status = document.getElementById('editorStatus');
  const initialRows = window.e4InitialRows;
  let rows = initialRows.map(row => [...row]);
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved) && saved.length === rows.length && saved.every(row => Array.isArray(row) && row.length === 8 && row.every(value => typeof value === 'string'))) {
      rows = saved;
      status.textContent = 'Ton brouillon a été retrouvé.';
    }
  } catch {
    status.textContent = 'La sauvegarde locale est indisponible. Pense à exporter tes modifications.';
  }

  const body = document.createElement('tbody');
  rows.forEach((row, rowIndex) => {
    const line = document.createElement('tr');
    row.forEach((value, columnIndex) => {
      const cell = document.createElement('td');
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('aria-label', `Ligne ${rowIndex + 1}, colonne ${columnIndex + 1}`);
      input.spellcheck = false;
      input.addEventListener('input', () => {
        rows[rowIndex][columnIndex] = input.value;
        try {
          localStorage.setItem(key, JSON.stringify(rows));
          status.textContent = 'Brouillon enregistré dans ce navigateur.';
        } catch {
          status.textContent = 'Sauvegarde impossible. Exporte le tableau pour garder tes changements.';
        }
      });
      cell.appendChild(input);
      line.appendChild(cell);
    });
    body.appendChild(line);
  });
  document.getElementById('e4Table').appendChild(body);

  // Les guillemets protègent les virgules et les retours à la ligne des cellules.
  // Le CSV exporté peut être ouvert dans Excel ; il contient la version modifiée.
  document.getElementById('exportTable').addEventListener('click', () => {
    const csv = rows.map(row => row.map(value => {
      const safe = /^[=+@-]/.test(value.trimStart()) ? "'" + value : value;
      return '"' + safe.replaceAll('"', '""') + '"';
    }).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Tableau de synthèse modifié.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Export préparé. Le fichier CSV peut être ouvert dans Excel.';
  });
})();
