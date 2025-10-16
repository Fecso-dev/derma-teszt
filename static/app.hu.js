// Egyszerű kliens-oldali illesztés a magyar felülethez.
// Betölti a static/diagnoses.hu.json fájlt és kulcsszavak alapján egyeztet.

async function loadDiagnoses() {
  const res = await fetch('static/diagnoses.hu.json');
  if (!res.ok) throw new Error('diagnoses.hu.json betöltése sikertelen');
  return res.json();
}

function normalize(text) {
  return (text || '').toLowerCase();
}

function tokenize(text) {
  return normalize(text)
    .replace(/[,()\/]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function calculateScore(observationTokens, diagKeywords) {
  let matches = 0;
  for (const k of diagKeywords) {
    const nk = normalize(k);
    const joinedObservation = observationTokens.join(' ');
    if (joinedObservation.includes(nk)) {
      matches++;
      continue;
    }
    const kTokens = nk.split(' ');
    if (kTokens.every(t => observationTokens.includes(t))) {
      matches++;
    }
  }
  const score = diagKeywords.length > 0 ? matches / diagKeywords.length : 0;
  return { matches, total: diagKeywords.length, score };
}

function renderResults(matches, container) {
  const list = container.querySelector('#list');
  const noresults = container.querySelector('#noresults');
  list.innerHTML = '';
  if (matches.length === 0) {
    noresults.style.display = 'block';
    return;
  } else {
    noresults.style.display = 'none';
  }

  for (const m of matches) {
    const div = document.createElement('div');
    div.className = 'diagnosis';
    const conf = Math.round(m.score * 100);
    div.innerHTML = `
      <div>
        <span class="confidence">${conf}%</span>
        <strong>${m.title}</strong>
      </div>
      <div class="small" style="margin-top:6px;">
        ${m.description || ''} ${m.matchSummary ? `<div style="margin-top:6px;"><em>Megfelelt: ${m.matchSummary.join(', ')}</em></div>` : ''}
      </div>
    `;
    list.appendChild(div);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const observationEl = document.getElementById('observation');
  const analyzeBtn = document.getElementById('analyze');
  const clearBtn = document.getElementById('clear');
  const resultsCard = document.getElementById('results');

  let diagnoses = [];
  try {
    diagnoses = await loadDiagnoses();
  } catch (err) {
    console.error(err);
    alert('diagnoses.hu.json betöltése sikertelen. Nézd meg a konzolt a részletekért.');
    return;
  }

  analyzeBtn.addEventListener('click', () => {
    const text = observationEl.value.trim();
    if (!text) {
      alert('Kérlek írd be a megfigyelést.');
      return;
    }
    const obsTokens = tokenize(text);
    const scored = [];

    for (const d of diagnoses) {
      const { matches, total, score } = calculateScore(obsTokens, d.keywords || []);
      if (matches > 0) {
        const matchedKeywords = [];
        for (const k of d.keywords || []) {
          const lk = normalize(k);
          const joined = obsTokens.join(' ');
          if (joined.includes(lk) || lk.split(' ').every(t => obsTokens.includes(t))) matchedKeywords.push(k);
        }
        scored.push({
          title: d.title,
          description: d.description,
          score,
          matchSummary: matchedKeywords
        });
      }
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.matchSummary?.length || 0) - (a.matchSummary?.length || 0);
    });

    const top = scored.slice(0, 6);
    resultsCard.style.display = 'block';
    renderResults(top, resultsCard);
  });

  clearBtn.addEventListener('click', () => {
    observationEl.value = '';
    document.getElementById('list').innerHTML = '';
    document.getElementById('noresults').style.display = 'none';
    document.getElementById('results').style.display = 'none';
  });
});
