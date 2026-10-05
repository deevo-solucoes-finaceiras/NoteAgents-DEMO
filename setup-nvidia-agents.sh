#!/usr/bin/env bash

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=============================================="
echo " FLOW SOCIAL — NVIDIA AGENT ENVIRONMENT"
echo "=============================================="
echo

export NVIDIA_API_KEY="${NVIDIA_API_KEY:-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}"
export NVIDIA_API_BASE_URL="https://integrate.api.nvidia.com/v1"
export NVIDIA_API_URL="https://integrate.api.nvidia.com/v1/chat/completions"
export NVIDIA_MODEL="nvidia/nemotron-3-ultra-550b-a55b"

# ------------------------------------------------
# Agent configuration
# ------------------------------------------------

export FLOW_ROOT="$ROOT"
export FLOW_AGENT_MODE="engineering"
export FLOW_AGENT_MAX_TOKENS="16384"
export FLOW_AGENT_TEMPERATURE="1"
export FLOW_AGENT_TOP_P="0.95"
export FLOW_AGENT_ENABLE_THINKING="true"
export FLOW_AGENT_STREAM="true"

# ------------------------------------------------
# Workspace safety
# ------------------------------------------------

export FLOW_AGENT_WORKSPACE="$ROOT"
export FLOW_AGENT_ALLOW_FILE_READ="true"
export FLOW_AGENT_ALLOW_FILE_WRITE="true"
export FLOW_AGENT_ALLOW_FILE_DELETE="false"
export FLOW_AGENT_ALLOW_COMMANDS="true"

# ------------------------------------------------
# Runtime directories
# ------------------------------------------------

export FLOW_STATE_DIR="$ROOT/.flow/state"
export FLOW_LOG_DIR="$ROOT/.flow/logs"
export FLOW_REPORT_DIR="$ROOT/.flow/reports"

mkdir -p \
    "$FLOW_STATE_DIR" \
    "$FLOW_LOG_DIR" \
    "$FLOW_REPORT_DIR" \
    "$ROOT/scripts/agents"

# ------------------------------------------------
# Persist configuration without storing API key
# ------------------------------------------------

ENV_FILE="$ROOT/.env.agents"

cat > "$ENV_FILE" <<EOF
export NVIDIA_API_BASE_URL="https://integrate.api.nvidia.com/v1"
export NVIDIA_API_URL="https://integrate.api.nvidia.com/v1/chat/completions"
export NVIDIA_MODEL="nvidia/nemotron-3-ultra-550b-a55b"

export FLOW_ROOT="$ROOT"
export FLOW_AGENT_MODE="engineering"

export FLOW_AGENT_MAX_TOKENS="16384"
export FLOW_AGENT_TEMPERATURE="1"
export FLOW_AGENT_TOP_P="0.95"

export FLOW_AGENT_ENABLE_THINKING="true"
export FLOW_AGENT_STREAM="true"

export FLOW_AGENT_WORKSPACE="$ROOT"

export FLOW_AGENT_ALLOW_FILE_READ="true"
export FLOW_AGENT_ALLOW_FILE_WRITE="true"
export FLOW_AGENT_ALLOW_FILE_DELETE="false"
export FLOW_AGENT_ALLOW_COMMANDS="true"

export FLOW_STATE_DIR="$ROOT/.flow/state"
export FLOW_LOG_DIR="$ROOT/.flow/logs"
export FLOW_REPORT_DIR="$ROOT/.flow/reports"
EOF

chmod 600 "$ENV_FILE"

# ------------------------------------------------
# Create activation helper
# ------------------------------------------------

cat > "$ROOT/scripts/agents/env.sh" <<'EOF'
#!/usr/bin/env bash

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ -f "$ROOT/.env.agents" ]]; then
    source "$ROOT/.env.agents"
fi

export NVIDIA_API_KEY="${NVIDIA_API_KEY:-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}"
export FLOW_ROOT="$ROOT"
export FLOW_AGENT_WORKSPACE="$ROOT"

echo "FLOW SOCIAL Agent Environment"
echo "-----------------------------"
echo "ROOT:   $FLOW_ROOT"
echo "MODEL:  $NVIDIA_MODEL"
echo "API:    $NVIDIA_API_BASE_URL"
echo "MODE:   $FLOW_AGENT_MODE"
echo
EOF

chmod +x "$ROOT/scripts/agents/env.sh"

echo "[1/2] Testando NVIDIA API..."
HTTP_STATUS="$(
curl -sS \
    -o "$ROOT/.flow/reports/nvidia-health.json" \
    -w "%{http_code}" \
    "$NVIDIA_API_BASE_URL/models" \
    -H "Authorization: Bearer $NVIDIA_API_KEY" \
    -H "Accept: application/json" \
    || true
)"

if [[ "$HTTP_STATUS" == "200" ]]; then
    echo "NVIDIA API: OK (HTTP 200)"
else
    echo "NVIDIA API respondeu HTTP $HTTP_STATUS"
fi

echo "[2/2] Setup NVIDIA concluído."
