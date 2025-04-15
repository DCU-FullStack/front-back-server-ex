import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Camera } from "@shared/schema";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CCTVPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: cameras, isLoading, error } = useQuery<Camera[]>({
    queryKey: ["/api/cameras"],
  });

  // Filter cameras based on search query and filter option
  const filteredCameras = cameras?.filter(camera => {
    const matchesSearch = 
      searchQuery === "" || 
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && camera.status === filter;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">CCTV 감시</h1>
            <p className="text-gray-600">실시간 도로 상황을 모니터링하세요.</p>
          </div>
          
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="카메라 이름 또는 위치로 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="온라인">온라인</TabsTrigger>
                <TabsTrigger value="오프라인">오프라인</TabsTrigger>
                <TabsTrigger value="유지보수">유지보수</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <div className="flex justify-between mt-2">
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                        <Skeleton className="h-6 w-[60px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              카메라 데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : filteredCameras?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras?.map(camera => (
                <Card key={camera.id} className="overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={camera.imageUrl} 
                      alt={`CCTV 피드 - ${camera.name}`} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <div>
                      <h3 className="font-bold text-lg">{camera.name}</h3>
                      <p className="text-gray-600 text-sm">{camera.location}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant={camera.status === "온라인" ? "success" : camera.status === "오프라인" ? "destructive" : "outline"}>
                          {camera.status}
                        </Badge>
                        <span className="text-xs text-gray-500">ID: {camera.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
