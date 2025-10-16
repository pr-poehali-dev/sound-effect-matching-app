import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AudioTrack {
  id: string;
  name: string;
  category: string;
  duration: number;
  emotion: string;
}

interface AnalysisResult {
  emotion: string;
  tempo: number;
  scenes: Array<{ time: number; type: string }>;
}

export default function Index() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<AudioTrack[]>([]);

  const audioLibrary: AudioTrack[] = [
    { id: '1', name: 'Epic Orchestral', category: 'Music', duration: 180, emotion: 'energetic' },
    { id: '2', name: 'Ambient Chill', category: 'Music', duration: 240, emotion: 'calm' },
    { id: '3', name: 'Corporate Upbeat', category: 'Music', duration: 120, emotion: 'positive' },
    { id: '4', name: 'Applause', category: 'SFX', duration: 5, emotion: 'positive' },
    { id: '5', name: 'Whoosh Transition', category: 'SFX', duration: 2, emotion: 'dynamic' },
    { id: '6', name: 'Success Bell', category: 'SFX', duration: 3, emotion: 'positive' },
    { id: '7', name: 'Documentary Voice', category: 'Voice', duration: 60, emotion: 'neutral' },
    { id: '8', name: 'Energetic Narrator', category: 'Voice', duration: 45, emotion: 'energetic' },
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      toast.success('Видео загружено');
      simulateAnalysis();
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisResult({
            emotion: 'energetic',
            tempo: 128,
            scenes: [
              { time: 0, type: 'intro' },
              { time: 15, type: 'action' },
              { time: 45, type: 'climax' },
              { time: 60, type: 'outro' },
            ],
          });
          toast.success('AI-анализ завершён');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const addTrackToProject = (track: AudioTrack) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
      toast.success(`${track.name} добавлен`);
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter((t) => t.id !== trackId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Audio AI Studio
          </h1>
          <p className="text-muted-foreground">
            Автоматический подбор звуков с AI-анализом эмоций и темпа видео
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon name="Video" className="text-primary" size={24} />
                </div>
                <h2 className="text-xl font-semibold">Загрузка видео</h2>
              </div>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group">
                <Icon name="Upload" className="text-muted-foreground group-hover:text-primary transition-colors mb-4" size={48} />
                <span className="text-sm font-medium mb-2">
                  {videoFile ? videoFile.name : 'Перетащите видео или нажмите для выбора'}
                </span>
                <span className="text-xs text-muted-foreground">MP4, MOV, AVI до 500 МБ</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>

              {isAnalyzing && (
                <div className="mt-6 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Icon name="Brain" className="text-primary animate-pulse" size={20} />
                    <span className="text-sm font-medium">AI-анализ контента...</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Определяем эмоции, темп и ключевые моменты
                  </p>
                </div>
              )}

              {analysisResult && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Результаты анализа</span>
                    <Icon name="CheckCircle2" className="text-green-500" size={20} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Эмоция</p>
                      <Badge variant="secondary" className="capitalize">
                        {analysisResult.emotion}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Темп</p>
                      <span className="text-sm font-medium">{analysisResult.tempo} BPM</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Сцены ({analysisResult.scenes.length})</p>
                    <div className="flex gap-2">
                      {analysisResult.scenes.map((scene, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {scene.type} {scene.time}s
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <Icon name="Music" className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-semibold">Библиотека звуков</h2>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="music">Музыка</TabsTrigger>
                  <TabsTrigger value="sfx">Эффекты</TabsTrigger>
                  <TabsTrigger value="voice">Озвучка</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-2 mt-4">
                  {audioLibrary.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                        >
                          <Icon name="Play" size={16} />
                        </Button>
                        <div>
                          <p className="text-sm font-medium">{track.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {track.category} • {track.duration}s
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => addTrackToProject(track)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="music" className="space-y-2 mt-4">
                  {audioLibrary
                    .filter((t) => t.category === 'Music')
                    .map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Icon name="Play" size={16} />
                          </Button>
                          <div>
                            <p className="text-sm font-medium">{track.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {track.duration}s
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addTrackToProject(track)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="sfx" className="space-y-2 mt-4">
                  {audioLibrary
                    .filter((t) => t.category === 'SFX')
                    .map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Icon name="Play" size={16} />
                          </Button>
                          <div>
                            <p className="text-sm font-medium">{track.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {track.duration}s
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addTrackToProject(track)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="voice" className="space-y-2 mt-4">
                  {audioLibrary
                    .filter((t) => t.category === 'Voice')
                    .map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Icon name="Play" size={16} />
                          </Button>
                          <div>
                            <p className="text-sm font-medium">{track.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {track.duration}s
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addTrackToProject(track)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Icon name="Wand2" className="text-secondary" size={24} />
                </div>
                <h2 className="text-xl font-semibold">Превью</h2>
              </div>

              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed">
                {videoFile ? (
                  <div className="text-center space-y-2">
                    <Icon name="FileVideo" className="mx-auto text-muted-foreground" size={48} />
                    <p className="text-sm font-medium">{videoFile.name}</p>
                  </div>
                ) : (
                  <Icon name="FileVideo" className="text-muted-foreground/50" size={64} />
                )}
              </div>

              {selectedTracks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Добавлено треков</span>
                    <Badge variant="secondary">{selectedTracks.length}</Badge>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedTracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border group"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="Music2" className="text-primary" size={16} />
                          <div>
                            <p className="text-xs font-medium">{track.name}</p>
                            <p className="text-xs text-muted-foreground">{track.duration}s</p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => removeTrack(track.id)}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full" size="lg">
                    <Icon name="Download" className="mr-2" size={18} />
                    Экспорт видео
                  </Button>
                </div>
              )}

              {selectedTracks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="ListMusic" className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="text-sm">Добавьте треки из библиотеки</p>
                </div>
              )}
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon name="History" className="text-foreground" size={24} />
                </div>
                <h2 className="text-xl font-semibold">История</h2>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                <Icon name="FolderOpen" className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm">Нет проектов</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
