"use client"
export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-white ml-4 text-xl">Loading 3D Model...</p>
    </div>
  );
}
