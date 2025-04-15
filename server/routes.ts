import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertIncidentSchema, insertTaskSchema, insertCameraSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes for incidents
  app.get("/api/incidents", async (req, res, next) => {
    try {
      const incidents = await storage.getIncidents();
      res.json(incidents);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/incidents/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const incident = await storage.getIncident(id);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      res.json(incident);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/incidents", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Login required" });
      }
      
      const validatedData = insertIncidentSchema.parse({
        ...req.body,
        reportedBy: req.user?.id
      });
      
      const incident = await storage.createIncident(validatedData);
      res.status(201).json(incident);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", details: err.errors });
      }
      next(err);
    }
  });

  app.put("/api/incidents/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Login required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const incident = await storage.getIncident(id);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      const validatedData = insertIncidentSchema.partial().parse(req.body);
      const updatedIncident = await storage.updateIncident(id, validatedData);
      
      res.json(updatedIncident);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", details: err.errors });
      }
      next(err);
    }
  });

  // API routes for tasks
  app.get("/api/tasks", async (req, res, next) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/tasks/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Login required" });
      }
      
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", details: err.errors });
      }
      next(err);
    }
  });

  app.put("/api/tasks/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Login required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const updatedTask = await storage.updateTask(id, validatedData);
      
      res.json(updatedTask);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", details: err.errors });
      }
      next(err);
    }
  });

  // API routes for CCTV cameras
  app.get("/api/cameras", async (req, res, next) => {
    try {
      const cameras = await storage.getCameras();
      res.json(cameras);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/cameras/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const camera = await storage.getCamera(id);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }
      
      res.json(camera);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/cameras", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Login required" });
      }
      
      const validatedData = insertCameraSchema.parse(req.body);
      const camera = await storage.createCamera(validatedData);
      res.status(201).json(camera);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", details: err.errors });
      }
      next(err);
    }
  });

  app.put("/api/cameras/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Login required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const camera = await storage.getCamera(id);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }
      
      const validatedData = insertCameraSchema.partial().parse(req.body);
      const updatedCamera = await storage.updateCamera(id, validatedData);
      
      res.json(updatedCamera);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", details: err.errors });
      }
      next(err);
    }
  });

  // Search API
  app.get("/api/search", async (req, res, next) => {
    try {
      const query = req.query.q as string | undefined;
      
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const normalizedQuery = query.toLowerCase();
      
      // Search in incidents
      const incidents = await storage.getIncidents();
      const matchedIncidents = incidents.filter(incident => 
        incident.title.toLowerCase().includes(normalizedQuery) || 
        incident.description.toLowerCase().includes(normalizedQuery) ||
        incident.location.toLowerCase().includes(normalizedQuery)
      );
      
      // Search in tasks
      const tasks = await storage.getTasks();
      const matchedTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(normalizedQuery) || 
        (task.description && task.description.toLowerCase().includes(normalizedQuery)) ||
        task.location.toLowerCase().includes(normalizedQuery)
      );
      
      // Search in cameras
      const cameras = await storage.getCameras();
      const matchedCameras = cameras.filter(camera => 
        camera.name.toLowerCase().includes(normalizedQuery) || 
        camera.location.toLowerCase().includes(normalizedQuery)
      );
      
      res.json({
        incidents: matchedIncidents,
        tasks: matchedTasks,
        cameras: matchedCameras
      });
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
