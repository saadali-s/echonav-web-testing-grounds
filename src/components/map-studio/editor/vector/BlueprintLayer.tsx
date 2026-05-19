interface BlueprintLayerProps {
  imageUrl?: string;
}

export function BlueprintLayer({ imageUrl }: BlueprintLayerProps) {
  if (!imageUrl) return null;

  // Use environment variable, fallback to localhost for local dev if missing
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  const fullUrl = imageUrl.startsWith('/') ? `${apiUrl}${imageUrl}` : imageUrl;

  return (
    <svg className="absolute inset-0 overflow-visible pointer-events-none opacity-40 dark:opacity-60">
        <image 
          href={fullUrl} 
          x="0" 
          y="0" 
          width="3000" 
          height="3000" 
          preserveAspectRatio="xMinYMin meet" 
        />
    </svg>
  );
}