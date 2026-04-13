import { GraphEditorComposer } from "@/components/map-studio/editor/GraphEditorComposer";
import React from "react";

export default function EditorPage() {
  // Normally, we would await params.id here and fetch the initial graph data,
  // but following our pattern, we just mount the Composer.
  return (
    <div className="h-full -m-6 md:-m-8"> 
      {/* Negative margin overrides the default padding of the global RootLayout, 
          letting the editor take up the absolute full bleed of the window. */}
      <GraphEditorComposer />
    </div>
  );
}