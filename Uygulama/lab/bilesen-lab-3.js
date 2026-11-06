// Bileşen laboratuvarı · 3.3 Liste bileşenleri
(function () {
const L = window.DCASE_LAB, { ST, MOD, PRI, KISI, IK, st, pri, ye, stMenu, priMenu, sla, MENU } = L;

const TABS = {
  talep: [['uzerimdeki','Üzerimdeki',4],['ekibimin','Ekibimin',7],['atanmamis','Atanmamış','A'],['takip','Takip ettiğim',2],['onayimi','Onayımı bekleyen',1]],
  olay: [['tumu','Tümü',16],['uzerimdeki','Üzerimdeki',4],['ekibimin','Ekibimin',7],['atanmamis','Atanmamış','A'],['buyuk','Büyük olaylar','B'],['sorun','Sorundan etkilenen',4]],
  problem: [['tumu','Tümü',12],['uzerimdeki','Üzerimdeki',3],['arastirma','Kök neden aranıyor',5],['bilinen','Bilinen hatalar',4],['hedef','Hedefi geçen',2],['kapali','Kapalı',31]],
  degisiklik: [['tumu','Tümü',9],['uzerimdeki','Üzerimdeki',4],['onayimi','Onayımı bekleyen',2],['hafta','Bu hafta planlı',3],['acil','Acil',1],['kapali','Kapalı',48]]
};
const LISTE = { talep:'Talep Listesi', olay:'Olay Listesi', problem:'Problem Listesi', degisiklik:'Değişiklik Listesi' };
L.bilesenler.push({
  id:'sekme', no:'3.3.1', ad:'Kuyruk sekmeleri', grup:'l', dok:'b-sekme', vmin:520,
  kontroller: [
    { k:'modul', e:'Modül', t:'sec', o:MOD },
    { k:'aktif', e:'Aktif sekme', t:'sec', o: d => TABS[d.modul].map(t => [t[0], t[1]]) },
    { k:'atanmamis', e:'Atanmamış sayısı', t:'aralik', min:0, max:9, kosul: d => d.modul === 'talep' || d.modul === 'olay' },
    { k:'buyuk', e:'Büyük olay sayısı', t:'aralik', min:0, max:5, kosul: d => d.modul === 'olay' }
  ],
  varsayilan: { modul:'olay', aktif:'tumu', atanmamis:3, buyuk:3 },
  duzelt: d => { if (!TABS[d.modul].some(t => t[0] === d.aktif)) d.aktif = TABS[d.modul][0][0]; },
  varyantlar: [ { e:'Talep', d:{ modul:'talep' } }, { e:'Olay', d:{} }, { e:'Problem', d:{ modul:'problem' } }, { e:'Değişiklik', d:{ modul:'degisiklik', aktif:'onayimi' } }, { e:'Olay · sayılar sıfır', d:{ atanmamis:0, buyuk:0, aktif:'atanmamis' } } ],
  vm(d, a) {
    const T = TABS[d.modul], ak = T.find(t => t[0] === d.aktif) || T[0];
    const sekmeler = T.map(t => { const n = t[2] === 'A' ? d.atanmamis : t[2] === 'B' ? d.buyuk : t[2], on = t === ak;
      let sBg = '#f1f5f9', sFg = '#334155';
      if (on) { sBg = '#007a55'; sFg = '#fff'; } else if (t[2] === 'A' && n > 0) { sBg = '#fdf1e0'; sFg = '#9a5b0a'; } else if (t[2] === 'B' && n > 0) { sBg = '#fbe9ea'; sFg = '#b3282d'; }
      return { e:t[1], n:String(n), secili:String(on), ti: on ? 0 : -1, cizgi: on ? '#007a55' : 'transparent', fw: on ? 600 : 500, fg: on ? '#020618' : '#64748b', sBg, sFg, sec: () => { if (!on) { a.set('aktif', t[0]); a.log('Sekme: ' + t[1]); } } }; });
    const tus = ev => { const i = T.indexOf(ak); let j = -1; if (ev.key === 'ArrowRight') j = (i + 1) % T.length; else if (ev.key === 'ArrowLeft') j = (i - 1 + T.length) % T.length; else if (ev.key === 'Home') j = 0; else if (ev.key === 'End') j = T.length - 1; if (j < 0) return; ev.preventDefault(); const tl = ev.currentTarget; a.set('aktif', T[j][0]); a.log('Sekme: ' + T[j][1]); setTimeout(() => { const b = tl.querySelectorAll('[role=tab]')[j]; if (b) b.focus(); }, 30); };
    return { sekmeler, tus, baslik: ak[0] === 'tumu' ? LISTE[d.modul] : LISTE[d.modul] + ' · ' + ak[1] };
  },
  kullan: ['Kuyruğu sahipliğe ve duruma göre bölen hazır görünümler için.', 'Sekmeye girmeden iş yükünü sayıyla vermek için.', 'Sol menüdeki kısayolları (?queue=) doğrudan sekmeye indirmek için.'],
  kullanma: ['Filtrenin yerine; daraltma filtre çubuğunun işi.', 'Altıdan çok sekme için; az kullanılan görünüm Görünümü kaydet ile saklanır.', 'Sıfır sayıyı renklendirmek için.'],
  kontrast: [['#020618','#f8fafc','Aktif sekme 13/600',4.5],['#64748b','#f8fafc','Pasif sekme 13/500',4.5],['#007a55','#f8fafc','Aktif alt çizgi',3],['#9a5b0a','#fdf1e0','Atanmamış sayısı',4.5],['#b3282d','#fbe9ea','Büyük olay sayısı',4.5]],
  klavye: [['Tab','Sekme listesine girer; yalnız aktif sekme odak alır'],['← →','Önceki / sonraki sekme'],['Home · End','İlk / son sekme']]
});

const HIZ = [['eposta','E-posta (Exchange)'],['sap','SAP ERP'],['ag','Ağ'],['guvenlik','Güvenlik']];
const ALAN = [['durum','Durum', ST.olay.map(s => ({ k:s[0], e:s[1], nokta:s[2], bos:!!s[3] }))], ['oncelik','Öncelik', PRI.slice(0,4).map(p => ({ k:p[0], e:p[1], kod:p[0], kodRenk:p[2] }))], ['hizmet','Hizmet', HIZ.map(h => ({ k:h[0], e:h[1] }))]];
L.bilesenler.push({
  id:'filtre', no:'3.3.2', ad:'Filtre çubuğu', grup:'l', dok:'b-filtre', vmin:560,
  kontroller: [
    { k:'ara', e:'Arama', t:'metin' },
    { k:'durum', e:'Durum', t:'coklu', o: ST.olay.map(s => [s[0], s[1]]) },
    { k:'oncelik', e:'Öncelik', t:'coklu', o: PRI.slice(0,4).map(p => [p[0], p[0]]) },
    { k:'slaSayi', e:'SLA riski sayısı', t:'aralik', min:0, max:9 },
    { k:'sla', e:'SLA riski filtresi etkin', t:'acik' }
  ],
  varsayilan: { ara:'', durum:[], oncelik:['P1','P2'], hizmet:[], slaSayi:3, sla:false },
  varyantlar: [ { e:'Boş', d:{ oncelik:[], slaSayi:0 } }, { e:'Dolu filtre', d:{} }, { e:'Üç seçim · kısalır', d:{ durum:['acik','atandi','calisiliyor'] } }, { e:'SLA riski var', d:{ oncelik:[] } }, { e:'SLA riski etkin', d:{ oncelik:[], sla:true } } ],
  vm(d, a) {
    const cipler = ALAN.map(([k, e, ops]) => { const s = d[k] || [], ad = s.map(x => { const o = ops.find(o => o.k === x); return o ? (o.kod || o.e) : x; }), dolu = s.length > 0;
      return { e: dolu ? e + ' · ' + ad.slice(0,2).join(', ') + (ad.length > 2 ? ' +' + (ad.length - 2) : '') : e, bd: dolu ? '1px solid #007a55' : '1px dashed #cbd5e1', bg: dolu ? '#ecfdf5' : '#fff', fg: dolu ? '#006045' : '#334155', ik: dolu ? '#007a55' : '#94a3b8',
        ac: ev => a.menu(ev, { baslik: e, coklu:1, genislik:210, ogeler: ops, secili: s.slice(), alt:'Filtreyi temizle', sec: v => { a.set(k, v); a.log('Filtre · ' + e + ': ' + (v.length ? v.length + ' seçim' : 'temizlendi')); } }) }; });
    const n = d.slaSayi, et = !!d.sla, dolu = ALAN.some(([k]) => (d[k] || []).length) || !!d.ara || et;
    return { cipler, ara: d.ara || '', araDegis: ev => a.set('ara', ev.target.value),
      slaE: 'SLA riski · ' + n, slaBasili: String(et), slaBd: et ? '1px solid #d23f43' : n > 0 ? '1px solid #f3c1c3' : '1px solid #e2e8f0', slaBg: et ? '#d23f43' : n > 0 ? '#fbe9ea' : '#fff', slaFg: et ? '#fff' : n > 0 ? '#b3282d' : '#334155',
      slaTikla: () => { a.set('sla', !et); a.log('SLA riski filtresi ' + (et ? 'kapatıldı' : 'açıldı')); },
      temizleVar: dolu, temizle: () => { a.setMany({ durum:[], oncelik:[], hizmet:[], ara:'', sla:false }); a.log('Filtreler temizlendi'); },
      yenile: () => { a.log('Liste yenilendi'); a.toast('Liste yenilendi'); } };
  },
  kullan: ['Sekmenin içinde arama ve filtreleme için; sekme, arama ve filtreler VE ile birleşir.', 'Hangi filtrelerin açık olduğunu listeye bakmadan okutmak için (dolu çip seçimi yazar).', 'SLA riskini tek tıkla açılıp kapanan ayrı bir çiple sunmak için.'],
  kullanma: ['Sahiplik ayrımı için; o kuyruk sekmelerinin işi.', 'Dolu çipte üçten çok seçimi tam yazmak için; ilk ikisi yazılır, gerisi "+N".', 'Boş filtreyi dolu gibi renklendirmek için; boş çip kesikli bir davettir.'],
  kontrast: [['#334155','#ffffff','Boş çip etiketi',4.5],['#006045','#ecfdf5','Dolu çip',4.5],['#b3282d','#fbe9ea','SLA riski var',4.5],['#ffffff','#d23f43','SLA riski etkin',4.5],['#64748b','#f8fafc','Son güncelleme 12 px',4.5],['#94a3b8','#ffffff','Arama ikonu',null]],
  klavye: [['Tab','Arama → çipler → SLA riski → Filtreleri temizle'],['Enter · Boşluk','Çipin listesini açar; SLA riskini açar / kapar'],['↑ ↓ · Enter','Listede gezer, seçeneği işaretler; liste açık kalır'],['Esc','Listeyi kapatır']]
});

const SATIR = [
  { id:'INC546', ozet:'E-posta hizmeti erişilemiyor', alt:'İzleme (Zabbix) · Kesinti', buyuk:1, p:'P1', st:'calisiliyor', k:19, y:'ihlal', yd:12, at:'Gökhan Tuna' },
  { id:'INC538', ozet:'Kart okuyucu turnikeler yanıt vermiyor', alt:'Güvenlik · Kesinti', p:'P2', st:'acik', k:44, y:'ihlal', yd:5, at:'' },
  { id:'INC548', ozet:'SAP oturum açma 30 saniyenin üzerinde', alt:'Ayşe Kaya · Yavaşlık', bag:'PRB-031', p:'P2', st:'calisiliyor', k:65, y:'tutuldu', at:'Deniz Acar' },
  { id:'INC541', ozet:'E-posta gönderimi gecikiyor', alt:'Pelin Er · Kesinti', bagB:'INC546', p:'P3', st:'beklemede', k:300, y:'tutuldu', at:'Elif Kaya', neden:'Bildiren yanıtı' },
  { id:'INC530', ozet:'VPN istemcisi güncellemeden sonra kopuyor', alt:'Murat Demir · Bozulma', p:'P4', st:'cozuldu', k:900, y:'tutuldu', at:'Selin Acar' }
];
const kisiMenu = (baslik, secili, kaldir) => ({ baslik, genislik:220, ogeler: KISI.map(k => ({ k, e:k })).concat(kaldir ? [{ k:'', e:'Atamayı kaldır', ayirici:1 }] : []), secili });
L.kisiMenu = kisiMenu;
L.bilesenler.push({
  id:'tablo', no:'3.3.3', ad:'Tablo ve hücre içi düzenleme', grup:'l', dok:'b-tablo', vmin:680,
  kontroller: [
    { k:'siralama', e:'Sıralama', t:'sec', o:[['sla','Kalan SLA ↑'],['slaAz','Kalan SLA ↓'],['oncelik','Öncelik ↑']] },
    { k:'secim', e:'Seçim sütunu', t:'acik' },
    { k:'atanSutun', e:'Atanan sütunu', t:'acik', ipucu:'Üzerimdeki sekmesinde Atanan sütunu düşer.' },
    { k:'bos', e:'Boş sonuç', t:'acik' }
  ],
  varsayilan: { siralama:'sla', secim:true, atanSutun:true, bos:false, rows:null, secili:[], hover:'' },
  varyantlar: [ { e:'Varsayılan', d:{} }, { e:'İki satır seçili · toplu eylem çubuğu', d:{ secili:['INC546','INC548'] } }, { e:'Boş sonuç', d:{ bos:true } } ],
  vm(d, a) {
    const R = d.rows || SATIR, secili = d.secili || [], sir = d.siralama || 'sla';
    const sinif = r => r.st === 'beklemede' ? 1 : (r.st === 'cozuldu' || r.st === 'kapali') ? 2 : 0;
    const rows = d.bos ? [] : R.slice().sort((x, y) => sir === 'oncelik' ? x.p.localeCompare(y.p) : sinif(x) - sinif(y) || (sir === 'slaAz' ? y.k - x.k : x.k - y.k));
    const guncelle = (id, yama, m) => { a.set('rows', R.map(r => r.id === id ? { ...r, ...yama } : r)); a.log(m); a.toast(m, () => a.set('rows', R)); };
    const satirlar = rows.map(r => { const s = st('olay', r.st), p = pri(r.p), sc = secili.includes(r.id), hv = d.hover === r.id;
      const S = r.st === 'beklemede' ? sla({ durum:'bekle', neden:r.neden }) : (r.st === 'cozuldu' || r.st === 'kapali') ? sla({ durum:'tutuldu' }) : sla({ oncelik:r.p, kalan:r.k, yanit:r.y, yanitDk:r.yd });
      return { id:r.id, ozet:r.ozet, alt:r.alt, buyuk:!!r.buyuk, bagVar:!!(r.bag || r.bagB), bag:(r.bagB ? '↳ ' : '') + (r.bag || r.bagB || ''), bagRenk: r.bagB ? '#b3282d' : '#007a55',
        pKod:p[0], pAd:p[1], pRenk:p[2], sAd:s[1], sRenk:s[2], sDolgu: s[3] ? '#fff' : s[2], sNedenVar: r.st === 'beklemede', sNeden: r.neden || '',
        slaAna:S.ana, slaRenk:S.renk, slaCubukVar:S.cubukVar, slaDol:S.dol, slaCubuk:S.cubuk, slaAlt:S.alt, slaAltRenk:S.altRenk,
        at: r.at || 'Atanmamış', atRenk: r.at ? '#020618' : '#9a5b0a', trBg: sc ? '#ecfdf5' : '#fff', trHbg: sc ? '#ecfdf5' : '#f8fafc', chev: hv ? '1' : '0',
        kBd: sc ? '#007a55' : '#cbd5e1', kBg: sc ? '#007a55' : '#fff', kIs: sc ? '✓' : '', kEtiket: r.id + ' seç', kSecili: String(sc),
        gir: () => { if (d.hover !== r.id) a.set('hover', r.id); }, cik: () => a.set('hover', ''),
        tikla: () => a.log(r.id + ' detayı açılır'),
        kutu: ev => { ev.stopPropagation(); a.set('secili', sc ? secili.filter(x => x !== r.id) : secili.concat(r.id)); },
        pAc: ev => { ev.stopPropagation(); a.menu(ev, { baslik: r.id + ' · Öncelik', ...priMenu(r.p), sec: k => { if (k !== r.p) guncelle(r.id, { p:k }, r.id + ' · Öncelik: ' + r.p + ' → ' + k); } }); },
        sAc: ev => { ev.stopPropagation(); a.menu(ev, { baslik: r.id + ' · Durum', ...stMenu('olay', r.st), sec: k => { if (k === r.st) return; const y = st('olay', k); guncelle(r.id, { st:k, neden: k === 'beklemede' ? 'Bildiren yanıtı' : r.neden }, r.id + ' · Durum: ' + s[1] + ' → ' + y[1] + (k === 'beklemede' ? ' (Bildiren yanıtı)' : '')); } }); },
        aAc: ev => { ev.stopPropagation(); a.menu(ev, { ...kisiMenu(r.id + ' · Atanan', r.at, true), sec: k => { if (k === r.at) return; const yama = { at:k }; let ek = ''; if (k && r.st === 'acik') { yama.st = 'atandi'; ek = ' · Durum: Açık → Atandı'; } if (!k && r.st === 'atandi') { yama.st = 'acik'; ek = ' · Durum: Atandı → Açık'; } guncelle(r.id, yama, r.id + ' · Atanan: ' + (r.at || 'Atanmamış') + ' → ' + (k || 'Atanmamış') + ek); } }); },
        menuAc: ev => { ev.stopPropagation(); a.menu(ev, { baslik: r.id + ' · ' + r.ozet, hiza:'sag', genislik:244, ogeler: MENU.satir.ogeler, sec: k => a.log(r.id + ' · ' + MENU.satir.ogeler.find(o => o.k === k).e) }); } }; });
    const gor = rows.map(r => r.id), n = gor.filter(x => secili.includes(x)).length, hepsi = n > 0 && n === gor.length;
    const toplu = (yamaF, m) => () => { a.setMany({ rows: R.map(r => secili.includes(r.id) && r.st !== 'kapali' ? { ...r, ...yamaF(r) } : r), secili:[] }); a.log(m); a.toast(m, () => a.setMany({ rows:R, secili })); };
    return { satirlar, bos: !rows.length, dolu: rows.length > 0, secimVar: d.secim !== false, atanVar: d.atanSutun !== false,
      hBd: n ? '#007a55' : '#cbd5e1', hBg: n ? '#007a55' : '#fff', hIs: hepsi ? '✓' : n ? '–' : '', tumunu: () => a.set('secili', n ? [] : gor),
      slaRenk: sir !== 'oncelik' ? '#007a55' : '#64748b', slaOk: sir === 'sla' ? ' ↑' : sir === 'slaAz' ? ' ↓' : '', pRenkB: sir === 'oncelik' ? '#007a55' : '#64748b', pOk: sir === 'oncelik' ? ' ↑' : '',
      slaSirala: () => { const y = sir === 'sla' ? 'slaAz' : 'sla'; a.set('siralama', y); a.log('Sıralama: Kalan SLA ' + (y === 'sla' ? '↑' : '↓')); },
      pSirala: () => { a.set('siralama', 'oncelik'); a.log('Sıralama: Öncelik ↑'); },
      cubukVar: n > 0, cubukMetin: String(n), 
      ata: ev => a.menu(ev, { ...kisiMenu(n + ' olay · Ata', null, false), sec: k => toplu(r => ({ at:k, st: r.st === 'acik' ? 'atandi' : r.st }), n + ' olay ' + ye(k) + ' atandı')() }),
      calis: toplu(() => ({ st:'calisiliyor' }), n + ' olay · Durum: Çalışılıyor'),
      prb: () => { a.set('secili', []); a.log(n + ' olay PRB-031\'e bağlandı'); a.toast(n + ' olay PRB-031\'e bağlandı'); },
      buyukBag: () => { a.set('secili', []); a.log(n + ' olay INC546 büyük olayına bağlandı'); a.toast(n + ' olay INC546 büyük olayına bağlandı'); },
      kapat: toplu(() => ({ st:'kapali' }), n + ' olay kapatıldı'),
      kaldir: () => { a.set('secili', []); a.log('Seçim kaldırıldı'); },
      temizle: () => { a.set('bos', false); a.log('Filtreler temizlendi'); },
      altBilgi: rows.length ? '1–' + rows.length + ' / ' + rows.length + ' · sayfa başına 25' : '0 sonuç' };
  },
  kullan: ['Kuyruğu tam genişlikte, satırı detaya bağlı göstermek için.', 'Durum, öncelik ve atananı satırdan çıkmadan değiştirmek için; seçim anında kaydedilir, bildirim Geri al sunar.', 'Satır seçimiyle toplu eylem çubuğunu açmak için.'],
  kullanma: ['Detay bilgisini yan panelde açmak için; detay ekranına bırakılır.', 'Birden çok alan isteyen işlemi hücrede yapmak için; çekmece kullanılır.', 'No, Özet, Durum ve Kalan SLA sütunlarını gizlemek için.'],
  kontrast: [['#64748b','#f8fafc','Sütun başlığı 12/600',4.5],['#007a55','#f8fafc','Aktif sıralama başlığı',4.5],['#020618','#ecfdf5','Seçili satır metni',4.5],['#9a5b0a','#ffffff','Atanmamış',4.5],['#64748b','#ffffff','Özet alt satırı 12 px',4.5]],
  klavye: [['Tab','Satır içinde onay kutusu → kimlik → hücre tetikleyicileri → ⋯'],['Enter · Boşluk','Hücre menüsünü açar; seçim anında kaydedilir'],['Boşluk','Onay kutusunda satırı seçer'],['Esc','Açık menüyü kapatır']]
});

const TOPLU = { olay:['Ata','Çalışılıyor yap','Probleme bağla','Büyük olaya bağla','Kapat'], problem:['Ata','Bilinen hata ilan et','Birleştir','Kapat'] };
L.bilesenler.push({
  id:'cubuk', no:'3.3.4', ad:'Koyu eylem çubuğu', grup:'l', dok:'b-cubuk', vmin:520,
  kontroller: [
    { k:'mod', e:'Mod', t:'sec', o:[['toplu','Toplu eylem · liste'],['duzen','Düzenleme · detay']] },
    { k:'modul', e:'Modül', t:'sec', o:[['olay','Olay'],['problem','Problem']], kosul: d => d.mod === 'toplu' },
    { k:'sayi', e:'Seçili satır', t:'aralik', min:0, max:12, kosul: d => d.mod === 'toplu' },
    { k:'alan', e:'Değişen alan', t:'aralik', min:0, max:4, kosul: d => d.mod === 'duzen' }
  ],
  varsayilan: { mod:'toplu', modul:'olay', sayi:3, alan:2 },
  varyantlar: [ { e:'Toplu eylem · olay', d:{} }, { e:'Toplu eylem · problem', d:{ modul:'problem', sayi:2 } }, { e:'Düzenleme · detay', d:{ mod:'duzen' } } ],
  vm(d, a) {
    const n = d.sayi, noun = d.modul === 'problem' ? 'problem' : 'olay';
    const satirlar = [0,1,2,3].map(i => { const sc = i < n; return { kBd: sc ? '#007a55' : '#cbd5e1', kBg: sc ? '#007a55' : '#fff', kIs: sc ? '✓' : '', bg: sc ? '#ecfdf5' : '#fff', w: [62,48,55,40][i] + '%', tikla: () => a.set('sayi', sc ? i : i + 1) }; });
    const eylemler = TOPLU[d.modul].map(e => ({ e, tikla: ev => { if (e === 'Ata') { a.menu(ev, { ...kisiMenu(n + ' ' + noun + ' · Ata', null, false), sec: k => { const m = n + ' ' + noun + ' ' + ye(k) + ' atandı'; a.set('sayi', 0); a.log(m); a.toast(m, () => a.set('sayi', n)); } }); return; } const m = n + ' ' + noun + ' · ' + e; a.set('sayi', 0); a.log(m); a.toast(m, () => a.set('sayi', n)); } }));
    return { toplu: d.mod !== 'duzen', duzen: d.mod === 'duzen', cubukVar: n > 0, ipucuVar: n === 0, metin: String(n), noun: noun + ' seçildi', eylemler, satirlar,
      kaldir: () => { a.set('sayi', 0); a.log('Seçim kaldırıldı'); },
      alanMetin: d.alan > 0 ? d.alan + ' alan değişti · ' + ['Kategori','Açıklama','Etkilenen hizmet','Öncelik'].slice(0, d.alan).join(', ') : 'Henüz değişiklik yok',
      vazgec: () => { a.set('alan', 0); a.log('Düzenlemeden vazgeçildi'); a.toast('INC546 · değişiklikler atıldı'); },
      kaydet: () => { if (!d.alan) { a.log('Kaydedilecek değişiklik yok'); return; } const m = 'INC546 · ' + d.alan + ' alan kaydedildi'; a.set('alan', 0); a.log(m); a.toast(m, () => a.set('alan', d.alan)); } };
  },
  kullan: ['Geçici bir modun eylemlerini toplamak için: listede satır seçimi, detayda düzenleme.', 'Toplu eylemi tablonun hemen üstünde, en az bir satır seçiliyken göstermek için.', 'Düzenlemede değişen alan sayısını ve adlarını Kaydet\'in yanında söylemek için.'],
  kullanma: ['Sayfanın kalıcı araç çubuğu olarak; koyu zemin geçici moddur.', 'Kapalı kayıtların durumunu toplu değiştirmek için; bu kayıtlar etkilenmez.', 'Her eylem için ayrı bildirim üretmek için; toplu işlem tek bildirimle biter.'],
  kontrast: [['#ffffff','#020618','Çubuk metni 13 px',4.5],['#cbd5e1','#020618','Seçimi kaldır',4.5],['#ffffff','#007a55','Kaydet',4.5]],
  klavye: [['Tab','Çubuktaki eylemlere sırayla gider'],['Enter · Boşluk','Eylemi çalıştırır; seçim temizlenir'],['Esc','Seçimi kaldırır (öneri)']]
});

const BM = { geri:['INC548 · Durum: Çalışılıyor → Beklemede (Bildiren yanıtı)',1], bilgi:['Liste yenilendi',0], toplu:['3 olay Deniz Acar\'a atandı',1] };
L.bilesenler.push({
  id:'bildirim', no:'3.3.5', ad:'Bildirim ve geri al', grup:'l', dok:'b-bildirim', vmin:440, minH:'200px',
  kontroller: [
    { k:'tur', e:'Tür', t:'sec', o:[['geri','Geri alınabilir'],['bilgi','Bilgi'],['toplu','Toplu işlem']] },
    { k:'metin', e:'Metin', t:'metin', ipucu:'"Kimlik · Alan: eski → yeni". Boş bırakılırsa örnek metin.' },
    { k:'kalici', e:'Kalıcı göster (zamanlayıcı yok)', t:'acik' }
  ],
  varsayilan: { tur:'geri', metin:'', kalici:false, gorunur:false, geriAlindi:false },
  varyantlar: [ { e:'Geri alınabilir · 6,5 sn', d:{ kalici:true } }, { e:'Bilgi · 3,2 sn', d:{ tur:'bilgi', kalici:true } }, { e:'Toplu işlem', d:{ tur:'toplu', kalici:true } }, { e:'Geri alındı', d:{ kalici:true, geriAlindi:true } } ],
  vm(d, a) {
    const t = BM[d.tur] || BM.geri, geriVar = !d.geriAlindi && !!t[1], ms = geriVar ? 6500 : 3200;
    const metin = d.geriAlindi ? (d.tur === 'toplu' ? '3 olay · değişiklik geri alındı' : 'INC548 · değişiklik geri alındı') : (d.metin || t[0]);
    return { gorunur: !!(d.kalici || d.gorunur), metin, geriVar, sureMetin: d.kalici ? 'Kalıcı gösteriliyor' : (geriVar ? '6,5' : '3,2') + ' sn sonra kapanır',
      goster: () => { a.setMany({ gorunur:true, geriAlindi:false }); a.log('Bildirim: ' + (d.metin || t[0])); if (!d.kalici) a.after(ms, () => a.set('gorunur', false), 'bildirim'); },
      geriAl: () => { a.setMany({ geriAlindi:true, gorunur:true }); a.log('Geri al tıklandı'); if (!d.kalici) a.after(3200, () => a.setMany({ gorunur:false, geriAlindi:false }), 'bildirim'); } };
  },
  kullan: ['Yapılan işlemin sonucunu söylemek ve geri alınabiliyorsa Geri al sunmak için.', 'Anında kaydedilen hücre içi değişikliklerin güvenlik ağı olarak.', 'Toplu işlemi tek bildirimle özetlemek için.'],
  kullanma: ['Süren bir durumu anlatmak için (büyük olay, uygulama sürüyor); o bağlam şeridinin işi.', 'Aynı anda iki bildirim göstermek için; yenisi eskisinin yerini alır.', 'Kullanıcıdan karar istemek için.'],
  kontrast: [['#ffffff','#020618','Bildirim metni 13 px',4.5],['#00bc7d','#202434','Geri al · rgba(255,255,255,.12) zemin',4.5]],
  klavye: [['—','role="status" ile duyurulur; odak çalmaz'],['Tab','Geri al düğmesine ulaşılır'],['Enter','Geri alır; "geri alındı" bildirimi gelir']]
});
})();
