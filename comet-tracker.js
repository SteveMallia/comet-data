/* Comet Tracker - Ontario Telescope and Accessories
   (c) 2026 Ontario Telescope and Accessories Inc.
   The code, layout and written explanations are ours. The astronomy is not:
   sidereal time, coordinate conversion, solar and lunar position, Kepler's and
   Barker's equations, the comet magnitude law and the light-grasp relation are
   long-published standard work, credited below, and free for anyone to use.

   Comet positions, brightness and the choice of which comets to list all come
   from NASA JPL (Horizons and the Small-Body Database). Credit NASA/JPL-Caltech.

   Star positions, names and constellation figures are derived from the Hipparcos
   and Yale Bright Star catalogues as prepared by the d3-celestial project.
   Solar and lunar positions follow Jean Meeus, Astronomical Algorithms.
   Sky-darkness classes follow John E. Bortle (Sky & Telescope, 2001).
   Designations and constellation names follow the IAU.

   d3-celestial licence:

   Copyright (c) 2015, Olaf Frohn. All rights reserved.
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
   1. Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
   2. Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
   3. Neither the name of the copyright holder nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
(function(){
  var mount=document.getElementById('comet-tracker-mount');
  if(!mount){return;}
  var st=document.createElement('style');
  st.textContent="\n/* ============================================================\n   comet-tracker.css  \u00b7  Ontario Telescope and Accessories\n   Token system and component vocabulary transposed from\n   flatframecalculator.css (.ffc) \u2014 theme variables first,\n   color-mix derivation, @supports fallback.\n   ============================================================ */\n.cmt{--brand-raw: var(--accent-color, var(--ota-brand, #ed0000));\n    --paper: var(--secondary-background, rgb(var(--color-background, 8 9 11)));\n    --ink: var(--text-color, rgb(var(--color-foreground, 233 235 238)));\n    --heading: var(--heading-color, var(--ink));\n    --card: color-mix(in srgb, var(--paper) 94%, var(--ink) 6%);\n    --sunken: color-mix(in srgb, var(--paper) 88%, var(--ink) 12%);\n    --rule: color-mix(in srgb, var(--ink) 22%, transparent);\n    --rule-soft: color-mix(in srgb, var(--ink) 12%, transparent);\n    --ink-soft: color-mix(in srgb, var(--ink) 68%, transparent);\n    --brand: var(--brand-raw);\n    --brand-hi: color-mix(in srgb, var(--brand) 82%, var(--ink) 18%);\n    --brand-bg: color-mix(in srgb, var(--brand) 9%, var(--paper));\n    --accent: color-mix(in srgb, #b5701c 82%, var(--ink) 18%);\n    --ok: color-mix(in srgb, #3d9068 78%, var(--ink) 22%);\n    --warn-bg: color-mix(in srgb, var(--accent) 12%, var(--paper));\n    --ok-bg: color-mix(in srgb, var(--ok) 12%, var(--paper));\n    --sky: color-mix(in srgb, var(--paper) 92%, #000 8%);\n    --star: var(--ink);\n    --skyline: color-mix(in srgb, var(--ink) 34%, transparent);\n    --mono: \"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, monospace;\n    --sans: var(--text-font-family, var(--font-body-family, \"IBM Plex Sans\", system-ui, sans-serif));\n    --head: var(--heading-font-family, var(--font-heading-family, var(--sans)));\n    background: var(--paper); color: var(--ink); font-family: var(--sans);\n    line-height: 1.6; -webkit-font-smoothing: antialiased;\n    box-sizing: border-box;\n    padding: 2.5rem clamp(1.25rem, 3vw, 2.5rem) 4rem;}\n@supports not (color: color-mix(in srgb, red 50%, transparent)){.cmt{--paper:#08090b; --ink:#e9ebee; --heading:#ffffff; --card:#131417; --sunken:#1b1d22;\n      --rule:#34373d; --rule-soft:#25272c; --ink-soft:#9aa1aa; --brand:#ed0000; --brand-hi:#ff4d4d;\n      --brand-bg:#2a0f10; --accent:#d69a4e; --ok:#4fae7f; --warn-bg:#241c10; --ok-bg:#0f2019;\n      --sky:#06070a; --star:#e9ebee; --skyline:#4a4e57;}\n  }\n/* Night mode: opt-in red-only ramp for use at the eyepiece. Overrides the\n   two source tokens only \u2014 everything else is derived and follows. */\n.cmt[data-night=\"on\"]{--paper:#0b0202; --ink:#ff7a6b; --heading:#ff9b8f;\n    --brand-raw:#ff4436; --accent:#c9553f; --ok:#b8483c;\n    --sky:#080101; --star:#ff8577; --skyline:color-mix(in srgb, var(--ink) 30%, transparent);}\n\n.cmt, .cmt *{box-sizing:border-box}\n.cmt .cmt-grid > *, .cmt .cmt-kpis > *, .cmt .cmt-prodcards > *{min-width:0}\n.cmt img, .cmt canvas, .cmt table{max-width:100%}\n.cmt input, .cmt select{max-width:100%; min-width:0}\n.cmt a{color:var(--brand); text-decoration:none}\n.cmt a:hover{text-decoration:underline}\n.cmt p{margin:0 0 1rem}\n\n.cmt__head{max-width:90rem; margin:0 auto 2.5rem}\n.cmt__eyebrow{font-family:var(--mono); font-size:.7rem; letter-spacing:.18em; text-transform:uppercase; color:var(--ink-soft); margin:0 0 .6rem}\n.cmt h1{color:var(--heading); font-family:var(--head); font-size:clamp(1.9rem,5vw,3rem); font-weight:600; letter-spacing:-.025em; line-height:1.08; margin:0 0 1rem}\n.cmt__standfirst{font-size:clamp(1rem,2.2vw,1.15rem); color:var(--ink-soft); max-width:46ch; margin:0 0 1rem}\n.cmt__seo{font-size:.92rem; color:var(--ink-soft); max-width:52ch; margin:0}\n\n.cmt__section{max-width:90rem; margin-left:auto; margin-right:auto; padding:2.5rem 0; border-top:1px solid var(--rule)}\n.cmt h2{font-family:var(--head); font-size:clamp(1.15rem,2.6vw,1.4rem); font-weight:600; letter-spacing:-.01em; color:var(--heading); margin:0 0 .5rem; display:flex; gap:.85rem; align-items:baseline}\n.cmt h2 .cmt-no{font-family:var(--mono); font-size:.75rem; font-weight:400; color:var(--accent); letter-spacing:.08em}\n.cmt h3{font-size:1.02rem; font-weight:600; color:var(--heading); margin:1.9rem 0 .5rem}\n.cmt h4{font-size:.95rem; font-weight:600; color:var(--ink); margin:1.3rem 0 .4rem}\n.cmt .cmt-sec-note{color:var(--ink-soft); font-size:.92rem; margin:0 0 1.4rem; max-width:48rem}\n\n.cmt .cmt-flags{display:flex; flex-wrap:wrap; gap:.5rem; margin:0 0 1.6rem}\n.cmt .cmt-flag{font-family:var(--mono); font-size:.7rem; letter-spacing:.03em; text-transform:uppercase;\n    white-space:nowrap; padding:.3rem .6rem; border-radius:2px; background:var(--sunken); color:var(--ink-soft)}\n.cmt .cmt-flag.cmt-ok{background:var(--ok-bg); color:var(--ok)}\n.cmt .cmt-flag.cmt-warn{background:var(--warn-bg); color:var(--accent)}\n.cmt .cmt-flag.cmt-bad{background:var(--brand-bg); color:var(--brand)}\n\n.cmt .cmt-group{background:var(--card); border:1px solid var(--rule); border-radius:3px; padding:1.1rem 1.15rem 1.25rem; margin:1rem 0}\n.cmt .cmt-group > h3{margin:0 0 .2rem; font-family:var(--mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.1em; color:var(--ink-soft); border-bottom:1px solid var(--rule); padding-bottom:.6rem}\n.cmt .cmt-grid{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.9rem 1.5rem; margin-top:.9rem}\n@media(min-width:780px){.cmt .cmt-group > .cmt-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}\n@media(max-width:600px){.cmt .cmt-grid{grid-template-columns:1fr}}\n.cmt .cmt-field{display:flex; flex-direction:column; gap:.35rem; min-width:0}\n.cmt .cmt-field label{font-size:.85rem; color:var(--ink); font-weight:500}\n.cmt .cmt-field .cmt-u{color:var(--ink-soft); font-weight:400; font-family:var(--mono); font-size:.78em}\n.cmt .cmt-field .cmt-sub{font-size:.76rem; color:var(--ink-soft); margin:0}\n.cmt select{width:100%; padding:.6rem .7rem; background:var(--paper); border:1px solid var(--rule); border-radius:2px;\n    color:var(--ink); font-size:.95rem; font-family:var(--sans); outline:none; min-height:44px;\n    appearance:none; background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888'><path d='M2 4l4 4 4-4z'/></svg>\");\n    background-repeat:no-repeat; background-position:right 12px center; padding-right:34px}\n.cmt select:focus{border-color:var(--brand); outline:2px solid var(--brand); outline-offset:1px}\n.cmt select option, .cmt select optgroup{background-color:var(--paper); color:var(--ink)}\n.cmt input[type=range]{width:100%; -webkit-appearance:none; appearance:none; background:transparent; height:44px; margin:0}\n.cmt input[type=range]::-webkit-slider-runnable-track{height:2px; background:var(--rule)}\n.cmt input[type=range]::-moz-range-track{height:2px; background:var(--rule)}\n.cmt input[type=range]::-webkit-slider-thumb{-webkit-appearance:none; width:20px; height:20px; background:var(--brand); border-radius:50%; margin-top:-9px; cursor:pointer}\n.cmt input[type=range]::-moz-range-thumb{width:20px; height:20px; background:var(--brand); border:none; border-radius:50%; cursor:pointer}\n.cmt input[type=range]:focus-visible{outline:2px solid var(--brand); outline-offset:2px}\n\n.cmt .cmt-modeswitch{display:inline-flex; gap:.4rem; background:var(--sunken); border:1px solid var(--rule); border-radius:3px; padding:.3rem; flex-wrap:wrap}\n.cmt .cmt-modeswitch button{border:0; background:transparent; color:var(--ink-soft); font-family:var(--mono); font-size:.8rem; letter-spacing:.03em; padding:.6rem 1rem; border-radius:2px; cursor:pointer; min-height:40px}\n.cmt .cmt-modeswitch button.cmt-on{background:var(--brand); color:#fff}\n.cmt .cmt-btn{display:inline-flex; align-items:center; justify-content:center; gap:.5rem; cursor:pointer; border:1px solid var(--brand); background:var(--brand); color:#fff; font-family:var(--mono); font-size:.82rem; letter-spacing:.04em; padding:0 1.4rem; min-height:44px; border-radius:2px}\n.cmt .cmt-btn:hover{background:var(--brand-hi); border-color:var(--brand-hi)}\n.cmt .cmt-btn:focus-visible{outline:2px solid var(--brand); outline-offset:1px}\n.cmt .cmt-btn.cmt-sec{background:var(--card); color:var(--ink); border-color:var(--rule)}\n.cmt .cmt-btn.cmt-sec:hover{background:var(--sunken); border-color:var(--brand)}\n.cmt .cmt-actions{display:flex; gap:.7rem; flex-wrap:wrap; margin-top:1.4rem; align-items:center}\n\n.cmt .cmt-sky{background:var(--sky); border:1px solid var(--rule); border-radius:3px; padding:.6rem}\n.cmt .cmt-sky canvas{width:100%; height:auto; display:block}\n.cmt .cmt-legend{display:flex; flex-wrap:wrap; gap:.4rem 1.1rem; margin-top:.7rem; font-family:var(--mono); font-size:.7rem; color:var(--ink-soft)}\n.cmt .cmt-legend i{display:inline-block; width:.5rem; height:.5rem; border-radius:50%; background:var(--brand); margin-right:.35rem; vertical-align:middle}\n.cmt .cmt-legend i.cmt-moon{background:var(--ink-soft)}\n\n.cmt .cmt-kpis{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.7rem; margin:1rem 0}\n@media(max-width:720px){.cmt .cmt-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:400px){.cmt .cmt-kpis{grid-template-columns:1fr}}\n.cmt .cmt-kpi{background:var(--card); border:1px solid var(--rule); border-radius:3px; padding:.9rem}\n.cmt .cmt-kpi .cmt-l{font-family:var(--mono); font-size:.66rem; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-soft)}\n.cmt .cmt-kpi .cmt-v{font-family:var(--mono); font-size:1.45rem; font-weight:500; margin-top:.35rem; color:var(--ink); line-height:1.15; font-variant-numeric:tabular-nums}\n.cmt .cmt-kpi .cmt-v small{font-size:.85rem; color:var(--ink-soft); font-weight:400}\n.cmt .cmt-kpi .cmt-d{font-size:.74rem; color:var(--ink-soft); margin-top:.35rem}\n.cmt .cmt-kpi .cmt-d b{color:var(--ink); font-weight:600}\n\n.cmt .cmt-list{border-top:1px solid var(--rule)}\n.cmt .cmt-row{border-bottom:1px solid var(--rule-soft)}\n.cmt .cmt-rowbtn{display:grid; grid-template-columns:1fr auto; gap:.3rem 1rem; align-items:center; width:100%;\n    text-align:left; background:none; border:0; padding:1rem .6rem; cursor:pointer; color:inherit; font-family:var(--sans); min-height:44px}\n.cmt .cmt-rowbtn:hover{background:var(--card)}\n.cmt .cmt-row[data-open=\"1\"] .cmt-rowbtn{background:var(--card); box-shadow:inset 3px 0 0 var(--brand)}\n.cmt .cmt-rname{font-weight:600; font-size:1rem; color:var(--ink); line-height:1.3}\n.cmt .cmt-rmeta{font-family:var(--mono); font-size:.72rem; color:var(--ink-soft); margin-top:.3rem}\n.cmt .cmt-rmeta span+span::before{content:\" \u00b7 \"; color:var(--rule)}\n.cmt .cmt-rmag{text-align:right; font-family:var(--mono); line-height:1.15}\n.cmt .cmt-rmag b{font-size:1.35rem; font-weight:500; color:var(--ink); font-variant-numeric:tabular-nums}\n.cmt .cmt-rmag .cmt-pill{display:block; margin-top:.3rem}\n.cmt .cmt-pill{display:inline-block; font-family:var(--mono); font-size:.66rem; letter-spacing:.03em; padding:.15rem .5rem; border-radius:2px}\n.cmt .cmt-pill.cmt-nb{background:var(--sunken); color:var(--ink-soft)}\n.cmt .cmt-pill.cmt-bb{background:var(--brand-bg); color:var(--brand)}\n.cmt .cmt-row.cmt-off{opacity:.45}\n.cmt .cmt-detail{display:none; padding:.25rem .6rem 1.75rem}\n.cmt .cmt-row[data-open=\"1\"] .cmt-detail{display:block}\n.cmt .cmt-two{display:grid; grid-template-columns:1fr; gap:1rem}\n@media(min-width:780px){.cmt .cmt-two{grid-template-columns:1.3fr 1fr}}\n.cmt .cmt-box{background:var(--card); border:1px solid var(--rule); border-radius:3px; padding:.95rem}\n.cmt .cmt-box h4{margin:0 0 .6rem; font-family:var(--mono); font-size:.68rem; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-soft); font-weight:500}\n.cmt .cmt-box canvas{width:100%; height:auto; display:block; background:var(--sky); border-radius:2px}\n.cmt table.cmt-exp{width:100%; border-collapse:collapse; margin-top:.4rem; font-size:.85rem}\n.cmt table.cmt-exp td{text-align:left; padding:.55rem .5rem; border-bottom:1px solid var(--rule-soft); color:var(--ink-soft)}\n.cmt table.cmt-exp td.cmt-exp-v{font-family:var(--mono); font-weight:500; color:var(--ink); font-variant-numeric:tabular-nums; text-align:right}\n\n.cmt .cmt-alert{display:flex; gap:.75rem; padding:.85rem 1rem; border-radius:2px; font-size:.9rem; align-items:flex-start; border-left:3px solid var(--rule); background:var(--card); margin:1rem 0}\n.cmt .cmt-alert .cmt-ic{flex:0 0 auto; font-family:var(--mono); font-weight:500; line-height:1.5}\n.cmt .cmt-alert.cmt-warn{background:var(--warn-bg); border-left-color:var(--accent)}\n.cmt .cmt-alert.cmt-warn .cmt-ic{color:var(--accent)}\n.cmt .cmt-alert.cmt-bad{background:var(--brand-bg); border-left-color:var(--brand)}\n.cmt .cmt-alert.cmt-bad .cmt-ic{color:var(--brand)}\n.cmt .cmt-alert.cmt-info{background:var(--sunken); border-left-color:var(--ink-soft)}\n.cmt .cmt-alert.cmt-info .cmt-ic{color:var(--ink-soft)}\n.cmt .cmt-alert b{color:var(--ink); font-weight:600}\n\n.cmt .cmt-guide p, .cmt .cmt-guide li{color:var(--ink-soft)}\n.cmt .cmt-guide ul{padding-left:1.2rem}\n.cmt .cmt-guide li{margin:.4rem 0}\n.cmt .cmt-guide b, .cmt .cmt-guide strong{color:var(--ink); font-weight:600}\n.cmt .cmt-guide h3, .cmt .cmt-guide p, .cmt .cmt-guide ul, .cmt .cmt-callout, .cmt .cmt-mono-block{max-width:48rem}\n.cmt .cmt-callout{border-left:3px solid var(--accent); background:var(--warn-bg); padding:.9rem 1rem; font-size:.9rem; margin:1rem 0}\n.cmt .cmt-callout h4{margin:0 0 .4rem; font-size:.95rem; color:var(--ink); font-weight:600}\n.cmt .cmt-callout p{margin:.4rem 0 0}\n.cmt .cmt-mono-block{background:var(--sunken); border-left:3px solid var(--rule); padding:.8rem 1rem; font-family:var(--mono); font-size:.82rem; color:var(--ink); overflow-x:auto; margin:1rem 0; line-height:1.9}\n.cmt .cmt-mono-block span{color:var(--ink-soft)}\n.cmt table.cmt-g{width:100%; border-collapse:collapse; margin:1rem 0; font-size:.86rem}\n.cmt table.cmt-g th, .cmt table.cmt-g td{border:1px solid var(--rule); padding:.55rem .75rem; text-align:left; vertical-align:top}\n.cmt table.cmt-g th{background:var(--sunken); color:var(--ink); font-family:var(--mono); font-size:.68rem; text-transform:uppercase; letter-spacing:.04em; font-weight:500}\n.cmt table.cmt-g td{color:var(--ink-soft)}\n.cmt table.cmt-g td:first-child{color:var(--ink); font-weight:600; width:12rem}\n@media(max-width:600px){.cmt table.cmt-g{display:block; overflow-x:auto; -webkit-overflow-scrolling:touch}}\n\n.cmt .cmt-prodcards{display:grid; grid-template-columns:1fr 1fr; gap:.8rem; margin:1rem 0}\n@media(max-width:600px){.cmt .cmt-prodcards{grid-template-columns:1fr}}\n@media(min-width:780px){.cmt .cmt-prodcards{grid-template-columns:repeat(3,1fr)}}\n.cmt .cmt-prodcard{background:var(--card); border:1px solid var(--rule); border-radius:3px; padding:1rem}\n.cmt .cmt-prodcard h4{margin:0 0 .3rem; font-size:.98rem; color:var(--ink); font-weight:600}\n.cmt .cmt-prodcard p{font-size:.82rem; color:var(--ink-soft); margin:.4rem 0 .9rem}\n.cmt .cmt-prodcard a{display:inline-flex; align-items:center; min-height:40px; font-family:var(--mono); font-size:.78rem; color:#fff; background:var(--brand); padding:0 .9rem; border-radius:2px}\n.cmt .cmt-prodcard a:hover{background:var(--brand-hi); text-decoration:none}\n\n.cmt .cmt-faq details{border-top:1px solid var(--rule); padding:0}\n.cmt .cmt-faq details:first-of-type{border-top:0}\n.cmt .cmt-faq summary{cursor:pointer; list-style:none; padding:1.1rem 2rem 1.1rem 0; font-size:1rem; font-weight:600; color:var(--ink); position:relative; min-height:44px; display:flex; align-items:center; max-width:52rem}\n.cmt .cmt-faq summary::-webkit-details-marker{display:none}\n.cmt .cmt-faq summary::after{content:\"+\"; position:absolute; right:.2rem; top:50%; transform:translateY(-50%); font-family:var(--mono); font-size:1.1rem; font-weight:400; color:var(--accent)}\n.cmt .cmt-faq details[open] summary::after{content:\"\\2013\"}\n.cmt .cmt-faq .cmt-a{padding:0 0 1.2rem; color:var(--ink-soft); font-size:.92rem; max-width:52rem}\n.cmt .cmt-faq .cmt-a p:first-child{margin-top:0}\n\n.cmt footer.cmt__foot{margin-top:2.5rem; padding-top:1.6rem; border-top:1px solid var(--rule); color:var(--ink-soft); font-size:.85rem}\n.cmt footer.cmt__foot .cmt-rev{color:var(--ink); font-weight:600}\n.cmt footer.cmt__foot .cmt-priv{margin-top:.4rem}\n.cmt footer.cmt__foot .cmt-disc{margin-top:1rem; font-size:.76rem}\n\n.cmt h1, .cmt h2, .cmt h3, .cmt h4, .cmt p, .cmt li, .cmt td{overflow-wrap:break-word}\n@media (prefers-reduced-motion:reduce){.cmt *{transition:none!important; animation:none!important}}\n";
  document.head.appendChild(st);
  if(!mount.querySelector('.cmt')){
    mount.innerHTML="\n\n<div class=\"cmt\" id=\"cmt\" data-night=\"off\">\n\n<header class=\"cmt__head\">\n  <p class=\"cmt__eyebrow\">Free tool \u00b7 Ontario Telescope</p>\n  <h1>Is there a comet worth getting the scope out for?</h1>\n  <p class=\"cmt__standfirst\">Comet brightness forecasts are extrapolations from past behaviour,\n  and comets do not feel bound by them. One on this list is currently running six magnitudes ahead\n  of its own prediction.</p>\n  <p class=\"cmt__seo\">The Ontario Telescope Comet Tracker is a free observing tool for\n  anyone, anywhere in the world, wondering whether a comet is worth going out for tonight.\n  Choose a location or use your own, and it plots every comet currently within amateur\n  reach on a live all-sky chart for that spot, tells you in plain terms what size of\n  telescope or binoculars you would need under your own sky, draws dated finder charts at\n  three magnifications, and refreshes its positions and brightness from NASA's JPL Horizons\n  service every night. It works from either hemisphere and from any latitude.</p>\n</header>\n\n<noscript>\n  <div class=\"cmt__section\">\n    <div class=\"cmt-alert cmt-warn\"><span class=\"cmt-ic\">!</span><div>This tool needs JavaScript\n    for the charts and positions. Enable it, or email us the comet you are after and we will send\n    you a finder chart.</div></div>\n  </div>\n</noscript>\n\n<section class=\"cmt__section\">\n  <div class=\"cmt-flags\" id=\"cmt-flags\"></div>\n\n  <h2><span class=\"cmt-no\">01</span>Where are you observing from?</h2>\n  <p class=\"cmt-sec-note\">Altitude and moonlight end more comet sessions than magnitude does, and\n  both depend on where you stand. Everything here is computed in your browser.</p>\n\n  <div class=\"cmt-group\">\n    <h3>Site and filters</h3>\n    <div class=\"cmt-grid\">\n      <div class=\"cmt-field\">\n        <label for=\"cmt-site\">Observing site</label>\n        <select id=\"cmt-site\"></select>\n        <p class=\"cmt-sub\">Pick a place, use your own location, or type any coordinates\n        below. The Bortle rating sets the aperture advice.</p>\n      </div>\n      <div class=\"cmt-field\">\n        <label for=\"cmt-lat\">Or any coordinates on Earth</label>\n        <div style=\"display:flex;gap:.4rem\">\n          <input type=\"text\" id=\"cmt-lat\" inputmode=\"decimal\" placeholder=\"latitude\"\n            aria-label=\"Latitude in degrees, north positive\"\n            style=\"flex:1 1 0;min-width:0;background:var(--paper);border:1px solid var(--rule);border-radius:2px;color:var(--ink);padding:.6rem .7rem;font:inherit;font-size:.95rem;min-height:44px\">\n          <input type=\"text\" id=\"cmt-lon\" inputmode=\"decimal\" placeholder=\"longitude\"\n            aria-label=\"Longitude in degrees, east positive\"\n            style=\"flex:1 1 0;min-width:0;background:var(--paper);border:1px solid var(--rule);border-radius:2px;color:var(--ink);padding:.6rem .7rem;font:inherit;font-size:.95rem;min-height:44px\">\n          <button class=\"cmt-btn cmt-sec\" id=\"cmt-go\" type=\"button\" style=\"flex:0 0 auto\">Go</button>\n        </div>\n        <p class=\"cmt-sub\" id=\"cmt-coordnote\">North and east positive. Times will use your own clock.</p>\n      </div>\n      <div class=\"cmt-field\">\n        <label for=\"cmt-bortle\">How dark is your sky?</label>\n        <select id=\"cmt-bortle\">\n          <option value=\"1\">1 &mdash; wilderness, Milky Way casts shadows</option>\n          <option value=\"2\">2 &mdash; genuinely dark site</option>\n          <option value=\"3\">3 &mdash; rural</option>\n          <option value=\"4\">4 &mdash; rural-suburban edge</option>\n          <option value=\"5\">5 &mdash; outer suburbs</option>\n          <option value=\"6\">6 &mdash; suburban</option>\n          <option value=\"7\">7 &mdash; bright suburban</option>\n          <option value=\"8\">8 &mdash; city</option>\n          <option value=\"9\">9 &mdash; inner city</option>\n        </select>\n        <p class=\"cmt-sub\">Picking a place above sets this for you. Change it if you know\n        your own sky better \u2014 it drives the aperture advice more than anything else.</p>\n      </div>\n      <div class=\"cmt-field\">\n        <label for=\"cmt-mag\">Faintest star you can see <span class=\"cmt-u\" id=\"cmt-magv\">mag 6.0</span></label>\n        <input type=\"range\" id=\"cmt-mag\" min=\"3\" max=\"7.5\" step=\"0.1\" value=\"6\">\n        <p class=\"cmt-sub\">Thins the sky chart to match your eyes.</p>\n      </div>\n      <div class=\"cmt-field\">\n        <label for=\"cmt-alt\">Minimum altitude <span class=\"cmt-u\" id=\"cmt-altv\">15\u00b0</span></label>\n        <input type=\"range\" id=\"cmt-alt\" min=\"0\" max=\"45\" step=\"1\" value=\"15\">\n        <p class=\"cmt-sub\">Below this, trees and haze win.</p>\n      </div>\n      <div class=\"cmt-field\">\n        <label for=\"cmt-el\">Minimum solar elongation <span class=\"cmt-u\" id=\"cmt-elv\">30\u00b0</span></label>\n        <input type=\"range\" id=\"cmt-el\" min=\"0\" max=\"90\" step=\"1\" value=\"30\">\n        <p class=\"cmt-sub\">Under 30\u00b0 it is lost in twilight.</p>\n      </div>\n    </div>\n    <div class=\"cmt-actions\">\n      <button class=\"cmt-btn cmt-sec\" id=\"cmt-geo\" type=\"button\">Use my location</button>\n      <button class=\"cmt-btn cmt-sec\" id=\"cmt-night\" type=\"button\" aria-pressed=\"false\">Night mode</button>\n      <button class=\"cmt-btn cmt-sec\" id=\"cmt-reload\" type=\"button\">Reload positions</button>\n    </div>\n  </div>\n</section>\n\n<section class=\"cmt__section\">\n  <h2><span class=\"cmt-no\">02</span>Your sky right now</h2>\n    <p class=\"cmt-sec-note\">Zenith at the centre, horizon at the rim, north at the top and\n    east to the left, as in a printed atlas. This is the sky above your chosen site at\n    <b id=\"cmt-clock\">\u2014</b>, and it redraws itself as the night turns. Drag the\n    star-magnitude slider and the sky thins to match what you can actually see.</p>\n  <div class=\"cmt-sky\">\n    <canvas id=\"cmt-dome\" width=\"900\" height=\"900\"\n      aria-label=\"All-sky chart showing horizon, stars, Moon and comet positions\"></canvas>\n  </div>\n  <div class=\"cmt-legend\">\n    <span><i></i>Comet</span>\n    <span><i class=\"cmt-moon\"></i>Moon</span>\n    <span id=\"cmt-legstars\">\u2014</span>\n    <span id=\"cmt-legdark\">\u2014</span>\n  </div>\n</section>\n\n<section class=\"cmt__section\">\n  <h2><span class=\"cmt-no\">03</span>What's out there</h2>\n  <p class=\"cmt-sec-note\">Brightest first. A red label means the figure is a real observation\n  rather than a forecast \u2014 trust those. Faded rows fail your altitude or elongation filter tonight.\n  Tap any comet for its finder chart.</p>\n  <div class=\"cmt-list\" id=\"cmt-list\"></div>\n  <p class=\"cmt-sec-note\" id=\"cmt-count\" style=\"margin-top:1rem\"></p>\n</section>\n\n<section class=\"cmt__section cmt-guide\">\n  <h2><span class=\"cmt-no\">04</span>How this works</h2>\n  <p class=\"cmt-sec-note\">No black box. Here is where every number comes from and\n  where it can let you down.</p>\n\n  <h3>The magnitude number</h3>\n  <p>Magnitude measures brightness, and it runs backwards: <b>lower numbers are\n  brighter</b>. Magnitude 6 is roughly the faintest star you can see with your eyes\n  from a properly dark site. Magnitude 13 is about a hundred thousand times fainter.\n  Each step of 1 is a factor of about 2.5.</p>\n  <p>Every magnitude on this page comes from NASA's JPL Horizons service, which\n  predicts it from the comet's orbit and its measured behaviour on previous passes.\n  It is the whole comet added together, coma and all.</p>\n\n  <h3>Why a comet is harder than a star of the same magnitude</h3>\n  <p>A star is a point. All its light lands in one spot, and the eye is good at picking\n  out points. A comet is a fuzzy patch several times the apparent width of Jupiter, and\n  the same amount of light spread over that area is far harder to notice \u2014 like the\n  difference between a torch beam and the same bulb behind frosted glass.</p>\n\n  <h3>Where the telescope figures come from</h3>\n  <p>Every telescope and binocular sold carries a published <em>limiting stellar\n  magnitude</em> \u2014 the faintest star it will show. Those published figures follow a\n  simple relation: magnitude 2.5 plus five times the logarithm of the aperture in\n  millimetres. That gives 14.0 for an 8-inch, 14.4 for a 9.25, 14.7 for an 11 and 15.3\n  for a 14, which is exactly what the manufacturers print on their own spec sheets.</p>\n  <p>Makers also publish what light pollution costs: about one magnitude under a\n  moderately light-polluted sky and two under a heavily light-polluted one, with the\n  unaided eye falling from 6.5 to 5.5 to 4.5 across the same three steps. We spread those\n  three tiers across the nine Bortle classes.</p>\n  <p>Then we subtract an allowance because a comet is not a star. How much depends on how\n  condensed the coma is, which nobody publishes, so the page names two instruments: one\n  that should show it if the coma is tight, and a larger one that will show it even if\n  the coma is loose. Only telescopes that actually exist are named \u2014 there is no such\n  thing as a nine-inch.</p>\n\n  <h3>Where the data comes from</h3>\n  <ul>\n    <li><b>Positions, distances and brightness</b> \u2014 NASA JPL Horizons, refreshed\n    every night. Horizons works out the full orbit including the small push a comet\n    gets from its own outgassing, which simpler methods miss.</li>\n    <li><b>Aperture guidance</b> \u2014 our own calculation, from the light-grasp relation\n    and the naked-eye limit for your sky. Method described above.</li>\n    <li><b>Stars, Sun and Moon</b> \u2014 Hipparcos and Yale Bright Star catalogues;\n    solar and lunar positions worked out in your browser.</li>\n  </ul>\n\n  <h3>What this page does not know</h3>\n  <ul>\n    <li><b>How diffuse each comet is right now.</b> The single biggest unknown. It\n    needs someone to look through an eyepiece and measure, and we do not have that\n    data.</li>\n    <li><b>Sudden outbursts.</b> Comets erupt without warning, sometimes brightening\n    a hundredfold in a day. A forecast from orbital behaviour cannot see that coming.\n    If a comet looks far brighter than we say, believe your eyes.</li>\n    <li><b>Cloud and seeing</b> \u2014 that is the\n    <a href=\"/pages/astronomy-weather-forecast\">Astronomy Weather Forecast</a>.</li>\n  </ul>\n\n  <h3>What to reach for</h3>\n  <div class=\"cmt-prodcards\">\n    <div class=\"cmt-prodcard\">\n      <h4>Binoculars</h4>\n      <p>The best comet instrument most nights. A wide field keeps the whole comet in\n      view with its contrast intact, which a long telescope cannot do.</p>\n      <a href=\"/collections/astronomy-binoculars\">Browse binoculars</a>\n    </div>\n    <div class=\"cmt-prodcard\">\n      <h4>Filters</h4>\n      <p>Comet gas glows in particular colours, so a UHC or Swan band filter can lift\n      one out of suburban skyglow. They do nothing for a dusty comet.</p>\n      <a href=\"/collections/filters\">Browse filters</a>\n    </div>\n    <div class=\"cmt-prodcard\">\n      <h4>More free tools</h4>\n      <p>Observing lists, weather scoring, ISS passes, focus stepping, flat frames,\n      guide scope matching and double-star resolving.</p>\n      <a href=\"/pages/free-utilities\">Free utilities</a>\n    </div>\n  </div>\n</section>\n\n<section class=\"cmt__section cmt-guide\">\n  <h2><span class=\"cmt-no\">05</span>Glossary</h2>\n  <p class=\"cmt-sec-note\">The terms this page uses, defined plainly. If you have arrived here from\n  a search engine or an AI assistant looking for one of these, this is the short version.</p>\n  <table class=\"cmt-g\">\n    <thead><tr><th>Term</th><th>What it means</th></tr></thead>\n    <tbody>\n      <tr><td>Magnitude</td><td>How bright something looks. Lower is brighter, and\n      each step of 1 is about two and a half times. Your eyes reach magnitude 6 under\n      a dark sky, roughly 4 from a city.</td></tr>\n      <tr><td>Coma</td><td>The fuzzy cloud of gas and dust around a comet. It is what\n      you actually see \u2014 the solid nucleus is only a few kilometres across and far too\n      small to make out.</td></tr>\n      <tr><td>Aperture</td><td>The width of your main lens or mirror. It decides how\n      much light you gather, and it is the number that matters most for faint\n      things.</td></tr>\n      <tr><td>AU</td><td>Astronomical unit: the distance from the Earth to the Sun,\n      about 150 million kilometres. Handy for comparing distances across the solar\n      system.</td></tr>\n      <tr><td>Perihelion</td><td>The point in the orbit closest to the Sun. Comets are\n      usually most active near it, though the best view from Earth can come weeks\n      before or after.</td></tr>\n      <tr><td>Angle from the Sun</td><td>How far the comet appears from the Sun in our\n      sky. Under about 30\u00b0 it is buried in twilight no matter how bright it is.</td></tr>\n      <tr><td>Outburst</td><td>A sudden unpredicted brightening, sometimes by a\n      hundredfold, when fresh material is exposed. Most fade within days.\n      29P/Schwassmann-Wachmann does it several times a year.</td></tr>\n      <tr><td>Bortle</td><td>A 1 to 9 scale for light pollution. 1 is a genuinely dark\n      wilderness sky, 9 is inner city. Toronto is about 8; Algonquin is about 2. It\n      changes what you can see more than your telescope does.</td></tr>\n      <tr><td>Altitude</td><td>How high something is above the horizon, in degrees.\n      Below about 20\u00b0 you are looking through a lot more air, and everything looks\n      worse.</td></tr>\n    </tbody>\n  </table>\n</section>\n\n<section class=\"cmt__section\">\n  <h2><span class=\"cmt-no\">06</span>Questions</h2>\n  <div class=\"cmt-faq\">\n    <details><summary>The magnitude here disagrees with another site. Which is right?</summary>\n      <div class=\"cmt-a\"><p>Ours is NASA's prediction from the comet's orbit, refreshed nightly.\n      Some other sites publish what people actually saw through a telescope last week. When a comet\n      is behaving normally the two agree closely. When it erupts, real observations will show it and\n      a prediction will not. If you see reports of a comet far brighter than we list, believe\n      them.</p></div></details>\n    <details><summary>Why does a magnitude 8 comet look like nothing through my telescope?</summary>\n      <div class=\"cmt-a\"><p>Because that brightness is smeared across a fuzzy patch rather than\n      concentrated in a point. A magnitude 8 star is obvious; a magnitude 8 comet can be a faint\n      smudge you might scan straight past. Turn the magnification down, not up \u2014 a wide, bright,\n      low-power view shows a comet far better than a narrow high-power one.</p></div></details>\n    <details><summary>How accurate are the charts?</summary>\n      <div class=\"cmt-a\"><p>Very. Star positions are standard catalogue data and comet positions\n      come from NASA to well under an arcsecond, updated nightly. You can star-hop with them, or\n      type the coordinates straight into a GoTo handset. The predicted brightness is the uncertain\n      part, not the position.</p></div></details>\n    <details><summary>Which comet should a beginner try first?</summary>\n      <div class=\"cmt-a\"><p>Whichever sits at the top of the list marked <b>Binoculars</b>, on a\n      night when the Moon is down. Use binoculars rather than a telescope, and expect a small round\n      smudge rather than the sweeping tail you have seen in photographs \u2014 tails are mostly a\n      camera phenomenon, not a visual one. Finding one at all is the achievement.</p></div></details>\n    <details><summary>Why is there a night mode?</summary>\n      <div class=\"cmt-a\"><p>Because this gets used at the eyepiece at two in the morning. A bright\n      screen destroys dark adaptation that took twenty minutes to build. Night mode drops the page\n      to a red-only ramp, which the dark-adapted eye barely registers.</p></div></details>\n    <details><summary>Is any of my data sent anywhere?</summary>\n      <div class=\"cmt-a\"><p>No. Comet positions are fetched from NASA JPL Horizons and that request\n      carries nothing about you. Your observing site is used only inside your own browser and is\n      never transmitted.</p></div></details>\n  </div>\n</section>\n\n<footer class=\"cmt__foot\">\n  <p class=\"cmt-rev\">Comet Tracker \u00b7 Rev 1.0 \u00b7 Reviewed August 2026 by Ontario Telescope &amp; Accessories</p>\n  <p class=\"cmt-priv\">All astronomical calculations run locally in your browser. Comet positions are\n  requested from NASA JPL Horizons; that request carries no information about you and nothing is\n  stored. Spotted a problem, or want a comet added?\n  <a href=\"/pages/contact-us\">Get in touch</a>.</p>\n  <p class=\"cmt-disc\">Comet positions and predicted brightness come from NASA's JPL\n  Horizons service, credit NASA/JPL-Caltech, refreshed every night. Which comets appear\n  here is decided each night from NASA's Small-Body Database: every comet with published\n  magnitude parameters whose computed brightness puts it within reach. Aperture is our\n  own calculation from the light-grasp relation plus a two-magnitude extended-object\n  penalty. Horizons predicts brightness from a magnitude law fitted to each comet's past\n  observations; that fit can be well out in either direction and cannot anticipate an\n  outburst. Treat every figure here as a guide and never as a promise.</p>\n\n  <p class=\"cmt-disc\">Positions of the Sun and Moon are computed in your browser from the\n  standard truncated series given in Jean Meeus, <i>Astronomical Algorithms</i>. The\n  nine-step sky-darkness scale and the naked-eye limiting magnitudes attached to each step\n  follow John E. Bortle's dark-sky scale, published in <i>Sky &amp; Telescope</i> in 2001;\n  the single values used here are our own simplification of his published ranges. Comet\n  and star designations, and constellation names, follow the International Astronomical\n  Union. Files are delivered by jsDelivr.</p>\n\n  <details style=\"margin-top:1rem\">\n  <summary style=\"cursor:pointer;color:var(--brand)\">Star catalogue licence (BSD 3-Clause)</summary>\n  <p class=\"cmt-disc\" style=\"margin-top:.6rem\">Star positions, names and constellation\n  figures are derived from the Hipparcos and Yale Bright Star catalogues as prepared by\n  the d3-celestial project.</p>\n  <pre class=\"cmt-disc\" style=\"white-space:pre-wrap;font-family:var(--mono);font-size:.72rem;\n  line-height:1.5;background:var(--sunken);padding:.9rem 1rem;border-radius:3px;overflow-x:auto\">Copyright (c) 2015, Olaf Frohn\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</pre>\n  <p class=\"cmt-disc\">Neither the name of the copyright holder nor of the contributors is\n  used to endorse or promote this tool.</p>\n  </details>\n  <p class=\"cmt-disc\">\u00a9 2026 Ontario Telescope and Accessories Inc. The code, layout,\n  artwork and written explanations on this page are ours, and may not be copied, rehosted\n  or republished without permission.</p>\n\n  <p class=\"cmt-disc\">The astronomy underneath them is not ours and we claim nothing over\n  it. Sidereal time, the conversion from sky coordinates to altitude and azimuth, the\n  positions of the Sun and Moon, Kepler's and Barker's equations, the comet magnitude law\n  and the light-grasp relation are all long-published standard work, credited above, and\n  free for anyone to use. What we have done is choose which of them to apply, assemble\n  them into something useful, and explain the result. That assembly and that explanation\n  are what the notice above covers.</p>\n</footer>\n</div>\n\n\n";
  }



(function(){
"use strict";
// The roster is not held here. It is derived nightly from JPL's Small-Body
// Database by fetch_comets.py and arrives in the feed, so the choice of which
// comets to list rests on public NASA data and our own criteria rather than on
// anyone else's published selection.
var COMETS=[];

// No editorial notes. Everything shown is computed from the feed, so nothing
// on this page depends on another publication's description of a comet.
var STARS=[],CONST=[],CONNAMES=[];
var SITES=[
 {g:"Ontario", n:"Toronto",lat:43.6532,lon:-79.3832,b:8,tz:"America/Toronto"},
 {g:"Ontario", n:"Mississauga",lat:43.5890,lon:-79.6441,b:8,tz:"America/Toronto"},
 {g:"Ontario", n:"Hamilton",lat:43.2557,lon:-79.8711,b:7,tz:"America/Toronto"},
 {g:"Ontario", n:"Ottawa",lat:45.4215,lon:-75.6972,b:7,tz:"America/Toronto"},
 {g:"Ontario", n:"London, Ontario",lat:42.9849,lon:-81.2453,b:7,tz:"America/Toronto"},
 {g:"Ontario", n:"Barrie",lat:44.3894,lon:-79.6903,b:6,tz:"America/Toronto"},
 {g:"Ontario", n:"Peterborough",lat:44.3091,lon:-78.3197,b:5,tz:"America/Toronto"},
 {g:"Ontario", n:"Sudbury",lat:46.4917,lon:-80.9930,b:5,tz:"America/Toronto"},
 {g:"Ontario", n:"Torrance Barrens",lat:44.9333,lon:-79.4500,b:3,tz:"America/Toronto"},
 {g:"Ontario", n:"Manitoulin Island",lat:45.7500,lon:-82.2000,b:3,tz:"America/Toronto"},
 {g:"Ontario", n:"Algonquin Park",lat:45.5000,lon:-78.3500,b:2,tz:"America/Toronto"},
 {g:"Rest of Canada", n:"Vancouver",lat:49.2827,lon:-123.1207,b:8,tz:"America/Vancouver"},
 {g:"Rest of Canada", n:"Calgary",lat:51.0447,lon:-114.0719,b:8,tz:"America/Edmonton"},
 {g:"Rest of Canada", n:"Winnipeg",lat:49.8951,lon:-97.1384,b:8,tz:"America/Winnipeg"},
 {g:"Rest of Canada", n:"Montreal",lat:45.5019,lon:-73.5674,b:8,tz:"America/Toronto"},
 {g:"Rest of Canada", n:"Halifax",lat:44.6488,lon:-63.5752,b:7,tz:"America/Halifax"},
 {g:"Rest of Canada", n:"Yellowknife",lat:62.4540,lon:-114.3718,b:4,tz:"America/Edmonton"},
 {g:"United States", n:"New York",lat:40.7128,lon:-74.0060,b:9,tz:"America/New_York"},
 {g:"United States", n:"Chicago",lat:41.8781,lon:-87.6298,b:8,tz:"America/Chicago"},
 {g:"United States", n:"Los Angeles",lat:34.0522,lon:-118.2437,b:8,tz:"America/Los_Angeles"},
 {g:"United States", n:"Phoenix",lat:33.4484,lon:-112.0740,b:8,tz:"America/Phoenix"},
 {g:"United States", n:"Seattle",lat:47.6062,lon:-122.3321,b:8,tz:"America/Los_Angeles"},
 {g:"United States", n:"Denver",lat:39.7392,lon:-104.9903,b:7,tz:"America/Denver"},
 {g:"United States", n:"Cherry Springs, PA",lat:41.6640,lon:-77.8160,b:2,tz:"America/New_York"},
 {g:"United States", n:"Boston",lat:42.3601,lon:-71.0589,b:8,tz:"America/New_York"},
 {g:"United States", n:"Miami",lat:25.7617,lon:-80.1918,b:8,tz:"America/New_York"},
 {g:"United States", n:"Dallas",lat:32.7767,lon:-96.7970,b:8,tz:"America/Chicago"},
 {g:"United States", n:"San Francisco",lat:37.7749,lon:-122.4194,b:8,tz:"America/Los_Angeles"},
 {g:"Europe", n:"London, UK",lat:51.5072,lon:-0.1276,b:8,tz:"Europe/London"},
 {g:"Europe", n:"Paris",lat:48.8566,lon:2.3522,b:8,tz:"Europe/Paris"},
 {g:"Europe", n:"Berlin",lat:52.5200,lon:13.4050,b:8,tz:"Europe/Berlin"},
 {g:"Europe", n:"Madrid",lat:40.4168,lon:-3.7038,b:8,tz:"Europe/Madrid"},
 {g:"Europe", n:"Rome",lat:41.9028,lon:12.4964,b:8,tz:"Europe/Rome"},
 {g:"Europe", n:"Reykjavik",lat:64.1466,lon:-21.9426,b:6,tz:"Atlantic/Reykjavik"},
 {g:"Europe", n:"La Palma, Canary Is.",lat:28.7136,lon:-17.8842,b:2,tz:"Atlantic/Canary"},
 {g:"Europe", n:"Dublin",lat:53.3498,lon:-6.2603,b:8,tz:"Europe/Dublin"},
 {g:"Europe", n:"Amsterdam",lat:52.3676,lon:4.9041,b:8,tz:"Europe/Amsterdam"},
 {g:"Europe", n:"Stockholm",lat:59.3293,lon:18.0686,b:7,tz:"Europe/Stockholm"},
 {g:"Europe", n:"Warsaw",lat:52.2297,lon:21.0122,b:8,tz:"Europe/Warsaw"},
 {g:"Europe", n:"Athens",lat:37.9838,lon:23.7275,b:8,tz:"Europe/Athens"},
 {g:"Europe", n:"Moscow",lat:55.7558,lon:37.6173,b:9,tz:"Europe/Moscow"},
 {g:"Europe", n:"Kielder, UK",lat:55.2333,lon:-2.5833,b:3,tz:"Europe/London"},
 {g:"Asia and Oceania", n:"Tokyo",lat:35.6762,lon:139.6503,b:9,tz:"Asia/Tokyo"},
 {g:"Asia and Oceania", n:"Singapore",lat:1.3521,lon:103.8198,b:9,tz:"Asia/Singapore"},
 {g:"Asia and Oceania", n:"Delhi",lat:28.6139,lon:77.2090,b:9,tz:"Asia/Kolkata"},
 {g:"Asia and Oceania", n:"Dubai",lat:25.2048,lon:55.2708,b:8,tz:"Asia/Dubai"},
 {g:"Asia and Oceania", n:"Sydney",lat:-33.8688,lon:151.2093,b:8,tz:"Australia/Sydney"},
 {g:"Asia and Oceania", n:"Melbourne",lat:-37.8136,lon:144.9631,b:8,tz:"Australia/Melbourne"},
 {g:"Asia and Oceania", n:"Auckland",lat:-36.8485,lon:174.7633,b:7,tz:"Pacific/Auckland"},
 {g:"Asia and Oceania", n:"Warrumbungle, NSW",lat:-31.2750,lon:149.0600,b:2,tz:"Australia/Sydney"},
 {g:"Asia and Oceania", n:"Perth",lat:-31.9523,lon:115.8613,b:8,tz:"Australia/Perth"},
 {g:"Asia and Oceania", n:"Brisbane",lat:-27.4698,lon:153.0251,b:8,tz:"Australia/Brisbane"},
 {g:"Asia and Oceania", n:"Adelaide",lat:-34.9285,lon:138.6007,b:7,tz:"Australia/Adelaide"},
 {g:"Asia and Oceania", n:"Hobart",lat:-42.8821,lon:147.3272,b:6,tz:"Australia/Hobart"},
 {g:"Asia and Oceania", n:"Wellington",lat:-41.2866,lon:174.7756,b:7,tz:"Pacific/Auckland"},
 {g:"Asia and Oceania", n:"Alice Springs",lat:-23.6980,lon:133.8807,b:3,tz:"Australia/Darwin"},
 {g:"Asia and Oceania", n:"Seoul",lat:37.5665,lon:126.9780,b:9,tz:"Asia/Seoul"},
 {g:"Asia and Oceania", n:"Beijing",lat:39.9042,lon:116.4074,b:9,tz:"Asia/Shanghai"},
 {g:"Asia and Oceania", n:"Hong Kong",lat:22.3193,lon:114.1694,b:9,tz:"Asia/Hong_Kong"},
 {g:"Asia and Oceania", n:"Bangkok",lat:13.7563,lon:100.5018,b:9,tz:"Asia/Bangkok"},
 {g:"Asia and Oceania", n:"Manila",lat:14.5995,lon:120.9842,b:9,tz:"Asia/Manila"},
 {g:"Asia and Oceania", n:"Mumbai",lat:19.0760,lon:72.8777,b:9,tz:"Asia/Kolkata"},
 {g:"Africa and South America", n:"Johannesburg",lat:-26.2041,lon:28.0473,b:8,tz:"Africa/Johannesburg"},
 {g:"Africa and South America", n:"Cape Town",lat:-33.9249,lon:18.4241,b:7,tz:"Africa/Johannesburg"},
 {g:"Africa and South America", n:"Nairobi",lat:-1.2921,lon:36.8219,b:8,tz:"Africa/Nairobi"},
 {g:"Africa and South America", n:"S\u00e3o Paulo",lat:-23.5505,lon:-46.6333,b:9,tz:"America/Sao_Paulo"},
 {g:"Africa and South America", n:"Santiago",lat:-33.4489,lon:-70.6693,b:8,tz:"America/Santiago"},
 {g:"Africa and South America", n:"Atacama, Chile",lat:-24.6272,lon:-70.4039,b:1,tz:"America/Santiago"},
 {g:"Africa and South America", n:"NamibRand, Namibia",lat:-25.0000,lon:16.0000,b:1,tz:"Africa/Windhoek"},
 {g:"Africa and South America", n:"Buenos Aires",lat:-34.6037,lon:-58.3816,b:8,tz:"America/Argentina/Buenos_Aires"},
 {g:"Africa and South America", n:"Rio de Janeiro",lat:-22.9068,lon:-43.1729,b:8,tz:"America/Sao_Paulo"},
 {g:"Africa and South America", n:"Lima",lat:-12.0464,lon:-77.0428,b:8,tz:"America/Lima"},
 {g:"Africa and South America", n:"Cairo",lat:30.0444,lon:31.2357,b:9,tz:"Africa/Cairo"},
 {g:"Africa and South America", n:"Lagos",lat:6.5244,lon:3.3792,b:9,tz:"Africa/Lagos"},
 {g:"Africa and South America", n:"Sutherland, S. Africa",lat:-32.3783,lon:20.8106,b:2,tz:"Africa/Johannesburg"}
];

var S={site:SITES[0],lim:6,minAlt:15,minEl:30,eph:{},fetch:"loading",note:"",now:new Date()};
var D2R=Math.PI/180,R2D=180/Math.PI;
function n360(d){return((d%360)+360)%360;}
function toJD(d){return d.getTime()/86400000+2440587.5;}
function el(i){return document.getElementById(i);}
// Attach a handler only if the element exists. A single missing node used to
// throw during setup and take the whole tool down with it.
function on(id,ev,fn){var n=el(id);if(n)n.addEventListener(ev,fn);return !!n;}
function get(id){for(var i=0;i<COMETS.length;i++)if(COMETS[i].id===id)return COMETS[i];return null;}

/* ---- colour resolution --------------------------------------------------
   Custom properties compute as "specified with variables substituted", so
   getPropertyValue('--rule') hands back the literal color-mix() text rather
   than a colour. Canvas cannot be trusted with that across browsers. Setting
   it as `color` on a probe inside .cmt and reading the computed style forces
   the engine to resolve it to an rgb() we can hand to the 2D context. */
var probe=document.createElement("span");
probe.setAttribute("aria-hidden","true");
probe.style.cssText="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
el("cmt").appendChild(probe);
var _cc={};
function col(name){
  if(_cc[name])return _cc[name];
  probe.style.color="";
  probe.style.color="var(--"+name+")";
  var v=getComputedStyle(probe).color||"#888";
  _cc[name]=v; return v;
}
function clearCol(){_cc={};}

/* ---- astronomy ---- */
function gmst(jd){var d=jd-2451545,T=d/36525;
  return n360(280.46061837+360.98564736629*d+0.000387933*T*T-T*T*T/38710000);}
function lst(jd,lon){return n360(gmst(jd)+lon);}
function altaz(ra,dec,jd,lat,lon){
  var H=(lst(jd,lon)-ra)*D2R,dr=dec*D2R,pr=lat*D2R;
  var sa=Math.sin(dr)*Math.sin(pr)+Math.cos(dr)*Math.cos(pr)*Math.cos(H);
  var alt=Math.asin(Math.max(-1,Math.min(1,sa)));
  var az=Math.atan2(-Math.sin(H)*Math.cos(dr),
        Math.sin(dr)*Math.cos(pr)-Math.cos(dr)*Math.sin(pr)*Math.cos(H));
  return{alt:alt*R2D,az:n360(az*R2D)};}
// Low-precision solar position, after Meeus / the Astronomical Almanac.
function sunPos(jd){var n=jd-2451545,L=n360(280.460+0.9856474*n),g=n360(357.528+0.9856003*n)*D2R;
  var lam=(L+1.915*Math.sin(g)+0.020*Math.sin(2*g))*D2R,e=(23.439-0.0000004*n)*D2R;
  return{ra:n360(Math.atan2(Math.cos(e)*Math.sin(lam),Math.cos(lam))*R2D),
         dec:Math.asin(Math.sin(e)*Math.sin(lam))*R2D};}
// Truncated lunar series after Jean Meeus, Astronomical Algorithms.
// Accurate to a few arcminutes, which is ample for phase and separation.
function moonPos(jd){var T=(jd-2451545)/36525;
  var Lp=n360(218.316+481267.8813*T)*D2R,M=n360(357.529+35999.0503*T)*D2R,
      Mp=n360(134.963+477198.8676*T)*D2R,D=n360(297.850+445267.1115*T)*D2R,
      F=n360(93.272+483202.0175*T)*D2R;
  var lam=Lp+(6.289*Math.sin(Mp)-1.274*Math.sin(Mp-2*D)+0.658*Math.sin(2*D)
        +0.214*Math.sin(2*Mp)-0.186*Math.sin(M)-0.114*Math.sin(2*F))*D2R;
  var bet=(5.128*Math.sin(F)+0.281*Math.sin(Mp+F)-0.278*Math.sin(F-Mp)-0.173*Math.sin(F-2*D))*D2R;
  var e=23.439*D2R;
  return{ra:n360(Math.atan2(Math.sin(lam)*Math.cos(e)-Math.tan(bet)*Math.sin(e),Math.cos(lam))*R2D),
         dec:Math.asin(Math.sin(bet)*Math.cos(e)+Math.cos(bet)*Math.sin(e)*Math.sin(lam))*R2D};}
function sep(r1,d1,r2,d2){var a=d1*D2R,b=d2*D2R;
  return Math.acos(Math.max(-1,Math.min(1,Math.sin(a)*Math.sin(b)
    +Math.cos(a)*Math.cos(b)*Math.cos((r1-r2)*D2R))))*R2D;}
function illum(jd){var s=sunPos(jd),m=moonPos(jd);
  return(1-Math.cos(sep(s.ra,s.dec,m.ra,m.dec)*D2R))/2;}
function phaseName(jd){var f=illum(jd),wax=illum(jd+1)>f;
  if(f<.04)return"New Moon"; if(f>.96)return"Full Moon";
  if(Math.abs(f-.5)<.06)return wax?"First quarter":"Last quarter";
  if(f<.5)return wax?"Waxing crescent":"Waning crescent";
  return wax?"Waxing gibbous":"Waning gibbous";}
var _dc={};
function dark(jd,lat,lon){
  var k=Math.floor(jd)+"|"+lat.toFixed(2)+"|"+lon.toFixed(2);
  if(_dc[k])return _dc[k];
  var st=null,en=null,pv=null;
  for(var i=0;i<=288;i++){var t=jd-.5+i/288,d=altaz(sunPos(t).ra,sunPos(t).dec,t,lat,lon).alt<-18;
    if(pv!==null&&d&&!pv)st=t; if(pv!==null&&!d&&pv)en=t; pv=d;}
  return _dc[k]={start:st,end:en};}

/* ---- cached ephemerides -------------------------------------------------
   Positions come from a nightly GitHub Action that queries JPL Horizons and
   commits comets.json. The page reads that one file from jsDelivr instead of
   making fourteen requests to a NASA research service on every pageview.
   jsDelivr caches a branch URL for around 12 hours, which is fine for data
   that only changes once a day. */
var FEED="https://cdn.jsdelivr.net/gh/SteveMallia/comet-data@main/comets.json";
var SKY ="https://cdn.jsdelivr.net/gh/SteveMallia/comet-data@main/comet-stars.json";
function loadSky(){
  return fetch(SKY,{cache:"default"}).then(function(r){
    if(!r.ok)throw new Error("HTTP "+r.status);
    return r.json();
  }).then(function(d){
    STARS=d.stars||[];CONST=d.constellations||[];CONNAMES=d.names||[];
    S.skyOK=STARS.length>0;
  })["catch"](function(){S.skyOK=false;});
}
function loadEph(){
  S.fetch="loading";drawFlags();
  return fetch(FEED,{cache:"default"}).then(function(r){
    if(!r.ok)throw new Error("HTTP "+r.status);
    return r.json();
  }).then(function(d){
    if(!d||!d.ephemerides)throw new Error("unexpected feed format");
    var n=0;
    COMETS.length=0;
    var names=d.names||{};
    Object.keys(d.ephemerides).forEach(function(id){
      var rows=d.ephemerides[id];
      if(!rows||!rows.length)return;
      S.eph[id]=rows;n++;
      COMETS.push({id:id, name:names[id]||id});
    });
    S.selection=d.selection||null;
    S.generated=d.generated||null;
    S.ageDays=S.generated?(Date.now()-new Date(S.generated))/864e5:null;
    if(n===0){S.fetch="bad";S.note="feed contained no usable comets";}
    else if(S.ageDays!==null&&S.ageDays>3){S.fetch="stale";S.note=Math.floor(S.ageDays)+" days old";}
    else if(n<COMETS.length){S.fetch="part";S.note=n+"/"+COMETS.length;}
    else{S.fetch="ok";S.note=null;}
    render();
  })["catch"](function(e){
    S.fetch="bad";S.note=(e&&e.message)||"network error";render();});
}
function ephAt(id,jd){var r=S.eph[id];
  if(!r||r.length<2)return null;
  if(jd<=r[0].jd)return r[0]; if(jd>=r[r.length-1].jd)return r[r.length-1];
  for(var i=0;i<r.length-1;i++)if(jd>=r[i].jd&&jd<=r[i+1].jd){
    var f=(jd-r[i].jd)/(r[i+1].jd-r[i].jd),A=r[i],B=r[i+1],dr=B.ra-A.ra;
    if(dr>180)dr-=360; if(dr<-180)dr+=360;
    function L(p,q){return(p==null||q==null)?null:p+(q-p)*f;}
    return{jd:jd,ra:n360(A.ra+dr*f),dec:A.dec+(B.dec-A.dec)*f,mag:L(A.mag,B.mag),
      r:L(A.r,B.r),delta:L(A.delta,B.delta),elong:L(A.elong,B.elong)};}
  return null;}

/* ---- brightness and optics -------------------------------------------
   Brightness: JPL Horizons T-mag, the total visual magnitude of the whole
   coma, from the IAU model T = M1 + 5log(delta) + K1*log(r) with M1/K1
   fitted by JPL to observations reported to the Minor Planet Centre.

   Aperture: an earlier version of this used
       limiting magnitude = naked-eye limit + 5*log10(D / 7mm)
   which is wrong, and wrong in an expensive direction. That relation
   assumes a 7mm exit pupil — the lowest useful power — where the sky
   through the telescope is exactly as bright as it is to the naked eye.
   Nobody hunts faint objects that way. At a 2mm exit pupil the sky
   background is 2.7 magnitudes per square arcsecond darker while the
   object's flux is unchanged, so magnification largely defeats light
   pollution. Ignoring that under-read an 8-inch by over a magnitude in
   a bright sky, and inverted to an aperture it demanded a 22-inch for a
   comet a 10-inch will show.

   What is used instead:
       point-source limit = 3.1 + 5*log10(D_mm) - skyPenalty(bortle)
   calibrated so a 203mm telescope reaches magnitude 14.6 under a
   wilderness sky falling to 12.5 in an inner city, which is what such a
   telescope is documented to do. Checked from 60mm to 406mm it stays
   within about 0.4 magnitudes of the commonly quoted figures.

   A comet is not a point, so subtract an extended-object penalty. Faint
   comets have compact comas of a few arcminutes, for which 1.2 magnitudes
   fits; a large diffuse coma is harder, and the page says so.
   ---------------------------------------------------------------------- */
// --- limiting magnitude, from the manufacturers' own numbers ---------------
// Celestron publish a limiting stellar magnitude on every telescope and
// binocular they sell. Fitting their table gives
//       limiting magnitude = 2.5 + 5*log10(aperture in mm)
// which reproduces their catalogue specs to a tenth: 14.0 for an 8-inch,
// 14.4 for a 9.25, 14.7 for an 11, 15.3 for a 14. They also publish a light
// pollution chart: subtract 1.0 magnitude for a moderately light-polluted
// sky and 2.0 for a heavily light-polluted one, with the unaided eye going
// 6.5 / 5.5 / 4.5 across the same three tiers.
//
// Earlier versions of this page used a constant of 3.1 and a slope taken
// from light grasp alone. Both were wrong, and wrong in the expensive
// direction: they asked for a 22-inch where a 10-inch would do.
var LM_CONSTANT=2.5;
// Celestron's three tiers spread across the nine Bortle classes.
function skyPenalty(bortle){
  var bb=(bortle==null)?(S.site.b||5):bortle;
  return Math.max(0,Math.min(2,(bb-1)*0.25));
}
function starLimit(mm,bortle){
  return LM_CONSTANT+5*Math.log10(Math.max(7,mm))-skyPenalty(bortle);
}

// A comet is not a star. Its light is spread over a coma, so it is harder to
// see than a point of the same total magnitude. How much harder depends on
// how condensed it is, which nobody publishes, so we carry a range rather
// than pretend to a single figure.
// A comet is an extended object, so it is harder to see than a star of the
// same total magnitude. How much harder depends on how condensed the coma is,
// which nobody publishes. 0.8 magnitudes suits a comet of ordinary
// condensation and is what the recommendation is built on; the page says
// plainly that a large diffuse one will be harder.
var COMET_PENALTY=0.8;
function cometLimit(mm,bortle){
  return starLimit(mm,bortle)-COMET_PENALTY;
}

// Telescopes that actually exist. No 9-inch, no 22-inch.
var REAL_SCOPES=[
  [50,"50mm binoculars"],[70,"70mm binoculars"],[80,"80mm refractor"],
  [100,"4-inch"],[130,"5-inch"],[150,"6-inch"],[200,"8-inch"],[250,"10-inch"],
  [300,"12-inch"],[350,"14-inch"],[400,"16-inch"],[450,"18-inch"],[500,"20-inch"]
];
var VISUAL_CEILING_MM=500;      // the largest telescope in that list
var PRACTICAL_APERTURE_MM=300;  // a 12-inch: large, but people own them

// Smallest real instrument that would show a comet of this magnitude.
function scopeFor(mag,bortle){
  for(var i=0;i<REAL_SCOPES.length;i++){
    if(cometLimit(REAL_SCOPES[i][0],bortle)>=mag)return REAL_SCOPES[i];
  }
  return null;
}
// One recommendation, not a hedge.
function scopeAdvice(mag,bortle){
  var s=scopeFor(mag,bortle);
  return s?{one:s[1]}:null;
}
function cometAperture(mag,bortle){
  var s=scopeFor(mag,bortle);
  return s?s[0]:VISUAL_CEILING_MM+1;
}

function darkerSkyThatWorks(mag){
  var here=S.site.b||5, fallback=null;
  for(var bb=here-1; bb>=1; bb--){
    var s=scopeFor(mag,bb);
    if(s&&fallback===null)fallback=bb;
    if(s&&s[0]<=PRACTICAL_APERTURE_MM)return bb;
  }
  return fallback;
}
// "an 8-inch", "a 12-inch", "50mm binoculars" -- get the article right.
function article(name){
  if(/binocular/.test(name))return name;
  return (/^(8|11|18|80)/.test(name)?"an ":"a ")+name;
}
function bortleWords(b){
  if(b<=1)return "a wilderness sky";
  if(b<=2)return "a genuinely dark site";
  if(b<=3)return "a rural sky";
  if(b<=4)return "a rural-suburban sky";
  if(b<=5)return "an outer-suburban sky";
  if(b<=6)return "a suburban sky";
  return "a somewhat darker sky";
}

function magOf(c){
  var e=ephAt(c.id,toJD(S.now));
  return (e&&e.mag!=null)?e.mag:null;
}

function gearFor(mm){
  if(mm<=7)   return {t:"Your eyes", s:"No equipment needed.", u:null};
  if(mm<=70)  return {t:"Binoculars", s:"An 8x42 or 10x50 is plenty.", u:"/collections/astronomy-binoculars"};
  if(mm<=100) return {t:"Large binoculars", s:"15x70 or 20x80 on a tripod.", u:"/collections/giant-astronomy-binoculars"};
  if(mm<=150) return {t:"Small telescope", s:"An 80 to 150mm.", u:"/collections/refractors"};
  if(mm<=250) return {t:"8 to 10 inch", s:"A fast Dobsonian is ideal.", u:"/collections/dobsonian"};
  if(mm<=350) return {t:"12 to 14 inch", s:"And a genuinely dark sky.", u:"/collections/dobsonian"};
  if(mm<=500) return {t:"16 to 20 inch", s:"A serious hunt.", u:"/collections/dobsonian"};
  return {t:"Camera only", s:"Out of visual reach. Stacked exposures will still catch it.",
          u:"/collections/smart-telescopes"};
}

// NASA predicts brightness from a magnitude law fitted to past observations
// of each comet. That fit can be well off in either direction, and it cannot
// anticipate an outburst at all. So the aperture below is an estimate from
// the predicted magnitude, not a measurement, and the page says so.
function verdictFor(mag){
  if(mag==null)return "Brightness unavailable.";
  var adv=scopeAdvice(mag);
  if(!adv){
    return darkerSkyThatWorks(mag)!=null
      ? "Out of reach from this sky, but not from a darker one."
      : "Beyond visual reach from anywhere. A camera will still record it.";
  }
  if(adv.one.indexOf("binocular")>=0)return "A binocular target on the predicted brightness.";
  if(adv.one==="80mm refractor"||adv.one==="4-inch")return "Within reach of a small telescope.";
  if(adv.one==="5-inch"||adv.one==="6-inch")return "A modest telescope should do it.";
  if(adv.one==="8-inch"||adv.one==="10-inch")return "Wants a decent telescope and a dark sky.";
  return "Difficult: large telescope, dark sky, patient observer.";
}

function trendOf(c){
  var rows=S.eph[c.id];
  if(!rows||rows.length<10)return null;
  var jd=toJD(S.now),now=ephAt(c.id,jd),later=ephAt(c.id,jd+21);
  if(!now||!later||now.mag==null||later.mag==null)return null;
  var d=later.mag-now.mag;
  if(d<-0.2)return{w:"getting brighter",a:"\u2191"};
  if(d> 0.2)return{w:"fading",a:"\u2193"};
  return{w:"holding steady",a:"\u2192"};
}

// The dust and gas tail is pushed directly away from the Sun, so its
// direction on the sky is exactly computable from the two positions. This
// is the one thing about a comet's APPEARANCE that JPL data pins down.
function tailPA(c){
  var jd=toJD(S.now), e=ephAt(c.id,jd); if(!e)return null;
  var s=sunPos(jd);
  var d=(s.ra-e.ra)*D2R, dc=e.dec*D2R, ds=s.dec*D2R;
  var pa=Math.atan2(Math.sin(d), Math.cos(dc)*Math.tan(ds)-Math.sin(dc)*Math.cos(d))*R2D;
  return n360(pa+180);          // anti-solar
}
function paWord(pa){
  var d=["north","north-east","east","south-east","south","south-west","west","north-west"];
  return d[Math.round(n360(pa)/45)%8];
}

// Best moment tonight, and how high it gets.
function tonight(c){
  var jd=toJD(S.now),st=S.site,dk=dark(jd,st.lat,st.lon);
  if(!S.eph[c.id])return null;
  var t0=dk.start||jd,t1=dk.end||(jd+.3),best=null;
  for(var t=t0;t<=t1;t+=1/144){var e=ephAt(c.id,t); if(!e)continue;
    var aa=altaz(e.ra,e.dec,t,st.lat,st.lon);
    if(!best||aa.alt>best.alt)best={alt:aa.alt,az:aa.az,jd:t,e:e};}
  if(!best)return null;
  var m=moonPos(best.jd);
  best.moonSep=sep(best.e.ra,best.e.dec,m.ra,m.dec);
  best.moonAlt=altaz(m.ra,m.dec,best.jd,st.lat,st.lon).alt;
  return best;
}
function compass(az){
  var d=["north","north-east","east","south-east","south","south-west","west","north-west"];
  return d[Math.round(n360(az)/45)%8];
}

/* ---- all-sky dome ---- */
function drawDome(){
  var cv=el("cmt-dome"),x=cv.getContext("2d");
  var dpr=Math.min(2,window.devicePixelRatio||1),W=cv.clientWidth||860;
  cv.width=W*dpr;cv.height=W*dpr;cv.style.height=W+"px";
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,W);
  var cx=W/2,cy=W/2,R=W/2-24,jd=toJD(S.now),st=S.site;
  var cRule=col("rule"),cStar=col("star"),cBrand=col("brand"),
      cSoft=col("ink-soft"),cSky=col("skyline"),cAcc=col("accent");
  var small=W<520, drop=small?1.0:0, lim=Math.max(3,S.lim-drop), sz=small?1.9:1.0;
  function P(alt,az){var r=R*(90-alt)/90,a=az*D2R;
    return[cx-r*Math.sin(a),cy-r*Math.cos(a)];}   // N up, E left
  x.strokeStyle=cRule;x.lineWidth=1;
  x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
  x.globalAlpha=.55;[30,60].forEach(function(a){
    x.beginPath();x.arc(cx,cy,R*(90-a)/90,0,7);x.stroke();});x.globalAlpha=1;
  if(S.minAlt>0){x.setLineDash([2,4]);x.strokeStyle=cAcc;x.globalAlpha=.7;
    x.beginPath();x.arc(cx,cy,R*(90-S.minAlt)/90,0,7);x.stroke();
    x.setLineDash([]);x.globalAlpha=1;}
  x.fillStyle=cSoft;x.font='500 '+(small?13:12)+'px '+col_font();
  x.textAlign="center";x.textBaseline="middle";
  [["N",0],["E",90],["S",180],["W",270]].forEach(function(p){
    var q=P(-5.5,p[1]);x.fillText(p[0],q[0],q[1]);});
  x.strokeStyle=cSky;x.lineWidth=small?1.1:1;
  CONST.forEach(function(f){f[1].forEach(function(seg){
    var on=false;x.beginPath();
    seg.forEach(function(p){var aa=altaz(p[0],p[1],jd,st.lat,st.lon);
      if(aa.alt<0){on=false;return;}
      var q=P(aa.alt,aa.az);
      if(!on){x.moveTo(q[0],q[1]);on=true;}else x.lineTo(q[0],q[1]);});
    x.stroke();});});
  var shown=0;x.fillStyle=cStar;
  for(var i=0;i<STARS.length;i++){var s=STARS[i];
    if(s[2]>lim)continue;
    var aa=altaz(s[0],s[1],jd,st.lat,st.lon); if(aa.alt<0)continue;
    shown++;var q=P(aa.alt,aa.az);
    x.globalAlpha=Math.min(1,.45+(lim-s[2])*.22);
    x.beginPath();x.arc(q[0],q[1],Math.max(.7,(lim-s[2]+.8)*.46*sz),0,7);x.fill();}
  x.globalAlpha=1;
  var mp=moonPos(jd),ma=altaz(mp.ra,mp.dec,jd,st.lat,st.lon);
  if(ma.alt>-2){var q=P(ma.alt,ma.az),f=illum(jd);
    x.beginPath();x.arc(q[0],q[1],small?9:7,0,7);
    x.fillStyle=cSoft;x.globalAlpha=.2+f*.65;x.fill();x.globalAlpha=1;
    x.strokeStyle=cSoft;x.lineWidth=1;x.stroke();}
  x.textAlign="left";x.font='600 '+(small?12:11)+'px '+col_font();
  COMETS.forEach(function(c){
    var e=ephAt(c.id,jd); if(!e)return;
    var aa=altaz(e.ra,e.dec,jd,st.lat,st.lon); if(aa.alt<0)return;
    var q=P(aa.alt,aa.az),rr=small?6:4.5;
    x.strokeStyle=cBrand;x.lineWidth=2;
    x.beginPath();x.arc(q[0],q[1],rr,0,7);x.stroke();
    x.globalAlpha=.35;x.beginPath();x.arc(q[0],q[1],rr*2.2,0,7);x.stroke();x.globalAlpha=1;
    x.fillStyle=cBrand;x.fillText(c.name.split(/[\/ ]/)[0],q[0]+rr+5,q[1]+4);});
  el("cmt-legstars").textContent=shown.toLocaleString()+" stars up to mag "+lim.toFixed(1)+
    (drop?" (thinned for this screen)":"");}
function col_font(){
  return getComputedStyle(el("cmt")).getPropertyValue("--mono").trim()||"monospace";}

/* ---- sky chart ----------------------------------------------------------
   One chart carrying everything: constellation lines, named stars, the
   comet's dated track, its position as a marker, and the direction the
   tail points. The comet is drawn as a small bullseye with a shaded wedge
   for the tail direction — a map symbol, never a picture of the object. It
   marks where to look; it does not claim to show what you would see.
   -------------------------------------------------------------------- */
var _conAbbr=null;
function conName(abbr){
  if(!_conAbbr){_conAbbr={};
    for(var i=0;i<CONNAMES.length;i++)_conAbbr[CONNAMES[i][0]]=CONNAMES[i][1];}
  return _conAbbr[abbr]||abbr;
}
function conAt(ra,dec){
  var best="",bd=1e9;
  for(var i=0;i<STARS.length;i++){
    var s=STARS[i];
    if(s.length<5||s[4]!==0)continue;
    var sp=s[3].lastIndexOf(" ");
    if(sp<0)continue;
    if(Math.abs(s[1]-dec)>bd)continue;
    var d=sep(ra,dec,s[0],s[1]);
    if(d<bd){bd=d;best=s[3].slice(sp+1);}}
  return best?conName(best):"";
}

function drawChart(cv,c,fov){
  var x=cv.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1);
  var W=cv.clientWidth||460,H=Math.round(W*0.78);
  cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+"px";
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
  x.fillStyle=col("sky");x.fillRect(0,0,W,H);

  var jd=toJD(S.now),e=ephAt(c.id,jd),m=magOf(c);
  var cStar=col("star"),cBrand=col("brand"),cSoft=col("ink-soft"),
      cSky=col("skyline"),cInk=col("ink"),mono=col_font();
  if(!e){x.fillStyle=cSoft;x.textAlign="center";x.font="12px "+mono;
    x.fillText("No position data",W/2,H/2);return;}

  var ra0=e.ra*D2R,d0=e.dec*D2R,sc=(Math.min(W,H)/2)/(fov/2),cx=W/2,cy=H/2;
  function P(ra,dec){
    var r=ra*D2R,d=dec*D2R;
    var cc=Math.sin(d0)*Math.sin(d)+Math.cos(d0)*Math.cos(d)*Math.cos(r-ra0);
    if(cc<.02)return null; var k=2/(1+cc);
    return[cx-k*Math.cos(d)*Math.sin(r-ra0)*R2D*sc,
           cy-k*(Math.cos(d0)*Math.sin(d)-Math.sin(d0)*Math.cos(d)*Math.cos(r-ra0))*R2D*sc];
  }

  // constellation lines first — the strongest orientation cue
  x.strokeStyle=cSky;x.lineWidth=1;x.globalAlpha=.8;
  CONST.forEach(function(f){f[1].forEach(function(seg){
    var on=false;x.beginPath();
    seg.forEach(function(p){var q=P(p[0],p[1]);
      if(!q){on=false;return;}
      if(!on){x.moveTo(q[0],q[1]);on=true;}else x.lineTo(q[0],q[1]);});
    x.stroke();});});
  x.globalAlpha=1;

  // stars, brightest first so the important labels win the space
  var lim=fov>20?6.0:7.5;
  var labelAll=fov<=12;                 // wide fields would turn to mush
  var placed=[],pool=[];
  for(var i=0;i<STARS.length;i++){
    var s=STARS[i];
    if(s[2]>lim)continue;
    if(Math.abs(s[1]-e.dec)>fov*0.9+2)continue;
    pool.push(s);
  }
  pool.sort(function(p,q){return p[2]-q[2];});
  function free(bx,by,bw,bh){
    for(var i=0;i<placed.length;i++){var p=placed[i];
      if(bx<p[0]+p[2]&&bx+bw>p[0]&&by<p[1]+p[3]&&by+bh>p[1])return false;}
    placed.push([bx,by,bw,bh]);return true;}
  for(var j=0;j<pool.length;j++){
    var s=pool[j],p=P(s[0],s[1]);
    if(!p||p[0]<-6||p[0]>W+6||p[1]<-6||p[1]>H+6)continue;
    var rad=Math.max(.7,(lim-s[2]+.9)*.55);
    x.globalAlpha=Math.min(1,.40+(lim-s[2])*.18);
    x.fillStyle=cStar;x.beginPath();x.arc(p[0],p[1],rad,0,7);x.fill();
    x.globalAlpha=1;
    if(s.length>4&&(s[4]===1||labelAll)){
      var pr=s[4]===1;
      x.font=(pr?"600 11px ":"400 10px ")+mono;
      var w=x.measureText(s[3]).width,gx=p[0]+rad+5,gy=p[1]+4;
      if(gx+w>W-6)gx=p[0]-rad-5-w;
      if(!free(gx-1,gy-10,w+2,13))continue;
      x.fillStyle=pr?cInk:cSoft;x.globalAlpha=pr?.95:.72;
      x.fillText(s[3],gx,gy);x.globalAlpha=1;
    }
  }

  // the comet's path, with dated ticks
  var rows=S.eph[c.id]||[];
  x.strokeStyle=cBrand;x.globalAlpha=.6;x.lineWidth=1.2;x.setLineDash([3,3]);
  x.beginPath();var on=false;
  rows.forEach(function(r){var p=P(r.ra,r.dec);
    if(!p){on=false;return;}
    if(!on){x.moveTo(p[0],p[1]);on=true;}else x.lineTo(p[0],p[1]);});
  x.stroke();x.setLineDash([]);x.globalAlpha=1;
  x.font="9.5px "+mono;x.textAlign="left";
  var stp=fov>12?7:3;
  for(var k=0;k<rows.length;k+=stp){
    var q=P(rows[k].ra,rows[k].dec);
    if(!q||q[0]<10||q[0]>W-10||q[1]<10||q[1]>H-10)continue;
    x.fillStyle=cBrand;x.globalAlpha=.85;x.fillRect(q[0]-1.5,q[1]-1.5,3,3);
    x.globalAlpha=.65;
    x.fillText(new Date((rows[k].jd-2440587.5)*864e5)
      .toLocaleDateString(undefined,{month:"short",day:"numeric"}),q[0]+5,q[1]-4);
  }
  x.globalAlpha=1;

  // The comet marker. A map symbol, not a picture: fixed size, drawn in the
  // brand colour so it reads as an annotation rather than an object. The tail
  // is stubbed in the true anti-solar direction, which is the one thing about
  // a comet's appearance that the data actually pins down.
  var pa=tailPA(c);
  var th=(pa==null?0:pa*D2R),ax=-Math.sin(th),ay=-Math.cos(th);
  if(pa!=null){
    // tapered tail, drawn first so the head sits over it
    x.save();x.translate(cx,cy);x.rotate(Math.atan2(ay,ax));
    var TL=54;
    var g=x.createLinearGradient(0,0,TL,0);
    g.addColorStop(0,cBrand);g.addColorStop(1,"rgba(0,0,0,0)");
    x.globalAlpha=.55;x.fillStyle=g;
    x.beginPath();
    x.moveTo(6,-5);
    x.quadraticCurveTo(TL*0.5,-8,TL,-2.5);
    x.lineTo(TL,2.5);
    x.quadraticCurveTo(TL*0.5,8,6,5);
    x.closePath();x.fill();
    x.globalAlpha=1;x.restore();
  }
  // coma: a ring, not a glow
  x.strokeStyle=cBrand;x.lineWidth=1.4;x.globalAlpha=.55;
  x.beginPath();x.arc(cx,cy,9,0,7);x.stroke();x.globalAlpha=1;
  // nucleus
  x.fillStyle=cBrand;x.beginPath();x.arc(cx,cy,3.6,0,7);x.fill();
  // a light halo so it stays visible over a dense star field
  x.strokeStyle=col("sky");x.lineWidth=2.2;
  x.beginPath();x.arc(cx,cy,5.6,0,7);x.stroke();
  x.strokeStyle=cBrand;x.lineWidth=1.4;
  x.beginPath();x.arc(cx,cy,5.6,0,7);x.stroke();
  if(pa!=null){
    x.font="600 10px "+mono;x.textAlign="center";x.fillStyle=cBrand;
    x.fillText("tail",cx+ax*70,cy+ay*70+4);
  }

  // furniture
  x.fillStyle=cSoft;x.font="10px "+mono;
  x.textAlign="center";x.fillText("N",cx,14);
  x.textAlign="left";x.fillText("E",8,cy+4);
  var bd=fov>20?10:(fov>8?2:1);
  x.strokeStyle=cSoft;x.lineWidth=1.2;
  x.beginPath();x.moveTo(14,H-14);x.lineTo(14+bd*sc,H-14);x.stroke();
  x.fillText(bd+"\u00B0",14,H-20);
  x.textAlign="right";x.fillText("N up \u00B7 E left",W-10,H-14);
  x.textAlign="left";x.fillStyle=col("accent");x.font="600 11px "+mono;
  x.fillText(conAt(e.ra,e.dec),12,18);
}

/* ---- brightness curve, straight from the JPL track ---- */
function drawCurve(cv,c){
  var x=cv.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1);
  var W=cv.clientWidth||380,H=155;
  cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+"px";
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
  var cRule=col("rule"),cBrand=col("brand"),cSoft=col("ink-soft"),mono=col_font();
  var rows=(S.eph[c.id]||[]).filter(function(r){return r.mag!=null;});
  if(rows.length<2){x.fillStyle=cSoft;x.textAlign="center";x.font="12px "+mono;
    x.fillText("No brightness data for this comet",W/2,H/2);return;}
  var jd0=rows[0].jd,jd1=rows[rows.length-1].jd;
  var mags=rows.map(function(r){return r.mag;});
  var lo=Math.min.apply(null,mags)-.4,hi=Math.max.apply(null,mags)+.4;
  if(hi-lo<1){var md=(hi+lo)/2;lo=md-.5;hi=md+.5;}
  var L=36,R=12,T=14,B=26;
  function X(jd){return L+((jd-jd0)/(jd1-jd0))*(W-L-R);}
  function Y(m){return T+((m-lo)/(hi-lo))*(H-T-B);}
  x.strokeStyle=cRule;x.lineWidth=1;x.fillStyle=cSoft;x.font="9.5px "+mono;
  x.textAlign="right";x.textBaseline="middle";
  var step=(hi-lo)>4?2:1;
  for(var m=Math.ceil(lo);m<=Math.floor(hi);m+=step){
    x.fillText(m.toFixed(0),L-5,Y(m));
    x.globalAlpha=.4;x.beginPath();x.moveTo(L,Y(m));x.lineTo(W-R,Y(m));x.stroke();x.globalAlpha=1;}
  x.textAlign="center";x.textBaseline="top";
  [0,0.5,1].forEach(function(f){
    var jd=jd0+(jd1-jd0)*f;
    x.fillText(new Date((jd-2440587.5)*864e5)
      .toLocaleDateString(undefined,{month:"short",day:"numeric"}),X(jd),H-B+6);});
  x.strokeStyle=cBrand;x.lineWidth=2;x.beginPath();
  rows.forEach(function(r,i){i?x.lineTo(X(r.jd),Y(r.mag)):x.moveTo(X(r.jd),Y(r.mag));});
  x.stroke();
  var nowJd=toJD(S.now),e=ephAt(c.id,nowJd);
  if(e&&e.mag!=null&&nowJd>=jd0&&nowJd<=jd1){
    x.setLineDash([2,3]);x.strokeStyle=cSoft;x.lineWidth=1;
    x.beginPath();x.moveTo(X(nowJd),T);x.lineTo(X(nowJd),H-B);x.stroke();x.setLineDash([]);
    x.fillStyle=cBrand;x.beginPath();x.arc(X(nowJd),Y(e.mag),4,0,7);x.fill();
    x.fillStyle=cSoft;x.font="9.5px "+mono;x.textAlign="left";x.textBaseline="middle";
    x.fillText("today",X(nowJd)+6,T+6);}
}

/* ---- text ---- */
function pad(n){return(n<10?"0":"")+n;}
function raStr(ra){var h=ra/15,hh=Math.floor(h),mm=(h-hh)*60,mi=Math.floor(mm);
  return pad(hh)+"h "+pad(mi)+"m "+((mm-mi)*60).toFixed(1)+"s";}
function decStr(d){var s=d<0?"\u2212":"+",a=Math.abs(d),dd=Math.floor(a),mm=(a-dd)*60,mi=Math.floor(mm);
  return s+pad(dd)+"\u00B0 "+pad(mi)+"\u2032 "+pad(Math.round((mm-mi)*60))+"\u2033";}
// Times are shown at the OBSERVING SITE, not in the visitor's own timezone.
// A visitor in Toronto looking at Sydney needs Sydney's clock. Presets carry
// an IANA zone; for a location the visitor typed or geolocated, their own
// browser zone is the right answer.
function siteTZ(){
  if(S.site&&S.site.tz)return S.site.tz;
  try{return Intl.DateTimeFormat().resolvedOptions().timeZone;}catch(e){return undefined;}
}
function hm(jd){
  var d=new Date((jd-2440587.5)*864e5),o={hour:"2-digit",minute:"2-digit"},tz=siteTZ();
  if(tz)o.timeZone=tz;
  try{return d.toLocaleTimeString(undefined,o);}
  catch(e){return d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});}
}
function siteClock(){
  var o={hour:"2-digit",minute:"2-digit",weekday:"short",day:"numeric",month:"short"},tz=siteTZ();
  if(tz)o.timeZone=tz;
  try{return S.now.toLocaleString(undefined,o);}
  catch(e){return S.now.toLocaleString();}
}
function rowsTable(list){return '<table class="cmt-exp"><tbody>'+list.map(function(p){
  return "<tr><td>"+p[0]+'</td><td class="cmt-exp-v">'+p[1]+"</td></tr>";}).join("")+"</tbody></table>";}

function drawFlags(){
  var jd=toJD(S.now),dk=dark(jd,S.site.lat,S.site.lon),f=[];
  f.push('<span class="cmt-flag">'+S.site.n+' · Bortle '+S.site.b+'</span>');
  f.push('<span class="cmt-flag">'+phaseName(jd)+' · '+Math.round(illum(jd)*100)+'% lit</span>');
  f.push('<span class="cmt-flag">'+(dk.start&&dk.end?
    "Dark "+hm(dk.start)+"–"+hm(dk.end):"No astronomical dark")+'</span>');
  if(S.fetch==="loading")f.push('<span class="cmt-flag">Loading positions…</span>');
  else if(S.fetch==="ok")f.push('<span class="cmt-flag cmt-ok">Positions · JPL Horizons · '+
    (S.ageDays!=null&&S.ageDays<1?"updated today":"updated "+Math.floor(S.ageDays)+"d ago")+'</span>');
  else if(S.fetch==="stale")f.push('<span class="cmt-flag cmt-warn">Positions '+S.note+
    ' — the nightly update may have stopped</span>');
  else if(S.fetch==="part")f.push('<span class="cmt-flag cmt-warn">Positions partial · '+S.note+'</span>');
  else f.push('<span class="cmt-flag cmt-bad">Positions unavailable — '+S.note+'</span>');
  el("cmt-flags").innerHTML=f.join("");
  el("cmt-legdark").textContent=dk.start&&dk.end?"Dark until "+hm(dk.end):"Twilight all night";}

function drawList(){
  var list=el("cmt-list"),jd=toJD(S.now),vis=0,h="",open={};
  Array.prototype.forEach.call(list.querySelectorAll(".cmt-row"),function(r){
    if(r.dataset.open==="1")open[r.dataset.id]=1;});

  COMETS.map(function(c){return{c:c,t:tonight(c),m:magOf(c)};})
   .sort(function(x,y){
     if(x.m==null)return 1; if(y.m==null)return -1;
     if(Math.abs(x.m-y.m)>0.25)return x.m-y.m;
     return(y.t?y.t.alt:-999)-(x.t?x.t.alt:-999);})
   .forEach(function(o){
    var c=o.c,t=o.t,m=o.m,pass=true,why="";
    if(t){ if(t.alt<S.minAlt){pass=false;why="only gets "+t.alt.toFixed(0)+"\u00B0 above the horizon";}
      else if(t.e.elong!=null&&t.e.elong<S.minEl){pass=false;why="too close to the Sun";}}
    if(pass&&m!=null)vis++;
    var mm=(m!=null)?cometAperture(m):null, g=mm?gearFor(mm):null, tr=trendOf(c);
    var e=ephAt(c.id,jd);

    h+='<div class="cmt-row'+(pass?"":" cmt-off")+'" data-id="'+c.id+'" data-open="'+
      (open[c.id]?1:0)+'"><button class="cmt-rowbtn" type="button" aria-expanded="'+
      (open[c.id]?"true":"false")+'">'+
      '<span><span class="cmt-rname">'+c.name+'</span><span class="cmt-rmeta">'+
      (e?'<span>in '+conAt(e.ra,e.dec)+'</span>':'')+
      (tr?'<span>'+tr.a+' '+tr.w+'</span>':'')+
      (t&&pass?'<span>highest '+hm(t.jd)+', '+t.alt.toFixed(0)+'\u00B0 up in the '+compass(t.az)+'</span>':'')+
      (!pass&&why?'<span>'+why+'</span>':'')+'</span></span>'+
      '<span class="cmt-rmag"><b>'+(m!=null?m.toFixed(1):"\u2014")+'</b>'+
      '<span class="cmt-pill '+(g&&mm<=35?"cmt-bb":"cmt-nb")+'">'+
      (g?g.t:"no data")+'</span></span></button>'+
      '<div class="cmt-detail">'+
        '<div class="cmt-kpis">'+
          '<div class="cmt-kpi"><div class="cmt-l">Brightness</div><div class="cmt-v">'+
            (m!=null?m.toFixed(1):"\u2014")+'</div><div class="cmt-d">magnitude \u2014 '+
            'lower is brighter</div></div>'+
          '<div class="cmt-kpi"><div class="cmt-l">You will likely need</div><div class="cmt-v cmt-sm">'+
            (function(){var a=(m!=null)?scopeAdvice(m):null;return a?a.one:(g?g.t:"\u2014");})()+
            '</div><div class="cmt-d">'+
            (function(){var a=(m!=null)?scopeAdvice(m):null;
              return a?(g?g.s:"")+' Estimated \u2014 see below.':(g?g.s:"");})()+
            '</div></div>'+
          '<div class="cmt-kpi"><div class="cmt-l">Best time tonight</div><div class="cmt-v cmt-sm">'+
            (t&&pass?hm(t.jd):"not up")+'</div><div class="cmt-d">'+
            (t&&pass?'<b>'+t.alt.toFixed(0)+'\u00B0</b> above the '+compass(t.az)+' horizon':
             (why||"below your minimum altitude"))+'</div></div>'+
          '<div class="cmt-kpi"><div class="cmt-l">Distance from us</div><div class="cmt-v">'+
            (e&&e.delta!=null?e.delta.toFixed(2):"\u2014")+'<small> AU</small></div>'+
            '<div class="cmt-d">'+(e&&e.delta!=null?
              Math.round(e.delta*149.6)+' million km':'')+'</div></div>'+
        '</div>'+
        '<div class="cmt-alert cmt-info"><span class="cmt-ic">i</span><div><b>'+
          verdictFor(m)+'</b>'+
          (function(){
            var adv=(m!=null)?scopeAdvice(m):null;
            if(adv){
              return ' From a Bortle '+S.site.b+' sky like '+S.site.n+', magnitude '+
                m.toFixed(1)+' calls for '+article(adv.one)+'. That follows the limiting '+
                'magnitudes telescope makers publish, less their light-pollution '+
                'allowance. A large diffuse coma will be harder than this; the brightness '+
                'itself is NASA\u2019s prediction and can be out in either direction.';
            }
            var better=darkerSkyThatWorks(m);
            if(better!=null){
              var s2=scopeAdvice(m,better);
              return ' From a Bortle '+S.site.b+' sky like '+S.site.n+', magnitude '+
                m.toFixed(1)+' is out of reach \u2014 the light is lost in the skyglow '+
                'before aperture becomes the limit. From a Bortle '+better+' sky, '+
                bortleWords(better)+', '+(s2?article(s2.one):'a large telescope')+
                ' would show it. For this one the drive matters more than the telescope.';
            }
            return ' At magnitude '+(m!=null?m.toFixed(1):'?')+' this is beyond visual '+
              'reach from any sky. A camera will still record it: stacked exposures reach '+
              'far fainter than the eye can.';
          })()+
          '</div></div>'+
        '<div class="cmt-two"><div class="cmt-box"><h4>Where to look</h4>'+
          '<canvas class="cmt-chart"></canvas>'+
          '<div class="cmt-modeswitch" style="margin-top:.7rem">'+
            '<button type="button" class="cmt-fov" data-fov="25">Wide 25\u00B0</button>'+
            '<button type="button" class="cmt-fov cmt-on" data-fov="10">Medium 10\u00B0</button>'+
            '<button type="button" class="cmt-fov" data-fov="5">Close 5\u00B0</button>'+
          '</div>'+
          '<p class="cmt-sec-note" style="margin:.7rem 0 0;font-size:.8rem">'+
            'The bullseye marks where the comet is. It is a map symbol, not a picture '+
            'of the comet. The dashed line is its path across the sky, with dated ticks. '+
            'The shaded wedge fanning out from the marker shows which way the tail is '+
            'pushed \u2014 always directly away from the Sun'+
            (tailPA(c)!=null?', so toward the '+paWord(tailPA(c))+' tonight':'')+
            '. Stars are shown down to magnitude 7.5; through binoculars or a telescope '+
            'you will see many more.</p>'+
          '</div>'+
          '<div><div class="cmt-box" style="margin-bottom:.8rem">'+
          '<h4>Brightness over the next two months</h4>'+
          '<canvas class="cmt-curve"></canvas></div>'+
          '<div class="cmt-box"><h4>Coordinates</h4><div data-nums></div></div></div></div>'+
      '</div></div>';});

  list.innerHTML=h;
  var best=null;
  COMETS.forEach(function(c){var m=magOf(c);if(m!=null&&(best==null||m<best))best=m;});
  var lead = vis===0
    ? "Nothing on this list clears your filters tonight. Try lowering the minimum altitude."
    : vis+" of "+COMETS.length+" are up and clear of the Sun tonight.";
  if(best!=null&&best>11){
    lead += " This is a lean spell: the brightest comet anywhere in the sky is only "+
      "magnitude "+best.toFixed(1)+", so everything here wants a telescope rather than "+
      "binoculars. Bright comets are occasional \u2014 worth checking back.";
  }
  el("cmt-count").textContent = lead;

  Array.prototype.forEach.call(list.querySelectorAll(".cmt-row"),function(row){
    var c=get(row.dataset.id),e=ephAt(c.id,jd),t=tonight(c),rows=[];
    if(e){
      rows.push(["Right ascension",raStr(e.ra)]);
      rows.push(["Declination",decStr(e.dec)]);
      rows.push(["Distance from Earth",e.delta!=null?e.delta.toFixed(3)+" AU":"\u2014"]);
      rows.push(["Distance from the Sun",e.r!=null?e.r.toFixed(3)+" AU":"\u2014"]);
      rows.push(["Angle from the Sun",e.elong!=null?e.elong.toFixed(0)+"\u00B0"+
        (e.elong<30?" (lost in twilight)":""):"\u2014"]);
    } else rows.push(["Position","loading"]);
    if(t){rows.push(["Moon is",t.moonSep.toFixed(0)+"\u00B0 away"+(t.moonAlt<0?", and down":"")]);}
    row.querySelector("[data-nums]").innerHTML=rowsTable(rows);

    var btn=row.querySelector(".cmt-rowbtn");
    btn.addEventListener("click",function(){
      var o=row.dataset.open==="1";row.dataset.open=o?"0":"1";
      btn.setAttribute("aria-expanded",String(!o));
      if(!o)redraw(row);});
    Array.prototype.forEach.call(row.querySelectorAll(".cmt-fov"),function(bt){
      bt.addEventListener("click",function(ev){ev.stopPropagation();
        Array.prototype.forEach.call(row.querySelectorAll(".cmt-fov"),function(o){
          o.classList.remove("cmt-on");});
        bt.classList.add("cmt-on");redraw(row);});});
    if(row.dataset.open==="1")redraw(row);});}

function redraw(row){
  var c=get(row.dataset.id),fb=row.querySelector(".cmt-fov.cmt-on");
  var ch=row.querySelector("canvas.cmt-chart"),cu=row.querySelector("canvas.cmt-curve");
  if(ch)drawChart(ch,c,fb?parseFloat(fb.dataset.fov):10);
  if(cu)drawCurve(cu,c);}

function render(){tickClock();drawFlags();drawDome();drawList();}

/* ---- wiring ---- */
var sel=el("cmt-site");
if(sel)(function(){
  var group=null,og=null;
  SITES.forEach(function(s,i){
    if(s.g!==group){group=s.g;og=document.createElement("optgroup");og.label=group;sel.appendChild(og);}
    var o=document.createElement("option");
    o.value=i;o.textContent=s.n+" \u2014 Bortle "+s.b;
    (og||sel).appendChild(o);
  });
})();
if(sel)sel.addEventListener("change",function(e){
  if(e.target.value==="")return;
  S.site=SITES[+e.target.value];_dc={};clearCol();syncBortle();render();});
on("cmt-mag","input",function(e){S.lim=parseFloat(e.target.value);
  el("cmt-magv").textContent="mag "+S.lim.toFixed(1);drawDome();});
on("cmt-alt","input",function(e){S.minAlt=+e.target.value;
  el("cmt-altv").textContent=S.minAlt+"\u00B0";drawDome();drawList();});
on("cmt-el","input",function(e){S.minEl=+e.target.value;
  el("cmt-elv").textContent=S.minEl+"\u00B0";drawList();});
on("cmt-night","click",function(e){
  var on=el("cmt").getAttribute("data-night")==="on";
  el("cmt").setAttribute("data-night",on?"off":"on");
  e.currentTarget.setAttribute("aria-pressed",String(!on));
  e.currentTarget.classList.toggle("cmt-on",!on);
  clearCol();render();});
on("cmt-geo","click",function(){
  if(!navigator.geolocation)return;
  navigator.geolocation.getCurrentPosition(function(p){
    setSite({n:"Your location",lat:p.coords.latitude,lon:p.coords.longitude,b:6});},function(){});
});
function setSite(s){
  S.site=s;_dc={};clearCol();syncBortle();
  var sel=el("cmt-site");if(sel)sel.value="";
  render();
}
function applyCoords(){
  var la=parseFloat(el("cmt-lat").value), lo=parseFloat(el("cmt-lon").value);
  var note=el("cmt-coordnote");
  if(isNaN(la)||isNaN(lo)||la<-90||la>90||lo<-180||lo>180){
    note.textContent="Latitude must be between \u221290 and 90, longitude between \u2212180 and 180.";
    return;
  }
  note.textContent="Showing "+la.toFixed(3)+"\u00B0, "+lo.toFixed(3)+
    "\u00B0. Times use your own clock. Sky darkness assumed Bortle 5 \u2014 "+
    "pick a nearby place above if you want a different one.";
  setSite({n:la.toFixed(2)+"\u00B0, "+lo.toFixed(2)+"\u00B0", lat:la, lon:lo, b:5});
}
on("cmt-go","click",applyCoords);
function syncBortle(){var n=el("cmt-bortle");if(n)n.value=String(S.site.b||5);}
on("cmt-bortle","change",function(e){
  S.site=Object.assign({},S.site,{b:+e.target.value});
  _dc={};clearCol();render();
});
["cmt-lat","cmt-lon"].forEach(function(id){
  on(id,"keydown",function(e){if(e.key==="Enter")applyCoords();});
});
on("cmt-reload","click",function(){S.eph={};S.fetch="loading";loadEph();});
var rt;window.addEventListener("resize",function(){clearTimeout(rt);
  rt=setTimeout(function(){drawDome();
    Array.prototype.forEach.call(document.querySelectorAll('.cmt-row[data-open="1"]'),redraw);},150);});
// Keep the sky live. The clock ticks every 10 seconds so the panel visibly
// reflects "right now"; the chart itself only needs redrawing every half
// minute, which is well inside the accuracy of anything shown.
function tickClock(){var c=el("cmt-clock");if(c)c.textContent=siteClock();}
setInterval(function(){S.now=new Date();tickClock();},10000);
setInterval(function(){S.now=new Date();drawFlags();drawDome();},30000);

syncBortle();
render();
Promise.all([loadSky(),loadEph()]).then(render);
})();



})();
