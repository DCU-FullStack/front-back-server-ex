import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("user"),
});

// Incidents table for road anomalies
export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(), 
  severity: text("severity").notNull(), // "긴급", "경고", "정보"
  status: text("status").notNull(), // "접수", "처리중", "해결됨"
  reportedAt: timestamp("reported_at").defaultNow(),
  reportedBy: integer("reported_by").references(() => users.id),
});

// Tasks table for work management
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  status: text("status").notNull(), // "계획됨", "진행 중", "완료됨", "긴급"
  assignedTo: integer("assigned_to").references(() => users.id),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CCTV cameras
export const cameras = pgTable("cameras", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(), // "온라인", "오프라인", "유지보수"
  imageUrl: text("image_url"),
});

// Define Zod schemas for data validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).pick({
  title: true,
  description: true,
  location: true,
  severity: true,
  status: true,
  reportedBy: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  location: true,
  status: true,
  assignedTo: true,
  dueDate: true,
});

export const insertCameraSchema = createInsertSchema(cameras).pick({
  name: true,
  location: true,
  status: true,
  imageUrl: true,
});

// Define types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type Camera = typeof cameras.$inferSelect;
