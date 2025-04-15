import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLocation } from "wouter";

type CCTVFeedProps = {
  camera: Camera;
};

const CCTVFeed = ({ camera }: CCTVFeedProps) => {
  const [_, navigate] = useLocation();
  
  return (
    <div 
      className="relative bg-gray-200 rounded overflow-hidden cursor-pointer"
      onClick={() => navigate(`/cctv?id=${camera.id}`)}
    >
      <AspectRatio ratio={16 / 9}>
        <img 
          src={camera.imageUrl} 
          alt={`CCTV 피드 - ${camera.name}`} 
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-xs text-white p-1">
        {camera.name}
      </div>
    </div>
  );
};

export function CCTVCard() {
  const { data: cameras, isLoading, error } = useQuery<Camera[]>({
    queryKey: ["/api/cameras"],
  });
  
  const [_, navigate] = useLocation();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">실시간 CCTV 모니터링</CardTitle>
          <Button variant="link" className="text-sm p-0 h-auto">전체 화면</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {isLoading ? (
            <>
              <Skeleton className="w-full aspect-video rounded" />
              <Skeleton className="w-full aspect-video rounded" />
              <Skeleton className="w-full aspect-video rounded" />
              <Skeleton className="w-full aspect-video rounded" />
            </>
          ) : error ? (
            <div className="col-span-2 text-center text-red-500 py-4">
              카메라 데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : cameras && cameras.length > 0 ? (
            cameras.slice(0, 4).map((camera) => (
              <CCTVFeed key={camera.id} camera={camera} />
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-4">
              사용 가능한 카메라가 없습니다.
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4 text-primary border-primary"
          onClick={() => navigate('/cctv')}
        >
          모든 카메라 보기
        </Button>
      </CardContent>
    </Card>
  );
}
