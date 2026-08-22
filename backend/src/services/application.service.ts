import { Application } from "@/models/application";

export class ApplicationService {
  static async createApplication(userId: string) {
    return Application.create({ userId });
  }

  static async getApplications(userId: string) {
    return Application.find({ userId });
  }

  static async getApplicationById(id: string) {
    return Application.findById(id);
  }
}
