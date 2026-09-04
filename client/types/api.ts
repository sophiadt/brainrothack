// types/api.ts

// Body accepted by POST /api/create-web-call, forwarded to RetellAI.
export interface CreateWebCallRequest {
  agent_id: string;
  metadata?: Record<string, unknown>;
  retell_llm_dynamic_variables?: Record<string, string>;
}

// Response returned by RetellAI's /v2/create-web-call endpoint.
export interface RetellAIResponse {
  access_token: string;
  call_id: string;
  agent_id?: string;
  call_status?: string;
  call_type?: string;
  metadata?: Record<string, unknown>;
  retell_llm_dynamic_variables?: Record<string, string>;
}
