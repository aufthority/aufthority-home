#!/usr/bin/env python3
"""Build the /donate page for every Aufthority app from one template.

Usage (from the folder that holds all the app repos side by side):
    python3 aufthority-home/tools/donate/build.py            # all apps
    python3 aufthority-home/tools/donate/build.py nafaslega  # one or more slugs

Edit apps.json (links, payee, app list) or template.html (copy, layout),
then re-run. Each page is written to <root>/<app.out>/index.html, where
<root> is the parent of the aufthority-home repo.
"""
import base64, html, json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]  # .../aufthority-home/tools/donate -> parent of aufthority-home

cfg = json.loads((HERE / "apps.json").read_text(encoding="utf-8"))
template = (HERE / "template.html").read_text(encoding="utf-8")
qr = "data:image/png;base64," + base64.b64encode((HERE / "toyyibpay-qr.png").read_bytes()).decode()
apps = cfg["apps"]
wanted = set(sys.argv[1:]) or {a["slug"] for a in apps}
unknown = wanted - {a["slug"] for a in apps}
if unknown:
    sys.exit(f"Unknown app slug(s): {', '.join(sorted(unknown))}")


def app_list(current):
    rows = []
    for a in apps:
        here = ('<span class="here"><span data-ms>Anda di sini</span>'
                '<span data-en>You are here</span></span>') if a is current else ""
        rows.append(
            f'        <li><a href="{a["url"]}" data-umami-event="{html.escape(current["name"])} - Donate Other app">'
            f'<span class="app-name">{html.escape(a["name"])}{here}</span>'
            f'<span class="app-tag"><span data-ms>{html.escape(a["tag_ms"])}</span>'
            f'<span data-en>{html.escape(a["tag_en"])}</span></span></a></li>')
    return "\n".join(rows)


for app in apps:
    if app["slug"] not in wanted:
        continue
    page = template
    for key, val in {
        "{{NAME}}": html.escape(app["name"]),
        "{{URL}}": app["url"],
        "{{UMAMI}}": app["umami"],
        "{{LANG}}": app["defaultLang"],
        "{{LANGKEY}}": app["langKey"],
        "{{PAYEE}}": html.escape(cfg["payee"]),
        "{{TOYYIBPAY}}": cfg["toyyibpay"],
        "{{BMC}}": cfg["bmc"],
        "{{QR}}": qr,
        "{{COUNT}}": str(len(apps)),
        "{{APPS}}": app_list(app),
    }.items():
        page = page.replace(key, val)
    assert "{{" not in page, f"unfilled placeholder in {app['slug']}"
    out = ROOT / app["out"] / "index.html"
    if not out.parent.parent.exists():
        print(f"skip {app['slug']}: {out.parent.parent} not found (repo not cloned here)")
        continue
    out.parent.mkdir(exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print(f"wrote {out.relative_to(ROOT)}")
