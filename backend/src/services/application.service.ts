import { Application } from "@/models/application";
import { APPLICATION_STATUS, DOCUMENT_TYPE } from "@/types/enums/enums";
import { UpdateApplication } from "@/utils/zod/application";

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

  static async updateApplication(
    applicationId: string,
    userId: string,
    data: UpdateApplication,
  ) {
    return Application.findOneAndUpdate(
      {
        _id: applicationId,
        userId,
        status: APPLICATION_STATUS.DRAFT,
      },
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  static async uploadDocument(
    applicationId: string,
    userId: string,
    documentType: DOCUMENT_TYPE,
    file: Express.Multer.File,
  ) {
    const application = await Application.findOne({
      _id: applicationId,
      userId,
      status: APPLICATION_STATUS.DRAFT,
    });

    if (!application) return null;

    console.log(application)
  }
}
