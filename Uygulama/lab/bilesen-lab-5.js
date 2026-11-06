// Bileşen laboratuvarı · 3.4 Detay bileşenleri (2) ve 2.4 Kabuk
(function () {
const L = window.DCASE_LAB, { PRI, KISI, IK, HEDEF, pri, kisiMenu } = L;

const AK = {
  degisiklik: [['Bugün 09:40','Hizmet sahibi onayı verildi · "Pencere iş birimleriyle uzlaşıldı"','Barış Can Ataklı'],['Bugün 09:12','Onaya gönderildi · yol: Hizmet sahibi → CAB','admin admin'],['Dün 16:05','Risk: — → Orta','admin admin'],['Dün 15:40','Etki analizi güncellendi · 6 bağlı CI','CMDB'],['18 Eyl 10:20','Kayıt açıldı · kaynak PRB-031','admin admin']],
  olay: [['Bugün 10:12','Durum: Açık → Çalışılıyor','Gökhan Tuna'],['Bugün 09:58','İç not · MBX-02 yeniden eşitleniyor, yaklaşık 20 dk sürer','Gökhan Tuna',1],['Bugün 09:05','Yanıt gönderildi · "Ekibimiz sorunu inceliyor, 30 dk içinde bilgi vereceğiz."','Gökhan Tuna'],['Bugün 08:57','Yanıt SLA\'sı tutuldu','SLA Motoru'],['Bugün 08:42','Kayıt açıldı · İzleme (Zabbix)','Sistem']]
};
L.bilesenler.push({
  id:'akis', no:'3.4.6', ad:'Aktivite akışı', grup:'d', dok:'b-akis', vmin:420,
  kontroller: [
    { k:'modul', e:'Giriş', t:'sec', o:[['degisiklik','Değişiklik · not satırı'],['olay','Olay · yanıt kutusu']] },
    { k:'gorunurluk', e:'Görünürlük', t:'sec', o:[['talep','Talep edene'],['ic','İç not']], kosul: d => d.modul === 'olay' },
    { k:'bos', e:'Boş akış', t:'acik' }
  ],
  varsayilan: { modul:'degisiklik', gorunurluk:'talep', bos:false, metin:'', girdiler:null },
  varyantlar: [ { e:'Değişiklik · not satırı', d:{} }, { e:'Olay · yanıt kutusu', d:{ modul:'olay' } }, { e:'Olay · iç not yazılıyor', d:{ modul:'olay', gorunurluk:'ic', metin:'MBX-02 yeniden eşitleniyor' } }, { e:'Boş akış', d:{ bos:true } } ],
  vm(d, a) {
    const m = d.modul === 'olay' ? 'olay' : 'degisiklik', ham = d.bos ? [] : (d.girdiler && d.girdiler[m]) || AK[m];
    const metin = d.metin || '', bos = !metin.trim(), ic = m === 'olay' && d.gorunurluk === 'ic';
    const ekle = () => { if (bos) return; const yeni = [['Şimdi', (m === 'olay' ? (ic ? 'İç not · ' : 'Yanıt gönderildi · ') : 'Not · ') + '"' + metin.trim() + '"', 'admin admin', ic ? 1 : 0]].concat(ham); a.setMany({ girdiler: { ...(d.girdiler || {}), [m]: yeni }, metin:'', bos:false }); a.log(m === 'olay' ? (ic ? 'İç not eklendi' : 'Yanıt talep edene gönderildi') : 'Not eklendi'); };
    return { baslik: m === 'olay' ? 'Aktivite' : 'Zaman çizelgesi', sayi: ham.length + ' kayıt', notSatiri: m === 'degisiklik', yanitKutusu: m === 'olay', bos: !ham.length, metin,
      girdiler: ham.map(g => ({ t:g[0], m:g[1], k:g[2], bg: g[3] ? '#f8fafc' : 'transparent', pad: g[3] ? '8px 10px' : '0' })),
      yaz: ev => a.set('metin', ev.target.value), tus: ev => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); ekle(); } }, ekle, opak: bos ? '.5' : '1', gonderE: ic ? 'İç not ekle' : 'Gönder',
      gorunurlukler: [['talep','Talep edene'],['ic','İç not']].map(([k, e]) => { const on = (d.gorunurluk || 'talep') === k; return { e, bd: on ? '#007a55' : '#e2e8f0', bg: on ? '#ecfdf5' : '#fff', fg: on ? '#006045' : '#334155', fw: on ? 600 : 500, basili: String(on), sec: () => a.set('gorunurluk', k) }; }) };
  },
  kullan: ['Kayıtta olan her şeyi tek listede, yeniden eskiye vermek için: alan değişiklikleri, notlar, yanıtlar, onaylar, sistem olayları.', 'Alan değişikliğini "Alan: eski → yeni" biçiminde yazmak için.', 'Sistem kaynaklı satırda kişi yerine kaynağı (CMDB, SLA Motoru) yazmak için.'],
  kullanma: ['Ayrı "Geçmiş" ve "Yorumlar" sekmeleri için.', 'Zaman ve kişiyi #94a3b8 ile yazmak için; kontrast için #64748b.', 'Çözüm metnini akış kutusundan istemek için; çözen eylem çekmecede ayrıca ister.'],
  kontrast: [['#64748b','#ffffff','Zaman ve kişi 11 px',4.5],['#94a3b8','#ffffff','Prototipteki zaman rengi',4.5],['#020618','#ffffff','Satır metni 13 px',4.5],['#006045','#ecfdf5','Seçili görünürlük',4.5]],
  klavye: [['Enter','Not satırında notu ekler; yanıt kutusunda Shift + Enter yeni satır'],['Tab','Görünürlük seçimi → Gönder'],['—','Yeni satır role="log" ile duyurulur']]
});

const ETKI = ['Kurum','Bölüm','Ekip','Kişi'], ACL = ['Düşük','Orta','Yüksek'], MT = [['P2','P1','P1'],['P3','P2','P1'],['P4','P3','P2'],['P4','P4','P3']];
const sa = m => m >= 60 ? (m / 60) + ' sa' : m + ' dk';
L.bilesenler.push({
  id:'matris', no:'3.4.7', ad:'Etki × aciliyet matrisi', grup:'d', dok:'b-matris', vmin:300,
  kontroller: [ { k:'modul', e:'Modül', t:'sec', o:[['olay','Olay'],['problem','Problem']] }, { k:'etki', e:'Etki', t:'sec', o: ETKI.map(e => [e]) }, { k:'aciliyet', e:'Aciliyet', t:'sec', o: ACL.map(e => [e]) } ],
  varsayilan: { modul:'olay', etki:'Bölüm', aciliyet:'Yüksek' },
  varyantlar: [ { e:'P1 · Kurum × Orta', d:{ etki:'Kurum', aciliyet:'Orta' } }, { e:'P2 · Ekip × Yüksek', d:{ etki:'Ekip', aciliyet:'Yüksek' } }, { e:'P3 · Bölüm × Düşük', d:{ etki:'Bölüm', aciliyet:'Düşük' } }, { e:'Problem · hedef tarih', d:{ modul:'problem', etki:'Kişi', aciliyet:'Düşük' } } ],
  vm(d, a) {
    const ei = Math.max(0, ETKI.indexOf(d.etki)), ai = Math.max(0, ACL.indexOf(d.aciliyet)), kod = MT[ei][ai], p = pri(kod), K = d.modul === 'problem' ? 'PRB-031' : 'INC538';
    const sec = (e, c) => { if (e === ei && c === ai) return; const yk = MT[e][c]; a.setMany({ etki:ETKI[e], aciliyet:ACL[c] }); if (yk !== kod) { const m = K + ' · Öncelik: ' + kod + ' → ' + yk; a.log(m); a.toast(m, () => a.setMany({ etki:d.etki, aciliyet:d.aciliyet })); } else a.log(K + ' · Etki ' + ETKI[e] + ', aciliyet ' + ACL[c] + ' · öncelik aynı'); };
    const tus = ev => { let e = ei, c = ai; if (ev.key === 'ArrowUp') e--; else if (ev.key === 'ArrowDown') e++; else if (ev.key === 'ArrowLeft') c--; else if (ev.key === 'ArrowRight') c++; else return; ev.preventDefault(); sec(Math.max(0, Math.min(3, e)), Math.max(0, Math.min(2, c))); };
    const H = HEDEF[kod];
    return { sutunlar: ACL.map(e => ({ e })), tus, kod, ad:p[1], renk:p[2], aciklama:'Etki ' + ETKI[ei] + ' · Aciliyet ' + ACL[ai],
      hedef: d.modul === 'problem' ? 'Hedef tarih: ' + ({ P1:3, P2:7, P3:14, P4:30 })[kod] + ' gün' : 'Çözüm hedefi ' + sa(H[0]) + ' · yanıt ' + sa(H[1]),
      satirlar: ETKI.map((e, i) => ({ e, hucreler: ACL.map((c, j) => { const k = MT[i][j], on = i === ei && j === ai; return { kod:k, renk:pri(k)[2], bd: on ? '2px solid #007a55' : '1px solid #e2e8f0', bg: on ? '#ecfdf5' : '#fff', hbg: on ? '#ecfdf5' : '#f8fafc', secili:String(on), etiket:'Etki ' + e + ', aciliyet ' + c + ': ' + k, sec: () => sec(i, j) }; }) })) };
  },
  kullan: ['Olay ve problemde önceliği etki ve aciliyetten türetmek için.', 'Öncelik değişince SLA hedefini (olay) ya da hedef tarihi (problem) yeniden hesaplatmak için.', 'Seçilen etkiyi listede kapsam metni olarak göstermek için ("Bölüm · Finans, 60 kullanıcı").'],
  kullanma: ['Talepte; talepte öncelik doğrudan seçilir.', 'Etkiyi iki ayrı alanda sormak için.', 'Beş seviyeli öncelikle; matris dört seviyedir (açık konu, 3.1.2).'],
  kontrast: [['#d23f43','#ffffff','P1 hücresi 13/600',4.5],['#b16a08','#ffffff','P2 hücresi',4.5],['#334155','#ecfdf5','Seçili P3 hücresi',4.5],['#64748b','#ffffff','Başlık 11/600',4.5],['#007a55','#ffffff','Seçili hücre kenarı',3]],
  klavye: [['Tab','Matrise odaklanır'],['← → ↑ ↓','Seçimi komşu hücreye taşır; öncelik anında değişir'],['—','Her hücrenin erişilebilir adı "Etki Bölüm, aciliyet Yüksek: P1"']]
});

const YOL = { normal:[['Hizmet sahibi','Barış Can Ataklı'],['CAB','admin admin'],['Güvenlik','Zeynep Ural']], acil:[['ECAB','admin admin']], standart:[] };
const GER = ['Geri alma süresi pencereyi aşıyor.','Etki analizi eksik.','Pencere başka bir değişiklikle çakışıyor.'];
L.bilesenler.push({
  id:'onay', no:'3.4.8', ad:'Onay yolu', grup:'d', dok:'b-onay', vmin:420,
  kontroller: [
    { k:'tur', e:'Değişiklik türü', t:'sec', o:[['normal','Normal'],['acil','Acil · ECAB'],['standart','Standart']] },
    { k:'adim', e:'Verilen onay', t:'aralik', min:0, max: d => (YOL[d.tur] || []).length, kosul: d => d.tur !== 'standart' },
    { k:'ret', e:'Sıradaki onaycı reddetti', t:'acik', kosul: d => d.tur !== 'standart' },
    { k:'ben', e:'Sıra bende', t:'acik', kosul: d => d.tur !== 'standart' }
  ],
  varsayilan: { tur:'normal', adim:1, ret:false, ben:true, gerekce:GER[0] },
  duzelt: d => { d.adim = Math.min(Math.round(d.adim), (YOL[d.tur] || []).length); },
  varyantlar: [ { e:'Sıra bende', d:{} }, { e:'Başkasında bekliyor', d:{ ben:false } }, { e:'Tamamlandı', d:{ adim:3 } }, { e:'Reddedildi', d:{ ret:true } }, { e:'Acil · ECAB', d:{ tur:'acil', adim:0, ben:false } } ],
  vm(d, a) {
    const Y = YOL[d.tur] || YOL.normal, n = Y.length, adim = d.adim, ret = !!d.ret && adim < n;
    const satirlar = Y.map(([rol, kisi], i) => {
      const r = i < adim ? { rBg:'#ecfdf5', rFg:'#006045', rozet:'✓', alt:'Onayladı · ' + (i === 0 ? 'Bugün 09:40' : 'Bugün 11:15'), altRenk:'#64748b', bd:'#e2e8f0', bg:'#fff', notVar: i === 0, not:'Pencere iş birimleriyle uzlaşıldı; bordro kapanışı 25 Eyl, çakışma yok.' }
        : i === adim && ret ? { rBg:'#fbe9ea', rFg:'#b3282d', rozet:'✕', alt:'Reddetti · 17 Eyl 14:00', altRenk:'#b3282d', bd:'#f3b4b6', bg:'#fef4f4', notVar:true, not: d.gerekce || GER[0] }
        : i === adim ? { rBg:'#fdf1e0', rFg:'#9a5b0a', rozet:String(i + 1), alt: d.ben ? 'Onayınız bekleniyor' : 'Onay bekleniyor · 2 sa', altRenk:'#9a5b0a', bd:'#a4f4cf', bg:'#f8fafc', notVar:false, not:'' }
        : { rBg:'#f1f5f9', rFg:'#64748b', rozet:String(i + 1), alt:'Sırada', altRenk:'#64748b', bd:'#e2e8f0', bg:'#fff', notVar:false, not:'' };
      return Object.assign(r, { rol, kisi, eylem: i === adim && !ret && !!d.ben,
        onayla: () => { a.set('adim', adim + 1); const m = 'CHG-118 · ' + rol + ' onayı verildi' + (adim + 1 === n ? ' · Durum: Onay bekliyor → Planlandı' : ''); a.log(m); a.toast(m, () => a.set('adim', adim)); },
        reddet: ev => a.menu(ev, { baslik:'CHG-118 · Ret gerekçesi', genislik:290, ogeler: GER.map(e => ({ k:e, e })), sec: k => { a.setMany({ ret:true, gerekce:k }); const m = 'CHG-118 · ' + rol + ' reddetti · Durum: Onay bekliyor → Reddedildi'; a.log(m); a.toast(m, () => a.set('ret', false)); } }) }); });
    const tamam = n > 0 && adim >= n;
    return { yol: n ? Y.map(y => y[0]).join(' → ') : 'önceden onaylı', ilerleme: n ? adim + ' / ' + n : '—', satirlar, notVar: d.tur !== 'normal',
      not: d.tur === 'acil' ? 'Acil değişiklik: ECAB onayı uygulamadan sonra alınabilir.' : 'Standart değişiklik önceden onaylıdır · şablon ST-04. Onay yolu çizilmez.',
      sonucVar: tamam || ret, sonuc: ret ? 'Tek ret durumu Reddedildi yaptı.' : 'Son onayla durum Planlandı oldu.', sonucRenk: ret ? '#b3282d' : '#006045' };
  },
  kullan: ['Değişikliğin onaycılarını sırasıyla, her biri bir satırda göstermek için.', 'Sırası gelen onaycının onayı satırdan vermesi için (Onayla / Reddet).', 'Zorunlu ama düz metin "Onay Durumu" alanının yerine.'],
  kullanma: ['Standart değişiklikte; önceden onaylıdır.', 'Reti gerekçesiz kaydetmek için.', 'Onay sırasını yalnızca renkle anlatmak için; rozette sıra numarası ya da ✓ / ✕ yazar.'],
  kontrast: [['#006045','#ecfdf5','Onayladı rozeti',4.5],['#9a5b0a','#fdf1e0','Sırası geldi rozeti',4.5],['#64748b','#f1f5f9','Sırada rozeti',4.5],['#b3282d','#fbe9ea','Reddetti rozeti',4.5],['#9a5b0a','#f8fafc','"Onayınız bekleniyor"',4.5]],
  klavye: [['Tab','Sırası gelen satırda Onayla → Reddet'],['Enter','Onaylar; Reddet gerekçe listesini açar'],['Esc','Gerekçe listesini kapatır']]
});

const KOD = ['Kalıcı çözüm','Geçici çözüm','Kullanıcı hatası','Yeniden başlatıldı'], KOK = ['Yapılandırma','Donanım','Yazılım hatası','Kapasite'], GRUP = ['Level 2 Analist','Ağ ekibi','Sunucu ekibi'];
L.bilesenler.push({
  id:'cekmece', no:'3.4.9', ad:'Çekmece ve açılır form', grup:'d', dok:'b-cekmece', vmin:560, minH:'540px',
  kontroller: [ { k:'tur', e:'Tür', t:'sec', o:[['cekmece','Çekmece · Çöz'],['form','Açılır form · Transfer et']] }, { k:'acik', e:'Açık', t:'acik' }, { k:'denendi', e:'Doğrulama hatalarını göster', t:'acik', kosul: d => d.tur === 'cekmece' } ],
  varsayilan: { tur:'cekmece', acik:false, denendi:false, kod:'', kok:'', aciklama:'', kb:false, grup:'', kisi:'' },
  varyantlar: [ { e:'Çekmece · boş', d:{ acik:true } }, { e:'Çekmece · doğrulama', d:{ acik:true, denendi:true } }, { e:'Çekmece · dolu', d:{ acik:true, kod:'Kalıcı çözüm', kok:'Yapılandırma', aciklama:'Exchange DAG üyesi yeniden eşitlendi, posta akışı normale döndü.', kb:true } }, { e:'Açılır form', d:{ tur:'form', acik:true } } ],
  vm(d, a) {
    const cek = d.tur !== 'form', acik = !!d.acik, hk = d.denendi && !d.kod, ha = d.denendi && !(d.aciklama || '').trim();
    const sc = (k, liste, baslik) => ev => a.menu(ev, { baslik, genislik:240, ogeler: liste.map(e => ({ k:e, e })), secili: d[k], sec: v => a.set(k, v) });
    return { cekAcik: acik && cek, formAcik: acik && !cek,
      ac: () => { a.setMany({ acik:true, tur:'cekmece' }); a.log('Çekmece açıldı · Çöz'); }, formAc: () => { a.setMany({ acik:true, tur:'form' }); a.log('Açılır form · Transfer et'); },
      kapat: () => { a.set('acik', false); a.log('Kapatıldı'); }, tus: ev => { if (ev.key === 'Escape') { ev.stopPropagation(); a.set('acik', false); a.log('Esc · kapatıldı'); } },
      odak: a.canli ? el => { if (el && !el._od) { el._od = 1; try { el.focus({ preventScroll:true }); } catch (e) {} } } : null,
      kod: d.kod || 'Seçin', kodRenk: d.kod ? '#020618' : '#64748b', kodAc: sc('kod', KOD, 'Çözüm kodu'), kodBd: hk ? '#f3b4b6' : '#e2e8f0', hataKod: hk,
      kok: d.kok || 'Seçin', kokRenk: d.kok ? '#020618' : '#64748b', kokAc: sc('kok', KOK, 'Kök neden'),
      aciklama: d.aciklama || '', yaz: ev => a.set('aciklama', ev.target.value), acBd: ha ? '#f3b4b6' : '#e2e8f0', hataAc: ha,
      kbBd: d.kb ? '#007a55' : '#cbd5e1', kbBg: d.kb ? '#007a55' : '#fff', kbIs: d.kb ? '✓' : '', kbStr: String(!!d.kb), kbDegis: () => a.set('kb', !d.kb),
      coz: () => { if (!d.kod || !(d.aciklama || '').trim()) { a.set('denendi', true); a.log('Doğrulama: zorunlu alanlar boş'); return; } a.setMany({ acik:false, denendi:false }); const m = 'INC546 · Durum: Çalışılıyor → Çözüldü'; a.log(m + (d.kb ? ' · KB makalesi önerildi' : '')); a.toast(m, () => a.set('acik', true)); },
      grup: d.grup || 'Level 2 Analist', grupAc: sc('grup', GRUP, 'Grup'), kisi: d.kisi || 'Seçin', kisiRenk: d.kisi ? '#020618' : '#64748b', kisiAc: sc('kisi', KISI, 'Kişi'),
      transfer: () => { a.set('acik', false); const m = 'INC546 · Grup: Level 1 → ' + (d.grup || 'Level 2 Analist') + (d.kisi ? ' · Atanan: ' + d.kisi : ''); a.log(m); a.toast(m, () => a.set('acik', true)); } };
  },
  kullan: ['Birden çok alan ya da metin isteyen işlem için çekmece: Çöz, Çözüme aktar, Kök nedeni kaydet, Kapat.', 'İki üç alanlı hızlı işlem için açılır form: Transfer et, Talebe dönüştür.', 'Kaydetmeden önce işlemin etkisini sonuç kutusunda söylemek için.'],
  kullanma: ['Tek alan için; hücre içi menü yeterli.', 'Kaydı arkada gizleyen tam ekran bir form için.', 'Birincil düğmeyi pasif bırakmak için; eksik alan gönderilince işaretlenir.'],
  kontrast: [['#64748b','#ffffff','Alan etiketi 12 px',4.5],['#d23f43','#ffffff','Zorunlu * işareti',3],['#b3282d','#ffffff','Hata metni 12 px',4.5],['#64748b','#f8fafc','Sonuç kutusu',4.5]],
  klavye: [['Esc','Çekmeceyi ya da formu kapatır'],['Tab','Odak çekmecenin içinde kalır; kapanınca tetikleyiciye döner'],['Enter','Açılır formda gönderir']]
});

const AI = {
  cozum: { baslik:'Çözüm taslağı hazır', oneri:'Posta kutusu sunucusu MBX-02 yeniden eşitlendi; kuyruktaki iletiler teslim edildi.', gerekce:'Benzer iki kapalı olayda aynı adım uygulanmış.', kabul:'Taslağı kullan', red:'Yoksay', sonuc:'Taslak çözüm açıklamasına eklendi; akışa "AI önerisi" kaynağıyla yazıldı.' },
  talep: { baslik:'Bu kayıt bir hizmet talebi olabilir', oneri:'', gerekce:'Açıklama "Şifre sıfırlama" katalog öğesiyle eşleşiyor. Dönüştürülürse olay SLA\'sı yerine talep SLA\'sı işler.', kabul:'Talebe dönüştür', red:'Olay olarak kalsın', sonuc:'REQ-291 oluşturuldu; olay talebe dönüştürüldü.' }
};
L.bilesenler.push({
  id:'ai', no:'3.4.10', ad:'AI öneri kartı', grup:'d', dok:'b-ai', vmin:360,
  kontroller: [ { k:'tur', e:'Öneri', t:'sec', o:[['cozum','Çözüm taslağı'],['talep','Talebe dönüştür']] }, { k:'durum', e:'Durum', t:'sec', o:[['hazir','Hazır'],['kabul','Kabul edildi'],['yok','Yoksayıldı']] } ],
  varsayilan: { tur:'cozum', durum:'hazir' },
  varyantlar: [ { e:'Çözüm taslağı', d:{} }, { e:'Talebe dönüştür', d:{ tur:'talep' } }, { e:'Kabul edildi', d:{ durum:'kabul' } }, { e:'Yoksayıldı', d:{ durum:'yok' } } ],
  vm(d, a) {
    const A = AI[d.tur] || AI.cozum, du = d.durum || 'hazir';
    return { yok: du === 'yok', goster: du !== 'yok', baslik:A.baslik, kutuVar:!!A.oneri, oneri:A.oneri, gerekce:A.gerekce, hazir: du === 'hazir', kabulEdildi: du === 'kabul', kabulE:A.kabul, redE:A.red, sonuc:A.sonuc,
      kabul: () => { a.set('durum', 'kabul'); a.log('AI önerisi kabul edildi · ' + A.kabul); }, red: () => { a.set('durum', 'yok'); a.log('AI önerisi yoksayıldı'); }, geri: () => { a.set('durum', 'hazir'); a.log('AI önerisi geri getirildi'); } };
  },
  kullan: ['Modelin önerisini ayrı kartta, AI rozetiyle ve gerekçesiyle sunmak için.', 'Detay ana sütununun başında, ilgili karttan önce; çekmecede Bilgi Bankası eşleşmesi için.', 'Kabul edilen öneriyi akışa kaynağıyla yazmak için.'],
  kullanma: ['Öneriyi kendiliğinden uygulamak için; kullanıcı kabul eder, düzenler ya da yoksayar.', 'Gerekçesiz öneri için.', 'AI rozetini sistemin doldurduğu içerikte kullanmak için; o OTOMATİK rozetidir.'],
  kontrast: [['#334155','#ffffff','Gövde 13 px',4.5],['#334155','#f8fafc','Önerilen metin',4.5],['#007a55','#ffffff','AI rozeti',4.5],['#006045','#ffffff','Kabul satırı',4.5]],
  klavye: [['Tab','Kabul → yoksay; öneri odak çalmaz'],['Enter','Seçilen eylemi uygular']]
});

const UB = ['HelpDesk','Apeiron','HelpDesk English','AI'];
L.bilesenler.push({
  id:'ustbar', no:'2.4 · 1', ad:'Üst bar', grup:'k', dok:'t-kabuk', olcuSec:['Üst bar'], vmin:640,
  aciklama:'Uygulamanın en üstündeki 49 px şerit: menü paneli simgesi, logo, ürün sekmeleri, Customize, tema ve araçlar. Açık ve koyu tema; çerçeve 1000 px\'in altına inince yalnız aktif ürün sekmesi kalır.',
  kontroller: [ { k:'tema', e:'Tema', t:'sec', o:[['acik','Açık'],['koyu','Koyu']] }, { k:'aktif', e:'Ürün sekmesi', t:'sec', o: UB.map(e => [e]) } ],
  varsayilan: { tema:'acik', aktif:'HelpDesk' },
  varyantlar: [ { e:'Açık', d:{} }, { e:'Koyu', d:{ tema:'koyu' } } ],
  vm(d, a) {
    const k = d.tema === 'koyu', cw = a.cw || 1200, genis = cw >= 1000, ak = UB.includes(d.aktif) ? d.aktif : UB[0];
    const T = k ? { zemin:'#020618', fg:'#f8fafc', cizgi:'rgba(255,255,255,.12)', soluk:'#94a3b8', nav:'#cbd5e1', aktifZ:'rgba(255,255,255,.08)', aktifFg:'#fff', btnZ:'rgba(255,255,255,.08)', btnC:'rgba(255,255,255,.14)', logo:'../assets/dcase-logo-dark.svg' }
      : { zemin:'#fff', fg:'#020618', cizgi:'#e2e8f0', soluk:'#475569', nav:'#020618', aktifZ:'#f1f5f9', aktifFg:'#020618', btnZ:'#f1f5f9', btnC:'#e2e8f0', logo:'../assets/dcase-logo.svg' };
    return Object.assign({}, T, { acikTema: !k, koyuTema: k, solW: cw >= 1200 ? '236px' : 'auto', genis, cwMetin: 'Çerçeve ' + cw + ' px · ' + (genis ? 'tüm ürün sekmeleri' : 'yalnız aktif sekme'),
      sekmeler: (genis ? UB : [ak]).map((e, i) => ({ e, ayirici: i > 0, bg: e === ak ? T.aktifZ : 'transparent', fg: e === ak ? T.aktifFg : T.nav, fw: e === ak ? 600 : 400, sec: () => { if (e !== ak) { a.set('aktif', e); a.log('Ürün sekmesi: ' + e); } } })),
      panel: () => a.log('Panel simgesi · dcase:menu olayı yayınlanır'), ozel: () => a.log('Özelleştir açılır') });
  },
  kullan: ['Her ekranın en üstünde, yapışkan (top:0, z-index 50).', 'Koyu temada dcase-logo-dark.svg ile; işaret iki temada da #00BD80.', 'Menüyü panel simgesiyle daraltmak ya da içeriğin üzerine açmak için (dcase:menu).'],
  kullanma: ['Sayfa eylemleri için; sayfa eylemleri kimlik başlığında ya da araç çubuğunda.', 'Logo yerine metin yazmak için.', 'Logo tonunu sekme ya da metin rengi yapmak için.'],
  kontrast: [['#020618','#ffffff','Sekme 14 px · açık',4.5],['#475569','#ffffff','ITSM etiketi · açık',4.5],['#ffffff','#020618','Aktif sekme · koyu',4.5],['#cbd5e1','#020618','Pasif sekme · koyu',4.5],['#94a3b8','#020618','ITSM etiketi · koyu',4.5],['#00bd80','#020618','Logo işareti · koyu',3]],
  klavye: [['Tab','Panel simgesi → ürün sekmeleri → Customize → tema → araçlar'],['Enter','Panel simgesi menüyü daraltır ya da açar']]
});

const SM = [['talep','Talep Yönetimi','#f5a524','mail','Üzerimdeki Talepler'],['olay','Olay Yönetimi','#e5484d','uyari','Olay Listesi'],['problem','Problem Yönetimi','#e5484d','bocek','Problem Listesi'],['degisiklik','Değişiklik Yönetimi','#f5a524','dosya','Değişiklik Listesi']];
L.bilesenler.push({
  id:'solmenu', no:'2.4 · 2', ad:'Sol menü', grup:'k', dok:'t-kabuk', olcuSec:['Sol menü','Modül ikonları','Sayfa iskeleti'], vmin:560, minH:'420px',
  aciklama:'Modül menüsü. 1200 px ve üstünde tam menü (256 px), 800–1199 px arasında ikon rayı (56 px), 800 px altında gizli; ray ve gizli modda panel simgesi menüyü içeriğin üzerine açar. "Genişlikten" seçiliyken mod çerçeve genişliğine göre değişir.',
  kontroller: [ { k:'kip', e:'Mod', t:'sec', o:[['oto','Genişlikten'],['tam','Tam · 256'],['ray','Ray · 56'],['gizli','Gizli']] }, { k:'acik', e:'Menü içeriğin üzerinde açık', t:'acik' }, { k:'aktif', e:'Aktif modül', t:'sec', o: SM.map(m => [m[0], m[1].split(' ')[0]]) } ],
  varsayilan: { kip:'oto', acik:false, aktif:'olay' },
  varyantlar: [ { e:'Tam · ≥ 1200 px', d:{ kip:'tam' } }, { e:'İkon rayı · 800–1199 px', d:{ kip:'ray' } }, { e:'Ray · menü açık', d:{ kip:'ray', acik:true } }, { e:'Gizli · menü açık', d:{ kip:'gizli', acik:true } } ],
  vm(d, a) {
    const cw = a.cw || 1200, oto = cw >= 1200 ? 'tam' : cw >= 800 ? 'ray' : 'gizli', kip = d.kip === 'oto' ? oto : d.kip, tam = kip === 'tam', ray = kip === 'ray', acik = !tam && !!d.acik;
    return { tam, ray, panelVar: tam || acik, panelPos: tam ? 'relative' : 'absolute', panelGolge: acik ? '12px 0 32px rgba(2,6,24,.18)' : 'none', ortu: acik, menuW: tam ? '256px' : ray ? '56px' : '0',
      kipMetin: (d.kip === 'oto' ? 'Genişlikten · ' : '') + (tam ? 'tam menü 256 px' : ray ? 'ikon rayı 56 px' : 'gizli') + ' · çerçeve ' + cw + ' px', kalkan: IK.kalkan, kitap: IK.kitap,
      moduller: SM.map(m => { const on = m[0] === d.aktif; return { e:m[1], renk:m[2], ikon:IK[m[3]], alt:m[4], acik:on, grupBg: on ? '#f1f5f9' : 'transparent', rayBg: on ? '#ecfdf5' : 'transparent', sec: () => { a.set('aktif', m[0]); a.log('Menü: ' + m[4]); } }; }),
      panel: () => { if (tam) { a.setMany({ kip:'ray', acik:false }); a.log('dcase:menu · menü daraltıldı'); } else { a.set('acik', !d.acik); a.log('dcase:menu · menü ' + (d.acik ? 'kapandı' : 'içeriğin üzerine açıldı')); } },
      kapat: () => { a.set('acik', false); a.log('Örtüye tıklandı · menü kapandı'); },
      daralt: () => { if (tam) { a.set('kip', 'ray'); a.log('Menü daraltıldı'); } else { a.set('acik', false); a.log('Menü kapandı'); } },
      genislet: () => { if (cw >= 1200) { a.setMany({ kip:'tam', acik:false }); a.log('Menü genişletildi'); } else { a.set('acik', true); a.log('Menü içeriğin üzerine açıldı'); } } };
  },
  kullan: ['Modüller arasında gezinmek için; detay ekranı da listenin menü öğesini aktif gösterir.', 'Dar görünümde ikon rayına ya da gizli moda geçmek için; kabuk kendini ayarlar.', 'Ray ve gizli modda menüyü içeriğin üzerine açmak için (örtü + gölge).'],
  kullanma: ['Sayfa şablonunda sarmalayıcıya sabit genişlik vermek için.', 'Sayfa içi sekmeler için; onlar kuyruk sekmeleri.', 'Modül ikon renklerini durum rengi gibi kullanmak için.'],
  kontrast: [['#020618','#ffffff','Menü öğesi 14 px',4.5],['#007a55','#ecfdf5','Aktif sayfa 13/600',4.5],['#020618','#f1f5f9','Açık grup',4.5],['#64748b','#ffffff','Ray düğmesi ikonu',3]],
  klavye: [['Tab','Menü öğeleri sırayla; grup başlığı Enter ile açılır / kapanır'],['Esc','Ray ya da gizli modda açılan menüyü kapatır'],['—','Panel simgesi (üst bar) dcase:menu olayını yayar']]
});
})();
