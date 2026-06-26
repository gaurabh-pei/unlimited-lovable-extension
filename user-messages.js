/**
 * Maxx\'s Lovable - User-facing copy: English translations + strip internal/hosting/vendor branding.
 */
function stripInternalBranding(value) {
  if (value == null) return value;
  var brand = typeof EXTENSION_NAME !== "undefined" ? String(EXTENSION_NAME) : "Maxx\'s Lovable";
  var s = String(value);

  var rules = [
    [/gringow\s*store/gi, brand],
    [/gringow/gi, brand],
    [/vendor\s+license\s+pool/gi, "service"],
    [/vendor\s+ql\s+keys?/gi, "service keys"],
    [/vendor\s+ql/gi, "service"],
    [/vendor\s+license/gi, "service"],
    [/vendor\s+key/gi, "service key"],
    [/vendor\s+supabase/gi, "service"],
    [/vendor\s+/gi, ""],
    [/plesk(\s+php)?/gi, ""],
    [/supabase\s+anon\s+key/gi, "service configuration"],
    [/supabase\s+url/gi, "service"],
    [/on\s+supabase/gi, ""],
    [/admin\s*→[^.]*\.?/gi, ""],
    [/check\s+admin[^.]*\.?/gi, "Contact support"],
    [/upload\s+(the\s+)?latest\s+backend[^.]*\.?/gi, ""],
    [/lovablefeaturescontroller[^.]*\.?/gi, ""],
    [/lovableapiservice[^.]*\.?/gi, ""],
    [/not\s+the\s+vendor\s+[^.]*\.?/gi, ""],
    [/infinity\/ql\s+key/gi, "service key"],
    [/\bteam\s+pk-/gi, ""],
    [/\bteam\s+license/gi, "service"],
    [/use your team/gi, "use your"],
    [/your team license/gi, "your service"],
    [/\(\s*not\s+the\s+[^)]+\)/gi, ""],
    [/powerkits\s+server/gi, brand + " service"],
    [/\s{2,}/g, " "],
    [/\. \./g, "."],
    [/\s+\./g, "."],
    [/^\s+|\s+$/g, ""]
  ];

  for (var i = 0; i < rules.length; i++) {
    s = s.replace(rules[i][0], rules[i][1]);
  }
  return s;
}

function translateUserMessage(value) {
  if (value == null) return value;
  var s = String(value);
  var map = [
    [/Licen[çc]a\s+n[aã]o\s+encontrada\s+ou\s+inativa/ig,
      "Service is unavailable. Try again later."],
    [/Licen[çc]a\s+n[aã]o\s+encontrada/ig, "Service unavailable"],
    [/Licen[çc]a\s+inativa/ig, "Service inactive"],
    [/Licen[çc]a\s+V[aá]lida/ig, "Service ready"],
    [/Licen[çc]a\s+inv[aá]lida/ig, "Service unavailable"],
    [/Chave\s+inv[aá]lida/ig, "Invalid key"],
    [/Sess[aã]o\s+inv[aá]lida\.?\s*Fa[çc]a\s+login\s+novamente\.?/ig, "Invalid session. Please log in again."],
    [/Sess[aã]o\s+inv[aá]lida/ig, "Invalid session"],
    [/Fa[çc]a\s+login\s+novamente/ig, "Please log in again"],
    [/Erro\s+de\s+conex[aã]o/ig, "Connection error"],
    [/Projeto\s+n[aã]o\s+sincronizado/ig, "Project not synced"],
    [/Token\s+n[aã]o\s+capturado/ig, "Token not captured"],
    [/Licen[çc]a\s+expirada/ig, "Service expired"],
    [/Acesso\s+Negado/ig, "Access denied"],
    [/Falha\s+ao\s+criar\s+projeto/ig, "Failed to create project"],
    [/Erro\s+no\s+envio/ig, "Send error"],
    [/Prompt\s+Enviado\s+com\s+Sucesso\.?/ig, "Prompt sent successfully"],
    [/Todos\s+os\s+QLs?\s+falharam/ig, "Service is temporarily unavailable. Try again later."],
    [/Nenhum\s+QL\s+configurado/ig, "Service is temporarily unavailable. Contact support."],
    [/No\s+vendor\s+license\s+configured[^.]*/ig, "Service is temporarily unavailable. Contact support."],
    [/Vendor\s+license\s+not\s+found[^.]*/ig, "Service is temporarily unavailable. Try again later."],
    [/Token\s+e\s+projectId\s+s[aã]o\s+obrigat[oó]rios\.?/ig,
      "Lovable token and project are required. Open your project on lovable.dev, wait for Synced, then try again."]
  ];
  for (var i = 0; i < map.length; i++) {
    s = s.replace(map[i][0], map[i][1]);
  }
  return stripInternalBranding(s);
}
