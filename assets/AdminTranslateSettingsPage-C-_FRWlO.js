import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{dt as t,lt as n}from"./radix-28cIy9iH.js";import{t as r}from"./toolkit-BwrVjikB.js";import{a as i,i as a,m as o,n as s,o as c,r as l,s as u,t as d}from"./card-D8ED-kOa.js";import{i as f,n as p,o as m,s as h,t as g}from"./select-C5qXRLB4.js";import{t as _}from"./PageBreadcrumb-Cw9ydOl0.js";import{n as v,t as y}from"./loader-circle-C44IcRyq.js";import{n as b,r as x,t as S}from"./key-EVeUrqYU.js";import{t as C}from"./globe-DwTN6iUb.js";import{t as w}from"./save-CopPfzJN.js";import{t as T}from"./server-Bq8r6sER.js";import{t as E}from"./shield-B_OwYFXX.js";import{t as D}from"./triangle-alert-CFaF9ejJ.js";import{n as O}from"./dist-eZM4RrNa.js";import{t as k}from"./input-1SWs2P4e.js";import{C as A,S as j,T as M,b as N,v as P,w as F,x as I,y as L}from"./index-DS0zBQK1.js";import{t as R}from"./switch-BRyvkCrY.js";import{a as z,i as B,n as V,r as H}from"./translate-Dce3emWq.js";import{t as U}from"./label-DD35abq1.js";var W=e(t(),1),G=n(),K=`// Cloudflare Worker — DeepL API Proxy
// Paste this into a new Cloudflare Worker to bypass browser CORS restrictions.
//
// How it works:
// 1. Browser sends POST request to your Worker URL with Authorization header
// 2. Worker forwards the request to DeepL API
// 3. Worker returns DeepL response with CORS headers
//
// Setup:
// 1. Go to Cloudflare Dashboard → Workers & Pages → Create → Create Worker
// 2. Replace the default code with this entire file
// 3. Deploy → Copy the Worker URL
// 4. Paste it into "Custom Proxy URL" field above

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Deepl-Plan',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    try {
      const plan = request.headers.get('X-Deepl-Plan') === 'pro' ? 'pro' : 'free';
      const targetBase =
        plan === 'free'
          ? 'https://api-free.deepl.com/v2/translate'
          : 'https://api.deepl.com/v2/translate';

      const bodyText = await request.text();
      const forwardHeaders = new Headers();
      forwardHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

      const authHeader = request.headers.get('Authorization');
      if (authHeader) forwardHeaders.set('Authorization', authHeader);

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

      return new Response(responseBody, {
        status: deeplResponse.status,
        headers: responseHeaders,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return new Response(
        JSON.stringify({ error: 'Proxy error', details: message }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        },
      );
    }
  },
};`;function q(){let{adminT:e}=o(),[t,n]=(0,W.useState)({provider:`mymemory`,deeplApiKey:``,deeplPlan:`free`,useCorsProxy:!0,corsProxyApiKey:``,customProxyUrl:``}),[q,J]=(0,W.useState)(!1),[Y,X]=(0,W.useState)(null),[Z,Q]=(0,W.useState)(!1);return(0,W.useEffect)(()=>{n(H())},[]),(0,G.jsxs)(`div`,{className:`space-y-4`,children:[(0,G.jsx)(_,{firstItem:{label:e(`admin.dashboard`),href:`/admin/dashboard`,icon:`dashboard`},items:[{label:e(`admin.translateSettings`)||e(`admin.translationSettings`)}]}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h1`,{className:`text-2xl font-bold text-foreground`,children:`Translation Settings`}),(0,G.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:`Configure your translation service provider and API keys`})]}),(0,G.jsx)(d,{className:`border-amber-500/30 bg-amber-500/5`,children:(0,G.jsx)(s,{className:`pt-4 pb-4`,children:(0,G.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,G.jsx)(E,{className:`size-5 text-amber-500 shrink-0 mt-0.5`}),(0,G.jsxs)(`div`,{className:`text-sm space-y-1`,children:[(0,G.jsx)(`p`,{className:`font-medium text-amber-600 dark:text-amber-500`,children:`Sensitive Information Notice`}),(0,G.jsxs)(`p`,{className:`text-muted-foreground`,children:[`This page contains sensitive data (API Key). The API Key is `,(0,G.jsx)(`strong`,{children:`stored locally in your browser only`}),` and will `,(0,G.jsx)(`strong`,{children:`never`}),` be synced to GitHub.`]}),(0,G.jsxs)(`p`,{className:`text-muted-foreground`,children:[`Custom translation texts entered by admins `,(0,G.jsx)(`strong`,{children:`will`}),` be synced to GitHub via `,(0,G.jsx)(`code`,{className:`px-1.5 py-0.5 bg-muted rounded text-xs font-mono`,children:`data/translations.json`}),`.`]})]})]})})}),(0,G.jsxs)(d,{className:`border-border/40 bg-card`,children:[(0,G.jsxs)(i,{children:[(0,G.jsxs)(c,{className:`text-base flex items-center gap-2`,children:[(0,G.jsx)(C,{className:`size-5 text-primary`}),`Translation Provider`]}),(0,G.jsx)(l,{children:`Choose which translation service to use. DeepL offers higher quality and requires an API key.`})]}),(0,G.jsxs)(s,{className:`space-y-6`,children:[(0,G.jsxs)(`div`,{className:`space-y-2`,children:[(0,G.jsx)(U,{children:`Provider`}),(0,G.jsxs)(g,{value:t.provider,onValueChange:e=>n({...t,provider:e}),children:[(0,G.jsx)(m,{className:`max-w-xs`,children:(0,G.jsx)(h,{})}),(0,G.jsxs)(p,{children:[(0,G.jsx)(f,{value:`mymemory`,children:`MyMemory (Free, no API key)`}),(0,G.jsx)(f,{value:`deepl`,children:`DeepL (Higher quality, API key required)`})]})]})]}),t.provider===`deepl`&&(0,G.jsxs)(`div`,{className:`space-y-4 p-4 rounded-lg border border-border/40 bg-background/40`,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,G.jsx)(S,{className:`size-4 text-primary`}),`DeepL API Configuration`]}),(0,G.jsxs)(`div`,{className:`space-y-2`,children:[(0,G.jsx)(U,{htmlFor:`deepl-key`,children:`API Key`}),(0,G.jsx)(k,{id:`deepl-key`,type:`password`,value:t.deeplApiKey,onChange:e=>n({...t,deeplApiKey:e.target.value}),placeholder:`e.g. 12345678-1234-1234-1234-123456789abc:fx`,className:`max-w-md font-mono text-sm`}),(0,G.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get your API key from`,` `,(0,G.jsx)(r,{to:`https://www.deepl.com/pro-api`,target:`_blank`,rel:`noreferrer`,className:`text-primary hover:underline`,children:`deepl.com/pro-api`}),`. Free plan includes 500,000 characters/month.`]})]}),(0,G.jsxs)(`div`,{className:`space-y-2`,children:[(0,G.jsx)(U,{children:`Plan Type`}),(0,G.jsxs)(g,{value:t.deeplPlan,onValueChange:e=>n({...t,deeplPlan:e}),children:[(0,G.jsx)(m,{className:`max-w-xs`,children:(0,G.jsx)(h,{})}),(0,G.jsxs)(p,{children:[(0,G.jsx)(f,{value:`free`,children:`Free Plan (api-free.deepl.com)`}),(0,G.jsx)(f,{value:`pro`,children:`Pro Plan (api.deepl.com)`})]})]})]}),(0,G.jsxs)(`div`,{className:`p-3 rounded-md bg-info/10 border border-info/30 text-info/90 text-xs space-y-1`,children:[(0,G.jsx)(`p`,{className:`font-semibold`,children:`💡 DeepL & Browser CORS`}),(0,G.jsxs)(`p`,{children:[`DeepL API does `,(0,G.jsx)(`strong`,{children:`not`}),` support direct calls from the browser (CORS is blocked). You must use a proxy. `,(0,G.jsx)(`strong`,{children:`Custom proxy (Cloudflare Worker)`}),` is the most reliable option. If you don't have one, enable the CORS Proxy below as a fallback.`]})]}),(0,G.jsxs)(`div`,{className:`space-y-2`,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,G.jsx)(T,{className:`size-4 text-primary`}),`Custom Proxy URL (Recommended)`]}),(0,G.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Enter your Cloudflare Worker or other self-hosted proxy URL. This is the most stable option and bypasses all CORS issues.`}),(0,G.jsxs)(`div`,{className:`flex gap-2`,children:[(0,G.jsx)(k,{type:`url`,value:t.customProxyUrl,onChange:e=>n({...t,customProxyUrl:e.target.value}),placeholder:`https://deepl-proxy.yourname.workers.dev`,className:`max-w-md font-mono text-sm flex-1`}),(0,G.jsxs)(P,{children:[(0,G.jsx)(M,{asChild:!0,children:(0,G.jsxs)(u,{variant:`outline`,size:`sm`,children:[(0,G.jsx)(x,{className:`size-4 mr-1`}),`View Worker Code`]})}),(0,G.jsxs)(N,{className:`border-border/40 bg-card text-foreground max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`,children:[(0,G.jsxs)(A,{children:[(0,G.jsx)(F,{children:`Cloudflare Worker — DeepL Proxy`}),(0,G.jsx)(I,{className:`text-muted-foreground`,children:`Copy and paste this code into a new Cloudflare Worker. Then paste the Worker URL above.`})]}),(0,G.jsx)(`div`,{className:`flex-1 overflow-auto`,children:(0,G.jsx)(`pre`,{className:`text-xs bg-background border border-border/40 rounded-md p-3 text-muted-foreground whitespace-pre-wrap break-all`,children:K})}),(0,G.jsxs)(j,{className:`gap-2`,children:[(0,G.jsx)(L,{asChild:!0,children:(0,G.jsx)(u,{variant:`outline`,children:`Close`})}),(0,G.jsxs)(u,{size:`sm`,onClick:()=>{navigator.clipboard.writeText(K).then(()=>{O.success(`Code copied to clipboard`)}).catch(()=>{O.error(`Copy failed`)})},children:[(0,G.jsx)(b,{className:`size-4 mr-1`}),`Copy Code`]})]})]})]})]})]}),(0,G.jsxs)(`div`,{className:`flex items-center justify-between max-w-md`,children:[(0,G.jsxs)(`div`,{className:`space-y-0.5`,children:[(0,G.jsx)(U,{htmlFor:`cors-proxy`,children:`Use CORS Proxy`}),(0,G.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`Required when DeepL API blocks browser requests due to CORS`})]}),(0,G.jsx)(R,{id:`cors-proxy`,checked:t.useCorsProxy,onCheckedChange:e=>n({...t,useCorsProxy:e})})]}),t.useCorsProxy&&(0,G.jsxs)(`div`,{className:`space-y-2 pl-4 border-l-2 border-border/40`,children:[(0,G.jsx)(U,{htmlFor:`cors-proxy-key`,children:`CORS Proxy API Key`}),(0,G.jsx)(k,{id:`cors-proxy-key`,type:`password`,value:t.corsProxyApiKey,onChange:e=>n({...t,corsProxyApiKey:e.target.value}),placeholder:`Get a free key from cors.sh`,className:`max-w-md font-mono text-sm`}),(0,G.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[`Get a free temporary key from`,` `,(0,G.jsx)(r,{to:`https://proxy.cors.sh/`,children:`proxy.cors.sh`}),`. Leave empty for basic anonymous usage (rate limited).`]})]}),(0,G.jsx)(`div`,{className:`flex items-center gap-2`,children:(0,G.jsxs)(u,{type:`button`,variant:`outline`,size:`sm`,onClick:async()=>{if(t.provider!==`deepl`||!t.deeplApiKey.trim()){O.warning(`Please select DeepL and enter an API Key first`);return}J(!0),X(null);try{let e=await z(t.deeplApiKey,t.deeplPlan,t.useCorsProxy,t.corsProxyApiKey,t.customProxyUrl);X(e),e.ok?O.success(`API Key is valid!`):O.error(`API Key test failed`)}catch(e){X({ok:!1,message:String(e)}),O.error(`Test request failed`)}finally{J(!1)}},disabled:q||!t.deeplApiKey.trim(),children:[q?(0,G.jsx)(y,{className:`size-4 mr-2 animate-spin`}):(0,G.jsx)(v,{className:`size-4 mr-2`}),`Test API Key`]})}),Y&&(0,G.jsxs)(`div`,{className:`p-3 rounded-md text-sm space-y-2 ${Y.ok?`bg-success/10 border border-success/30 text-success`:`bg-destructive/10 border border-destructive/30 text-destructive`}`,children:[(0,G.jsxs)(`div`,{className:`flex items-start gap-2`,children:[Y.ok?(0,G.jsx)(v,{className:`size-4 shrink-0 mt-0.5`}):(0,G.jsx)(D,{className:`size-4 shrink-0 mt-0.5`}),(0,G.jsx)(`span`,{className:`break-all`,children:Y.message})]}),!Y.ok&&!t.useCorsProxy&&(Y.message.toLowerCase().includes(`failed to fetch`)||Y.message.toLowerCase().includes(`cors`)||Y.message.toLowerCase().includes(`network`))&&(0,G.jsxs)(`div`,{className:`text-xs border-t border-destructive/20 pt-2 space-y-1`,children:[(0,G.jsx)(`p`,{className:`font-semibold`,children:`Why this happens:`}),(0,G.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,G.jsx)(`li`,{children:`DeepL API does NOT allow direct browser calls (CORS is blocked on their side)`}),(0,G.jsx)(`li`,{children:`"Failed to fetch" usually means the browser blocked the request due to CORS`}),(0,G.jsx)(`li`,{children:`This is expected behavior — not an API key issue`})]}),(0,G.jsx)(`p`,{className:`font-semibold mt-2`,children:`Solution:`}),(0,G.jsxs)(`ul`,{className:`list-disc list-inside space-y-0.5 text-muted-foreground`,children:[(0,G.jsxs)(`li`,{children:[`Enable the `,(0,G.jsx)(`strong`,{children:`"Use CORS Proxy"`}),` toggle above (recommended)`]}),(0,G.jsx)(`li`,{children:`Or use MyMemory (free, no key required) — it works directly in the browser`}),(0,G.jsx)(`li`,{children:`Or set up a backend proxy server for DeepL`})]})]})]})]}),t.provider===`mymemory`&&(0,G.jsx)(`div`,{className:`p-4 rounded-lg border border-border/40 bg-background/40`,children:(0,G.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[(0,G.jsx)(`strong`,{className:`text-foreground`,children:`MyMemory`}),` is a free translation service that doesn't require an API key. It's used as the default fallback. Limit: ~5000 characters/day per IP address.`]})})]}),(0,G.jsxs)(a,{className:`flex justify-between border-t border-border/40 pt-4`,children:[(0,G.jsx)(u,{type:`button`,variant:`outline`,size:`sm`,onClick:()=>{V(),O.success(`Translation cache cleared`)},children:`Clear Translation Cache`}),(0,G.jsxs)(u,{type:`button`,onClick:()=>{Q(!0);try{B(t),O.success(`Translation settings saved`),X(null)}catch{O.error(`Failed to save settings`)}finally{setTimeout(()=>Q(!1),300)}},disabled:Z,className:`bg-primary hover:bg-primary/90`,children:[Z?(0,G.jsx)(y,{className:`size-4 mr-2 animate-spin`}):(0,G.jsx)(w,{className:`size-4 mr-2`}),`Save Settings`]})]})]}),(0,G.jsxs)(d,{className:`border-border/40 bg-card`,children:[(0,G.jsx)(i,{children:(0,G.jsx)(c,{className:`text-base`,children:`How Auto-Translate Works`})}),(0,G.jsxs)(s,{className:`text-sm text-muted-foreground space-y-2`,children:[(0,G.jsxs)(`p`,{children:[(0,G.jsx)(`strong`,{className:`text-foreground`,children:`As-you-type:`}),` When you stop typing in the English input field for 500ms, the system automatically translates to Chinese, Spanish, and Japanese.`]}),(0,G.jsxs)(`p`,{children:[(0,G.jsx)(`strong`,{className:`text-foreground`,children:`On blur:`}),` Clicking away from the English field triggers an immediate translation.`]}),(0,G.jsxs)(`p`,{children:[(0,G.jsx)(`strong`,{className:`text-foreground`,children:`Caching:`}),` Translated text is cached locally to avoid redundant API calls and stay within rate limits.`]}),(0,G.jsxs)(`p`,{children:[(0,G.jsx)(`strong`,{className:`text-foreground`,children:`Fallback:`}),` If DeepL fails (invalid key, rate limit, network issue), the system automatically falls back to MyMemory.`]})]})]})]})}export{q as default};