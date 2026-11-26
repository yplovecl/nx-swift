#!/usr/bin/env bash
set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

for command in node pnpm pm2 curl; do
  if ! command -v "$command" >/dev/null 2>&1; then
    printf '缺少部署命令：%s\n' "$command" >&2
    exit 1
  fi
done

if [[ ! -r .env ]]; then
  printf '无法读取项目根目录的 .env。\n' >&2
  exit 1
fi

if ! pm2 describe nx-swift >/dev/null 2>&1; then
  printf '当前用户的 PM2 中没有 nx-swift。请使用部署用户，或先完成首次启动。\n' >&2
  exit 1
fi

port="$(node --env-file=.env -p 'process.env.PORT ?? "3000"')"
if [[ ! "$port" =~ ^[1-9][0-9]{0,4}$ ]] || (( port > 65535 )); then
  printf 'PORT 必须是 1 到 65535 之间的整数。\n' >&2
  exit 1
fi

printf '\n安装依赖\n'
pnpm install --frozen-lockfile --prod=false

printf '\n生成生产 Prisma Client 并应用数据库迁移\n'
pnpm run setup:production

printf '\n构建 Remix 应用\n'
pnpm run build

printf '\n重启 nx-swift\n'
pm2 restart ecosystem.config.cjs --only nx-swift --update-env

printf '\n等待应用响应\n'
for ((attempt = 1; attempt <= 15; attempt++)); do
  if curl --noproxy '*' --fail --silent --max-time 2 \
    --output /dev/null "http://127.0.0.1:${port}/"; then
    pm2 save
    pm2 status nx-swift
    exit 0
  fi
  sleep 2
done

printf '应用未通过本机 HTTP 检查。请查看 pm2 logs nx-swift --lines 100 --nostream。\n' >&2
exit 1
