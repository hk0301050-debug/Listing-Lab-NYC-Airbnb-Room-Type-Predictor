// NYC Airbnb dataset — neighbourhood_group -> neighbourhood list
// Matches the 218 neighbourhoods the trained OneHotEncoder was fit on.
const NEIGHBOURHOODS = {
  "Bronx": ["Allerton","Baychester","Belmont","Bronxdale","Castle Hill","City Island","Claremont Village","Clason Point","Co-op City","Concourse","Concourse Village","Country Club","Eastchester","Edenwald","Fieldston","Fordham","Highbridge","Hunts Point","Kingsbridge","Longwood","Melrose","Morris Heights","Morris Park","Morrisania","Mott Haven","Mount Eden","Mount Hope","North Riverdale","Norwood","Olinville","Parkchester","Pelham Bay","Pelham Gardens","Port Morris","Riverdale","Schuylerville","Soundview","South Bronx","Spuyten Duyvil","Throgs Neck","Unionport","University Heights","Van Nest","Wakefield","West Farms","Westchester Square","Williamsbridge","Woodlawn"],
  "Brooklyn": ["Bath Beach","Bay Ridge","Bedford-Stuyvesant","Bensonhurst","Bergen Beach","Boerum Hill","Borough Park","Brighton Beach","Brooklyn Heights","Brownsville","Bushwick","Canarsie","Carroll Gardens","City Line","Clinton Hill","Cobble Hill","Columbia St","Coney Island","Crown Heights","Cypress Hills","Downtown Brooklyn","DUMBO","Dyker Heights","East Flatbush","East New York","Erasmus","Flatbush","Flatlands","Fort Greene","Fort Hamilton","Gerritsen Beach","Gowanus","Gravesend","Greenpoint","Kensington","Manhattan Beach","Marine Park","Midwood","Mill Basin","Navy Yard","New York City","Windsor Terrace","North Side","Ocean Hill","Ocean Parkway","Park Slope","Prospect Heights","Prospect-Lefferts Gardens","Prospect Park South","Red Hook","Remsen Village","Rugby","Sea Gate","Sheepshead Bay","South Side","Spring Creek","Starrett City","Sunset Park","Vinegar Hill","Williamsburg"],
  "Manhattan": ["Battery Park City","Chelsea","Chinatown","Civic Center","East Harlem","East Village","Financial District","Flatiron District","Gramercy Park","Greenwich Village","Harlem","Hell's Kitchen","Inwood","Kips Bay","Little Italy","Lower East Side","Marble Hill","Midtown","Morningside Heights","Murray Hill","NoHo","Nolita","Roosevelt Island","SoHo","Stuyvesant Town","Theater District","Tribeca","Two Bridges","Upper East Side","Upper West Side","Washington Heights","West Village"],
  "Queens": ["Arverne","Astoria","Bay Terrace","Bayside","Bayswater","Belle Harbor","Bellerose","Breezy Point","Briarwood","Cambria Heights","College Point","Corona","Ditmars Steinway","Douglaston","East Elmhurst","Edgemere","Elmhurst","Far Rockaway","Flushing","Forest Hills","Fresh Meadows","Glendale","Hollis","Holliswood","Howard Beach","Jackson Heights","Jamaica","Jamaica Estates","Jamaica Hills","Kew Gardens","Kew Gardens Hills","Laurelton","Little Neck","Long Island City","Maspeth","Middle Village","Neponsit","Ozone Park","Queens Village","Rego Park","Richmond Hill","Ridgewood","Rockaway Beach","Rosedale","South Ozone Park","South Jamaica","Springfield Gardens","St. Albans","Sunnyside","Whitestone","Woodhaven","Woodside"],
  "Staten Island": ["Arden Heights","Arrochar","Bay Terrace, Staten Island","Bloomfield","Bull's Head","Castleton Corners","Clifton","Concord","Dongan Hills","Egbertville","Elm Park","Emerson Hill","Eltingville","Fort Wadsworth","Graniteville","Grant City","Grasmere","Great Kills","Grymes Hill","Howland Hook","Huguenot","Lighthouse Hill","Mariners Harbor","Midland Beach","New Brighton","New Dorp","New Dorp Beach","New Springville","Oakwood","Old Town","Port Richmond","Prince's Bay","Randall Manor","Richmondtown","Rosebank","Rossville","Shore Acres","Silver Lake","South Beach","St. George","Stapleton","Todt Hill","Tompkinsville","Tottenville","West Brighton","Westerleigh","Willowbrook","Woodrow"]
};

// ---------- Populate borough / neighbourhood dropdowns ----------
const groupSelect = document.getElementById('neighbourhood_group');
const neighSelect = document.getElementById('neighbourhood');

Object.keys(NEIGHBOURHOODS).forEach(g=>{
  const opt = document.createElement('option');
  opt.value = g; opt.textContent = g;
  groupSelect.appendChild(opt);
});

groupSelect.addEventListener('change', ()=>{
  const g = groupSelect.value;
  neighSelect.innerHTML = '';
  if(!g){
    neighSelect.disabled = true;
    const opt = document.createElement('option');
    opt.value=''; opt.textContent='Select borough first…';
    neighSelect.appendChild(opt);
    return;
  }
  neighSelect.disabled = false;
  const placeholder = document.createElement('option');
  placeholder.value=''; placeholder.textContent='Select neighbourhood…';
  neighSelect.appendChild(placeholder);
  NEIGHBOURHOODS[g].forEach(n=>{
    const opt = document.createElement('option');
    opt.value = n; opt.textContent = n;
    neighSelect.appendChild(opt);
  });
  clearFieldError('neighbourhood');
});

// ---------- Range <-> number sync ----------
function syncRange(rangeId, numId){
  const r = document.getElementById(rangeId);
  const n = document.getElementById(numId);
  r.addEventListener('input', ()=>{ n.value = r.value; clearFieldError(numId); });
  n.addEventListener('input', ()=>{
    let v = Number(n.value);
    const min = Number(r.min), max = Number(r.max);
    if(!isNaN(v)){
      if(v > max) v = max;
      if(v < min) v = min;
      r.value = v;
    }
    clearFieldError(numId);
  });
}
syncRange('minimum_nights_range','minimum_nights');
syncRange('availability_365_range','availability_365');

// ---------- Skyline window flicker ----------
(function initWindows(){
  const svg = document.querySelector('.skyline');
  const buildings = svg.querySelectorAll('.bldg');
  const group = document.getElementById('windows');
  buildings.forEach(b=>{
    const x = +b.getAttribute('x'), y = +b.getAttribute('y');
    const w = +b.getAttribute('width'), h = +b.getAttribute('height');
    const cols = Math.max(2, Math.floor(w/12));
    const rows = Math.max(3, Math.floor(h/16));
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        if(Math.random() < 0.4){
          const wx = x + 5 + c*(w-10)/cols;
          const wy = y + 10 + r*(h-20)/rows;
          const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
          rect.setAttribute('x', wx.toFixed(1));
          rect.setAttribute('y', wy.toFixed(1));
          rect.setAttribute('width', 4);
          rect.setAttribute('height', 6);
          rect.setAttribute('class', 'win on');
          rect.style.animationDelay = (Math.random()*4).toFixed(2)+'s';
          group.appendChild(rect);
        }
      }
    }
  });
})();

// ---------- Field validation ----------
const FIELDS = [
  {id:'latitude', type:'number', min:-90, max:90, required:true},
  {id:'longitude', type:'number', min:-180, max:180, required:true},
  {id:'price', type:'number', min:0.01, required:true},
  {id:'minimum_nights', type:'number', min:1, max:365, required:true},
  {id:'number_of_reviews', type:'number', min:0, required:true},
  {id:'reviews_per_month', type:'number', min:0, required:true},
  {id:'calculated_host_listings_count', type:'number', min:0, required:true},
  {id:'availability_365', type:'number', min:0, max:365, required:true},
  {id:'neighbourhood_group', type:'select', required:true},
  {id:'neighbourhood', type:'select', required:true},
];

function setFieldError(id, msg){
  const el = document.getElementById(id);
  const fieldDiv = el.closest('.field');
  fieldDiv.classList.add('invalid');
  fieldDiv.querySelector('.err').textContent = msg;
}
function clearFieldError(id){
  const el = document.getElementById(id);
  const fieldDiv = el.closest('.field');
  fieldDiv.classList.remove('invalid');
  fieldDiv.querySelector('.err').textContent = '';
}

function validateAll(){
  let ok = true;
  const values = {};
  FIELDS.forEach(f=>{
    clearFieldError(f.id);
    const el = document.getElementById(f.id);
    let raw = el.value;
    if(f.type === 'select'){
      if(!raw){ setFieldError(f.id, 'Required'); ok = false; return; }
      values[f.id] = raw;
      return;
    }
    if(raw === '' || raw === null){ setFieldError(f.id, 'Required'); ok = false; return; }
    const num = Number(raw);
    if(isNaN(num)){ setFieldError(f.id, 'Must be a number'); ok = false; return; }
    if(f.min !== undefined && num < f.min){ setFieldError(f.id, `Min ${f.min}`); ok = false; return; }
    if(f.max !== undefined && num > f.max){ setFieldError(f.id, `Max ${f.max}`); ok = false; return; }
    values[f.id] = num;
  });
  return {ok, values};
}

// ---------- Route animation ----------
const routePanel = document.getElementById('routePanel');
const routeFill = document.getElementById('routeFill');
const stops = document.querySelectorAll('.route-stop');

function resetRoute(){
  routeFill.style.width = '0%';
  stops.forEach(s=>s.classList.remove('done'));
}
function animateRoute(){
  return new Promise(resolve=>{
    resetRoute();
    routePanel.classList.add('active');
    let i = 0;
    const total = stops.length;
    const tick = ()=>{
      if(i < total){
        stops[i].classList.add('done');
        const pct = ((i+1)/total)*100;
        routeFill.style.width = pct + '%';
        i++;
        setTimeout(tick, 380);
      } else {
        setTimeout(resolve, 250);
      }
    };
    tick();
  });
}

// ---------- Predict ----------
const CLASS_COLORS = {
  'Entire home/apt': 'var(--navy)',
  'Private room': 'var(--brick)',
  'Shared room': 'var(--green)'
};

const predictBtn = document.getElementById('predictBtn');
const errorBanner = document.getElementById('errorBanner');
const ticket = document.getElementById('ticket');

function showError(html){
  errorBanner.innerHTML = html;
  errorBanner.classList.add('active');
}
function hideError(){
  errorBanner.classList.remove('active');
  errorBanner.innerHTML = '';
}

predictBtn.addEventListener('click', async ()=>{
  hideError();
  ticket.classList.remove('active');
  const {ok, values} = validateAll();
  if(!ok){
    showError('Fix the highlighted fields above before running a prediction.');
    return;
  }

  const payload = {
    latitude: values.latitude,
    longitude: values.longitude,
    price: values.price,
    minimum_nights: Math.round(values.minimum_nights),
    number_of_reviews: Math.round(values.number_of_reviews),
    reviews_per_month: values.reviews_per_month,
    calculated_host_listings_count: Math.round(values.calculated_host_listings_count),
    availability_365: Math.round(values.availability_365),
    neighbourhood_group: values.neighbourhood_group,
    neighbourhood: values.neighbourhood
  };

  const apiUrl = document.getElementById('apiUrl').value.trim();
  predictBtn.classList.add('loading');
  predictBtn.disabled = true;

  const routeDone = animateRoute();

  let apiResult = null, apiError = null;
  try{
    const res = await fetch(apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      const errBody = await res.text();
      throw new Error(`Server responded ${res.status}: ${errBody.slice(0,200)}`);
    }
    apiResult = await res.json();
  }catch(err){
    apiError = err;
  }

  await routeDone;
  predictBtn.classList.remove('loading');
  predictBtn.disabled = false;

  if(apiError){
    showError(
      `Couldn't reach the model server at <code>${apiUrl}</code>.<br>` +
      `${apiError.message}<br><br>` +
      `Make sure your FastAPI backend is running (<code>uvicorn main:app --reload</code>) and that CORS allows this page's origin.`
    );
    routePanel.classList.remove('active');
    return;
  }

  renderTicket(apiResult, payload);
});

function renderTicket(result, payload){
  const label = result['Predicted room type'];
  const probs = result['Probaility'] || result['Probability'] || [];
  const classNames = ['Entire home/apt','Private room','Shared room'];

  document.getElementById('stampText').textContent = label;
  document.getElementById('stampText').style.color = CLASS_COLORS[label] || 'var(--navy)';

  const probRows = document.getElementById('probRows');
  probRows.innerHTML = '';
  const maxIdx = probs.indexOf(Math.max(...probs));
  classNames.forEach((name, idx)=>{
    const p = probs[idx] !== undefined ? probs[idx] : 0;
    const pct = Math.round(p*100);
    const row = document.createElement('div');
    row.className = 'prob-row';
    row.innerHTML = `
      <span class="name">${name}</span>
      <div class="prob-bar-track"><div class="prob-bar-fill ${idx===maxIdx?'top':''}" style="width:0%"></div></div>
      <span class="prob-pct mono">${pct}%</span>
    `;
    probRows.appendChild(row);
    requestAnimationFrame(()=>{
      setTimeout(()=>{ row.querySelector('.prob-bar-fill').style.width = pct + '%'; }, 60);
    });
  });

  document.getElementById('sideBorough').textContent = payload.neighbourhood_group;
  document.getElementById('sidePrice').textContent = '$' + payload.price;
  document.getElementById('sideMinNights').textContent = payload.minimum_nights + ' nights';
  document.getElementById('sideAvail').textContent = payload.availability_365 + ' / 365 days';

  ticket.classList.add('active');
  ticket.scrollIntoView({behavior:'smooth', block:'nearest'});
}
