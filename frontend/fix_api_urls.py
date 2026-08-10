#!/usr/bin/env python3
"""
Angular API URL Fixer - Run this in your frontend directory
Usage: python3 fix_api_urls.py .
"""
import os, sys, re, shutil
from pathlib import Path
from datetime import datetime

def log(m): print(f"[{datetime.now().strftime('%H:%M:%S')}] {m}")

def read_file(p):
    try: return open(p, 'r', encoding='utf-8').read()
    except: return None

def write_file(p, c):
    if p.exists(): shutil.copy2(p, p.with_suffix(p.suffix + '.backup'))
    open(p, 'w', encoding='utf-8').write(c)
    log(f"Updated: {p}")

def fix_env_ts(p):
    c = read_file(p)
    if not c: c = ""
    if 'apiUrl' not in c:
        c = re.sub(r'(export const environment = \{)([^\}]*)', r"\1\n  apiUrl: 'http://localhost:3000/api',\n\2", c)
        if 'apiUrl' not in c: c = "export const environment = {\n  production: false,\n  apiUrl: 'http://localhost:3000/api'\n};\n"
    write_file(p, c)

def fix_env_prod(p):
    c = """export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
"""
    write_file(p, c)

def fix_auth_service(p):
    c = read_file(p)
    if not c: return
    orig = c
    if 'environment' not in c:
        c = "import { environment } from '../../environments/environment';\n" + c
    c = re.sub(r'apiUrl\s*=\s*["\']http://localhost:3000/api/auth["\']', 'apiUrl = `${environment.apiUrl}/auth`', c)
    if c != orig: write_file(p, c)

def main():
    root = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path('.')
    log(f"Fixing API URLs in: {root}")
    
    env_dir = root / 'src' / 'environments'
    env_dir.mkdir(parents=True, exist_ok=True)
    
    fix_env_ts(env_dir / 'environment.ts')
    fix_env_prod(env_dir / 'environment.prod.ts')
    
    # Find and fix auth service
    for svc in ['src/app/core/services/auth.service.ts', 'src/app/services/auth.service.ts', 'src/app/auth.service.ts']:
        p = root / svc
        if p.exists(): fix_auth_service(p); break
    
    log("Done! Check .backup files for originals.")

if __name__ == '__main__': main()
