// Bileşen laboratuvarı · 3.4 Detay bileşenleri (1)
(function () {
const L = window.DCASE_LAB, { ST, MOD, ACIK, IK, HEDEF, st, pri, sure, stMenu, priMenu, sla, MENU, ETK, KIM, kisiMenu } = L;

const BAS = {
  talep: { liste:'Üzerimdeki Talepler', once:'REQ-283', sonra:'REQ-281', sablon:'Hizmet talebi', hizmet:'Son kullanıcı donanımı', ci:'—', tarih:'12 Eyl 2026 09:14', sahip:'Pelin Er', ik:'Beklemeye al', bi:'Çöz…', kaynak:'INC512' },
  olay: { liste:'Olay Listesi', once:'INC547', sonra:'INC545', sablon:'Kesinti', hizmet:'E-posta (Exchange)', ci:'MBX-02', tarih:'18 Eyl 2026 08:42', sahip:'Gökhan Tuna', ik:'Beklemeye al', bi:'Çöz…', kaynak:'İzleme (Zabbix)' },
  problem: { liste:'Problem Listesi', once:'PRB-032', sonra:'PRB-030', sablon:'Reaktif', hizmet:'SAP ERP', ci:'AS-02', tarih:'16 Eyl 2026 11:05', sahip:'Ayşe Kaya', ik:'', bi:'Kök nedeni kaydet…', kaynak:'INC548' },
  degisiklik: { liste:'Değişiklik Listesi', once:'CHG-119', sonra:'CHG-117', sablon:'', hizmet:'SAP ERP', ci:'AS-02', tarih:'18 Eyl 2026 10:20', sahip:'admin admin', ik:'Reddet', bi:'Onayla · CAB', kaynak:'PRB-031' }
};
L.bilesenler.push({
  id:'baslik', no:'3.4.1', ad:'Kimlik başlığı', grup:'d', dok:'b-baslik', vmin:560,
  kontroller: [
    { k:'modul', e:'Modül', t:'sec', o:MOD },
    { k:'tur', e:'Değişiklik türü', t:'sec', o:[['standart','Standart'],['normal','Normal'],['acil','Acil']], kosul: d => d.modul === 'degisiklik' },
    { k:'buyuk', e:'Büyük olay', t:'acik', kosul: d => d.modul === 'olay' },
    { k:'kaynak', e:'Kaynak kayıt', t:'acik' },
    { k:'baslik', e:'Başlık', t:'metin', ipucu:'Başlık kısaltılmaz; uzun metin satıra kırılır.' }
  ],
  varsayilan: { modul:'degisiklik', tur:'normal', buyuk:true, kaynak:true, baslik:'' },
  varyantlar: [ { e:'Talep', d:{ modul:'talep', kaynak:false } }, { e:'Olay · büyük olay', d:{ modul:'olay' } }, { e:'Problem', d:{ modul:'problem' } }, { e:'Değişiklik · normal', d:{} } ],
  vm(d, a) {
    const B = BAS[d.modul], K = KIM[d.modul], tur = d.modul === 'degisiklik' ? (ETK.tur.o.find(o => o[0] === d.tur) || ETK.tur.o[1]) : null, y = B.ik === 'Reddet';
    return { liste:B.liste, id:K[0], once:B.once, sonra:B.sonra, baslik: d.baslik || K[1], hizmet:B.hizmet, ci:B.ci, tarih:B.tarih, sahip:B.sahip,
      turVar: !!tur, turE: tur ? tur[1] : '', turBg: tur ? tur[2] : '', turFg: tur ? tur[3] : '', buyukVar: d.modul === 'olay' && !!d.buyuk, sablonVar: !!B.sablon, sablon: B.sablon,
      kaynakVar: !!d.kaynak, kaynak: B.kaynak, kaynakMono: /^[A-Z]{3}/.test(B.kaynak) ? 'ui-monospace,SFMono-Regular,Menlo,monospace' : 'inherit',
      ikVar: !!B.ik, ikE: B.ik, ikBd: y ? '#f3b4b6' : '#e2e8f0', ikFg: y ? '#b3282d' : '#020618', ikHbg: y ? '#fef4f4' : '#f8fafc', biE: B.bi,
      listeGit: ev => { ev.preventDefault(); a.log(B.liste + ' açılır'); }, onceGit: () => a.log(B.once + ' açılır · kuyruk sırası'), sonraGit: () => a.log(B.sonra + ' açılır · kuyruk sırası'),
      kaynakGit: ev => { ev.preventDefault(); a.log(B.kaynak + ' açılır'); },
      ikF: () => a.log(K[0] + ' · ' + B.ik), biF: () => { a.log(K[0] + ' · ' + B.bi); a.toast(K[0] + ' · ' + B.bi.replace('…', '') + ' başlatıldı'); },
      diger: ev => a.menu(ev, { baslik: K[0] + ' · Diğer eylemler', hiza:'sag', genislik:260, ogeler: MENU.detay.ogeler, sec: k => a.log(K[0] + ' · ' + MENU.detay.ogeler.find(o => o.k === k).e) }) };
  },
  kullan: ['Detay sayfasının ilk bloğu olarak: kayıt nerede, ne, kime ait ve şimdi ne yapılmalı.', 'Önceki / sonraki kayda kuyruk sırasıyla geçmek için.', 'Kaynak kaydı ("kaynak PRB-031") kimlik satırında bağlamak için.'],
  kullanma: ['Başlığı kısaltmak için; başlık satıra kırılır.', 'Eylem zincirinde ikiden çok görünür düğme için.', 'Meta satırına durum ya da öncelik koymak için; onlar özet şeridinde.'],
  kontrast: [['#64748b','#f8fafc','İçerik haritası 12 px',4.5],['#007a55','#f8fafc','Kimlik 13/600',4.5],['#020618','#f8fafc','Başlık 20/700',4.5],['#64748b','#f8fafc','Meta 13 px',4.5]],
  klavye: [['Tab','İçerik haritası → önceki / sonraki → eylem zinciri'],['Enter','Bağlantıyı ya da eylemi çalıştırır']]
});

const RK = ETK.risk.o;
L.bilesenler.push({
  id:'ozet', no:'3.4.2', ad:'Özet şeridi', grup:'d', dok:'b-ozet', vmin:520,
  kontroller: [
    { k:'modul', e:'Modül', t:'sec', o:MOD },
    { k:'durum', e:'Durum', t:'sec', o: d => ST[d.modul].map(s => [s[0], s[1]]) },
    { k:'oncelik', e:'Öncelik', t:'sec', o:[['P1'],['P2'],['P3'],['P4']], kosul: d => d.modul !== 'degisiklik' },
    { k:'risk', e:'Risk', t:'sec', o: RK.map(o => [o[0], o[1]]), kosul: d => d.modul === 'degisiklik' },
    { k:'atanan', e:'Atanan', t:'sec', o:[['Gökhan Tuna'],['Deniz Acar'],['','Atanmamış']] }
  ],
  varsayilan: { modul:'degisiklik', durum:'onay', oncelik:'P2', risk:'orta', atanan:'Gökhan Tuna' },
  duzelt: d => { d.durum = st(d.modul, d.durum)[0]; },
  varyantlar: [ { e:'Talep', d:{ modul:'talep', durum:'calisiliyor' } }, { e:'Olay', d:{ modul:'olay', durum:'calisiliyor', oncelik:'P1' } }, { e:'Problem', d:{ modul:'problem', durum:'inceleniyor' } }, { e:'Değişiklik', d:{} }, { e:'Olay · atanmamış', d:{ modul:'olay', durum:'acik', atanan:'' } } ],
  vm(d, a) {
    const m = d.modul, s = st(m, d.durum), p = pri(d.oncelik), K = KIM[m][0], at = d.atanan;
    const H = (e, o) => Object.assign({ etiket:e, duz:false, deger:'—', renk:'#020618', noktaVar:false, nokta:'', noktaBg:'', adVar:false, ad:'', cubukVar:false, dol:'0%', alt:'', altRenk:'#64748b', ac: () => {}, rol:'group', ti:-1, imlec:'default', hbg:'transparent' }, o);
    const duz = (o, f) => Object.assign(o, { duz:true, rol:'button', ti:0, imlec:'pointer', hbg:'#f8fafc', ac:f });
    const kay = (k, eski, yeni, et) => { a.set(k, yeni); a.log(K + ' · ' + et); a.toast(K + ' · ' + et, () => a.set(k, eski)); };
    const durumH = duz(H('Durum', { noktaVar:true, deger:s[1], nokta:s[2], noktaBg: s[3] ? '#fff' : s[2], alt: ACIK[s[0]] || '' }), ev => a.menu(ev, { baslik: K + ' · Durum', ...stMenu(m, s[0]), sec: k => { if (k !== s[0]) kay('durum', s[0], k, 'Durum: ' + s[1] + ' → ' + st(m, k)[1]); } }));
    const oncH = duz(H('Öncelik', { deger:p[0], renk:p[2], adVar:true, ad:p[1], alt: m === 'talep' ? 'doğrudan seçildi' : 'etki × aciliyet' }), ev => a.menu(ev, { baslik: K + ' · Öncelik', ...priMenu(p[0]), sec: k => { if (k !== p[0]) kay('oncelik', p[0], k, 'Öncelik: ' + p[0] + ' → ' + k); } }));
    const atH = e => duz(H(e, { deger: at || 'Atanmamış', renk: at ? '#020618' : '#9a5b0a', alt: at ? 'Level 2 Analist' : 'kuyrukta bekliyor' }), ev => a.menu(ev, { ...kisiMenu(K + ' · ' + e, at, true), sec: k => { if (k !== at) kay('atanan', at, k, e + ': ' + (at || 'Atanmamış') + ' → ' + (k || 'Atanmamış')); } }));
    const S = sla({ oncelik:p[0], gecen:70, yanit:'tutuldu', durum:'isliyor' });
    let hucreler;
    if (m === 'talep') hucreler = [durumH, oncH, H('SLA', { deger:S.ana, renk:S.renk, alt:S.alt, cubukVar:true, dol:S.dol }), atH('Atanan')];
    else if (m === 'olay') hucreler = [durumH, oncH, H('Çözüm SLA\'sı', { deger:S.ana, renk:S.renk, alt:'hedef ' + sure(HEDEF[p[0]][0]) }), H('Yanıt SLA\'sı', { deger:'Tutuldu ✓', renk:'#007a55', alt:'00:09 içinde' }), atH('Atanan'), H('Bekleyen', { deger:'—', alt:'bekleme yok' }), H('Etkilenen hizmet', { deger:'E-posta (Exchange)', alt:'Kurum · ~1.200 kullanıcı' })];
    else if (m === 'problem') hucreler = [durumH, oncH, H('Bağlı olay', { deger:'4', alt:'son 30 gün' }), H('Geçici çözüm', { deger:'Var', renk:'#007a55', alt:'KB-112 · yayında' }), atH('Sorumlu'), H('Hedef tarih', { deger:'26 Eyl', alt: p[0] + ' · ' + ({ P1:3, P2:7, P3:14, P4:30 })[p[0]] + ' gün' }), H('Hizmet', { deger:'SAP ERP', alt:'AS-02' })];
    else { const r = RK.find(o => o[0] === d.risk) || RK[1];
      hucreler = [durumH, duz(H('Risk', { deger:r[1], renk:r[3], alt:r[4] }), ev => a.menu(ev, { baslik: K + ' · Risk', genislik:220, ogeler: RK.map(o => ({ k:o[0], e:o[1], kod:'●', kodRenk:o[3] })), secili:r[0], sec: k => { if (k !== r[0]) kay('risk', r[0], k, 'Risk: ' + r[1] + ' → ' + RK.find(o => o[0] === k)[1]); } })), H('Onay', { deger:'1 / 2', alt:'CAB bekleniyor', cubukVar:true, dol:'50%' }), H('Pencere', { deger:'25 Eyl 22:00–23:30', alt:'çakışma yok' }), atH('Uygulayan'), H('Görevler', { deger:'0 / 4', alt:'pencere açılınca', cubukVar:true, dol:'0%' })]; }
    return { hucreler };
  },
  kullan: ['Kaydın en çok bakılan alanlarını tek kartta, eşit hücrelerde vermek için; ilk hücre durum.', 'Durum, öncelik ve sahipliği formu açmadan yerinde değiştirmek için.', 'Hesaplanan değerleri (Onay, Görevler, SLA, Bağlı olay) salt okunur göstermek için.'],
  kullanma: ['Bir hücreye iki bilgi koymak için.', 'Hesaplanan hücreye chevron koymak için.', 'Yedi hücreden fazlası için; geri kalanı kartlara.'],
  kontrast: [['#64748b','#ffffff','Etiket 11/600',4.5],['#020618','#ffffff','Değer 14/600',4.5],['#9a5b0a','#ffffff','Atanmamış',4.5],['#b16a08','#ffffff','Orta risk 14/600',4.5],['#007a55','#e2e8f0','İlerleme çubuğu',3]],
  klavye: [['Tab','Düzenlenebilir hücreye odaklanır'],['Enter · Boşluk','Hücre içi menüyü açar'],['↑ ↓ · Enter','Değeri seçer; anında kaydedilir, bildirim Geri al sunar']]
});

const SR = {
  buyuk: { bg:'#fbe9ea', bd:'#f3c1c3', fg:'#b3282d', fg2:'#7a1f23', rozet:1, kimlik:'INC546', baslik:'E-posta hizmeti erişilemiyor', metin:'E-posta (Exchange) · Kurum geneli · ~1.200 kullanıcı · 3 bağlı olay · Köprü açık, 08:42\'den beri', e:[['Bağlı olayları göster','ik'],['Büyük olayı aç','kr']] },
  uygulama: { bg:'#ecfdf5', bd:'#a4f4cf', fg:'#006045', fg2:'#334155', baslik:'Uygulama sürüyor', metin:'Pencere 25 Eyl 22:00–23:30 · 2 / 4 görev tamamlandı · geri alma planı hazır', e:[['Görevleri göster','ik']] },
  dondurma: { bg:'#fdf1e0', bd:'#f3d9ae', fg:'#9a5b0a', fg2:'#334155', baslik:'Dondurma dönemi', metin:'Pencere ay sonu kapanış dondurmasına denk geliyor; uygulama için CAB istisnası gerekir.', e:[['İstisna iste','uy']] },
  cakisma: { bg:'#fef4f4', bd:'#f3b4b6', fg:'#b3282d', fg2:'#334155', baslik:'⚠ Çakışma', kimlik:'CHG-116', metin:'Veritabanı indeks bakımı aynı CI\'da (AS-02); pencereler 30 dk örtüşüyor.', e:[['Pencereyi değiştir','yk']] }
};
const EB = { ik:['#fff','#020618','1px solid #e2e8f0','#f8fafc'], kr:['#d23f43','#fff','0','#b3282d'], uy:['#b16a08','#fff','0','#9a5b0a'], yk:['#fff','#b3282d','1px solid #f3b4b6','#fef4f4'] };
L.bilesenler.push({
  id:'serit', no:'3.4.3', ad:'Bağlam şeridi', grup:'d', dok:'b-serit', vmin:460,
  kontroller: [ { k:'tur', e:'Durum', t:'sec', o:[['buyuk','Büyük olay'],['uygulama','Uygulama sürüyor'],['dondurma','Dondurma dönemi'],['cakisma','Çakışma']] }, { k:'eylem', e:'Eylemleri göster', t:'acik' } ],
  varsayilan: { tur:'buyuk', eylem:true },
  varyantlar: [ { e:'Büyük olay', d:{} }, { e:'Uygulama sürüyor', d:{ tur:'uygulama' } }, { e:'Dondurma dönemi', d:{ tur:'dondurma' } }, { e:'Çakışma', d:{ tur:'cakisma' } } ],
  vm(d, a) {
    const S = SR[d.tur] || SR.buyuk;
    return { bg:S.bg, bd:S.bd, fg:S.fg, fg2:S.fg2, rozetVar:!!S.rozet, kimlikVar:!!S.kimlik, kimlik:S.kimlik || '', baslik:S.baslik, metin:S.metin, eylemVar: d.eylem !== false,
      eylemler: S.e.map(([e, t]) => ({ e, bg:EB[t][0], fg:EB[t][1], bd:EB[t][2], hbg:EB[t][3], tikla: () => { a.log(e); if (t === 'uy') a.toast('CHG-118 · istisna talebi CAB\'a gönderildi'); } })),
      git: ev => { ev.preventDefault(); a.log(S.kimlik + ' açılır'); } };
  },
  kullan: ['Süren ve ekrandaki her kararı etkileyen bir durumu anlatmak için: büyük olay, süren uygulama, dondurma, çakışma.', 'Listede her aktif büyük olay için bir satır; detayda kimlik başlığıyla özet şeridi arasında tek şerit.', 'Durumdan çıkan eylemi (Büyük olayı aç, İstisna iste) şeridin sağında sunmak için.'],
  kullanma: ['Bir işlemin sonucunu anlatmak için; o bildirimin işi.', 'Detayda birden çok şerit için.', 'Durum bittiğinde şeridi bırakmak için; şerit kalkar.'],
  kontrast: [['#b3282d','#fbe9ea','Büyük olay başlığı',4.5],['#7a1f23','#fbe9ea','Büyük olay metni',4.5],['#006045','#ecfdf5','Uygulama sürüyor',4.5],['#9a5b0a','#fdf1e0','Dondurma',4.5],['#334155','#fdf1e0','Şerit metni',4.5],['#b3282d','#fef4f4','Çakışma',4.5]],
  klavye: [['—','role="status"; sayfa açılınca bir kez duyurulur'],['Tab','Şeritteki kimlik bağlantısına ve eylemlere gider']]
});

const KR = {
  plan: { baslik:'Uygulama planı', adimlar:['AS-02 için snapshot al','Bellek parametrelerini güncelle','Uygulama sunucusunu yeniden başlat','Oturum açma süresini doğrula'] },
  geri: { baslik:'Geri alma planı', adimlar:['Snapshot\'tan AS-02\'yi geri yükle','Eski bellek parametrelerini uygula','Oturum açma süresini doğrula'], eksik:'Geri alma planı yazılmadı. Normal ve acil değişiklikte onaya gönderilmeden önce zorunlu.', ekle:'Geri alma planı ekle' },
  etki: { baslik:'Etki analizi', kutular:[['6','bağlı CI'],['2','hizmet'],['~1.200','kullanıcı']] }
};
L.bilesenler.push({
  id:'kart', no:'3.4.4', ad:'Kart', grup:'d', dok:'b-kart', vmin:320,
  kontroller: [
    { k:'icerik', e:'İçerik', t:'sec', o:[['plan','Uygulama planı'],['geri','Geri alma planı'],['etki','Etki analizi']] },
    { k:'durum', e:'Durum', t:'sec', o: d => d.icerik === 'geri' ? [['hazir','Hazır'],['eksik','Eksik · zorunlu'],['bos','Boş · opsiyonel']] : [['hazir','Hazır'],['bos','Boş · opsiyonel']] },
    { k:'ipucu', e:'İpucu ("CMDB\'den · 09:12")', t:'acik' }
  ],
  varsayilan: { icerik:'geri', durum:'eksik', ipucu:false },
  duzelt: d => { if (d.durum === 'eksik' && d.icerik !== 'geri') d.durum = 'hazir'; },
  varyantlar: [ { e:'Hazır', d:{ icerik:'plan', durum:'hazir' } }, { e:'Eksik · zorunlu', d:{} }, { e:'İpucu ve OTOMATİK', d:{ icerik:'etki', durum:'hazir', ipucu:true } }, { e:'Boş · opsiyonel', d:{ durum:'bos' } } ],
  vm(d, a) {
    const K = KR[d.icerik] || KR.plan, gizli = d.durum === 'bos', eksik = d.durum === 'eksik' && !!K.eksik, kutu = !!K.kutular;
    return { gizli, gorunur: !gizli, baslik:K.baslik, kenar: eksik ? '#f3d9ae' : '#e2e8f0', otoVar: d.icerik === 'etki', ipucuVar: !!d.ipucu, ipucu:'CMDB\'den · 09:12',
      chipVar: !gizli, chip: eksik ? 'Eksik' : 'Hazır', chipBg: eksik ? '#fdf1e0' : '#ecfdf5', chipFg: eksik ? '#9a5b0a' : '#006045',
      adimVar: !eksik && !kutu, adimlar: (K.adimlar || []).map(e => ({ e })), eksikVar: eksik, eksikMetin: K.eksik || '', tamamlaE: K.ekle || '',
      kutuVar: kutu, kutular: (K.kutular || []).map(x => ({ d:x[0], e:x[1] })),
      tamamla: () => { a.set('durum', 'hazir'); a.log('CHG-118 · ' + K.baslik + ' eklendi'); a.toast('CHG-118 · ' + K.baslik + ' eklendi', () => a.set('durum', 'eksik')); } };
  },
  kullan: ['Detaydaki her içerik grubunu (gerekçe, plan, geri alma, etki analizi) ayrı kartta vermek için.', 'Kartın hazır olup olmadığını başlığın sağında kart durumu rozetiyle söylemek için.', 'Zorunlu ama boş içeriği kartın içinde eksik olarak göstermek ve tamamlatmak için.'],
  kullanma: ['Opsiyonel ve boş alanı görünüm modunda göstermek için; kart gizlenir.', 'Kartın kenarını vurgu rengiyle boyamak için; yalnız eksik içerik #f3d9ae kenar alır.', 'Kart içinde ikinci bir kart açmak için; küçük kutular 8 px köşeli çizgidir.'],
  kontrast: [['#64748b','#ffffff','Kart başlığı 12/600',4.5],['#334155','#ffffff','Gövde 13 px',4.5],['#9a5b0a','#ffffff','Eksik açıklaması',4.5],['#006045','#ecfdf5','Hazır rozeti',4.5]],
  klavye: [['Tab','Kart içindeki eyleme gider; kartın kendisi odak almaz']]
});

const YS = {
  degisiklik: { yol:['taslak','degerlendirme','onay','planlandi','uygulaniyor','pir','kapali'], gec:['18 Eyl 10:20 · kayıt açıldı','18 Eyl 15:40 · risk Orta','19 Eyl 09:40 · onaylandı','22 Eyl 08:00 · pencere 25 Eyl','25 Eyl 23:30 · görevler bitti','26 Eyl 10:00 · yazıldı','26 Eyl 10:05 · sonuç kaydedildi'] },
  problem: { yol:['yeni','inceleniyor','kokneden','bilinenhata','cozuldu','kapali'], gec:['16 Eyl 11:05 · kayıt açıldı','17 Eyl 14:20 · 3 hipotez','19 Eyl 09:10 · bellek eşiği','19 Eyl 16:00 · KB-112 yayında','26 Eyl 10:00 · CHG-118 uygulandı','27 Eyl 09:00 · kapatıldı'] },
  olay: { yol:['acik','atandi','calisiliyor','cozuldu','kapali'], gec:['08:42 · İzleme (Zabbix)','08:45 · Gökhan Tuna','08:50 · köprü açıldı','10:33 · MBX-02 eşitlendi','11:00 · kapatıldı'] },
  talep: { yol:['acik','calisiliyor','cozuldu'], gec:['09:14 · portal','09:40 · Deniz Acar','11:20 · teslim edildi'] }
};
const rgba = (h, al) => 'rgba(' + [1,3,5].map(i => parseInt(h.substr(i,2),16)).join(',') + ',' + al + ')';
L.bilesenler.push({
  id:'yasam', no:'3.4.5', ad:'Yaşam döngüsü', grup:'d', dok:'b-yasam', vmin:280,
  kontroller: [
    { k:'modul', e:'Modül', t:'sec', o:[['degisiklik','Değişiklik'],['problem','Problem'],['olay','Olay'],['talep','Talep']] },
    { k:'asama', e:'Aşama', t:'aralik', min:0, max: d => YS[d.modul].yol.length - 1, goster: (v, d) => st(d.modul, YS[d.modul].yol[Math.min(Math.round(v), YS[d.modul].yol.length - 1)])[1], kosul: d => !(d.modul === 'degisiklik' && d.ret), ipucu:'Adıma tıklayarak da aşama değişir.' },
    { k:'ret', e:'Ret dalı', t:'acik', kosul: d => d.modul === 'degisiklik' }
  ],
  varsayilan: { modul:'degisiklik', asama:2, ret:false },
  duzelt: d => { d.asama = Math.min(Math.round(d.asama), YS[d.modul].yol.length - 1); },
  varyantlar: [ { e:'Değişiklik · onay bekliyor', d:{} }, { e:'Değişiklik · ret dalı', d:{ ret:true } }, { e:'Problem · kök neden aranıyor', d:{ modul:'problem', asama:1 } }, { e:'Olay · çalışılıyor', d:{ modul:'olay', asama:2 } } ],
  vm(d, a) {
    const Y = YS[d.modul], ret = d.modul === 'degisiklik' && !!d.ret;
    let yol = Y.yol, gec = Y.gec, asama = d.asama;
    if (ret) { yol = ['taslak','degerlendirme','onay','reddedildi']; gec = ['15 Eyl 16:30 · kayıt açıldı','16 Eyl 11:05 · risk Yüksek','17 Eyl 09:30 · CAB\'a gönderildi','']; asama = 3; }
    const adimlar = yol.map((k, i) => { const s = st(d.modul, k), g = i < asama, now = i === asama, red = k === 'reddedildi', son = i === yol.length - 1;
      const o = red ? { dolgu:'#fff', kenar:'#d23f43', halka:'none', fg:'#b3282d', fw:600, alt:ACIK.reddedildi } : g ? { dolgu:'#007a55', kenar:'#007a55', halka:'none', fg:'#020618', fw:500, alt:gec[i] } : now ? { dolgu:s[2], kenar:s[2], halka:'0 0 0 3px ' + rgba(s[2], .2), fg:'#020618', fw:600, alt:ACIK[k] || '' } : { dolgu:'#fff', kenar:'#cbd5e1', halka:'none', fg:'#64748b', fw:500, alt:ACIK[k] || '' };
      return { e:s[1], ...o, cizgiVar: !son && !red, cizgi: g ? '#007a55' : '#e2e8f0', imlec: ret ? 'default' : 'pointer', sec: () => { if (!ret && i !== asama) { a.set('asama', i); a.log('Aşama: ' + s[1]); } } }; });
    return { adimlar, ozet: (Math.min(asama, yol.length - 1) + 1) + ' / ' + yol.length };
  },
  kullan: ['Altı ve daha çok durumlu yaşam döngüsünde "daha kaç adım var" sorusunu yanıtlamak için (Problem, Değişiklik).', 'Geçilen adımda tarih ve kısa sonucu, gelecek adımda durumun açıklamasını vermek için.', 'Ret gibi bir dalın akışı orada bitirdiğini göstermek için.'],
  kullanma: ['Talep ve Olay\'da; özet şeridindeki durum yeterli.', 'Durum değiştirmek için; durum eylem zinciriyle ilerler.', 'Yatay adım çubuğu olarak; gösterge dikeydir, yan sütunda durur.'],
  kontrast: [['#020618','#ffffff','Şimdiki adım 13/600',4.5],['#64748b','#ffffff','Gelecek adım · alt satır',4.5],['#b3282d','#ffffff','Ret etiketi',4.5],['#007a55','#ffffff','Geçilen nokta ve çizgi',3]],
  klavye: [['—','Gösterge salt okunur; sıralı liste olarak okunur ("7 adımın 3.\'sü: Onay bekliyor")']]
});
})();
