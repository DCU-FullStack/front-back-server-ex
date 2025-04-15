import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Incident } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

function formatTimeAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

type IncidentItemProps = {
  incident: Incident;
};

const IncidentItem = ({ incident }: IncidentItemProps) => {
  const badgeVariant = incident.severity === "긴급" ? "destructive" : "warning";
  const reportedDate = new Date(incident.reportedAt);
  
  return (
    <div className="border-b pb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">{incident.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{incident.location}</p>
        </div>
        <Badge variant={badgeVariant}>{incident.severity}</Badge>
      </div>
      <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(reportedDate)}</p>
    </div>
  );
};

export function IncidentsCard() {
  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">최근 이상 징후</CardTitle>
          <Button variant="link" className="text-sm p-0 h-auto">모두 보기</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="space-y-2 pb-3 border-b">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
              <Skeleton className="h-3 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <div className="space-y-2 pb-3 border-b">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
              <Skeleton className="h-3 w-[170px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[190px]" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
              <Skeleton className="h-3 w-[160px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : incidents && incidents.length > 0 ? (
          incidents.map((incident) => (
            <IncidentItem key={incident.id} incident={incident} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            현재 보고된 이상 징후가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
