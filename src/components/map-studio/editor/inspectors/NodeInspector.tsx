import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteNodeTts, useGenerateNodeTts } from "@/hooks/api/useMapStudio";
import { CheckCircle2, Loader2, Mic, Play, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NodeData } from "../vector/types";

export function NodeInspector({
  node,
  updateNode,
  onSave,
  onResolveHazard,
}: {
  node?: NodeData | any;
  updateNode?: (u: Partial<NodeData>) => void;
  onSave?: () => void;
  onResolveHazard?: (id: string) => void;
}) {
  const [ttsInput, setTtsInput] = useState(node?.ttsVerbalGuidance || "");
  const [audioVersion, setAudioVersion] = useState(Date.now());
  const generateMutation = useGenerateNodeTts();
  const deleteTtsMutation = useDeleteNodeTts();

  useEffect(() => {
    setTtsInput(node?.ttsVerbalGuidance || "");
    setAudioVersion(Date.now());
  }, [node?.id, node?.ttsAudioUrl]);

  const handleGenerate = () => {
    if (!node?.id) return;
    generateMutation.mutate(
      { nodeId: Number(node.id), text: ttsInput },
      {
        onSuccess: (updatedNodeFromDb) => {
          if (updateNode)
            updateNode({ ttsAudioUrl: updatedNodeFromDb.ttsAudioUrl });
        },
      },
    );
  };

  const handleDeleteTts = () => {
    if (!node?.id) return;
    deleteTtsMutation.mutate(Number(node.id), {
      onSuccess: () => {
        setTtsInput("");
        if (updateNode)
          updateNode({
            ttsVerbalGuidance: undefined,
            ttsAudioUrl: undefined,
          } as any);
      },
    });
  };

  const isGenerating = generateMutation.isPending;
  const hasAudio = !!node?.ttsAudioUrl;
  const isInputDirty = ttsInput !== node?.ttsVerbalGuidance;
  const isNewNode = !node?.id || String(node.id).startsWith("n");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  const baseAudioUrl = node?.ttsAudioUrl
    ? node.ttsAudioUrl.startsWith("/")
      ? `${apiUrl}${node.ttsAudioUrl}`
      : node.ttsAudioUrl
    : "";
  const fullAudioUrl = baseAudioUrl ? `${baseAudioUrl}?v=${audioVersion}` : "";

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">
            Node Label (Name)
          </Label>
          <Input
            value={node?.label || ""}
            onChange={(e) => updateNode?.({ label: e.target.value })}
            onBlur={onSave}
            placeholder="e.g., Lobby Entrance"
            className="text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-11 focus-visible:ring-0  dark:shadow-none"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">
            Verbal Guidance (TTS)
          </Label>
          <Textarea
            value={ttsInput}
            onChange={(e) => {
              setTtsInput(e.target.value);
              updateNode?.({ ttsVerbalGuidance: e.target.value } as any);
            }}
            placeholder="e.g., You are passing the Science Lab on your right."
            className="resize-none h-24 text-sm font-medium bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl focus-visible:ring-0 dark:shadow-none p-3"
          />

          {isNewNode ? (
            <div className="p-3 mt-2 border-2 border-amber-500 bg-amber-50 rounded-xl text-center">
              <p className="text-xs font-bold text-amber-700 mb-2">
                Save properties to register this node before generating audio.
              </p>
              <Button
                onClick={onSave}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Save Properties Now
              </Button>
            </div>
          ) : !hasAudio || isInputDirty ? (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !ttsInput.trim()}
              className="w-full mt-2 bg-zinc-950 text-white hover:bg-zinc-800"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mic className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Generate Audio"}
            </Button>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <audio
                src={fullAudioUrl}
                className="hidden"
                id={`audio-${node.id}`}
              />
              <Button
                variant="secondary"
                className="flex-1 border-2 border-zinc-950"
                onClick={() => {
                  const audioEl = document.getElementById(
                    `audio-${node.id}`,
                  ) as HTMLAudioElement;
                  if (audioEl) {
                    audioEl.load();
                    audioEl.play();
                  }
                }}
              >
                <Play className="h-4 w-4 mr-2" /> Play Audio
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="border-2 border-zinc-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this verbal guidance
                      audio? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteTts}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="pt-4 border-t-2 border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
              Mark as Hazard
            </Label>
            <Switch
              checked={node?.isHazard || false}
              onCheckedChange={(c) =>
                updateNode?.({
                  isHazard: c,
                  hazardType: c ? node?.hazardType || "Fire" : undefined,
                } as any)
              }
              className="data-[state=checked]:bg-rose-500 border-2 border-zinc-950 m-0"
            />
          </div>

          {node?.isHazard && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">
                  Hazard Type
                </Label>
                <Select
                  value={node?.hazardType || "Fire"}
                  onValueChange={(val) =>
                    updateNode?.({ hazardType: val } as any)
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold  dark:shadow-none">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-zinc-950 rounded-xl font-bold">
                    <SelectItem value="Fire">Fire</SelectItem>
                    <SelectItem value="Spill">Spill</SelectItem>
                    <SelectItem value="Obstruction">Obstruction</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold  dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve Hazard
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800 rounded-xl  dark:shadow-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black uppercase tracking-tight">
                      Resolve Hazard?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-bold text-zinc-500">
                      Are you sure this hazard has been resolved? This will
                      clear the hazard from the map and update the system logs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10  dark:shadow-none">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (node?.id) onResolveHazard?.(node.id);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 dark:text-black text-white font-black uppercase text-[11px] tracking-wider h-10 border-2 border-zinc-950  dark:shadow-none"
                    >
                      Confirm & Resolve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
