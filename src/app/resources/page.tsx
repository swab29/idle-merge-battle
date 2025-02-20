import { ResourcesView } from '@/components/resources/resources-view';
import { MergeView } from '@/components/resources/merge-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Gather resources and merge them to create more powerful versions
        </p>
      </div>
      
      <Tabs defaultValue="gather" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gather">Gather</TabsTrigger>
          <TabsTrigger value="merge">Merge</TabsTrigger>
        </TabsList>
        <TabsContent value="gather" className="space-y-4">
          <ResourcesView />
        </TabsContent>
        <TabsContent value="merge" className="space-y-4">
          <MergeView />
        </TabsContent>
      </Tabs>
    </div>
  );
} 