import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{dt as t,lt as n}from"./radix-28cIy9iH.js";import{t as r}from"./toolkit-CTzdlMsi.js";import{a as i,i as a,m as o,n as s,o as c,r as l,s as u,t as d}from"./card-CLk6_aDH.js";import{i as f,n as p,o as m,s as h,t as g}from"./select-Cxrt-4is.js";import{t as _}from"./PageBreadcrumb-6b96bJLs.js";import{t as v}from"./circle-check-DXcBxIAa.js";import{n as ee,r as te,t as y}from"./key-oLHxlsOb.js";import{t as b}from"./globe-D65dIO_B.js";import{t as x}from"./loader-circle-BDdecXfK.js";import{t as S}from"./save-BnyZqhEK.js";import{t as C}from"./server-EmfZrO_R.js";import{t as w}from"./shield-89t7xb3n.js";import{t as T}from"./triangle-alert-BbGIkIWc.js";import{n as E}from"./dist-eZM4RrNa.js";import{t as D}from"./input-_KRwW4Ed.js";import{C as O,E as k,S as A,T as ne,b as re,w as j,x as M,y as N}from"./index-DIISZlWu.js";import{t as P}from"./switch-D21gVEKX.js";import{a as F,i as I,n as L,o as R,r as z}from"./translate-H8v1nWMX.js";import{t as B}from"./label-CgFgFUTq.js";var V=e(t(),1),H=n(),U=`// ============================================================
// Cloudflare Worker — DeepL Translation API Proxy (v135)
// ============================================================
// Paste this entire file into a new Cloudflare Worker.
// Fixes browser CORS restrictions for DeepL API calls.
//
// Setup:
//   1. Cloudflare Dashboard → Workers & Pages → Create → Create Worker
//   2. Replace all default code with this file
//   3. Save & Deploy
//   4. Copy the Worker URL (e.g. https://your-worker.you.workers.dev)
//   5. Paste into "Custom Proxy URL" field above
// ============================================================

// ---------- CORS Headers (critical for browser calls) ----------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Deepl-Plan, Accept, Accept-Language, Origin',
  'Access-Control-Expose-Headers':
    'Content-Type, Content-Length, X-RateLimit-Limit, X-RateLimit-Remaining, X-Character-Count',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// ---------- DeepL proxy handler ----------
async function handleDeepl(request, env) {
  try {
    const url = new URL(request.url);

    // Determine plan: /free path, /pro path, or X-Deepl-Plan header
    let plan = 'free';
    if (url.pathname.includes('/pro')) plan = 'pro';
    else if (url.pathname.includes('/free')) plan = 'free';
    else {
      const planHeader = request.headers.get('X-Deepl-Plan');
      if (planHeader === 'pro' || planHeader === 'free') plan = planHeader;
    }

    const targetBase =
      plan === 'free'
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate';

    const bodyText = await request.text();
    const forwardHeaders = new Headers();
    forwardHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

    // Use hardcoded key from secrets if set (more secure),
    // otherwise forward the Authorization header from the browser
    const hardcodedKey = env?.DEEPL_AUTH_KEY || globalThis.DEEPL_AUTH_KEY || '';
    if (hardcodedKey) {
      forwardHeaders.set('Authorization', \`DeepL-Auth-Key \${hardcodedKey}\`);
    } else {
      const authHeader = request.headers.get('Authorization');
      if (authHeader) forwardHeaders.set('Authorization', authHeader);
    }

    const deeplResponse = await fetch(targetBase, {
      method: 'POST',
      headers: forwardHeaders,
      body: bodyText,
    });

    const responseBody = await deeplResponse.text();
    const responseHeaders = new Headers({
      ...CORS_HEADERS,
      'Content-Type': deeplResponse.headers.get('content-type') || 'application/json',
    });

    // Forward rate limit headers
    for (const h of ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-character-count']) {
      const val = deeplResponse.headers.get(h);
      if (val) responseHeaders.set(h, val);
    }

    return new Response(responseBody, {
      status: deeplResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: 'Proxy error', details: message }, 502);
  }
}

// ---------- Main entry ----------
export default {
  async fetch(request, env) {
    try {
      // CORS preflight — must return 204 with CORS headers
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      const url = new URL(request.url);
      const pathname = url.pathname;

      // Health check endpoint
      if (pathname === '/' || pathname === '/health') {
        return json({
          status: 'ok',
          worker: 'deepl-proxy-v135',
          deeplConfigured:
            !!(env?.DEEPL_AUTH_KEY || globalThis.DEEPL_AUTH_KEY),
        });
      }

      // DeepL translate proxy (POST to any path)
      if (request.method === 'POST') {
        return handleDeepl(request, env);
      }

      return json({ error: 'Not found' }, 404);
    } catch (fatalErr) {
      const message = fatalErr instanceof Error ? fatalErr.message : String(fatalErr);
      return json({ error: 'Worker internal error', details: message }, 500);
    }
  },
};`;function W(){let{adminT:e}=o(),[t,n]=(0,V.useState)({provider:`mymemory`,deeplApiKey:``,deeplPlan:`free`,useCorsProxy:!0,corsProxyApiKey:``,customProxyUrl:``}),[W,G]=(0,V.useState)(!1),[K,q]=(0,V.useState)(null),[J,Y]=(0,V.useState)(!1),[X,Z]=(0,V.useState)(null),[Q,$]=(0,V.useState)(!1);return(0,V.useEffect)(()=>{n(z())},[]),(0,H.jsxs)(`div`,{className:`space-y-4`,children:[(0,H.jsx)(_,{firstItem:{label:e(`admin.dashboard`),href:`/admin/dashboard`,icon:`dashboard`},items:[{label:e(`admin.translateSettings`)||e(`admin.translationSettings`)}]}),(0,H.jsxs)(`div`,{children:[(0,H.jsx)(`h1`,{className:`text-2xl font-bold text-foreground`,children:`Translation Settings`}),(0,H.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:`Configure your translation service provider and API keys`})]}),(0,H.jsx)(d,{className:`border-amber-500/30 bg-amber-500/5`,children:(0,H.jsx)(s,{className:`pt-4 pb-4`,children:(0,H.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,H.jsx)(w,{className:`size-5 text-amber-500 shrink-0 mt-0.5`}),(0,H.jsxs)(`div`,{className:`text-sm space-y-1`,children:[(0,H.jsx)(`p`,{className:`font-medium text-amber-600 dark:text-amber-500`,children:`Sensitive Information Notice`}),(0,H.jsxs)(`p`,{className:`text-muted-foreground`,children:[`This page contains sensitive data (API Key). The API Key is `,(0,H.jsx)(`strong`,{children:`stored locally in your browser only`}),` and will `,(0,H.jsx)(`strong`,{children:`never`}),` be synced to GitHub.`]}),(0,H.jsxs)(`p`,{className:`text-muted-foreground`,children:[`Custom translation texts entered by admins `,(0,H.jsx)(`strong`,{children:`will`}),` be synced to GitHub via `,(0,H.jsx)(`code`,{className:`px-1.5 py-0.5 bg-muted rounded text-xs font-mono`,children:`data/translations.json`}),`.`]})]})]})})}),(0,H.jsxs)(d,{className:`border-border/40 bg-card`,children:[(0,H.jsxs)(i,{children:[(0,H.jsxs)(c,{className:`text-base flex items-center gap-2`,children:[(0,H.jsx)(b,{className:`size-5 text-primary`}),`Translation Provider`]}),(0,H.jsx)(l,{children:`Choose which translation service to use. DeepL offers higher quality and requires an API key.`})]}),(0,H.jsxs)(s,{className:`space-y-6`,children:[(0,H.jsxs)(`div`,{className:`space-y-2`,children:[(0,H.jsx)(B,{children:`Provider`}),(0,H.jsxs)(g,{value:t.provider,onValueChange:e=>n({...t,provider:e}),children:[(0,H.jsx)(m,{className:`max-w-xs`,children:(0,H.jsx)(h,{})}),(0,H.jsxs)(p,{children:[(0,H.jsx)(f,{value:`mymemory`,children:`MyMemory (Free, no API key)`}),(0,H.jsx)(f,{value:`deepl`,children:`DeepL (Higher quality, API key required)`})]})]})]}),t.provider===`deepl`&&(0,H.jsxs)(`div`,{className:`space-y-4 p-4 rounded-lg border border-border/40 bg-background/40`,children:[(0,H.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,H.jsx)(y,{className:`size-4 text-primary`}),`DeepL API Configuration`]}),(0,H.jsxs)(`div`,{className:`space-y-2`,children:[(0,H.jsx)(B,{htmlFor:`deepl-key`,children:`API Key`}),(0,H.jsx)(D,{id:`deepl-key`,type:`password`,value:t.deeplApiKey,onChange:e=>n({...t,deeplApiKey:e.target.value}),placeholder:`e.g. 12345678-1234-1234-1234-123456789abc:fx`,className:`max-w-md font-mono text-sm`}),(0,H.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get your API key from`,` `,(0,H.jsx)(r,{to:`https://www.deepl.com/pro-api`,target:`_blank`,rel:`noreferrer`,className:`text-primary hover:underline`,children:`deepl.com/pro-api`}),`. Free plan includes 500,000 characters/month.`]})]}),(0,H.jsxs)(`div`,{className:`space-y-2`,children:[(0,H.jsx)(B,{children:`Plan Type`}),(0,H.jsxs)(g,{value:t.deeplPlan,onValueChange:e=>n({...t,deeplPlan:e}),children:[(0,H.jsx)(m,{className:`max-w-xs`,children:(0,H.jsx)(h,{})}),(0,H.jsxs)(p,{children:[(0,H.jsx)(f,{value:`free`,children:`Free Plan (api-free.deepl.com)`}),(0,H.jsx)(f,{value:`pro`,children:`Pro Plan (api.deepl.com)`})]})]})]}),(0,H.jsxs)(`div`,{className:`p-3 rounded-md bg-info/10 border border-info/30 text-info/90 text-xs space-y-1`,children:[(0,H.jsx)(`p`,{className:`font-semibold`,children:`💡 DeepL & Browser CORS`}),(0,H.jsxs)(`p`,{children:[`DeepL API does `,(0,H.jsx)(`strong`,{children:`not`}),` support direct calls from the browser (CORS is blocked). You must use a proxy. `,(0,H.jsx)(`strong`,{children:`Custom proxy (Cloudflare Worker)`}),` is the most reliable option. If you don't have one, enable the CORS Proxy below as a fallback.`]})]}),(0,H.jsxs)(`div`,{className:`space-y-2`,children:[(0,H.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,H.jsx)(C,{className:`size-4 text-primary`}),`Custom Proxy URL (Recommended)`]}),(0,H.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Enter your Cloudflare Worker or other self-hosted proxy URL. This is the most stable option and bypasses all CORS issues.`}),(0,H.jsxs)(`div`,{className:`flex gap-2 flex-wrap`,children:[(0,H.jsx)(D,{type:`url`,value:t.customProxyUrl,onChange:e=>n({...t,customProxyUrl:e.target.value}),placeholder:`https://deepl-proxy.yourname.workers.dev`,className:`max-w-md font-mono text-sm flex-1`}),(0,H.jsxs)(u,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(!t.customProxyUrl.trim()){E.warning(`Please enter a Custom Proxy URL first`);return}Y(!0),Z(null);try{let e=await R(t.customProxyUrl);Z(e),e.ok?E.success(`Proxy connection is healthy`):E.error(`Proxy test failed`)}catch(e){Z({ok:!1,message:String(e)}),E.error(`Proxy test request failed`)}finally{Y(!1)}},disabled:J||!t.customProxyUrl.trim(),children:[J?(0,H.jsx)(x,{className:`size-4 mr-1 animate-spin`}):(0,H.jsx)(v,{className:`size-4 mr-1`}),`Test Proxy`]}),(0,H.jsxs)(N,{children:[(0,H.jsx)(k,{asChild:!0,children:(0,H.jsxs)(u,{variant:`outline`,size:`sm`,children:[(0,H.jsx)(te,{className:`size-4 mr-1`}),`View Worker Code`]})}),(0,H.jsxs)(M,{className:`border-border/40 bg-card text-foreground max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`,children:[(0,H.jsxs)(j,{children:[(0,H.jsx)(ne,{children:`Cloudflare Worker — DeepL Proxy`}),(0,H.jsx)(A,{className:`text-muted-foreground`,children:`Copy and paste this code into a new Cloudflare Worker. Then paste the Worker URL above.`})]}),(0,H.jsx)(`div`,{className:`flex-1 overflow-auto`,children:(0,H.jsx)(`pre`,{className:`text-xs bg-background border border-border/40 rounded-md p-3 text-muted-foreground whitespace-pre-wrap break-all`,children:U})}),(0,H.jsxs)(O,{className:`gap-2`,children:[(0,H.jsx)(re,{asChild:!0,children:(0,H.jsx)(u,{variant:`outline`,children:`Close`})}),(0,H.jsxs)(u,{size:`sm`,onClick:()=>{navigator.clipboard.writeText(U).then(()=>{E.success(`Code copied to clipboard`)}).catch(()=>{E.error(`Copy failed`)})},children:[(0,H.jsx)(ee,{className:`size-4 mr-1`}),`Copy Code`]})]})]})]})]}),X&&(0,H.jsx)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${X.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:(0,H.jsxs)(`div`,{className:`flex items-start gap-2`,children:[X.ok?(0,H.jsx)(v,{className:`size-4 shrink-0 mt-0.5`}):(0,H.jsx)(T,{className:`size-4 shrink-0 mt-0.5`}),(0,H.jsxs)(`div`,{className:`space-y-1`,children:[(0,H.jsx)(`span`,{className:`font-medium`,children:X.message}),X.details&&(0,H.jsx)(`pre`,{className:`text-xs whitespace-pre-wrap break-all opacity-80 mt-1`,children:X.details})]})]})})]}),(0,H.jsxs)(`div`,{className:`flex items-center justify-between max-w-md`,children:[(0,H.jsxs)(`div`,{className:`space-y-0.5`,children:[(0,H.jsx)(B,{htmlFor:`cors-proxy`,children:`Use CORS Proxy`}),(0,H.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Required when DeepL API blocks browser requests due to CORS`})]}),(0,H.jsx)(P,{id:`cors-proxy`,checked:t.useCorsProxy,onCheckedChange:e=>n({...t,useCorsProxy:e})})]}),t.useCorsProxy&&(0,H.jsxs)(`div`,{className:`space-y-2 pl-4 border-l-2 border-border/40`,children:[(0,H.jsx)(B,{htmlFor:`cors-proxy-key`,children:`CORS Proxy API Key`}),(0,H.jsx)(D,{id:`cors-proxy-key`,type:`password`,value:t.corsProxyApiKey,onChange:e=>n({...t,corsProxyApiKey:e.target.value}),placeholder:`Get a free key from cors.sh`,className:`max-w-md font-mono text-sm`}),(0,H.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get a free temporary key from`,` `,(0,H.jsx)(r,{to:`https://proxy.cors.sh/`,children:`proxy.cors.sh`}),`. Leave empty for basic anonymous usage (rate limited).`]})]}),(0,H.jsx)(`div`,{className:`flex items-center gap-2`,children:(0,H.jsxs)(u,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(t.provider!==`deepl`||!t.deeplApiKey.trim()){E.warning(`Please select DeepL and enter an API Key first`);return}G(!0),q(null);try{let e=await F(t.deeplApiKey,t.deeplPlan,t.useCorsProxy,t.corsProxyApiKey,t.customProxyUrl);q(e),e.ok?E.success(`API Key is valid!`):E.error(`API Key test failed`)}catch(e){q({ok:!1,message:String(e)}),E.error(`Test request failed`)}finally{G(!1)}},disabled:W||!t.deeplApiKey.trim(),children:[W?(0,H.jsx)(x,{className:`size-4 mr-2 animate-spin`}):(0,H.jsx)(v,{className:`size-4 mr-2`}),`Test API Key`]})}),K&&(0,H.jsxs)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${K.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:[(0,H.jsxs)(`div`,{className:`flex items-start gap-2`,children:[K.ok?(0,H.jsx)(v,{className:`size-4 shrink-0 mt-0.5`}):(0,H.jsx)(T,{className:`size-4 shrink-0 mt-0.5`}),(0,H.jsx)(`span`,{className:`break-all`,children:K.message})]}),!K.ok&&!t.useCorsProxy&&(K.message.toLowerCase().includes(`failed to fetch`)||K.message.toLowerCase().includes(`cors`)||K.message.toLowerCase().includes(`network`))&&(0,H.jsxs)(`div`,{className:`text-xs border-t border-destructive/20 pt-2 space-y-1`,children:[(0,H.jsx)(`p`,{className:`font-semibold`,children:`Why this happens:`}),(0,H.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,H.jsx)(`li`,{children:`DeepL API does NOT allow direct browser calls (CORS is blocked on their side)`}),(0,H.jsx)(`li`,{children:`"Failed to fetch" usually means the browser blocked the request due to CORS`}),(0,H.jsx)(`li`,{children:`This is expected behavior — not an API key issue`})]}),(0,H.jsx)(`p`,{className:`font-semibold mt-2`,children:`Solution:`}),(0,H.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,H.jsxs)(`li`,{children:[`Enable the `,(0,H.jsx)(`strong`,{children:`"Use CORS Proxy"`}),` toggle above (recommended)`]}),(0,H.jsx)(`li`,{children:`Or use MyMemory (free, no key required) — it works directly in the browser`}),(0,H.jsx)(`li`,{children:`Or set up a backend proxy server for DeepL`})]})]})]})]}),t.provider===`mymemory`&&(0,H.jsx)(`div`,{className:`p-4 rounded-lg border border-border/40 bg-background/40`,children:(0,H.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[(0,H.jsx)(`strong`,{className:`text-foreground`,children:`MyMemory`}),` is a free translation service that doesn't require an API key. It's used as the default fallback. Limit: ~5000 characters/day per IP address.`]})})]}),(0,H.jsxs)(a,{className:`flex justify-between border-t border-border/40 pt-4`,children:[(0,H.jsx)(u,{type:`button`,variant:`outline`,size:`sm`,onClick:()=>{L(),E.success(`Translation cache cleared`)},children:`Clear Translation Cache`}),(0,H.jsxs)(u,{type:`button`,onClick:()=>{$(!0);try{I(t),E.success(`Translation settings saved`),q(null),Z(null)}catch{E.error(`Failed to save settings`)}finally{setTimeout(()=>$(!1),300)}},disabled:Q,className:`bg-primary hover:bg-primary/90`,children:[Q?(0,H.jsx)(x,{className:`size-4 mr-2 animate-spin`}):(0,H.jsx)(S,{className:`size-4 mr-2`}),`Save Settings`]})]})]}),(0,H.jsxs)(d,{className:`border-border/40 bg-card`,children:[(0,H.jsx)(i,{children:(0,H.jsx)(c,{className:`text-base`,children:`How Auto-Translate Works`})}),(0,H.jsxs)(s,{className:`text-sm text-muted-foreground space-y-2`,children:[(0,H.jsxs)(`p`,{children:[(0,H.jsx)(`strong`,{className:`text-foreground`,children:`As-you-type:`}),` When you stop typing in the English input field for 500ms, the system automatically translates to Chinese, Spanish, and Japanese.`]}),(0,H.jsxs)(`p`,{children:[(0,H.jsx)(`strong`,{className:`text-foreground`,children:`On blur:`}),` Clicking away from the English field triggers an immediate translation.`]}),(0,H.jsxs)(`p`,{children:[(0,H.jsx)(`strong`,{className:`text-foreground`,children:`Caching:`}),` Translated text is cached locally to avoid redundant API calls and stay within rate limits.`]}),(0,H.jsxs)(`p`,{children:[(0,H.jsx)(`strong`,{className:`text-foreground`,children:`Fallback:`}),` If DeepL fails (invalid key, rate limit, network issue), the system automatically falls back to MyMemory.`]})]})]})]})}export{W as default};