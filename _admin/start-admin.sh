#!/bin/sh
cd "$(dirname "$0")/.." && exec python3 _admin/admin.py "$@"
