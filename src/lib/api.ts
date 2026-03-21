// Central API configuration
// Replace this URL with your actual backend URL (e.g., from Render)
const API_BASE_URL = "https://your-backend-url.onrender.com/api";

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add API key from localStorage if available
  const apiKey = localStorage.getItem("ai_api_key");
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// --- Script Generation ---
export interface GenerateScriptRequest {
  topic: string;
  tone?: string;
  length?: "short" | "medium" | "long";
}

export interface GenerateScriptResponse {
  script: string;
  title: string;
  tags: string[];
}

export const generateScript = (data: GenerateScriptRequest) =>
  apiRequest<GenerateScriptResponse>("/generate/script", {
    method: "POST",
    body: JSON.stringify(data),
  });

// --- Image Generation ---
export interface GenerateImageRequest {
  prompt: string;
  style?: string;
  width?: number;
  height?: number;
}

export interface GenerateImageResponse {
  imageUrl: string;
}

export const generateImage = (data: GenerateImageRequest) =>
  apiRequest<GenerateImageResponse>("/generate/image", {
    method: "POST",
    body: JSON.stringify(data),
  });

// --- Video Generation (Runway / Pika) ---
export interface GenerateVideoRequest {
  prompt: string;
  provider?: "runway" | "pika";
  duration?: number;
}

export interface GenerateVideoResponse {
  videoUrl: string;
  status: string;
}

export const generateVideo = (data: GenerateVideoRequest) =>
  apiRequest<GenerateVideoResponse>("/generate/video", {
    method: "POST",
    body: JSON.stringify(data),
  });

// --- Auto YouTube ---
export interface AutoYouTubeRequest {
  topic: string;
  style?: string;
  autoUpload?: boolean;
}

export interface AutoYouTubeResponse {
  videoUrl: string;
  title: string;
  description: string;
  status: string;
}

export const autoYouTube = (data: AutoYouTubeRequest) =>
  apiRequest<AutoYouTubeResponse>("/auto-youtube", {
    method: "POST",
    body: JSON.stringify(data),
  });

// --- Assets ---
export interface Asset {
  id: string;
  name: string;
  type: "image" | "video" | "script";
  url: string;
  createdAt: string;
}

export const getAssets = () => apiRequest<Asset[]>("/assets");

export const deleteAsset = (id: string) =>
  apiRequest<void>(`/assets/${id}`, { method: "DELETE" });
