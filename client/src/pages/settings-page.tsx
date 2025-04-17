import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Bell, LockKeyhole, User, Shield, Mail, Globe, Coffee, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  
  // 설정 상태 변수
  const [profileData, setProfileData] = useState({
    name: user?.username || "",
    email: "user@example.com", // 예시 이메일
    phone: "010-1234-5678", // 예시 전화번호
    department: "도로 관리팀" // 예시 부서
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appAlerts: true,
    urgentOnly: false
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    highContrast: false,
    largeText: false
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleDisplayToggle = (key: keyof typeof displaySettings) => {
    setDisplaySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "프로필 업데이트 완료",
      description: "프로필 정보가 성공적으로 업데이트되었습니다."
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "설정 저장 완료",
      description: "시스템 설정이 성공적으로 저장되었습니다."
    });
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">마이페이지</h1>
            <p className="text-gray-600">계정 및 시스템 설정을 관리하세요.</p>
          </div>
          
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                프로필
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                알림
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                보안
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                화면 설정
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>내 프로필</CardTitle>
                  <CardDescription>
                    개인정보를 관리하고 업데이트 하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {user?.username?.substring(0, 2).toUpperCase() || "사용자"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline">프로필 사진 변경</Button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">이름</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={profileData.name} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">이메일</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={profileData.email} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">전화번호</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={profileData.phone} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="department">부서</Label>
                          <Input 
                            id="department" 
                            name="department" 
                            value={profileData.department} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Button className="mt-4" onClick={handleSaveProfile}>
                          변경사항 저장
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>알림 설정</CardTitle>
                  <CardDescription>
                    시스템 알림 및 공지 설정을 관리하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">이메일 알림</h4>
                        <p className="text-sm text-muted-foreground">
                          이상 상황 및 작업 관련 이메일 알림 수신
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailAlerts}
                        onCheckedChange={() => handleNotificationToggle("emailAlerts")}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">SMS 알림</h4>
                        <p className="text-sm text-muted-foreground">
                          긴급 상황 발생 시 SMS 알림 수신
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsAlerts}
                        onCheckedChange={() => handleNotificationToggle("smsAlerts")}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">앱 알림</h4>
                        <p className="text-sm text-muted-foreground">
                          애플리케이션 내 알림 수신
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.appAlerts}
                        onCheckedChange={() => handleNotificationToggle("appAlerts")}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">긴급 알림만 수신</h4>
                        <p className="text-sm text-muted-foreground">
                          중요한 알림만 수신하고 나머지는 무시
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.urgentOnly}
                        onCheckedChange={() => handleNotificationToggle("urgentOnly")}
                      />
                    </div>
                    
                    <div>
                      <Button className="mt-4" onClick={handleSaveSettings}>
                        알림 설정 저장
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>보안 설정</CardTitle>
                  <CardDescription>
                    계정 보안 및 접근 권한을 관리하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">비밀번호 변경</h4>
                      <div>
                        <Label htmlFor="current-password">현재 비밀번호</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">새 비밀번호</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">비밀번호 확인</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button className="mt-2">비밀번호 변경</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">로그인 세션</h4>
                      <div className="rounded-lg border p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">현재 세션</p>
                            <p className="text-sm text-muted-foreground">마지막 로그인: 2025년 4월 15일</p>
                          </div>
                          <Button variant="outline" size="sm">세션 종료</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">계정 삭제</h4>
                      <p className="text-sm text-muted-foreground">
                        계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                      <Button variant="destructive">계정 삭제</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>화면 설정</CardTitle>
                  <CardDescription>
                    애플리케이션 화면 설정을 관리하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">다크 모드</h4>
                        <p className="text-sm text-muted-foreground">
                          어두운 테마로 전환하여 눈의 피로를 줄이세요
                        </p>
                      </div>
                      <Switch
                        checked={displaySettings.darkMode}
                        onCheckedChange={() => handleDisplayToggle("darkMode")}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">고대비 모드</h4>
                        <p className="text-sm text-muted-foreground">
                          가독성 향상을 위한 고대비 테마 활성화
                        </p>
                      </div>
                      <Switch
                        checked={displaySettings.highContrast}
                        onCheckedChange={() => handleDisplayToggle("highContrast")}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h4 className="font-medium">확대 텍스트</h4>
                        <p className="text-sm text-muted-foreground">
                          텍스트 크기를 확대하여 가독성 개선
                        </p>
                      </div>
                      <Switch
                        checked={displaySettings.largeText}
                        onCheckedChange={() => handleDisplayToggle("largeText")}
                      />
                    </div>
                    
                    <div>
                      <Button className="mt-4" onClick={handleSaveSettings}>
                        화면 설정 저장
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>시스템 정보</CardTitle>
              <CardDescription>스마트 도로 이상감지 시스템 버전 및 정보</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">시스템 버전</span>
                  <span>v1.0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">최근 업데이트</span>
                  <span>2025년 4월 15일</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">라이센스</span>
                  <span>Business Edition</span>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    © 2025 스마트 도로 이상감지 시스템. 모든 권리 보유.
                    본 시스템은 도로 유지보수 및 관리 목적으로 개발되었습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}