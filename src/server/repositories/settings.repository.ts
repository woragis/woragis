import { eq, desc, asc } from "drizzle-orm";
import { db } from "../db";
import { settings } from "../db/schemas";
import type { Setting, NewSetting, SettingKey } from "@/types";

export class SettingsRepository {
  // Basic CRUD operations
  async findAll(): Promise<Setting[]> {
    return await db.select().from(settings).orderBy(asc(settings.key));
  }

  async findByKey(key: string): Promise<Setting | null> {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key));
    return result[0] || null;
  }

  async create(setting: NewSetting): Promise<Setting> {
    const result = await db.insert(settings).values(setting).returning();
    return result[0];
  }

  async update(key: string, value: string): Promise<Setting> {
    const existing = await this.findByKey(key);

    if (existing) {
      const result = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return result[0];
    } else {
      return await this.create({ key, value });
    }
  }

  async delete(key: string): Promise<void> {
    await db.delete(settings).where(eq(settings.key, key));
  }

  // Convenience methods for common settings
  async getProjectsPerPage(): Promise<number> {
    const setting = await this.findByKey("projects_per_page");
    return setting ? parseInt(setting.value) : 6;
  }

  async setProjectsPerPage(count: number): Promise<Setting> {
    return await this.update("projects_per_page", count.toString());
  }

  async getSiteTitle(): Promise<string> {
    const setting = await this.findByKey("site_title");
    return setting?.value || "My Portfolio";
  }

  async setSiteTitle(title: string): Promise<Setting> {
    return await this.update("site_title", title);
  }

  async getSiteDescription(): Promise<string> {
    const setting = await this.findByKey("site_description");
    return setting?.value || "";
  }

  async setSiteDescription(description: string): Promise<Setting> {
    return await this.update("site_description", description);
  }

  async getContactEmail(): Promise<string> {
    const setting = await this.findByKey("contact_email");
    return setting?.value || "";
  }

  async setContactEmail(email: string): Promise<Setting> {
    return await this.update("contact_email", email);
  }

  async getTheme(): Promise<"light" | "dark" | "system"> {
    const setting = await this.findByKey("theme");
    const value = setting?.value as "light" | "dark" | "system";
    return value || "system";
  }

  async setTheme(theme: "light" | "dark" | "system"): Promise<Setting> {
    return await this.update("theme", theme);
  }

  async getMaintenanceMode(): Promise<boolean> {
    const setting = await this.findByKey("maintenance_mode");
    return setting?.value === "true";
  }

  async setMaintenanceMode(enabled: boolean): Promise<Setting> {
    return await this.update("maintenance_mode", enabled.toString());
  }

  // Bulk operations
  async updateMany(settingsData: Record<string, string>): Promise<Setting[]> {
    const promises = Object.entries(settingsData).map(([key, value]) =>
      this.update(key, value)
    );
    return await Promise.all(promises);
  }

  async getMany(keys: string[]): Promise<Record<string, string>> {
    const settings = await this.findAll();
    const result: Record<string, string> = {};

    keys.forEach((key) => {
      const setting = settings.find((s) => s.key === key);
      if (setting) {
        result[key] = setting.value;
      }
    });

    return result;
  }
}
