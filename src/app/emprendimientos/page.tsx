"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { getEmprendimientosWithRelations, EmprendimientoWithRelations } from '@/services/emprendimientos.service';
import { getParroquias } from '@/services/parroquias.service';
import { getItemCatalogos } from '@/services/itemcatalogo.service';
import { getGaleriasWithDetalles } from '@/services/galeria.service';
import { getProductosByEmprendimiento, ProductoRow } from '@/services/producto.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EmprendimientosPage() {
  const [items, setItems] = useState<EmprendimientoWithRelations[]>([]);
  const [itemsAll, setItemsAll] = useState<EmprendimientoWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EmprendimientoWithRelations | null>(null);
  const [pageStart, setPageStart] = useState(0);
  const pageSize = 10;
  const [parroquias, setParroquias] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedFotos, setSelectedFotos] = useState<string[]>([]);
  const [productos, setProductos] = useState<ProductoRow[]>([]);

  // filters
  const [query, setQuery] = useState('');
  const [filterCategoriaId, setFilterCategoriaId] = useState<number | null>(null);
  const [filterParroquiaId, setFilterParroquiaId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // fetch all items once for client-side filtering
        const data = await getEmprendimientosWithRelations();
        if (!mounted) return;
        setItemsAll(data);
        // initialize visible page
        setPageStart(0);
      } catch (err) {
        console.error('Failed to load emprendimientos', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [pageStart]);

  // when selection changes, load up to 3 fotos from the GaleriaDetalle relation
  useEffect(() => {
    let mounted = true;
    (async () => {
      setSelectedFotos([]);
      if (!selected) return;
      try {
        // if selected already includes GaleriaDetalle, use it
        const g = selected.Galeria;
        if (g && (g as any).GaleriaDetalle && Array.isArray((g as any).GaleriaDetalle)) {
          const urls = ((g as any).GaleriaDetalle as any[]).map(d => d.ImagenUrl).filter(Boolean).slice(0, 3);
          if (!mounted) return;
          setSelectedFotos(urls);
          return;
        }

        // otherwise fetch the galeria with detalles by id
        if (selected.Galeria && selected.Galeria.Id) {
          const all = await getGaleriasWithDetalles();
          if (!mounted) return;
          const found = all.find(x => x.Id === selected.Galeria!.Id);
          const urls = (found?.GaleriaDetalle || []).map(d => (d as any).ImagenUrl).filter(Boolean).slice(0, 3);
          setSelectedFotos(urls);
        }
      } catch (err) {
        console.error('Failed to load galeria detalles', err);
      }
    })();
    // also load productos for this emprendimiento
    (async () => {
      try {
        setProductos([]);
        if (!selected) return;
        const prods = await getProductosByEmprendimiento(selected.Id, 0, 5);
        setProductos(prods);
      } catch (err) {
        console.error('Failed to load productos', err);
      }
    })();
    return () => { mounted = false; };
  }, [selected]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const ps = await getParroquias();
  if (!mounted) return;
  setParroquias(ps);
  const cats = await getItemCatalogos();
  if (!mounted) return;
  setCategorias(cats);
      } catch (err) {
        console.error('Failed to load parroquias', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // recompute filtered items from the full set
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return itemsAll.filter(it => {
      if (filterCategoriaId && !(it.ItemCatalogo?.Id === filterCategoriaId || it.IdCategoria === filterCategoriaId)) return false;
      if (filterParroquiaId && !(it.Parroquia?.Id === filterParroquiaId || it.IdParroquia === filterParroquiaId)) return false;
      if (!q) return true;
      const hay = (it.Nombre || '') + ' ' + (it.Descripcion || '');
      return hay.toLowerCase().includes(q);
    });
  }, [itemsAll, query, filterCategoriaId, filterParroquiaId]);

  // derive page items from filtered set
  useEffect(() => {
    setItems(filteredItems.slice(pageStart, pageStart + pageSize));
    // ensure selected is visible/valid
    if (!filteredItems.length) {
      setSelected(null);
    } else {
      const selectedStillVisible = selected && filteredItems.find(f => f.Id === selected.Id);
      if (!selectedStillVisible) setSelected(filteredItems[0]);
    }
  }, [filteredItems, pageStart]);

  const selectItem = (it: EmprendimientoWithRelations) => setSelected(it);

  return (
    <div>
      <Navbar />
      {/* Hero section */}
      <section className="main-hero relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/2.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
        <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
        <div className="relative z-10 flex flex-col justify-center h-screen px-12">
          <div className="max-w-[600px]">
            <h1 className="text-6xl font-black text-white mb-6">Emmprendimientos</h1>
            <p className="text-7md text-gray-300 mb-2">
                Descubre los emprendimientos de Sigchos: productores locales, artesanos y servicios que reflejan la tradición y el talento de la comunidad. Aquí encontrarás desde alimentos típicos hasta experiencias turísticas únicas.
            </p>
            <p className="text-7md text-gray-300 mb-8">
                Revisa la lista y apoya el comercio local — cada emprendimiento tiene una historia que contar. Explora la página para ver galerías, horarios y contactos, y anímate a visitar o contactar a quienes hacen posible Sigchos.
            </p>
            <button
              type="button"
              onClick={() => {
                const formSection = document.getElementById('emprendimientos-list');
                formSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="contactanos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold"
            >
              Ver Emprendimientos
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                const formSection = document.getElementById('emprendimientos-list');
                formSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute bottom-24 right-24 w-16 h-16 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-[#12141d] text-white transition-all duration-300"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section id="emprendimientos-list" style={{ maxWidth: 1100, margin: '24px auto', display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, boxSizing: 'border-box', overflowX: 'hidden' }}>

        <div className="mx-auto max-w-3xl text-center" style={{ gridColumn: '1 / -1', marginBottom: 6 }}>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ margin:0 }}>
            Emprendimientos en {' '}
            <span className="bg-gradient-to-r from-blue-300 via-blue-500 to-pink-600 bg-clip-text text-transparent">
              SIGCHOS
            </span>
          </h2>
        </div>

        <div style={{ background:'#fff', padding:12, borderRadius:10, boxShadow:'0 8px 24px rgba(2,6,23,0.06)', height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
            Gestión de Emprendimientos
        </h1>
          <div style={{ display:'flex', gap:8, marginBottom:10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              placeholder="Buscar por nombre o descripción..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPageStart(0); }}
              style={{ flex: '1 1 220px', minWidth:0, padding:8, borderRadius:8, border:'1px solid #e6e6e6', boxSizing: 'border-box' }}
            />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
        <div style={{ position: 'relative', flex: '0 0 140px', minWidth: 120 }}>
                    <select
                        aria-label="Filtrar por categoría"
                        value={filterCategoriaId ?? ''}
                        onChange={(e) => { setFilterCategoriaId(e.target.value ? Number(e.target.value) : null); setPageStart(0); }}
            style={{
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
              width: '100%',
              padding: '8px 36px 8px 12px',
                            borderRadius: 10,
                            border: '1px solid #e6e6e6',
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(2,6,23,0.04)',
                            cursor: 'pointer',
                            fontSize: 14,
              color: '#111827',
              boxSizing: 'border-box'
                        }}
                    >
                        <option value="">Categorías</option>
                        {categorias.map(c => (
                            <option key={c.Id} value={c.Id}>{c.Nombre}</option>
                        ))}
                    </select>
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', width: 16, height: 16, color: '#6b7280' }}
                    >
                        <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                    </svg>
                </div>

                <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 140 }}>
                    <select
                        aria-label="Filtrar por parroquia"
                        value={filterParroquiaId ?? ''}
                        onChange={(e) => { setFilterParroquiaId(e.target.value ? Number(e.target.value) : null); setPageStart(0); }}
            style={{
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            width: '100%',
              padding: '8px 36px 8px 12px',
                            borderRadius: 10,
                            border: '1px solid #e6e6e6',
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(2,6,23,0.04)',
                            cursor: 'pointer',
                            fontSize: 14,
              color: '#111827',
              boxSizing: 'border-box'
                        }}
                    >
                        <option value="">Parroquia</option>
                        {parroquias.map(p => (
                            <option key={p.Id} value={p.Id}>{p.Nombre}</option>
                        ))}
                    </select>
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', width: 16, height: 16, color: '#6b7280' }}
                    >
                        <path strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                    </svg>
                </div>
            </div>
          </div>
          {loading && <div>Cargando...</div>}
          {!loading && items.length === 0 && <div>No hay emprendimientos.</div>}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 6 }}>
            {items.map(it => (
              <div
                key={it.Id}
                onClick={() => selectItem(it)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectItem(it); }}
                style={{ padding:10, marginBottom:8, background: selected?.Id === it.Id ? '#f0f7ff' : 'transparent', borderRadius:8, cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  {/* Avatar / thumbnail */}
                  <div style={{ width:56, height:56, borderRadius:8, background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#3730a3', flexShrink:0 }} aria-hidden>
                    {String((it.Nombre || '').charAt(0)).toUpperCase() || '?'}
                  </div>

                  {/* Content */}
                  <div style={{ minWidth:0, flex: '1 1 auto' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                      <strong style={{ fontSize:16, lineHeight:1.1 }}>{it.Nombre}</strong>
                      <div style={{ fontSize:12, color:'#888' }}>{it.Parroquia?.Nombre ?? ''}</div>
                    </div>

                    <div style={{ fontSize:13, color:'#666', marginTop:6, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {it.Descripcion ?? ''}
                    </div>

                    <div style={{ marginTop:8, display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ background:'#eef2ff', color:'#3730a3', padding:'4px 8px', borderRadius:999, fontSize:12 }}>
                        {it.ItemCatalogo?.Nombre ?? (categorias.find(c => c.Id === it.IdCategoria)?.Nombre) ?? 'Sin categoría'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, marginBottom:4 }}>
            <button onClick={() => setPageStart(Math.max(0, pageStart - pageSize))} disabled={pageStart === 0}>Anterior</button>
            <button onClick={() => setPageStart(pageStart + pageSize)} disabled={items.length < pageSize}>Siguiente</button>
          </div>
        </div>

        <div style={{ background:'#fff', padding:18, borderRadius:10, boxShadow:'0 8px 24px rgba(2,6,23,0.06)', minHeight: '60vh' }}>
          {!selected ? (
            <div>Seleccione un emprendimiento para ver detalles.</div>
          ) : (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{selected.Nombre}</h2>
              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <div style={{ flex:1 }}>
                  <label>Horario</label>
                  <div style={{ padding:12, background:'#fafafa', borderRadius:8 }}>{selected.Horario ?? 'No disponible'}</div>
                </div>
              </div>

              <section style={{ marginTop:16 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Descripción</h3>
                <p>{selected.Descripcion}</p>
              </section>

              <section style={{ marginTop:16 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Galería</h3>
                <div style={{ marginTop:8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {selectedFotos.length > 0 ? (
                      selectedFotos.map((u, i) => (
                        <img
                          key={i}
                          src={u}
                          alt={`Foto ${i + 1}`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              // open lightbox on keyboard activation
                              const overlay = document.createElement('div');
                              overlay.style.position = 'fixed';
                              overlay.style.inset = '0';
                              overlay.style.display = 'flex';
                              overlay.style.alignItems = 'center';
                              overlay.style.justifyContent = 'center';
                              overlay.style.background = 'rgba(0,0,0,0.85)';
                              overlay.style.zIndex = '9999';
                              overlay.style.padding = '20px';
                              const imgEl = document.createElement('img');
                              imgEl.src = u;
                              imgEl.alt = `Foto ${i + 1}`;
                              imgEl.style.maxWidth = '90%';
                              imgEl.style.maxHeight = '90%';
                              imgEl.style.borderRadius = '10px';
                              imgEl.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
                              overlay.appendChild(imgEl);
                              const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') close(); };
                              const close = () => { window.removeEventListener('keydown', onKey); if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
                              overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
                              window.addEventListener('keydown', onKey);
                              document.body.appendChild(overlay);
                            }
                          }}
                          onClick={() => {
                            const overlay = document.createElement('div');
                            overlay.style.position = 'fixed';
                            overlay.style.inset = '0';
                            overlay.style.display = 'flex';
                            overlay.style.alignItems = 'center';
                            overlay.style.justifyContent = 'center';
                            overlay.style.background = 'rgba(0,0,0,0.85)';
                            overlay.style.zIndex = '9999';
                            overlay.style.padding = '20px';

                            const imgEl = document.createElement('img');
                            imgEl.src = u;
                            imgEl.alt = `Foto ${i + 1}`;
                            imgEl.style.maxWidth = '90%';
                            imgEl.style.maxHeight = '90%';
                            imgEl.style.borderRadius = '10px';
                            imgEl.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
                            overlay.appendChild(imgEl);

                            const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') close(); };
                            const close = () => { window.removeEventListener('keydown', onKey); if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };

                            overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
                            window.addEventListener('keydown', onKey);
                            document.body.appendChild(overlay);
                          }}
                          style={{ width: 220, height: 170, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                        />
                      ))
                    ) : (
                      <div style={{ color: '#666' }}>No hay fotos disponibles para esta galería.</div>
                    )}
                  </div>
                  {/* Productos relacionados */}
                  <div style={{ marginTop: 12 }}>
                    <h4 style={{ margin: '8px 0', fontSize: 15, fontWeight: 700 }}>Productos</h4>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {productos.length > 0 ? productos.map(p => (
                        <div key={p.Id} style={{ width: 160, background: '#fff', borderRadius: 8, padding: 8, boxShadow: '0 6px 18px rgba(2,6,23,0.06)', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ width: '100%', height: 90, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                            {p.ImagenUrl ? (
                              <img src={p.ImagenUrl} alt={p.Nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Sin imagen</div>
                            )}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0b2e55' }}>{p.Nombre}</div>
                          <div style={{ fontSize: 13, color: '#374151' }}>{p.Descripcion ? (p.Descripcion.length > 60 ? p.Descripcion.slice(0, 60) + '…' : p.Descripcion) : ''}</div>
                          {typeof p.Valor === 'number' && <div style={{ marginTop: 6, fontWeight: 700, color: '#0b2e55' }}>₡{p.Valor}</div>}
                        </div>
                      )) : (
                        <div style={{ color: '#666' }}>No hay productos vinculados a este emprendimiento.</div>
                      )}
                    </div>
                  </div>
                
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
