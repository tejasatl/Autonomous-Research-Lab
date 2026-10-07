import json
import os


def safe_json_load(path, default):
    if not os.path.exists(path):
        return default

    with open(path, "r", encoding="utf-8") as f:
        content = f.read().strip()

        if not content:
            return default

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return default