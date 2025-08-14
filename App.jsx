import React, { useMemo, useState } from 'react'

function round2(n){ return Math.round(n*100)/100 }

export default function App(){
  const [platform, setPlatform] = useState('Vinted')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [condition, setCondition] = useState('Ottimo')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [keywords, setKeywords] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [targetMargin, setTargetMargin] = useState('30')
  const [platformFeePct, setPlatformFeePct] = useState('0')
  const [otherCosts, setOtherCosts] = useState('0')

  const suggestion = useMemo(()=>{
    const p = parseFloat(purchasePrice||'0')
    const margin = parseFloat(targetMargin||'0')/100
    const feePct = parseFloat(platformFeePct||'0')/100
    const extra = parseFloat(otherCosts||'0')
    const baseCost = p + extra
    const suggestedPrice = baseCost>0 ? baseCost*(1+margin)/Math.max(1-feePct,0.01) : 0
    const fees = suggestedPrice*feePct
    const profit = suggestedPrice - p - extra - fees
    return { suggestedPrice: round2(suggestedPrice)||0, fees: round2(fees)||0, profit: round2(profit)||0 }
  }, [purchasePrice, targetMargin, platformFeePct, otherCosts])

  const title = useMemo(()=>{
    const parts = [brand, category, size && `taglia ${size}`, color].filter(Boolean)
    const base = parts.join(' · ')
    const extras = keywords ? ` | ${keywords}` : ''
    return `${base}${extras}`.trim()
  }, [brand, category, size, color, keywords])

  const description = useMemo(()=>{
    return (`${brand?brand+' ':''}${category}`.trim()+
      `\n• Condizione: ${condition}`+
      `${size?`\n• Taglia: ${size}`:''}`+
      `${color?`\n• Colore: ${color}`:''}`+
      `${keywords?`\n• Dettagli: ${keywords}`:''}`+
      `\n\nSpedizione tracciata. Consegna a mano in zona disponibile. `+
      `Disponibile a creare lotti e fare un piccolo sconto.`
    )
  }, [brand, category, condition, size, color, keywords])

  function copy(text){ navigator.clipboard.writeText(text) }
  function resetAll(){
    setPlatform('Vinted'); setCategory(''); setBrand(''); setCondition('Ottimo')
    setSize(''); setColor(''); setKeywords('')
    setPurchasePrice(''); setTargetMargin('30'); setPlatformFeePct('0'); setOtherCosts('0')
  }

  return (
    <div style={{padding:'20px', fontFamily:'sans-serif'}}>
      <h1>FlipHelper</h1>
      <h3>Generatore Annuncio</h3>
      <label>Piattaforma: </label>
      {['Vinted','Wallapop','Facebook'].map(p=>(
        <button key={p} onClick={()=>setPlatform(p)} style={{margin:'5px', background:platform===p?'#ccc':''}}>{p}</button>
      ))}
      <div><label>Categoria: </label><input value={category} onChange={e=>setCategory(e.target.value)} /></div>
      <div><label>Brand: </label><input value={brand} onChange={e=>setBrand(e.target.value)} /></div>
      <div><label>Condizione: </label><input value={condition} onChange={e=>setCondition(e.target.value)} /></div>
      <div><label>Taglia: </label><input value={size} onChange={e=>setSize(e.target.value)} /></div>
      <div><label>Colore: </label><input value={color} onChange={e=>setColor(e.target.value)} /></div>
      <div><label>Parole chiave: </label><input value={keywords} onChange={e=>setKeywords(e.target.value)} /></div>
      <div>
        <label>Titolo: </label><input readOnly value={title} /> <button onClick={()=>copy(title)}>Copia</button>
      </div>
      <div>
        <label>Descrizione: </label><textarea readOnly value={description}></textarea> <button onClick={()=>copy(description)}>Copia</button>
      </div>
      <button onClick={resetAll}>Reset</button>

      <h3>Calcolo Prezzo</h3>
      <div><label>Costo acquisto (€): </label><input type="number" value={purchasePrice} onChange={e=>setPurchasePrice(e.target.value)} /></div>
      <div><label>Margine (%): </label><input type="number" value={targetMargin} onChange={e=>setTargetMargin(e.target.value)} /></div>
      <div><label>Commissioni (%): </label><input type="number" value={platformFeePct} onChange={e=>setPlatformFeePct(e.target.value)} /></div>
      <div><label>Altri costi (€): </label><input type="number" value={otherCosts} onChange={e=>setOtherCosts(e.target.value)} /></div>
      <div>Prezzo consigliato: € {suggestion.suggestedPrice}</div>
      <div>Commissioni: € {suggestion.fees}</div>
      <div>Profitto stimato: € {suggestion.profit}</div>
    </div>
  )
}
