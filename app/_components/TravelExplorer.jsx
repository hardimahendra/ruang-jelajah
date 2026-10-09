"use client";

import { useEffect, useState } from "react";

const topics = [["Nusantara", "Indonesia landscape"], ["Gunung", "Indonesia mountain landscape"], ["Pantai", "Indonesia beach landscape"], ["Hutan", "Indonesia forest landscape"]];

function locationLabel(photo) {
  return [...new Map([photo.location.name, photo.location.city, photo.location.country].filter(Boolean).flatMap((value) => value.split(",").map((part) => part.trim()).filter(Boolean)).map((value) => [value.toLowerCase(), value])).values()].join(", ");
}

export default function TravelExplorer() {
  const [topic, setTopic] = useState(topics[0]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError("");
      try {
        const response = await fetch(`/api/destinasi?q=${encodeURIComponent(topic[1])}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Lanskap tidak dapat dimuat.");
        setPhotos(payload.data);
      } catch (reason) {
        if (reason.name !== "AbortError") setError(reason.message || "Lanskap tidak dapat dimuat.");
      } finally { setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, [topic]);

  return <main className="journey-library">
    <header className="journey-header"><a className="journey-logo" href="#jelajah"><span>rj</span>ruang<br /><b>jelajah</b></a><p>LANDSCAPE NOTES / UNSPLASH</p><a href="https://unsplash.com" target="_blank" rel="noreferrer">Kredit foto ↗</a></header>
    <section className="journey-hero" id="jelajah"><p>CATATAN LANSKAP · LIVE</p><h1>Melihat tempat,<br /><i>menyebut lokasinya.</i></h1><span>Lokasi ditampilkan hanya jika tercantum pada metadata foto Unsplash—bukan perkiraan dari gambar.</span></section>
    <section className="journey-toolbar" aria-label="Topik lanskap"><div>{topics.map((entry) => <button key={entry[0]} className={topic[0] === entry[0] ? "active" : ""} aria-pressed={topic[0] === entry[0]} onClick={() => setTopic(entry)}>{entry[0]}</button>)}</div><p>{loading ? "Memuat lanskap…" : `${photos.length} LOKASI BERLABEL`}</p></section>
    {error ? <section className="journey-state" role="alert"><h2>{error}</h2><p>Pastikan konfigurasi Unsplash tersedia, lalu coba lagi.</p><button onClick={() => setTopic([...topic])}>Coba lagi</button></section> : null}
    {!error && <section className="journey-grid" aria-live="polite">{photos.map((photo) => <article key={photo.id}><button className="journey-photo" onClick={() => setSelected(photo)} aria-label={`Buka detail lokasi ${locationLabel(photo)}`}><img src={photo.url} alt={photo.alt} /></button><div><p>LOKASI MENURUT UNSPLASH</p><h2>{locationLabel(photo)}</h2><span>{photo.alt}</span><a href={photo.profile} target="_blank" rel="noreferrer">Foto oleh {photo.author} ↗</a></div></article>)}{loading && Array.from({ length: 8 }, (_, index) => <div className="journey-skeleton" key={index} aria-hidden="true" />)}</section>}
    {!loading && !error && !photos.length ? <section className="journey-state"><h2>Belum ada foto dengan metadata lokasi.</h2><p>Pilih kategori lain untuk memuat lanskap yang lokasinya dicantumkan fotografer.</p></section> : null}
    {selected ? <div className="journey-overlay" role="presentation" onClick={() => setSelected(null)}><section className="journey-dialog" role="dialog" aria-modal="true" aria-labelledby="journey-title" onClick={(event) => event.stopPropagation()}><button className="journey-close" aria-label="Tutup detail" onClick={() => setSelected(null)}>×</button><img src={selected.url} alt={selected.alt} /><p>LOKASI MENURUT METADATA UNSPLASH</p><h2 id="journey-title">{locationLabel(selected)}</h2><span>{selected.alt}</span><dl><div><dt>Fotografer</dt><dd><a href={selected.profile} target="_blank" rel="noreferrer">{selected.author}</a></dd></div><div><dt>Sumber foto</dt><dd><a href={selected.link} target="_blank" rel="noreferrer">Buka di Unsplash ↗</a></dd></div>{selected.location.latitude && selected.location.longitude ? <div><dt>Koordinat</dt><dd>{selected.location.latitude.toFixed(4)}, {selected.location.longitude.toFixed(4)}</dd></div> : null}</dl></section></div> : null}
    <footer className="journey-footer"><span>RUANG JELAJAH</span><span>UNSPLASH API · LOKASI DARI METADATA FOTO</span></footer>
  </main>;
}
