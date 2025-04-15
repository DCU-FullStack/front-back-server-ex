import { users, type User, type InsertUser, incidents, type Incident, type InsertIncident, tasks, type Task, type InsertTask, cameras, type Camera, type InsertCamera } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Incident operations
  getIncidents(): Promise<Incident[]>;
  getIncident(id: number): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined>;
  
  // Task operations
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  
  // Camera operations
  getCameras(): Promise<Camera[]>;
  getCamera(id: number): Promise<Camera | undefined>;
  createCamera(camera: InsertCamera): Promise<Camera>;
  updateCamera(id: number, camera: Partial<InsertCamera>): Promise<Camera | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private incidents: Map<number, Incident>;
  private tasks: Map<number, Task>;
  private cameras: Map<number, Camera>;
  
  private userId: number;
  private incidentId: number;
  private taskId: number;
  private cameraId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.incidents = new Map();
    this.tasks = new Map();
    this.cameras = new Map();
    
    this.userId = 1;
    this.incidentId = 1;
    this.taskId = 1;
    this.cameraId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Incident operations
  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }
  
  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }
  
  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.incidentId++;
    const now = new Date();
    const incident: Incident = { 
      ...insertIncident, 
      id, 
      reportedAt: now 
    };
    this.incidents.set(id, incident);
    return incident;
  }
  
  async updateIncident(id: number, updateData: Partial<InsertIncident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident = { ...incident, ...updateData };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }
  
  // Task operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const now = new Date();
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: now 
    };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updateData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  // Camera operations
  async getCameras(): Promise<Camera[]> {
    return Array.from(this.cameras.values());
  }
  
  async getCamera(id: number): Promise<Camera | undefined> {
    return this.cameras.get(id);
  }
  
  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const id = this.cameraId++;
    const camera: Camera = { ...insertCamera, id };
    this.cameras.set(id, camera);
    return camera;
  }
  
  async updateCamera(id: number, updateData: Partial<InsertCamera>): Promise<Camera | undefined> {
    const camera = this.cameras.get(id);
    if (!camera) return undefined;
    
    const updatedCamera = { ...camera, ...updateData };
    this.cameras.set(id, updatedCamera);
    return updatedCamera;
  }
  
  // Initialize sample data
  private initSampleData() {
    // Create sample cameras
    this.createCamera({
      name: "서울IC - 01",
      location: "서울 외곽순환고속도로 서울IC",
      status: "온라인",
      imageUrl: "https://images.unsplash.com/photo-1545415074-8098350c9b2c?auto=format&fit=crop&q=80",
    });
    
    this.createCamera({
      name: "서울IC - 02",
      location: "서울 외곽순환고속도로 서울IC",
      status: "온라인",
      imageUrl: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&q=80",
    });
    
    this.createCamera({
      name: "수원IC - 03",
      location: "경부고속도로 수원IC",
      status: "온라인",
      imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80",
    });
    
    this.createCamera({
      name: "수원IC - 04",
      location: "경부고속도로 수원IC",
      status: "온라인",
      imageUrl: "https://images.unsplash.com/photo-1606768666853-403c90a981ad?auto=format&fit=crop&q=80",
    });
    
    // Create sample incidents
    this.createIncident({
      title: "차량 추돌 사고",
      description: "3대 차량 추돌 사고 발생",
      location: "서울 외곽순환고속도로 구간 23KM",
      severity: "긴급",
      status: "접수",
      reportedBy: 1,
    });
    
    this.createIncident({
      title: "도로 파손 감지",
      description: "아스팔트 파손 확인",
      location: "경부고속도로 부산방향 145KM",
      severity: "경고",
      status: "처리중",
      reportedBy: 1,
    });
    
    this.createIncident({
      title: "차선 이탈 차량",
      description: "화물차 차선 이탈",
      location: "중부내륙고속도로 235KM",
      severity: "경고",
      status: "접수",
      reportedBy: 1,
    });
    
    // Create sample tasks
    this.createTask({
      title: "CCTV 카메라 점검",
      description: "3개 카메라 유지보수",
      location: "서울IC 구간",
      status: "진행 중",
      assignedTo: 1,
      dueDate: new Date(new Date().setHours(17, 0, 0, 0)),
    });
    
    this.createTask({
      title: "도로 포장 작업",
      description: "파손된 아스팔트 보수",
      location: "경부고속도로 145KM",
      status: "긴급",
      assignedTo: 1,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    });
    
    this.createTask({
      title: "안전 표지판 설치",
      description: "속도 제한 표지판 추가",
      location: "중부내륙고속도로 235KM",
      status: "계획됨",
      assignedTo: 1,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    });
  }
}

export const storage = new MemStorage();
