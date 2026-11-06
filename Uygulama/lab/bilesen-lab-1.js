// Bileşen laboratuvarı · ortak sabitler ve 3.1 Göstergeler
(function () {
const L = window.DCASE_LAB = window.DCASE_LAB || { bilesenler: [] };
const MOD = [['talep','Talep'],['olay','Olay'],['problem','Problem'],['degisiklik','Değişiklik']];
const ST = {
  talep: [['acik','Açık','#4c7bd9',0],['calisiliyor','Çalışılıyor','#e39b2c',0],['bekleniyor','Beklemede','#94a3b8',0],['cozuldu','Çözüldü','#00bc7d',0]],
  olay: [['acik','Açık','#4c7bd9',0],['atandi','Atandı','#4c7bd9',1],['calisiliyor','Çalışılıyor','#e39b2c',0],['beklemede','Beklemede','#94a3b8',0],['cozuldu','Çözüldü','#00bc7d',0],['kapali','Kapalı','#64748b',1]],
  problem: [['yeni','Yeni','#4c7bd9',0],['inceleniyor','Kök neden aranıyor','#e39b2c',0],['kokneden','Kök neden bulundu','#08748e',0],['bilinenhata','Bilinen hata','#64748b',0],['cozuldu','Çözüldü','#00bc7d',0],['kapali','Kapalı','#64748b',1]],
  degisiklik: [['taslak','Taslak','#94a3b8',1],['degerlendirme','Değerlendirme','#4c7bd9',0],['onay','Onay bekliyor','#e39b2c',0],['planlandi','Planlandı','#08748e',0],['uygulaniyor','Uygulanıyor','#00bc7d',0],['pir','Gözden geçirme','#64748b',0],['kapali','Kapalı','#64748b',1],['reddedildi','Reddedildi','#d23f43',1]]
};
const ACIK = { acik:'atanmayı bekliyor', atandi:'çalışma başlamadı', calisiliyor:'üzerinde çalışılıyor', beklemede:'SLA duraklatıldı', bekleniyor:'yanıt bekleniyor', cozuldu:'bildiren onayı bekleniyor', kapali:'sonuç kaydedildi', yeni:'analiz başlamadı', inceleniyor:'hipotezler test ediliyor', kokneden:'kalıcı çözüm bekleniyor', bilinenhata:'geçici çözüm yayında', taslak:'kayıt açıldı', degerlendirme:'risk ve pencere belirleniyor', onay:'onay yolu tamamlanmadı', planlandi:'onaylandı, pencere bekleniyor', uygulaniyor:'pencere açık, görevler işleniyor', pir:'gözden geçirme yazılıyor', reddedildi:'geri alma süresi pencereyi aşıyor' };
const PRI = [['P1','Kritik','#d23f43'],['P2','Yüksek','#b16a08'],['P3','Orta','#334155'],['P4','Düşük','#64748b'],['P5','Çok Düşük','#94a3b8']];
const KISI = ['Gökhan Tuna','Deniz Acar','Elif Kaya','Ayşe Kaya','Selin Acar'];
const HEDEF = { P1:[240,15], P2:[480,30], P3:[960,120], P4:[2880,240], P5:[2880,240] };
const IK = {
  ac:'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  duzenle:'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  siren:'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  bag:'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  arti:'M12 5v14M5 12h14', kapat:'M18 6 6 18M6 6l12 12',
  kopya:'M8 8h12v12H8zM4 16V4h12',
  birlestir:'M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  mail:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  uyari:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4M12 16h.01',
  bocek:'M8 2l1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6M12 20v-9',
  dosya:'M18 5l-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506zM8 18h1',
  kitap:'M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  kalkan:'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'
};
const pri = k => PRI.find(p => p[0] === k) || PRI[1];
const st = (m, k) => ST[m].find(s => s[0] === k) || ST[m][0];
const pad = n => String(n).padStart(2, '0');
const sure = m => { m = Math.max(0, Math.round(Math.abs(m))); return m >= 1440 ? Math.floor(m / 1440) + 'g ' + pad(Math.floor(m % 1440 / 60)) + 's' : pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
const ye = n => { const v = [...n].reverse().find(c => 'aeıioöuü'.includes(c.toLocaleLowerCase('tr'))) || 'a'; return n + "'" + (/[aeıioöuü]$/i.test(n) ? 'y' : '') + ('aıou'.includes(v.toLocaleLowerCase('tr')) ? 'a' : 'e'); };
const stMenu = (m, secili) => ({ ogeler: ST[m].map(s => ({ k: s[0], e: s[1], nokta: s[2], bos: !!s[3] })), secili });
const priMenu = (secili, n) => ({ ogeler: PRI.slice(0, n || 4).map(p => ({ k: p[0], e: p[1], kod: p[0], kodRenk: p[2] })), secili });
function sla(o) {
  const H = HEDEF[o.oncelik] || HEDEF.P2, hedef = H[0];
  const kalan = o.kalan != null ? o.kalan : Math.round(hedef - hedef * o.gecen / 100);
  const gecen = o.kalan != null ? (hedef - o.kalan) / hedef * 100 : o.gecen;
  const r = { cubukVar:false, dol:'0%', cubuk:'#94a3b8', renk:'#334155', ana:'', alt:'', altRenk:'#64748b', risk:false, hedefMetin: sure(hedef) + ' çözüm · ' + sure(H[1]) + ' yanıt', gecenMetin: sure(hedef - kalan) };
  if (o.durum === 'bekle') { r.ana = 'Duraklatıldı'; r.renk = '#64748b'; r.alt = o.neden || 'Bildiren yanıtı'; return r; }
  if (o.durum === 'tutuldu') { r.ana = 'Tutuldu ✓'; r.renk = '#007a55'; r.alt = 'zamanında'; return r; }
  if (o.durum === 'ihlal') { r.ana = 'İhlal · 10:33'; r.renk = '#d23f43'; r.alt = 'kapanışta donduruldu'; return r; }
  const kr = kalan < 60, uy = kalan < 240;
  r.ana = kalan <= 0 ? 'İhlal · ' + sure(-kalan) : sure(kalan);
  r.renk = kr ? '#d23f43' : uy ? '#b16a08' : '#334155';
  r.cubuk = kr ? '#d23f43' : uy ? '#e39b2c' : '#94a3b8';
  r.cubukVar = true; r.dol = Math.max(4, Math.min(100, gecen)) + '%';
  if (o.yanit === 'kaldi') { r.alt = 'Yanıt: 00:20 kaldı'; r.altRenk = '#b16a08'; }
  else if (o.yanit === 'ihlal') { r.alt = 'Yanıt ihlali · ' + sure(o.yanitDk || 12); r.altRenk = '#d23f43'; }
  else r.alt = 'Yanıt tutuldu ✓';
  r.risk = kr || o.yanit === 'ihlal';
  return r;
}
const oran = (a, b) => { const l = h => { const c = [1,3,5].map(i => parseInt(h.substr(i,2),16)/255).map(x => x <= .04045 ? x/12.92 : Math.pow((x+.055)/1.055, 2.4)); return .2126*c[0] + .7152*c[1] + .0722*c[2]; }; const A = l(a), B = l(b); return (Math.max(A,B)+.05)/(Math.min(A,B)+.05); };
Object.assign(L, { MOD, ST, ACIK, PRI, KISI, HEDEF, IK, pri, st, sure, ye, stMenu, priMenu, sla, oran,
  gruplar: [{ id:'g', ad:'3.1 Göstergeler' }, { id:'e', ad:'3.2 Eylemler' }, { id:'l', ad:'3.3 Liste bileşenleri' }, { id:'d', ad:'3.4 Detay bileşenleri' }, { id:'k', ad:'2.4 Kabuk' }] });
const nok = x => ({ e: x[1], renk: x[2], dolgu: x[3] ? '#fff' : x[2] });

L.bilesenler.push({
  id:'durum', no:'3.1.1', ad:'Durum rozeti', grup:'g', dok:'b-durum', vmin:240,
  kontroller: [
    { k:'modul', e:'Modül', t:'sec', o:MOD },
    { k:'durum', e:'Durum', t:'sec', o: d => ST[d.modul].map(s => [s[0], s[1]]) },
    { k:'baglam', e:'Bağlam', t:'sec', o:[['liste','Liste hücresi'],['ozet','Özet şeridi'],['menu','Menü'],['filtre','Filtre listesi']] },
    { k:'neden', e:'Bekleme nedeni', t:'sec', o:[['Bildiren yanıtı'],['Tedarikçi'],['Kargo / kurye']], kosul: d => st(d.modul, d.durum)[2] === '#94a3b8' && !st(d.modul, d.durum)[3] },
    { k:'duz', e:'Yerinde düzenlenebilir', t:'acik', kosul: d => d.baglam === 'liste' }
  ],
  varsayilan: { modul:'olay', durum:'beklemede', baglam:'liste', neden:'Bildiren yanıtı', duz:true },
  duzelt: d => { d.durum = st(d.modul, d.durum)[0]; },
  varyantlar: [ { e:'Talep', d:{ modul:'talep', baglam:'tum' } }, { e:'Olay', d:{ modul:'olay', baglam:'tum' } }, { e:'Problem', d:{ modul:'problem', baglam:'tum' } }, { e:'Değişiklik', d:{ modul:'degisiklik', baglam:'tum' } }, { e:'Özet şeridi', d:{ modul:'problem', durum:'inceleniyor', baglam:'ozet' } }, { e:'Menü', d:{ durum:'calisiliyor', baglam:'menu' } }, { e:'Filtre listesi', d:{ durum:'acik', baglam:'filtre' } } ],
  vm(d, a) {
    const Ls = ST[d.modul], s = st(d.modul, d.durum), gri = s[2] === '#94a3b8' && !s[3], duz = d.duz !== false && d.baglam === 'liste';
    return { ...nok(s), liste: d.baglam === 'liste', ozet: d.baglam === 'ozet', kutulu: d.baglam === 'menu' || d.baglam === 'filtre', filtre: d.baglam === 'filtre', tum: d.baglam === 'tum',
      nedenVar: gri, neden: d.neden, aciklama: ACIK[s[0]] || '', chev: duz, imlec: duz ? 'pointer' : 'default', hov: duz ? '#e2e8f0' : 'transparent',
      kutuBaslik: d.baglam === 'filtre' ? 'Durum' : 'INC548 · Durum',
      hepsi: Ls.map(x => ({ ...nok(x), subVar: x[0] === 'beklemede' || x[0] === 'bekleniyor', sub: 'Bildiren yanıtı' })),
      ogeler: Ls.map(x => { const on = x[0] === s[0]; return { ...nok(x), tik: on && d.baglam === 'menu', kBd: on ? '#007a55' : '#cbd5e1', kBg: on ? '#007a55' : '#fff', kIs: on ? '✓' : '' }; }),
      ac: duz ? ev => a.menu(ev, { baslik:'INC548 · Durum', ...stMenu(d.modul, s[0]), sec: k => { const y = st(d.modul, k); if (y[0] === s[0]) return; a.set('durum', k); const m = 'INC548 · Durum: ' + s[1] + ' → ' + y[1] + (gri || y[2] !== '#94a3b8' ? '' : ' (' + d.neden + ')'); a.log(m); a.toast(m, () => a.set('durum', s[0])); } }) : () => {} };
  },
  kullan: ['Kaydın yaşam döngüsündeki yerini liste, özet şeridi, menü ve filtrede aynı biçimde göstermek için.', 'Aynı rengi paylaşan iki durumu içi boş noktayla ayırmak için (Atandı, Taslak, Kapalı, Reddedildi).', 'Beklemedeki kayıtta bekleme nedenini alt satırda vermek için.'],
  kullanma: ['Kayıt türünü ("Problem") ya da başka modülün genel sözcüğünü durum adı olarak yazmak için.', 'Rengi tek başına bilgi olarak kullanmak için; nokta her zaman durum adıyla gelir.', 'Kurala takılan bir geçişi sessizce kaydetmek için; geçiş kaydedilmez, nedeni bildirimle yazılır.'],
  kontrast: [['#020618','#ffffff','Durum adı 13 px',4.5],['#64748b','#ffffff','Bekleme nedeni 11 px',4.5],['#94a3b8','#ffffff','Gri nokta',null],['#e39b2c','#ffffff','Amber nokta',null],['#00bc7d','#ffffff','Yeşil nokta',null]],
  klavye: [['Tab','Düzenlenebilir hücrede tetikleyiciye odaklanır'],['Enter · Boşluk','Seçenek menüsünü açar'],['↑ ↓','Menüde seçenekler arasında gezer'],['Esc','Menüyü kapatır, değer değişmez']]
});

L.bilesenler.push({
  id:'oncelik', no:'3.1.2', ad:'Öncelik', grup:'g', dok:'b-oncelik', vmin:260,
  kontroller: [
    { k:'seviye', e:'Seviye', t:'sec', o: PRI.map(p => [p[0], p[0] + ' ' + p[1]]) },
    { k:'gosterim', e:'Bağlam', t:'sec', o:[['hucre','Liste hücresi'],['ozet','Özet şeridi'],['kod','Yalnız kod']] },
    { k:'duz', e:'Yerinde düzenlenebilir', t:'acik', kosul: d => d.gosterim !== 'kod' }
  ],
  varsayilan: { seviye:'P2', gosterim:'hucre', duz:true },
  varyantlar: [ { e:'Beş seviye · liste', d:{ gosterim:'tum' } }, { e:'Özet şeridi', d:{ seviye:'P1', gosterim:'ozet' } }, { e:'Yalnız kod', d:{ gosterim:'tumkod' } } ],
  vm(d, a) {
    const p = pri(d.seviye), duz = d.duz !== false && (d.gosterim === 'hucre' || d.gosterim === 'ozet');
    return { kod:p[0], ad:p[1], renk:p[2], hucre: d.gosterim === 'hucre', ozet: d.gosterim === 'ozet', kodTek: d.gosterim === 'kod', tum: d.gosterim === 'tum', tumKod: d.gosterim === 'tumkod',
      chev: duz, imlec: duz ? 'pointer' : 'default', hov: duz ? '#e2e8f0' : 'transparent', kaynak:'Etki Bölüm × Aciliyet Orta',
      hepsi: PRI.map(x => ({ kod:x[0], ad:x[1], renk:x[2] })),
      ac: duz ? ev => a.menu(ev, { baslik:'INC538 · Öncelik', ...priMenu(p[0], 5), sec: k => { if (k === p[0]) return; a.set('seviye', k); const m = 'INC538 · Öncelik: ' + p[0] + ' → ' + k; a.log(m); a.toast(m, () => a.set('seviye', p[0])); } }) : () => {} };
  },
  kullan: ['İşin sırasını listede, özet şeridinde ve menüde göstermek için.', 'Olay ve problemde etki × aciliyet matrisinin sonucunu göstermek için (3.4.7).', 'Talepte önceliği doğrudan seçtirmek için.'],
  kullanma: ['Olay ve problemde önceliği elle seçtirmek için; kullanıcı etki ve aciliyeti seçer.', 'Kodu rozet içine almak için; kod renkli ve kalın metindir.', 'Adı kodsuz yazmak için.'],
  kontrast: [['#d23f43','#ffffff','P1 kod 13/600',4.5],['#b16a08','#ffffff','P2 kod 13/600',4.5],['#334155','#ffffff','P3 kod',4.5],['#64748b','#ffffff','P4 kod · ad 12 px',4.5],['#94a3b8','#ffffff','P5 kod',4.5]],
  klavye: [['Tab','Tetikleyiciye odaklanır'],['Enter · Boşluk','Seviye menüsünü açar'],['↑ ↓ · Enter','Seviyeyi seçer; anında kaydedilir'],['Esc','Menüyü kapatır']]
});

const ETK = {
  tur: { s:['12px',600,'2px 8px','999px','normal'], o:[['standart','Standart','#ecfdf5','#006045'],['normal','Normal','#f1f5f9','#334155'],['acil','Acil','#fbe9ea','#b3282d']] },
  risk: { s:['13px',600,'0','0','normal'], o:[['dusuk','Düşük','transparent','#64748b','tek CI, mesai dışı, denenmiş adım'],['orta','Orta','transparent','#b16a08','birden çok hizmet ya da kesinti riski'],['yuksek','Yüksek','transparent','#d23f43','kritik hizmet, geri dönüşü zor adım']] },
  sayi: { s:['11px',600,'1px 7px','999px','normal'], o:[['aktif','Aktif sekme','#007a55','#fff'],['notr','Nötr','#f1f5f9','#334155'],['dikkat','Dikkat · atanmamış','#fdf1e0','#9a5b0a'],['kritik','Kritik · büyük olay','#fbe9ea','#b3282d']] },
  bilgi: { s:['10px',700,'3px 7px','4px','.06em'], o:[['buyuk','BÜYÜK OLAY','#d23f43','#fff'],['oto','OTOMATİK','#f1f5f9','#64748b'],['ai','AI','#fff','#007a55','model önerisi','1px solid #007a55']] },
  kart: { s:['11px',600,'2px 8px','999px','normal'], o:[['hazir','Hazır','#ecfdf5','#006045'],['eksik','Eksik','#fdf1e0','#9a5b0a'],['durak','Duraklatıldı','#f1f5f9','#64748b']] }
};
L.ETK = ETK;
L.bilesenler.push({
  id:'etiket', no:'3.1.3', ad:'Etiketler ve rozetler', grup:'g', dok:'b-etiket', vmin:240,
  kontroller: [
    { k:'tur', e:'Tür', t:'sec', o:[['tur','Değişiklik türü'],['risk','Risk'],['sayi','Sayı'],['bilgi','Bilgi rozeti'],['kart','Kart durumu']] },
    { k:'deger', e:'Değer', t:'sec', o: d => ETK[d.tur].o.map(o => [o[0], o[1]]) },
    { k:'sayi', e:'Sayı', t:'aralik', min:0, max:99, kosul: d => d.tur === 'sayi', ipucu:'Dikkat ve kritik renk yalnızca sayı sıfırdan büyükken.' }
  ],
  varsayilan: { tur:'sayi', deger:'dikkat', sayi:3 },
  duzelt: d => { if (!ETK[d.tur].o.some(o => o[0] === d.deger)) d.deger = ETK[d.tur].o[0][0]; },
  varyantlar: [ { e:'Değişiklik türü', d:{ tur:'tur', hepsi:1 } }, { e:'Risk', d:{ tur:'risk', hepsi:1 } }, { e:'Sayı', d:{ tur:'sayi', hepsi:1 } }, { e:'Bilgi rozeti', d:{ tur:'bilgi', hepsi:1 } }, { e:'Kart durumu', d:{ tur:'kart', hepsi:1 } } ],
  vm(d) {
    const T = ETK[d.tur], s = T.s, sec = T.o.find(o => o[0] === d.deger) || T.o[0];
    const ogeler = (d.hepsi ? T.o : [sec]).map(o => { let bg = o[2], fg = o[3], metin = o[1];
      if (d.tur === 'sayi') { const n = d.hepsi ? ({ aktif:16, notr:7, dikkat:3, kritik:2 })[o[0]] : d.sayi; metin = String(n); if ((o[0] === 'dikkat' || o[0] === 'kritik') && n === 0) { bg = '#f1f5f9'; fg = '#334155'; } }
      return { metin, fs:s[0], fw:s[1], pad:s[2], r:s[3], ls:s[4], bg, fg, bd: o[5] || '0', title: o[4] || o[1] }; });
    return { ogeler, notVar: d.tur === 'risk' && !d.hepsi, not: sec[4] || '' };
  },
  kullan: ['Kaydın sınıfını göstermek için: değişiklik türü, risk.', 'Sekmenin iş yükünü sayıyla vermek için.', 'İçeriğin niteliğini işaretlemek için: büyük olay, sistemin doldurduğu bölüm, AI önerisi.'],
  kullanma: ['Tıklanan bir eylem olarak; rozet tıklanmaz.', 'Riski rozet içinde göstermek için; risk renkli metindir.', 'Sıfır sayıyı renkli göstermek için.'],
  kontrast: [['#006045','#ecfdf5','Standart · Hazır',4.5],['#b3282d','#fbe9ea','Acil · kritik sayı',4.5],['#9a5b0a','#fdf1e0','Dikkat sayı · Eksik',4.5],['#ffffff','#007a55','Aktif sekme sayısı',4.5],['#ffffff','#d23f43','BÜYÜK OLAY',4.5],['#64748b','#f1f5f9','OTOMATİK',4.5],['#b16a08','#ffffff','Orta risk metni',4.5]],
  klavye: [['—','Rozet odak almaz ve tıklanmaz; bilgi metin olarak okunur. Yalnızca renkle ayrılan sayıya ekran okuyucu metni eklenir ("3 atanmamış").']]
});

L.bilesenler.push({
  id:'sla', no:'3.1.4', ad:'SLA hücresi', grup:'g', dok:'b-sla', vmin:320,
  kontroller: [
    { k:'oncelik', e:'Öncelik (hedef)', t:'sec', o: PRI.slice(0,4).map(p => [p[0], p[0] + ' · ' + sure(HEDEF[p[0]][0])]) },
    { k:'durum', e:'Kayıt', t:'sec', o:[['isliyor','İşliyor'],['bekle','Beklemede'],['tutuldu','Kapandı · tutuldu'],['ihlal','Kapandı · ihlal']] },
    { k:'gecen', e:'Geçen süre', t:'aralik', min:0, max:130, birim:'%', kosul: d => d.durum === 'isliyor' },
    { k:'yanit', e:'Yanıt SLA\'sı', t:'sec', o:[['tutuldu','Tutuldu'],['kaldi','Süre işliyor'],['ihlal','İhlal']], kosul: d => d.durum === 'isliyor' },
    { k:'neden', e:'Bekleme nedeni', t:'sec', o:[['Bildiren yanıtı'],['Tedarikçi'],['Kargo / kurye']], kosul: d => d.durum === 'bekle' },
    { k:'sayac', e:'Sayaç işlesin (1 sn = 1 dk)', t:'acik', kosul: d => d.durum === 'isliyor' }
  ],
  varsayilan: { oncelik:'P2', durum:'isliyor', gecen:70, yanit:'tutuldu', neden:'Kargo / kurye', sayac:false },
  tick: d => d.durum === 'isliyor' && d.sayac && d.gecen < 130 ? { gecen: Math.min(130, d.gecen + 100 / HEDEF[d.oncelik][0]) } : null,
  varyantlar: [ { e:'Nötr · 4 saatten çok', d:{ oncelik:'P4', gecen:40 } }, { e:'Uyarı · 1–4 saat', d:{ gecen:70, yanit:'kaldi' } }, { e:'Kritik · 1 saatten az', d:{ oncelik:'P1', gecen:92, yanit:'ihlal' } }, { e:'İhlal', d:{ gecen:107 } }, { e:'Bir günden uzun', d:{ oncelik:'P4', gecen:30 } }, { e:'Beklemede', d:{ durum:'bekle' } }, { e:'Kapandı · tutuldu', d:{ durum:'tutuldu' } }, { e:'Kapandı · ihlal', d:{ durum:'ihlal' } } ],
  vm(d) { return { ...sla(d), onc: d.oncelik + ' · ' + pri(d.oncelik)[1] }; },
  kullan: ['Kalan çözüm süresini ve yanıt SLA\'sını tek hücrede vermek için.', 'SLA riski filtresinin ve varsayılan sıralamanın kaynağı olarak.', 'Kapanan kayıtta donmuş sonucu (tutuldu / ihlal) göstermek için.'],
  kullanma: ['Kapalı ya da beklemedeki kayıtta işleyen sayaç göstermek için.', 'Eşik türünü renklendirmek için; renk kalan payı anlatır.', 'Yanıt ve çözüm SLA\'sını iki ayrı sütuna bölmek için.'],
  kontrast: [['#334155','#ffffff','Nötr kalan süre',4.5],['#b16a08','#ffffff','Uyarı 13/600',4.5],['#d23f43','#ffffff','Kritik ve ihlal',4.5],['#64748b','#ffffff','Alt satır 11 px',4.5],['#007a55','#ffffff','Tutuldu ✓',4.5]],
  klavye: [['—','Hücre salt okunur, odak almaz. Ekran okuyucu tam metni okur: "Kalan çözüm süresi 02:30, yanıt tutuldu".']]
});

const KT = { 'REQ-282':['Talep','Yeni çalışan için dizüstü bilgisayar','Çözüldü · Son kullanıcı donanımı'], 'INC546':['Olay','E-posta hizmeti erişilemiyor','Çalışılıyor · büyük olay'], 'PRB-031':['Problem','SAP ERP yavaşlığı, bellek eşiği aşıldı','Kök neden bulundu · 4 bağlı olay'], 'CHG-118':['Değişiklik','SAP ERP uygulama sunucusu bellek ayarı','Onay bekliyor · kaynak PRB-031'] };
L.bilesenler.push({
  id:'kimlik', no:'3.1.5', ad:'Kayıt kimliği ve bağlantılar', grup:'g', dok:'b-kimlik', vmin:300,
  kontroller: [
    { k:'baglam', e:'Bağlam', t:'sec', o:[['hucre','Liste hücresi'],['baslik','Detay başlığı'],['bag','Satır altı bağ'],['iliskili','İlişkili kayıt satırı']] },
    { k:'tur', e:'Kayıt', t:'sec', o: Object.keys(KT).map(k => [k, KT[k][0] + ' · ' + k.slice(0,3)]), kosul: d => d.baglam !== 'bag' },
    { k:'bag', e:'Bağlar', t:'sec', o:[['buyuk','Büyük olay'],['problem','Problem'],['ikisi','İkisi']], kosul: d => d.baglam === 'bag' }
  ],
  varsayilan: { baglam:'bag', tur:'INC546', bag:'ikisi' },
  varyantlar: [ { e:'Liste hücresi', d:{ baglam:'hucre' } }, { e:'Detay başlığı', d:{ baglam:'baslik', tur:'CHG-118' } }, { e:'Satır altı · büyük olay', d:{ bag:'buyuk' } }, { e:'Satır altı · problem', d:{ bag:'problem' } }, { e:'İlişkili kayıt satırı', d:{ baglam:'iliskili', tur:'PRB-031' } } ],
  vm(d, a) {
    const id = d.tur, K = KT[id] || KT.INC546, git = k => ev => { if (ev && ev.preventDefault) ev.preventDefault(); a.log(k + ' detayına gider · ?id=' + k); };
    const buyuk = d.bag === 'buyuk' || d.bag === 'ikisi', prob = d.bag === 'problem' || d.bag === 'ikisi';
    return { id, git: git(id), gitBuyuk: git('INC546'), gitPrb: git('PRB-031'), gitSatir: git('INC548'), hucre: d.baglam === 'hucre', baslik: d.baglam === 'baslik', bag: d.baglam === 'bag', iliskili: d.baglam === 'iliskili',
      buyuk, prob, ayrac: buyuk && prob, kTur: K[0], kBaslik: K[1], kMeta: K[2] };
  },
  kullan: ['Kaydı her yerde kimliğiyle anmak ve kimliği detaya bağlamak için.', 'Bağlı kayıtları (büyük olay, problem, kaynak) satırın altında ya da kimlik başlığında göstermek için.', 'İlişkili sekmesinde kayıtları gruplar halinde listelemek için.'],
  kullanma: ['Kimliği düz metin olarak yazmak için; kimlik her zaman bağlantıdır.', 'Önek ve numara arasındaki tireyi modüle göre değiştirmek için (açık konu, Bölüm 10).', 'Bağı yalnızca renkle anlatmak için; "↳" ve önek birlikte okunur.'],
  kontrast: [['#007a55','#ffffff','Kimlik 12/600 mono',4.5],['#006045','#ffffff','Kimlik hover',4.5],['#b3282d','#ffffff','Büyük olay bağı 11 px',4.5],['#64748b','#ffffff','Meta 12 px',4.5]],
  klavye: [['Tab','Kimlik bağlantısına odaklanır'],['Enter','Kaydın detayını açar (?id=)'],['Ctrl / ⌘ + Enter','Yeni sekmede açar']]
});
})();
