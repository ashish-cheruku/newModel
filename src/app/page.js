import ModelViewer from '../components/modelViewer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex flex-col items-center justify-center p-5">
      <h1 className="text-4xl md:text-5xl font-semibold text-gray-100 text-center mb-8 tracking-wide">
        3D Model Viewer
      </h1>
      <ModelViewer />
    </main>
  );
}
