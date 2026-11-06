// Bileşen laboratuvarı · 3.2 Eylemler
(function () {
const L = window.DCASE_LAB, { ST, MOD, IK, st, ye } = L;
const nok = x => ({ e: x[1], renk: x[2], dolgu: x[3] ? '#fff' : x[2] });

const DG = { birincil:['#007a55','#fff','0','#006045',600], ikincil:['#fff','#020618','1px solid #e2e8f0','#f8fafc',500], yikici:['#fff','#b3282d','1px solid #f3b4b6','#fef4f4',500], uyari:['#b16a08','#fff','0','#9a5b0a',600], kritik:['#d23f43','#fff','0','#b3282d',600], koyu:['transparent','#fff','1px solid rgba(255,255,255,.3)','rgba(255,255,255,.08)',500], ikon:['transparent','#007a55','0','transparent',500] };
const DGAD = { birincil:'birincil', ikincil:'ikincil', yikici:'yıkıcı ikincil', uyari:'uyarı birincil', kritik:'kritik birincil', koyu:'koyu zemin', ikon:'ikon · metin' };
L.bilesenler.push({
  id:'dugme', no:'3.2.1', ad:'Düğmeler', grup:'e', dok:'b-dugme', vmin:200,
  kontroller: [
    { k:'tur', e:'Tür', t:'sec', o: Object.keys(DGAD).map(k => [k, DGAD[k][0].toLocaleUpperCase('tr') + DGAD[k].slice(1)]) },
    { k:'boyut', e:'Yükseklik', t:'sec', o:[['34','34 · detay'],['32','32 · araç çubuğu'],['28','28 · satır']] },
    { k:'etiket', e:'Etiket', t:'metin', ipucu:'Etiket fiille başlar: "Transfer et", "Probleme bağla".' },
    { k:'ikon', e:'Önde ikon', t:'acik' }
  ],
  varsayilan: { tur:'birincil', boyut:'34', etiket:'Onaya gönder', ikon:false },
  varyantlar: [ { e:'Birincil · araç çubuğu', d:{ boyut:'32', etiket:'Yeni olay', ikon:true } }, { e:'Birincil · detay', d:{} }, { e:'İkincil', d:{ tur:'ikincil', boyut:'32', etiket:'Görünümü kaydet' } }, { e:'Yıkıcı ikincil', d:{ tur:'yikici', etiket:'Geri al (rollback)' } }, { e:'Uyarı birincil', d:{ tur:'uyari', etiket:'Dondurma istisnası iste' } }, { e:'Kritik birincil', d:{ tur:'kritik', boyut:'28', etiket:'Büyük olayı aç' } }, { e:'Koyu zemin', d:{ tur:'koyu', boyut:'28', etiket:'Ata' } }, { e:'İkon · metin', d:{ tur:'ikon', boyut:'32', etiket:'Filtreleri temizle', ikon:true } } ],
  vm(d, a) {
    const t = DG[d.tur] || DG.birincil, h = +d.boyut, e = d.etiket || 'Düğme';
    return { bg:t[0], fg:t[1], bd:t[2], hbg:t[3], hfg: d.tur === 'ikon' ? '#006045' : t[1], fw:t[4], h: h + 'px', fs: h === 28 ? '12px' : '13px', pad: '0 ' + (d.tur === 'ikon' ? 4 : h === 34 ? 14 : h === 32 ? 12 : 10) + 'px',
      zemin: d.tur === 'koyu' ? '#020618' : 'transparent', zpad: d.tur === 'koyu' ? '10px 12px' : '0', odak: d.tur === 'koyu' ? '#00bc7d' : '#007a55', etiket: e, ikon: !!d.ikon, ikonD: d.tur === 'ikon' ? IK.kapat : IK.arti,
      tikla: () => a.log('"' + e + '" tıklandı · ' + DGAD[d.tur]) };
  },
  kullan: ['Ekrandaki en olası sonraki adım için görünümde tek birincil.', 'Alternatifler için ikincil, geri dönüşü zor işlemler için yıkıcı ikincil.', 'Uyarı birincili kurala karşı ilerleyen adımda (dondurma istisnası), kritik birincili büyük olay şeridinde.'],
  kullanma: ['Pasif (disabled) düğme göstermek için; eksik koşul varsa birincil o koşulu tamamlatan eyleme dönüşür.', 'Aynı görünümde ikinci bir birincil için.', 'Yalnızca ikonlu düğmeyi aria-label olmadan kullanmak için.'],
  kontrast: [['#ffffff','#007a55','Birincil',4.5],['#ffffff','#006045','Birincil hover',4.5],['#b3282d','#ffffff','Yıkıcı ikincil',4.5],['#ffffff','#b16a08','Uyarı birincil',4.5],['#ffffff','#9a5b0a','Uyarı birincil · önerilen',4.5],['#ffffff','#d23f43','Kritik birincil',4.5],['#007a55','#ffffff','İkon · metin',4.5]],
  klavye: [['Tab','Düğmeye odaklanır; odak halkası 2 px birincil'],['Enter · Boşluk','Eylemi çalıştırır'],['—','Yalnızca ikonlu düğmede aria-label zorunlu']]
});

const ZN = {
  talep: { acik:{ b:['Üstlen','calisiliyor'] }, calisiliyor:{ i:['Beklemeye al','bekleniyor'], b:['Çöz…','cozuldu'] }, bekleniyor:{ b:['Çalışmaya dön','calisiliyor'] }, cozuldu:{ b:['Yeniden aç','calisiliyor',1] } },
  olay: { acik:{ b:['Üstlen','atandi'] }, atandi:{ b:['Çalışmaya başla','calisiliyor'] }, calisiliyor:{ i:['Beklemeye al','beklemede'], b:['Çöz…','cozuldu'] }, beklemede:{ b:['Çalışmaya dön','calisiliyor'] }, cozuldu:{ i:['Yeniden aç','calisiliyor'], b:['Kapat','kapali'] }, kapali:{ b:['Yeniden aç','calisiliyor',1] } },
  problem: { yeni:{ b:['Analize başla','inceleniyor'] }, inceleniyor:{ b:['Kök nedeni kaydet…','kokneden'] }, kokneden:{ i:['Değişiklik aç',null], b:['Bilinen hata ilan et','bilinenhata'] }, bilinenhata:{ b:['Çözüldü olarak işaretle','cozuldu'] }, cozuldu:{ b:['Kapat','kapali'] }, kapali:{ b:['Yeniden aç','inceleniyor',1] } }
};
const ZD = { taslak:'Değerlendirmeyi başlat', degerlendirme:'Riski değerlendir → Pencere seç → Onaya gönder', onay:'Reddet · Onayla · CAB (sıra bendeyse)', planlandi:'Pencereyi değiştir · Uygulamaya başla · dondurmada Dondurma istisnası iste', uygulaniyor:'Geri al (rollback) · Uygulamayı tamamla (görevler bitince)', pir:'Gözden geçirmeyi kaydet → Kapat · Başarılı', kapali:'—', reddedildi:'Düzenle ve yeniden gönder' };
const KIM = { talep:['REQ-282','Yeni çalışan için dizüstü bilgisayar'], olay:['INC546','E-posta hizmeti erişilemiyor'], problem:['PRB-031','SAP ERP yavaşlığı, bellek eşiği aşıldı'], degisiklik:['CHG-118','SAP ERP uygulama sunucusu bellek ayarı'] };
const DIGER = [{ k:'kopya', e:'Bağlantıyı kopyala', ikon:IK.kopya }, { k:'bagla', e:'Olay bağla', ikon:IK.bag }, { k:'birlestir', e:'Birleştir…', ikon:IK.birlestir, ayirici:1, yikici:1 }];
L.KIM = KIM;
L.bilesenler.push({
  id:'zincir', no:'3.2.2', ad:'Eylem zinciri', grup:'e', dok:'b-zincir', vmin:480,
  kontroller: [
    { k:'modul', e:'Modül', t:'sec', o:MOD },
    { k:'durum', e:'Durum', t:'sec', o: d => ST[d.modul].map(s => [s[0], s[1]]) },
    { k:'risk', e:'Risk değerlendirildi', t:'acik', kosul: d => d.modul === 'degisiklik' && d.durum === 'degerlendirme' },
    { k:'pencere', e:'Pencere seçildi', t:'acik', kosul: d => d.modul === 'degisiklik' && d.durum === 'degerlendirme' },
    { k:'cab', e:'Onay sırası bende (CAB)', t:'acik', kosul: d => d.modul === 'degisiklik' && d.durum === 'onay' },
    { k:'dondurma', e:'Pencere dondurma döneminde', t:'acik', kosul: d => d.modul === 'degisiklik' && d.durum === 'planlandi' },
    { k:'gorev', e:'Görevler bitti', t:'acik', kosul: d => d.modul === 'degisiklik' && d.durum === 'uygulaniyor' },
    { k:'pir', e:'Gözden geçirme yazıldı', t:'acik', kosul: d => d.modul === 'degisiklik' && d.durum === 'pir' }
  ],
  varsayilan: { modul:'degisiklik', durum:'degerlendirme', risk:false, pencere:false, cab:true, dondurma:false, gorev:false, pir:false },
  duzelt: d => { d.durum = st(d.modul, d.durum)[0]; },
  varyantlar: [ { e:'Değerlendirme · risk eksik', d:{} }, { e:'Değerlendirme · hazır', d:{ risk:true, pencere:true } }, { e:'Onay bekliyor · sıra bende', d:{ durum:'onay' } }, { e:'Planlandı · dondurma', d:{ durum:'planlandi', dondurma:true } }, { e:'Uygulanıyor · görevler sürüyor', d:{ durum:'uygulaniyor' } }, { e:'Olay · çalışılıyor', d:{ modul:'olay', durum:'calisiliyor' } }, { e:'Problem · kök neden aranıyor', d:{ modul:'problem', durum:'inceleniyor' } } ],
  vm(d, a) {
    const m = d.modul, s = st(m, d.durum), K = KIM[m][0];
    let bi = null, ik = null, not = '';
    const gec = (to, et) => () => { const y = st(m, to); a.set('durum', to); const t = K + ' · Durum: ' + s[1] + ' → ' + y[1]; a.log(et + ' · ' + t); a.toast(t, () => a.set('durum', s[0])); };
    const bay = (k, msg) => () => { a.set(k, true); a.log(K + ' · ' + msg); a.toast(K + ' · ' + msg, () => a.set(k, false)); };
    if (m === 'degisiklik') {
      const D = s[0];
      if (D === 'taslak') bi = { e:'Değerlendirmeyi başlat', f: gec('degerlendirme', 'Değerlendirmeyi başlat') };
      else if (D === 'degerlendirme') { bi = !d.risk ? { e:'Riski değerlendir', f: bay('risk', 'Risk: — → Orta') } : !d.pencere ? { e:'Pencere seç', f: bay('pencere', 'Pencere: 25 Eyl 22:00–23:30') } : { e:'Onaya gönder', f: gec('onay', 'Onaya gönder') }; not = 'Eksik olan ilk adım birincil olur.'; }
      else if (D === 'onay') { if (d.cab) { ik = { e:'Reddet', y:1, f: gec('reddedildi', 'Reddet') }; bi = { e:'Onayla · CAB', f: gec('planlandi', 'Onayla · CAB') }; } else not = 'Sıra Hizmet sahibinde. Onaysız değişiklik Planlandı\'ya geçmez.'; }
      else if (D === 'planlandi') { ik = { e:'Pencereyi değiştir', f: () => a.log(K + ' · Pencereyi değiştir') }; bi = d.dondurma ? { e:'Dondurma istisnası iste', u:1, f: () => { a.log(K + ' · Dondurma istisnası istendi'); a.toast(K + ' · istisna talebi CAB\'a gönderildi'); } } : { e:'Uygulamaya başla', f: gec('uygulaniyor', 'Uygulamaya başla') }; }
      else if (D === 'uygulaniyor') { ik = { e:'Geri al (rollback)', y:1, f: () => { a.log(K + ' · geri alma planı çalıştırıldı'); a.toast(K + ' · geri alma planı çalıştırıldı'); } }; if (d.gorev) bi = { e:'Uygulamayı tamamla', f: gec('pir', 'Uygulamayı tamamla') }; else not = 'Görevler bitince Uygulamayı tamamla gelir · 2 / 4 görev.'; }
      else if (D === 'pir') bi = d.pir ? { e:'Kapat · Başarılı', f: gec('kapali', 'Kapat · Başarılı') } : { e:'Gözden geçirmeyi kaydet', f: bay('pir', 'gözden geçirme kaydedildi') };
      else if (D === 'reddedildi') bi = { e:'Düzenle ve yeniden gönder', f: gec('taslak', 'Düzenle ve yeniden gönder') };
      else not = 'Kapalı değişiklik yeniden açılmaz.';
    } else {
      const z = ZN[m][s[0]] || {};
      if (z.i) ik = { e: z.i[0], f: z.i[1] ? gec(z.i[1], z.i[0]) : () => { a.log(K + ' · ' + z.i[0]); a.toast('CHG-121 oluşturuldu · kaynak ' + K); } };
      if (z.b) { const f = gec(z.b[1], z.b[0]); if (z.b[2]) ik = { e: z.b[0], f }; else bi = { e: z.b[0], f }; }
      if (z.b && z.b[2]) not = 'Kapanmış kayıtta tek eylem Yeniden aç.';
    }
    const zincir = ST[m].map(x => { const on = x[0] === s[0], z = ZN[m] && ZN[m][x[0]]; return { ...nok(x), eylem: m === 'degisiklik' ? ZD[x[0]] : z ? [z.i && z.i[0], z.b && z.b[0]].filter(Boolean).join(' · ') : '—', bg: on ? '#ecfdf5' : 'transparent', fw: on ? 600 : 400, fg: on ? '#006045' : '#334155' }; });
    return { kimlik:K, baslik:KIM[m][1], ...nok(s), zincir, notVar: !!not, not,
      ikVar: !!ik, ikE: ik ? ik.e : '', ikBd: ik && ik.y ? '#f3b4b6' : '#e2e8f0', ikFg: ik && ik.y ? '#b3282d' : '#020618', ikHbg: ik && ik.y ? '#fef4f4' : '#f8fafc', ikF: ik ? ik.f : () => {},
      biVar: !!bi, biE: bi ? bi.e : '', biBg: bi && bi.u ? '#b16a08' : '#007a55', biHbg: bi && bi.u ? '#9a5b0a' : '#006045', biF: bi ? bi.f : () => {},
      diger: ev => a.menu(ev, { baslik: K + ' · Diğer eylemler', hiza:'sag', genislik:260, ogeler: DIGER, sec: k => a.log(K + ' · ' + DIGER.find(o => o.k === k).e) }) };
  },
  kullan: ['Detay başlığının sağında kaydın durumuna göre sıradaki adımı önermek için.', 'Eksik koşulu tamamlatan eylemi birincil yapmak için (Riski değerlendir, Pencere seç).', 'Rolü ya da sonucu etikette söylemek için: "Onayla · CAB", "Kapat · Başarılı".'],
  kullanma: ['Pasif birincil düğme göstermek için; eksik koşul eyleme dönüşür.', 'İkiden çok görünür düğme için; geri kalanı Diğer eylemler (⋯) menüsüne.', 'Düzenleme modunda; zincir gizlenir, yerine düzenleme çubuğu gelir (3.3.4).'],
  kontrast: [['#ffffff','#007a55','Birincil',4.5],['#ffffff','#b16a08','Uyarı birincil',4.5],['#b3282d','#ffffff','Yıkıcı ikincil',4.5],['#64748b','#ffffff','Koşul notu 12 px',4.5],['#006045','#ecfdf5','Zincirde şimdiki adım',4.5]],
  klavye: [['Tab','Sıra: İkincil → Birincil → Diğer eylemler (⋯)'],['Enter · Boşluk','Eylemi çalıştırır; durum değişir, bildirim Geri al sunar'],['Esc','Diğer eylemler menüsünü kapatır']]
});

const MENU = {
  satir: { baslik:'INC546 · E-posta hizmeti erişilemiyor', g:244, ogeler:[{ k:'ac', e:'Detayı aç', ikon:IK.ac }, { k:'duzenle', e:'Düzenle', ikon:IK.duzenle }, { k:'buyuk', e:'Büyük olay ilan et', ikon:IK.siren, kritik:1 }, { k:'prb', e:'Probleme bağla', ikon:IK.bag }] },
  detay: { baslik:'CHG-118 · SAP ERP uygulama sunucusu bellek ayarı', g:260, ogeler:[{ k:'chg', e:'Değişiklik talebi oluştur', ikon:IK.arti }, { k:'olay', e:'Olay bağla', ikon:IK.bag }, { k:'kopya', e:'Bağlantıyı kopyala', ikon:IK.kopya }, { k:'birlestir', e:'Birleştir…', ikon:IK.birlestir, ayirici:1, yikici:1 }] },
  secenek: { baslik:'INC548 · Durum', g:220 }
};
L.MENU = MENU;
L.bilesenler.push({
  id:'menu', no:'3.2.3', ad:'Açılır menü', grup:'e', dok:'b-menu', vmin:300,
  kontroller: [
    { k:'tur', e:'Menü', t:'sec', o:[['satir','Satır menüsü'],['detay','Diğer eylemler · detay'],['secenek','Seçenek menüsü']] },
    { k:'durum', e:'Seçili değer', t:'sec', o: ST.olay.map(s => [s[0], s[1]]), kosul: d => d.tur === 'secenek' },
    { k:'acik', e:'Açık hâlini yanında göster', t:'acik' }
  ],
  varsayilan: { tur:'satir', durum:'calisiliyor', acik:true },
  varyantlar: [ { e:'Satır menüsü', d:{} }, { e:'Diğer eylemler · detay', d:{ tur:'detay' } }, { e:'Seçenek menüsü', d:{ tur:'secenek' } } ],
  vm(d, a) {
    const M = MENU[d.tur] || MENU.satir, sec = d.tur === 'secenek', s = st('olay', d.durum);
    const ogeler = sec ? ST.olay.map(x => ({ k:x[0], e:x[1], nokta:x[2], bos:!!x[3] })) : M.ogeler;
    const statik = ogeler.map(o => ({ e:o.e, ayirici:!!o.ayirici, renk: o.yikici ? '#b3282d' : '#020618', ikonVar:!!o.ikon, ikon:o.ikon || '', ikonRenk: o.kritik ? '#d23f43' : o.yikici ? '#b3282d' : '#64748b', noktaVar:!!o.nokta, nokta:o.nokta || '', noktaBg: o.bos ? '#fff' : (o.nokta || ''), tik: sec && o.k === s[0] }));
    return { satir: d.tur === 'satir', detay: d.tur === 'detay', secenek: sec, statikVar: !!d.acik, statik, baslik: M.baslik, gen: M.g + 'px', ...nok(s),
      ac: ev => a.menu(ev, { baslik: M.baslik, genislik: M.g, hiza: sec ? 'sol' : 'sag', ogeler, secili: sec ? s[0] : null, sec: k => { if (sec) { const y = st('olay', k); if (k === s[0]) return; a.set('durum', k); const m = 'INC548 · Durum: ' + s[1] + ' → ' + y[1]; a.log(m); a.toast(m, () => a.set('durum', s[0])); } else a.log(M.baslik.split(' · ')[0] + ' · ' + ogeler.find(o => o.k === k).e); } }) };
  },
  kullan: ['Satırın ⋯ düğmesinde ve detaydaki Diğer eylemler için tek menü.', 'Hücre içi düzenlemede seçenek listesi için (mevcut değer ✓).', 'Menünün başında hangi kayıt için açıldığını yazmak için.'],
  kullanma: ['Birincil eylemi menüye gömmek için; birincil başlıkta durur.', 'İç içe alt menü için.', 'Aynı anda ikinci bir açılır katman için.'],
  kontrast: [['#020618','#ffffff','Öğe 13 px',4.5],['#020618','#f8fafc','Öğe hover',4.5],['#64748b','#ffffff','Başlık 11 px',4.5],['#b3282d','#ffffff','Yıkıcı öğe',4.5],['#d23f43','#ffffff','Kritik ikon',3]],
  klavye: [['Enter · Boşluk · ↓','Menüyü açar, odak menüye geçer'],['↑ ↓','Öğeler arasında gezer'],['Enter','Öğeyi seçer, menü kapanır'],['Esc · Tab','Menüyü kapatır, odak tetikleyiciye döner']]
});
})();
