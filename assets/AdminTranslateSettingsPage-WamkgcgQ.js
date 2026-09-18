import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{ft as t,ut as n}from"./radix-CZyrmWVq.js";import{t as r}from"./toolkit-DuNpR3X3.js";import{a as i,i as a,m as ee,n as o,o as s,r as c,s as l,t as u}from"./card-DroaWbf6.js";import{i as d,n as f,o as p,s as m,t as h}from"./select-B3Hrymk1.js";import{t as g}from"./PageBreadcrumb-C79IsJQr.js";import{t as _}from"./circle-check-BXy1YPXh.js";import{n as te,r as v,t as y}from"./key-CFeI4UGQ.js";import{t as b}from"./globe-BjaEg4YX.js";import{t as x}from"./loader-circle-DoxpcvZx.js";import{t as S}from"./save-DdmadQcZ.js";import{t as C}from"./server-DZR07UvA.js";import{t as w}from"./shield-JuL1tlmr.js";import{t as T}from"./triangle-alert-WSE7KzMX.js";import{n as E}from"./dist-CdQjqD3X.js";import{t as D}from"./input-CdnMJXzp.js";import{C as O,D as k,E as ne,O as re,S as ie,T as ae,b as A,w as j,x as M}from"./index-CEA0ildL.js";import{t as N}from"./switch-B4zyXbbV.js";import{a as P,i as F,n as I,o as L,r as R}from"./translate-DZYQQNek.js";import{t as z}from"./label-CFy7IJqN.js";var B=e(t(),1),V=n(),H=`// ============================================================
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
};`;function U(){let{adminT:e}=ee(),{markDirty:t}=A(),[n,U]=(0,B.useState)({provider:`mymemory`,deeplApiKey:``,deeplPlan:`free`,useCorsProxy:!0,corsProxyApiKey:``,customProxyUrl:``}),[W,G]=(0,B.useState)(!1),[K,q]=(0,B.useState)(null),[J,Y]=(0,B.useState)(!1),[X,Z]=(0,B.useState)(null),[Q,$]=(0,B.useState)(!1);return(0,B.useEffect)(()=>{U(R())},[]),(0,V.jsxs)(`div`,{className:`space-y-4`,children:[(0,V.jsx)(g,{firstItem:{label:e(`admin.dashboard`),href:`/admin/dashboard`,icon:`dashboard`},items:[{label:e(`admin.translateSettings`)||e(`admin.translationSettings`)}]}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h1`,{className:`text-2xl font-bold text-foreground`,children:`Translation Settings`}),(0,V.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:`Configure your translation service provider and API keys`})]}),(0,V.jsx)(u,{className:`border-amber-500/30 bg-amber-500/5`,children:(0,V.jsx)(o,{className:`pt-4 pb-4`,children:(0,V.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,V.jsx)(w,{className:`size-5 text-amber-500 shrink-0 mt-0.5`}),(0,V.jsxs)(`div`,{className:`text-sm space-y-1`,children:[(0,V.jsx)(`p`,{className:`font-medium text-amber-600 dark:text-amber-500`,children:`Sensitive Information Notice`}),(0,V.jsxs)(`p`,{className:`text-muted-foreground`,children:[`This page contains sensitive data (API Key). The API Key is `,(0,V.jsx)(`strong`,{children:`stored locally in your browser only`}),` and will `,(0,V.jsx)(`strong`,{children:`never`}),` be synced to GitHub.`]}),(0,V.jsxs)(`p`,{className:`text-muted-foreground`,children:[`Custom translation texts entered by admins `,(0,V.jsx)(`strong`,{children:`will`}),` be synced to GitHub via `,(0,V.jsx)(`code`,{className:`px-1.5 py-0.5 bg-muted rounded text-xs font-mono`,children:`data/translations.json`}),`.`]})]})]})})}),(0,V.jsxs)(u,{className:`border-border/40 bg-card`,children:[(0,V.jsxs)(i,{children:[(0,V.jsxs)(s,{className:`text-base flex items-center gap-2`,children:[(0,V.jsx)(b,{className:`size-5 text-primary`}),`Translation Provider`]}),(0,V.jsx)(c,{children:`Choose which translation service to use. DeepL offers higher quality and requires an API key.`})]}),(0,V.jsxs)(o,{className:`space-y-6`,children:[(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsx)(z,{children:`Provider`}),(0,V.jsxs)(h,{value:n.provider,onValueChange:e=>U({...n,provider:e}),children:[(0,V.jsx)(p,{className:`max-w-xs`,children:(0,V.jsx)(m,{})}),(0,V.jsxs)(f,{children:[(0,V.jsx)(d,{value:`mymemory`,children:`MyMemory (Free, no API key)`}),(0,V.jsx)(d,{value:`deepl`,children:`DeepL (Higher quality, API key required)`})]})]})]}),n.provider===`deepl`&&(0,V.jsxs)(`div`,{className:`space-y-4 p-4 rounded-lg border border-border/40 bg-background/40`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,V.jsx)(y,{className:`size-4 text-primary`}),`DeepL API Configuration`]}),(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsx)(z,{htmlFor:`deepl-key`,children:`API Key`}),(0,V.jsx)(D,{id:`deepl-key`,type:`password`,value:n.deeplApiKey,onChange:e=>U({...n,deeplApiKey:e.target.value}),placeholder:`e.g. 12345678-1234-1234-1234-123456789abc:fx`,className:`max-w-md font-mono text-sm`}),(0,V.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get your API key from`,` `,(0,V.jsx)(r,{to:`https://www.deepl.com/pro-api`,target:`_blank`,rel:`noreferrer`,className:`text-primary hover:underline`,children:`deepl.com/pro-api`}),`. Free plan includes 500,000 characters/month.`]})]}),(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsx)(z,{children:`Plan Type`}),(0,V.jsxs)(h,{value:n.deeplPlan,onValueChange:e=>U({...n,deeplPlan:e}),children:[(0,V.jsx)(p,{className:`max-w-xs`,children:(0,V.jsx)(m,{})}),(0,V.jsxs)(f,{children:[(0,V.jsx)(d,{value:`free`,children:`Free Plan (api-free.deepl.com)`}),(0,V.jsx)(d,{value:`pro`,children:`Pro Plan (api.deepl.com)`})]})]})]}),(0,V.jsxs)(`div`,{className:`p-3 rounded-md bg-info/10 border border-info/30 text-info/90 text-xs space-y-1`,children:[(0,V.jsx)(`p`,{className:`font-semibold`,children:`💡 DeepL & Browser CORS`}),(0,V.jsxs)(`p`,{children:[`DeepL API does `,(0,V.jsx)(`strong`,{children:`not`}),` support direct calls from the browser (CORS is blocked). You must use a proxy. `,(0,V.jsx)(`strong`,{children:`Custom proxy (Cloudflare Worker)`}),` is the most reliable option. If you don't have one, enable the CORS Proxy below as a fallback.`]})]}),(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,V.jsx)(C,{className:`size-4 text-primary`}),`Custom Proxy URL (Recommended)`]}),(0,V.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Enter your Cloudflare Worker or other self-hosted proxy URL. This is the most stable option and bypasses all CORS issues.`}),(0,V.jsxs)(`div`,{className:`flex gap-2 flex-wrap`,children:[(0,V.jsx)(D,{type:`url`,value:n.customProxyUrl,onChange:e=>U({...n,customProxyUrl:e.target.value}),placeholder:`https://deepl-proxy.yourname.workers.dev`,className:`max-w-md font-mono text-sm flex-1`}),(0,V.jsxs)(l,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(!n.customProxyUrl.trim()){E.warning(`Please enter a Custom Proxy URL first`);return}Y(!0),Z(null);try{let e=await L(n.customProxyUrl);Z(e),e.ok?E.success(`Proxy connection is healthy`):E.error(`Proxy test failed`)}catch(e){Z({ok:!1,message:String(e)}),E.error(`Proxy test request failed`)}finally{Y(!1)}},disabled:J||!n.customProxyUrl.trim(),children:[J?(0,V.jsx)(x,{className:`size-4 mr-1 animate-spin`}):(0,V.jsx)(_,{className:`size-4 mr-1`}),`Test Proxy`]}),(0,V.jsxs)(M,{children:[(0,V.jsx)(re,{asChild:!0,children:(0,V.jsxs)(l,{variant:`outline`,size:`sm`,children:[(0,V.jsx)(v,{className:`size-4 mr-1`}),`View Worker Code`]})}),(0,V.jsxs)(O,{className:`border-border/40 bg-card text-foreground max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`,children:[(0,V.jsxs)(ne,{children:[(0,V.jsx)(k,{children:`Cloudflare Worker — DeepL Proxy`}),(0,V.jsx)(j,{className:`text-muted-foreground`,children:`Copy and paste this code into a new Cloudflare Worker. Then paste the Worker URL above.`})]}),(0,V.jsx)(`div`,{className:`flex-1 overflow-auto`,children:(0,V.jsx)(`pre`,{className:`text-xs bg-background border border-border/40 rounded-md p-3 text-muted-foreground whitespace-pre-wrap break-all`,children:H})}),(0,V.jsxs)(ae,{className:`gap-2`,children:[(0,V.jsx)(ie,{asChild:!0,children:(0,V.jsx)(l,{variant:`outline`,children:`Close`})}),(0,V.jsxs)(l,{size:`sm`,onClick:()=>{navigator.clipboard.writeText(H).then(()=>{E.success(`Code copied to clipboard`)}).catch(()=>{E.error(`Copy failed`)})},children:[(0,V.jsx)(te,{className:`size-4 mr-1`}),`Copy Code`]})]})]})]})]}),X&&(0,V.jsx)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${X.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:(0,V.jsxs)(`div`,{className:`flex items-start gap-2`,children:[X.ok?(0,V.jsx)(_,{className:`size-4 shrink-0 mt-0.5`}):(0,V.jsx)(T,{className:`size-4 shrink-0 mt-0.5`}),(0,V.jsxs)(`div`,{className:`space-y-1`,children:[(0,V.jsx)(`span`,{className:`font-medium`,children:X.message}),X.details&&(0,V.jsx)(`pre`,{className:`text-xs whitespace-pre-wrap break-all opacity-80 mt-1`,children:X.details})]})]})})]}),(0,V.jsxs)(`div`,{className:`flex items-center justify-between max-w-md`,children:[(0,V.jsxs)(`div`,{className:`space-y-0.5`,children:[(0,V.jsx)(z,{htmlFor:`cors-proxy`,children:`Use CORS Proxy`}),(0,V.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Required when DeepL API blocks browser requests due to CORS`})]}),(0,V.jsx)(N,{id:`cors-proxy`,checked:n.useCorsProxy,onCheckedChange:e=>U({...n,useCorsProxy:e})})]}),n.useCorsProxy&&(0,V.jsxs)(`div`,{className:`space-y-2 pl-4 border-l-2 border-border/40`,children:[(0,V.jsx)(z,{htmlFor:`cors-proxy-key`,children:`CORS Proxy API Key`}),(0,V.jsx)(D,{id:`cors-proxy-key`,type:`password`,value:n.corsProxyApiKey,onChange:e=>U({...n,corsProxyApiKey:e.target.value}),placeholder:`Get a free key from cors.sh`,className:`max-w-md font-mono text-sm`}),(0,V.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get a free temporary key from`,` `,(0,V.jsx)(r,{to:`https://proxy.cors.sh/`,children:`proxy.cors.sh`}),`. Leave empty for basic anonymous usage (rate limited).`]})]}),(0,V.jsx)(`div`,{className:`flex items-center gap-2`,children:(0,V.jsxs)(l,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(n.provider!==`deepl`||!n.deeplApiKey.trim()){E.warning(`Please select DeepL and enter an API Key first`);return}G(!0),q(null);try{let e=await P(n.deeplApiKey,n.deeplPlan,n.useCorsProxy,n.corsProxyApiKey,n.customProxyUrl);q(e),e.ok?E.success(`API Key is valid!`):E.error(`API Key test failed`)}catch(e){q({ok:!1,message:String(e)}),E.error(`Test request failed`)}finally{G(!1)}},disabled:W||!n.deeplApiKey.trim(),children:[W?(0,V.jsx)(x,{className:`size-4 mr-2 animate-spin`}):(0,V.jsx)(_,{className:`size-4 mr-2`}),`Test API Key`]})}),K&&(0,V.jsxs)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${K.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:[(0,V.jsxs)(`div`,{className:`flex items-start gap-2`,children:[K.ok?(0,V.jsx)(_,{className:`size-4 shrink-0 mt-0.5`}):(0,V.jsx)(T,{className:`size-4 shrink-0 mt-0.5`}),(0,V.jsx)(`span`,{className:`break-all`,children:K.message})]}),!K.ok&&!n.useCorsProxy&&(K.message.toLowerCase().includes(`failed to fetch`)||K.message.toLowerCase().includes(`cors`)||K.message.toLowerCase().includes(`network`))&&(0,V.jsxs)(`div`,{className:`text-xs border-t border-destructive/20 pt-2 space-y-1`,children:[(0,V.jsx)(`p`,{className:`font-semibold`,children:`Why this happens:`}),(0,V.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,V.jsx)(`li`,{children:`DeepL API does NOT allow direct browser calls (CORS is blocked on their side)`}),(0,V.jsx)(`li`,{children:`"Failed to fetch" usually means the browser blocked the request due to CORS`}),(0,V.jsx)(`li`,{children:`This is expected behavior — not an API key issue`})]}),(0,V.jsx)(`p`,{className:`font-semibold mt-2`,children:`Solution:`}),(0,V.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,V.jsxs)(`li`,{children:[`Enable the `,(0,V.jsx)(`strong`,{children:`"Use CORS Proxy"`}),` toggle above (recommended)`]}),(0,V.jsx)(`li`,{children:`Or use MyMemory (free, no key required) — it works directly in the browser`}),(0,V.jsx)(`li`,{children:`Or set up a backend proxy server for DeepL`})]})]})]})]}),n.provider===`mymemory`&&(0,V.jsx)(`div`,{className:`p-4 rounded-lg border border-border/40 bg-background/40`,children:(0,V.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`MyMemory`}),` is a free translation service that doesn't require an API key. It's used as the default fallback. Limit: ~5000 characters/day per IP address.`]})})]}),(0,V.jsxs)(a,{className:`flex justify-between border-t border-border/40 pt-4`,children:[(0,V.jsx)(l,{type:`button`,variant:`outline`,size:`sm`,onClick:()=>{I(),E.success(`Translation cache cleared`)},children:`Clear Translation Cache`}),(0,V.jsxs)(l,{type:`button`,onClick:()=>{$(!0);try{F(n),t(`settings`),E.success(`Translation settings saved`),q(null),Z(null)}catch{E.error(`Failed to save settings`)}finally{setTimeout(()=>$(!1),300)}},disabled:Q,className:`bg-primary hover:bg-primary/90`,children:[Q?(0,V.jsx)(x,{className:`size-4 mr-2 animate-spin`}):(0,V.jsx)(S,{className:`size-4 mr-2`}),`Save Settings`]})]})]}),(0,V.jsxs)(u,{className:`border-border/40 bg-card`,children:[(0,V.jsx)(i,{children:(0,V.jsx)(s,{className:`text-base`,children:`How Auto-Translate Works`})}),(0,V.jsxs)(o,{className:`text-sm text-muted-foreground space-y-2`,children:[(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`As-you-type:`}),` When you stop typing in the English input field for 500ms, the system automatically translates to Chinese, Spanish, and Japanese.`]}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`On blur:`}),` Clicking away from the English field triggers an immediate translation.`]}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`Caching:`}),` Translated text is cached locally to avoid redundant API calls and stay within rate limits.`]}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`Fallback:`}),` If DeepL fails (invalid key, rate limit, network issue), the system automatically falls back to MyMemory.`]})]})]})]})}export{U as default};