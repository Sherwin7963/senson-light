import{d as e,o as t,t as n}from"./toolkit-shim-RVIUYT4N.js";import{n as r}from"./dist-D-J4ORno.js";import{a as i,i as a,n as o,o as s,r as c,s as l,t as u,v as d}from"./card-CS6brS4C.js";import{t as f}from"./jsx-runtime-WTu9FJws.js";import{t as p}from"./PageBreadcrumb-CVDsk3IR.js";import{t as m}from"./loader-circle-DIHfciVx.js";import{t as h}from"./triangle-alert-CTni7Kvf.js";import{t as g}from"./input-C3qN_OBl.js";import{$ as ee,At as te,Et as _,F as v,I as y,J as b,L as x,Nt as ne,P as S,Q as C,R as w,X as T,Y as E,Z as D,Zt as re,dn as ie,et as ae,kn as O,nt as k,tt as A,xn as j,yn as M}from"./index-zgrxyo0C.js";import{t as N}from"./switch-BQknvGHO.js";import{a as P,i as F,n as I,o as L,r as R}from"./translate-DIkYwKyo.js";import{t as z}from"./label-BTDXLbq6.js";var B=e(t(),1),V=f(),H=`// ============================================================
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
};`;function U(){let{adminT:e}=d(),{markDirty:t}=b(),[f,U]=(0,B.useState)({provider:`mymemory`,deeplApiKey:``,deeplPlan:`free`,useCorsProxy:!0,corsProxyApiKey:``,customProxyUrl:``}),[W,G]=(0,B.useState)(!1),[K,q]=(0,B.useState)(null),[J,Y]=(0,B.useState)(!1),[X,Z]=(0,B.useState)(null),[Q,$]=(0,B.useState)(!1);return(0,B.useEffect)(()=>{U(R())},[]),(0,V.jsxs)(`div`,{className:`space-y-4`,children:[(0,V.jsx)(p,{firstItem:{label:e(`admin.dashboard`),href:`/admin/dashboard`,icon:`dashboard`},items:[{label:e(`admin.translateSettings`)||e(`admin.translationSettings`)}]}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h1`,{className:`text-2xl font-bold text-foreground`,children:`Translation Settings`}),(0,V.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:`Configure your translation service provider and API keys`})]}),(0,V.jsx)(u,{className:`border-amber-500/30 bg-amber-500/5`,children:(0,V.jsx)(o,{className:`pt-4 pb-4`,children:(0,V.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,V.jsx)(_,{className:`size-5 text-amber-500 shrink-0 mt-0.5`}),(0,V.jsxs)(`div`,{className:`text-sm space-y-1`,children:[(0,V.jsx)(`p`,{className:`font-medium text-amber-600 dark:text-amber-500`,children:`Sensitive Information Notice`}),(0,V.jsxs)(`p`,{className:`text-muted-foreground`,children:[`This page contains sensitive data (API Key). The API Key is `,(0,V.jsx)(`strong`,{children:`stored locally in your browser only`}),` and will `,(0,V.jsx)(`strong`,{children:`never`}),` be synced to GitHub.`]}),(0,V.jsxs)(`p`,{className:`text-muted-foreground`,children:[`Custom translation texts entered by admins `,(0,V.jsx)(`strong`,{children:`will`}),` be synced to GitHub via `,(0,V.jsx)(`code`,{className:`px-1.5 py-0.5 bg-muted rounded text-xs font-mono`,children:`data/translations.json`}),`.`]})]})]})})}),(0,V.jsxs)(u,{className:`border-border/40 bg-card`,children:[(0,V.jsxs)(i,{children:[(0,V.jsxs)(s,{className:`text-base flex items-center gap-2`,children:[(0,V.jsx)(ie,{className:`size-5 text-primary`}),`Translation Provider`]}),(0,V.jsx)(c,{children:`Choose which translation service to use. DeepL offers higher quality and requires an API key.`})]}),(0,V.jsxs)(o,{className:`space-y-6`,children:[(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsx)(z,{children:`Provider`}),(0,V.jsxs)(S,{value:f.provider,onValueChange:e=>U({...f,provider:e}),children:[(0,V.jsx)(x,{className:`max-w-xs`,children:(0,V.jsx)(w,{})}),(0,V.jsxs)(v,{children:[(0,V.jsx)(y,{value:`mymemory`,children:`MyMemory (Free, no API key)`}),(0,V.jsx)(y,{value:`deepl`,children:`DeepL (Higher quality, API key required)`})]})]})]}),f.provider===`deepl`&&(0,V.jsxs)(`div`,{className:`space-y-4 p-4 rounded-lg border border-border/40 bg-background/40`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,V.jsx)(re,{className:`size-4 text-primary`}),`DeepL API Configuration`]}),(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsx)(z,{htmlFor:`deepl-key`,children:`API Key`}),(0,V.jsx)(g,{id:`deepl-key`,type:`password`,value:f.deeplApiKey,onChange:e=>U({...f,deeplApiKey:e.target.value}),placeholder:`e.g. 12345678-1234-1234-1234-123456789abc:fx`,className:`max-w-md font-mono text-sm`}),(0,V.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get your API key from`,` `,(0,V.jsx)(n,{to:`https://www.deepl.com/pro-api`,target:`_blank`,rel:`noreferrer`,className:`text-primary hover:underline`,children:`deepl.com/pro-api`}),`. Free plan includes 500,000 characters/month.`]})]}),(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsx)(z,{children:`Plan Type`}),(0,V.jsxs)(S,{value:f.deeplPlan,onValueChange:e=>U({...f,deeplPlan:e}),children:[(0,V.jsx)(x,{className:`max-w-xs`,children:(0,V.jsx)(w,{})}),(0,V.jsxs)(v,{children:[(0,V.jsx)(y,{value:`free`,children:`Free Plan (api-free.deepl.com)`}),(0,V.jsx)(y,{value:`pro`,children:`Pro Plan (api.deepl.com)`})]})]})]}),(0,V.jsxs)(`div`,{className:`p-3 rounded-md bg-info/10 border border-info/30 text-info/90 text-xs space-y-1`,children:[(0,V.jsx)(`p`,{className:`font-semibold`,children:`💡 DeepL & Browser CORS`}),(0,V.jsxs)(`p`,{children:[`DeepL API does `,(0,V.jsx)(`strong`,{children:`not`}),` support direct calls from the browser (CORS is blocked). You must use a proxy. `,(0,V.jsx)(`strong`,{children:`Custom proxy (Cloudflare Worker)`}),` is the most reliable option. If you don't have one, enable the CORS Proxy below as a fallback.`]})]}),(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,V.jsx)(te,{className:`size-4 text-primary`}),`Custom Proxy URL (Recommended)`]}),(0,V.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Enter your Cloudflare Worker or other self-hosted proxy URL. This is the most stable option and bypasses all CORS issues.`}),(0,V.jsxs)(`div`,{className:`flex gap-2 flex-wrap`,children:[(0,V.jsx)(g,{type:`url`,value:f.customProxyUrl,onChange:e=>U({...f,customProxyUrl:e.target.value}),placeholder:`https://deepl-proxy.yourname.workers.dev`,className:`max-w-md font-mono text-sm flex-1`}),(0,V.jsxs)(l,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(!f.customProxyUrl.trim()){r.warning(`Please enter a Custom Proxy URL first`);return}Y(!0),Z(null);try{let e=await L(f.customProxyUrl);Z(e),e.ok?r.success(`Proxy connection is healthy`):r.error(`Proxy test failed`)}catch(e){Z({ok:!1,message:String(e)}),r.error(`Proxy test request failed`)}finally{Y(!1)}},disabled:J||!f.customProxyUrl.trim(),children:[J?(0,V.jsx)(m,{className:`size-4 mr-1 animate-spin`}):(0,V.jsx)(O,{className:`size-4 mr-1`}),`Test Proxy`]}),(0,V.jsxs)(E,{children:[(0,V.jsx)(k,{asChild:!0,children:(0,V.jsxs)(l,{variant:`outline`,size:`sm`,children:[(0,V.jsx)(j,{className:`size-4 mr-1`}),`View Worker Code`]})}),(0,V.jsxs)(D,{className:`border-border/40 bg-card text-foreground max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`,children:[(0,V.jsxs)(ae,{children:[(0,V.jsx)(A,{children:`Cloudflare Worker — DeepL Proxy`}),(0,V.jsx)(C,{className:`text-muted-foreground`,children:`Copy and paste this code into a new Cloudflare Worker. Then paste the Worker URL above.`})]}),(0,V.jsx)(`div`,{className:`flex-1 overflow-auto`,children:(0,V.jsx)(`pre`,{className:`text-xs bg-background border border-border/40 rounded-md p-3 text-muted-foreground whitespace-pre-wrap break-all`,children:H})}),(0,V.jsxs)(ee,{className:`gap-2`,children:[(0,V.jsx)(T,{asChild:!0,children:(0,V.jsx)(l,{variant:`outline`,children:`Close`})}),(0,V.jsxs)(l,{size:`sm`,onClick:()=>{navigator.clipboard.writeText(H).then(()=>{r.success(`Code copied to clipboard`)}).catch(()=>{r.error(`Copy failed`)})},children:[(0,V.jsx)(M,{className:`size-4 mr-1`}),`Copy Code`]})]})]})]})]}),X&&(0,V.jsx)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${X.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:(0,V.jsxs)(`div`,{className:`flex items-start gap-2`,children:[X.ok?(0,V.jsx)(O,{className:`size-4 shrink-0 mt-0.5`}):(0,V.jsx)(h,{className:`size-4 shrink-0 mt-0.5`}),(0,V.jsxs)(`div`,{className:`space-y-1`,children:[(0,V.jsx)(`span`,{className:`font-medium`,children:X.message}),X.details&&(0,V.jsx)(`pre`,{className:`text-xs whitespace-pre-wrap break-all opacity-80 mt-1`,children:X.details})]})]})})]}),(0,V.jsxs)(`div`,{className:`flex items-center justify-between max-w-md`,children:[(0,V.jsxs)(`div`,{className:`space-y-0.5`,children:[(0,V.jsx)(z,{htmlFor:`cors-proxy`,children:`Use CORS Proxy`}),(0,V.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Required when DeepL API blocks browser requests due to CORS`})]}),(0,V.jsx)(N,{id:`cors-proxy`,checked:f.useCorsProxy,onCheckedChange:e=>U({...f,useCorsProxy:e})})]}),f.useCorsProxy&&(0,V.jsxs)(`div`,{className:`space-y-2 pl-4 border-l-2 border-border/40`,children:[(0,V.jsx)(z,{htmlFor:`cors-proxy-key`,children:`CORS Proxy API Key`}),(0,V.jsx)(g,{id:`cors-proxy-key`,type:`password`,value:f.corsProxyApiKey,onChange:e=>U({...f,corsProxyApiKey:e.target.value}),placeholder:`Get a free key from cors.sh`,className:`max-w-md font-mono text-sm`}),(0,V.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get a free temporary key from`,` `,(0,V.jsx)(n,{to:`https://proxy.cors.sh/`,children:`proxy.cors.sh`}),`. Leave empty for basic anonymous usage (rate limited).`]})]}),(0,V.jsx)(`div`,{className:`flex items-center gap-2`,children:(0,V.jsxs)(l,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(f.provider!==`deepl`||!f.deeplApiKey.trim()){r.warning(`Please select DeepL and enter an API Key first`);return}G(!0),q(null);try{let e=await P(f.deeplApiKey,f.deeplPlan,f.useCorsProxy,f.corsProxyApiKey,f.customProxyUrl);q(e),e.ok?r.success(`API Key is valid!`):r.error(`API Key test failed`)}catch(e){q({ok:!1,message:String(e)}),r.error(`Test request failed`)}finally{G(!1)}},disabled:W||!f.deeplApiKey.trim(),children:[W?(0,V.jsx)(m,{className:`size-4 mr-2 animate-spin`}):(0,V.jsx)(O,{className:`size-4 mr-2`}),`Test API Key`]})}),K&&(0,V.jsxs)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${K.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:[(0,V.jsxs)(`div`,{className:`flex items-start gap-2`,children:[K.ok?(0,V.jsx)(O,{className:`size-4 shrink-0 mt-0.5`}):(0,V.jsx)(h,{className:`size-4 shrink-0 mt-0.5`}),(0,V.jsx)(`span`,{className:`break-all`,children:K.message})]}),!K.ok&&!f.useCorsProxy&&(K.message.toLowerCase().includes(`failed to fetch`)||K.message.toLowerCase().includes(`cors`)||K.message.toLowerCase().includes(`network`))&&(0,V.jsxs)(`div`,{className:`text-xs border-t border-destructive/20 pt-2 space-y-1`,children:[(0,V.jsx)(`p`,{className:`font-semibold`,children:`Why this happens:`}),(0,V.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,V.jsx)(`li`,{children:`DeepL API does NOT allow direct browser calls (CORS is blocked on their side)`}),(0,V.jsx)(`li`,{children:`"Failed to fetch" usually means the browser blocked the request due to CORS`}),(0,V.jsx)(`li`,{children:`This is expected behavior — not an API key issue`})]}),(0,V.jsx)(`p`,{className:`font-semibold mt-2`,children:`Solution:`}),(0,V.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,V.jsxs)(`li`,{children:[`Enable the `,(0,V.jsx)(`strong`,{children:`"Use CORS Proxy"`}),` toggle above (recommended)`]}),(0,V.jsx)(`li`,{children:`Or use MyMemory (free, no key required) — it works directly in the browser`}),(0,V.jsx)(`li`,{children:`Or set up a backend proxy server for DeepL`})]})]})]})]}),f.provider===`mymemory`&&(0,V.jsx)(`div`,{className:`p-4 rounded-lg border border-border/40 bg-background/40`,children:(0,V.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`MyMemory`}),` is a free translation service that doesn't require an API key. It's used as the default fallback. Limit: ~5000 characters/day per IP address.`]})})]}),(0,V.jsxs)(a,{className:`flex justify-between border-t border-border/40 pt-4`,children:[(0,V.jsx)(l,{type:`button`,variant:`outline`,size:`sm`,onClick:()=>{I(),r.success(`Translation cache cleared`)},children:`Clear Translation Cache`}),(0,V.jsxs)(l,{type:`button`,onClick:()=>{$(!0);try{F(f),t(`settings`),r.success(`Translation settings saved`),q(null),Z(null)}catch{r.error(`Failed to save settings`)}finally{setTimeout(()=>$(!1),300)}},disabled:Q,className:`bg-primary hover:bg-primary/90`,children:[Q?(0,V.jsx)(m,{className:`size-4 mr-2 animate-spin`}):(0,V.jsx)(ne,{className:`size-4 mr-2`}),`Save Settings`]})]})]}),(0,V.jsxs)(u,{className:`border-border/40 bg-card`,children:[(0,V.jsx)(i,{children:(0,V.jsx)(s,{className:`text-base`,children:`How Auto-Translate Works`})}),(0,V.jsxs)(o,{className:`text-sm text-muted-foreground space-y-2`,children:[(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`As-you-type:`}),` When you stop typing in the English input field for 500ms, the system automatically translates to Chinese, Spanish, and Japanese.`]}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`On blur:`}),` Clicking away from the English field triggers an immediate translation.`]}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`Caching:`}),` Translated text is cached locally to avoid redundant API calls and stay within rate limits.`]}),(0,V.jsxs)(`p`,{children:[(0,V.jsx)(`strong`,{className:`text-foreground`,children:`Fallback:`}),` If DeepL fails (invalid key, rate limit, network issue), the system automatically falls back to MyMemory.`]})]})]})]})}export{U as default};